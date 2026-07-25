"""Download an ArcGIS Online Space Time Cube using credentials from a local .env file."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path


def load_settings() -> tuple[str, str, str, str]:
    """Load AGOL connection settings without putting credentials in source control."""
    try:
        from dotenv import load_dotenv
    except ImportError as error:
        raise RuntimeError(
            "Missing python-dotenv. Install it with: conda install -c conda-forge python-dotenv"
        ) from error

    load_dotenv()
    portal_url = os.getenv("AGOL_PORTAL_URL")
    username = os.getenv("AGOL_USERNAME")
    password = os.getenv("AGOL_PASSWORD")
    item_id = os.getenv("AGOL_CUBE_ITEM_ID")
    missing = [
        name
        for name, value in {
            "AGOL_PORTAL_URL": portal_url,
            "AGOL_USERNAME": username,
            "AGOL_PASSWORD": password,
            "AGOL_CUBE_ITEM_ID": item_id,
        }.items()
        if not value
    ]
    if missing:
        raise RuntimeError("Missing required .env values: " + ", ".join(missing))
    return portal_url, username, password, item_id


def main() -> int:
    parser = argparse.ArgumentParser(description="Download the configured Space Time Cube from AGOL.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("data/cube"),
        help="Directory that receives the downloaded .nc file (default: data/cube).",
    )
    args = parser.parse_args()

    try:
        from arcgis.gis import GIS

        portal_url, username, password, item_id = load_settings()
        args.output_dir.mkdir(parents=True, exist_ok=True)

        # Authenticate to the team portal and retrieve the centrally managed cube item.
        gis = GIS(portal_url, username, password)
        cube_item = gis.content.get(item_id)
        if cube_item is None:
            raise RuntimeError(f"No AGOL item was found for AGOL_CUBE_ITEM_ID={item_id!r}.")

        downloaded_path = Path(cube_item.download(save_path=str(args.output_dir)))
        print(f"Downloaded '{cube_item.title}' to: {downloaded_path.resolve()}")
        return 0
    except Exception as error:
        print(f"Cube download failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())