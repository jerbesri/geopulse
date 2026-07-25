"""Train an ArcGIS time-series model from a Space Time Cube and export forecast records.

The resulting CSV is intentionally simple: downstream FastAPI or ArcGIS feature-layer
code can join it back to hotspot/bin IDs before forming a response.
"""

from __future__ import annotations

import argparse
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
    parser.add_argument("--variable", default="INCIDENT_COUNT", help="Cube data variable containing incident counts.")
    parser.add_argument("--bin-id-field", default="LOCATION_ID", help="Identifier column to retain in forecast output.")
    parser.add_argument("--seq-len", type=int, default=12, help="History steps used for each forecast.")
    parser.add_argument("--epochs", type=int, default=20, help="Training epochs; reduce for a fast demo retrain.")
    parser.add_argument("--model-dir", type=Path, default=Path("models/incident_forecast_v1"))
    parser.add_argument("--predictions", type=Path, default=Path("data/outputs/incident_forecast.csv"))
    args = parser.parse_args()

    if not args.cube.is_file():
        print(f"Cube file does not exist: {args.cube}", file=sys.stderr)
        return 1

    try:
        validate_variable(args.cube, args.variable)
        from arcgis import __version__ as arcgis_version
        from arcgis.learn import TimeSeriesModel, prepare_tabulardata

        # Convert the cube's per-bin count series to the format ArcGIS Learn expects.
        data = call_supported(prepare_tabulardata, str(args.cube), variable_names=[args.variable])
        model = call_supported(TimeSeriesModel, data, seq_len=args.seq_len)
        model.fit(epochs=args.epochs)

        args.model_dir.parent.mkdir(parents=True, exist_ok=True)
        model.save(str(args.model_dir))
        print(f"Saved trained model to: {args.model_dir}")

        # ArcGIS releases expose slightly different predict signatures; inspect and use supported options.
        prediction = call_supported(
            model.predict,
            data,
            prediction_type="dataframe",
            output_path=str(args.predictions),
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