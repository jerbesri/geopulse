# geopulse Experience Builder app

## Setup

Install pnpm if not already installed

```powershell
cd server
npm i -g pnpm
```

Initialize pnpm

```powershell
pnpm ci
```

Do the same for the client

```powershell
cd ../client
pnpm ci
```

## EMS staging widget

Configure the `run-suggestions` widget in Experience Builder before the demo:

1. Select the map widget that will display the staging-area marker.
2. Enter the prediction feature layer URL, including its layer index such as `/FeatureServer/0`.
3. Enter the incident feature layer URL and the exact incident-type field name.
4. Set the incident search radius in miles.
5. Keep the briefing proxy URL as `/rest/ems/staging-briefing` when the client and server share an origin, or enter the deployed API URL.

The widget performs prediction, spatial incident, and Open-Meteo queries in the browser. Only the compact tactical-briefing payload is sent to the server.

Set Azure OpenAI credentials in the environment that starts the server. Do not put the key in widget configuration or source files.

```powershell
$env:AZURE_OPENAI_ENDPOINT = "https://YOUR_RESOURCE.openai.azure.com"
$env:AZURE_OPENAI_DEPLOYMENT_NAME = "YOUR_DEPLOYMENT"
$env:AZURE_OPENAI_KEY = "YOUR_KEY"
```

For an existing API gateway that already exposes a complete chat-completions route, set this instead of the endpoint and deployment variables:

```powershell
$env:AZURE_OPENAI_CHAT_COMPLETIONS_URL = "https://YOUR_GATEWAY/chat/completions?api-version=2024-02-01"
$env:AZURE_OPENAI_KEY = "YOUR_KEY"
```

Restart the server after changing environment variables.
