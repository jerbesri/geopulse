flowchart TB
    A[Prediction Feature Layer] --> W[ArcGIS Web Map]
    B[Historical Hotspot Layer] --> W
    C[Live Incident Layer] --> W
    D[Vehicle Layer] --> W
    E[Station Layer] --> W
    F[Staging Recommendation Layer] --> W
    W --> X[Experience Builder]
    X --> API[GeoPulse FastAPI]
    API --> F
