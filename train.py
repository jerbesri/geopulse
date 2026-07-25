"""Train an ArcGIS time-series model from a Space Time Cube and export forecast records.

The resulting CSV is intentionally simple: downstream FastAPI or ArcGIS feature-layer
code can join it back to hotspot/bin IDs before forming a response.
"""

from __future__ import annotations

import argparse
import importlib.util
import inspect
import sys
from pathlib import Path
from typing import Any


def cube_variables(cube_path: Path) -> list[str]:
    """Read NetCDF variable names so a GIS teammate can confirm the aggregation field."""
    try:
        import xarray as xr
    except ImportError as error:
        raise RuntimeError(
            "Missing xarray for NetCDF inspection. Install it with: conda install -c conda-forge xarray"
        ) from error

    with xr.open_dataset(cube_path) as dataset:
        return sorted(dataset.data_vars)


def validate_variable(cube_path: Path, variable_name: str) -> None:
    """Fail before training if the guessed incident-count variable is not in the cube."""
    available = cube_variables(cube_path)
    if variable_name not in available:
        variables = ", ".join(available) if available else "(none found)"
        raise ValueError(
            f"Variable {variable_name!r} is not in {cube_path}. Available data variables: {variables}. "
            "Set --variable to the incident-count aggregation field used by the GIS pipeline."
        )
    print(f"Using cube variable: {variable_name}")


def training_frame(
    cube_path: Path,
    variable_name: str,
    bin_id_field: str,
    train_end: str | None,
) -> tuple[Any, Any]:
    """Flatten observed cube bins into the table expected by ArcGIS Learn."""
    try:
        import numpy as np
        import pandas as pd
        import xarray as xr
    except ImportError as error:
        raise RuntimeError("pandas and xarray are required to prepare the cube.") from error

    with xr.open_dataset(cube_path) as dataset:
        required = {variable_name, bin_id_field, "PROCESSING_BINARY_MASK"}
        missing = sorted(required.difference(dataset.variables))
        if missing:
            raise ValueError(f"Cube is missing required variables: {', '.join(missing)}")

        if train_end is None:
            train_end = dataset.attrs.get("data_max_time")
        if not train_end:
            raise ValueError("Set --train-end because the cube has no data_max_time attribute.")

        requested_end = pd.Timestamp(train_end)
        observed_times = dataset.time.where(dataset.time <= requested_end, drop=True)
        if observed_times.size == 0:
            raise ValueError(f"No cube bins occur on or before --train-end {requested_end}.")
        effective_end = pd.Timestamp(observed_times.values[-1])

        valid_cells = dataset["PROCESSING_BINARY_MASK"].values.astype(bool).reshape(-1)
        times = observed_times.values
        counts = dataset[variable_name].sel(time=slice(None, effective_end)).values
        counts = counts.reshape(len(times), -1)[:, valid_cells]

        location_ids = dataset[bin_id_field].isel(time=0).values.reshape(-1)[valid_cells]
        if np.isnan(location_ids).any():
            raise ValueError(f"{bin_id_field} is missing for one or more processing cells.")

        frame = pd.DataFrame(
            {
                "time": np.tile(times, len(location_ids)),
                bin_id_field: np.repeat(location_ids.astype("int64"), len(times)),
                variable_name: np.nan_to_num(counts.T.reshape(-1), nan=0.0),
            }
        )
        return frame, effective_end


def require_deep_learning_dependencies() -> None:
    """Fail clearly when the ArcGIS Pro deep-learning libraries are not installed."""
    missing = [name for name in ("torch", "fastai") if importlib.util.find_spec(name) is None]
    if missing:
        raise RuntimeError(
            "ArcGIS Learn training dependencies are missing: "
            + ", ".join(missing)
            + ". Install Esri's Deep Learning Libraries for your ArcGIS Pro version, "
            "then rerun this command. Do not install arbitrary pip versions into arcgispro-py3."
        )


def call_supported(function: Any, /, *args: Any, **kwargs: Any) -> Any:
    """Pass only options supported by the installed ArcGIS Python API version."""
    signature = inspect.signature(function)
    supported_kwargs = {name: value for name, value in kwargs.items() if name in signature.parameters}
    return function(*args, **supported_kwargs)


def records_from_prediction(prediction: Any, bin_id_field: str) -> Any:
    """Normalize common ArcGIS prediction outputs to a tabular object that can become CSV."""
    try:
        import pandas as pd
    except ImportError as error:
        raise RuntimeError("pandas is required to export forecast records.") from error

    if hasattr(prediction, "sdf"):
        prediction = prediction.sdf
    if isinstance(prediction, pd.Series):
        prediction = prediction.to_frame(name="predicted_incident_count")
    elif not isinstance(prediction, pd.DataFrame):
        prediction = pd.DataFrame(prediction)

    prediction = prediction.copy()
    if bin_id_field not in prediction.columns:
        prediction.insert(0, bin_id_field, prediction.index.astype(str))

    numeric_columns = prediction.select_dtypes(include="number").columns.tolist()
    if numeric_columns and "predicted_incident_count" not in prediction.columns:
        prediction = prediction.rename(columns={numeric_columns[-1]: "predicted_incident_count"})
    return prediction


def main() -> int:
    parser = argparse.ArgumentParser(description="Train a TimeSeriesModel from a Space Time Cube.")
    parser.add_argument("--cube", type=Path, required=True, help="Path to the downloaded .nc Space Time Cube.")
    parser.add_argument("--variable", default="COUNT", help="Cube data variable containing incident counts.")
    parser.add_argument("--bin-id-field", default="location_ID", help="Cube variable identifying each spatial bin.")
    parser.add_argument("--train-end", help="Last observed timestamp to use; defaults to the cube's data_max_time.")
    parser.add_argument("--forecast-steps", type=int, default=90, help="Future 8-hour bins to predict.")
    parser.add_argument("--seq-len", type=int, default=90, help="Historical 8-hour bins used for each forecast.")
    parser.add_argument("--epochs", type=int, default=20, help="Training epochs; reduce for a fast demo retrain.")
    parser.add_argument("--prepare-only", action="store_true", help="Validate and summarize input without training.")
    parser.add_argument("--model-dir", type=Path, default=Path("models/incident_forecast_v1"))
    parser.add_argument("--predictions", type=Path, default=Path("data/outputs/incident_forecast.csv"))
    args = parser.parse_args()

    if not args.cube.is_file():
        print(f"Cube file does not exist: {args.cube}", file=sys.stderr)
        return 1

    try:
        validate_variable(args.cube, args.variable)
        if args.seq_len < 2:
            raise ValueError("--seq-len must be at least 2.")
        if args.forecast_steps < 1:
            raise ValueError("--forecast-steps must be at least 1.")

        frame, effective_end = training_frame(
            args.cube,
            args.variable,
            args.bin_id_field,
            args.train_end,
        )
        print(
            f"Prepared {len(frame):,} observations across "
            f"{frame[args.bin_id_field].nunique():,} locations through {effective_end}."
        )
        if args.prepare_only:
            return 0

        require_deep_learning_dependencies()
        from arcgis import __version__ as arcgis_version
        from arcgis.learn import TimeSeriesModel, prepare_tabulardata

        print(f"Training with ArcGIS API {arcgis_version}.")
        data = call_supported(
            prepare_tabulardata,
            input_features=frame,
            variable_predict=args.variable,
            explanatory_variables=[(args.bin_id_field, True)],
            index_field="time",
        )
        model = call_supported(
            TimeSeriesModel,
            data,
            seq_len=args.seq_len,
            location_var=args.bin_id_field,
        )
        model.fit(epochs=args.epochs)

        args.model_dir.parent.mkdir(parents=True, exist_ok=True)
        model.save(str(args.model_dir))
        print(f"Saved trained model to: {args.model_dir}")

        # ArcGIS releases expose slightly different predict signatures; inspect and use supported options.
        prediction = call_supported(
            model.predict,
            input_features=frame,
            prediction_type="dataframe",
            number_of_predictions=args.forecast_steps,
        )
        records = records_from_prediction(prediction, args.bin_id_field)
        args.predictions.parent.mkdir(parents=True, exist_ok=True)
        records.to_csv(args.predictions, index=False)
        print(f"Wrote {len(records)} forecast records to: {args.predictions}")
        return 0
    except Exception as error:
        print(f"Training failed: {error}", file=sys.stderr)
        print(
            "ArcGIS API version and relevant callable signatures:",
            file=sys.stderr,
        )
        try:
            import arcgis
            from arcgis.learn import TimeSeriesModel, prepare_tabulardata

            print(f"  arcgis={arcgis.__version__}", file=sys.stderr)
            print(f"  prepare_tabulardata{inspect.signature(prepare_tabulardata)}", file=sys.stderr)
            print(f"  TimeSeriesModel{inspect.signature(TimeSeriesModel)}", file=sys.stderr)
        except Exception:
            pass
        return 1


if __name__ == "__main__":
    raise SystemExit(main())