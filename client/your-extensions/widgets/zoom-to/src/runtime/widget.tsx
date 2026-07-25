/* eslint-disable semi */
import { React, type AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, type JimuMapView } from "jimu-arcgis";
import Point from "@arcgis/core/geometry/Point";

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView | null>(
    null,
  );

  const zoomToCoords = async (lon: number, lat: number) => {
    if (!jimuMapView?.view) return;

    const pt = new Point({
      longitude: lon,
      latitude: lat,
      spatialReference: { wkid: 4326 },
    });

    await jimuMapView.view.goTo({
      target: pt,
      zoom: 14,
    });
  };

  return (
    <div>
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={setJimuMapView}
      />
      <button onClick={() => zoomToCoords(-96.797, 32.7767)}>
        Zoom to coordinate
      </button>
    </div>
  );
};

export default Widget;
