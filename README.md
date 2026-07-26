![Geopulse app preview](image.png)

## Experience Builder package

This app is intended to run with ArcGIS Experience Builder. Download the latest package (currently 1.21) from:

https://developers.arcgis.com/experience-builder/guide/downloads/

## Setup

Install pnpm if not already installed.

```powershell
cd server
npm i -g pnpm
```

Initialize pnpm.

```powershell
pnpm ci
```

Do the same for the client.

```powershell
cd ../client
pnpm ci
```

## Run the application

After setup is complete, run both services in separate terminals.

### Start server

```powershell
cd server
pnpm dev
```

### Start client

```powershell
cd client
pnpm dev
```

Then open the local URL shown in the terminal
