/* eslint-disable semi */
import { React, type AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, type JimuMapView } from "jimu-arcgis";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";

const Widget = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView | null>(
    null,
  );
  const highlightGraphicRef = React.useRef<Graphic | null>(null);

  const zoomToCoords = async (lon: number, lat: number) => {
    if (!jimuMapView?.view) return;

    const pt = new Point({
      longitude: lon,
      latitude: lat,
      spatialReference: { wkid: 4326 },
    });

    if (highlightGraphicRef.current) {
      jimuMapView.view.graphics.remove(highlightGraphicRef.current);
      highlightGraphicRef.current = null;
    }

    const highlightGraphic = new Graphic({
      geometry: pt,
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: [255, 87, 34, 0.95],
        size: 14,
        outline: {
          color: [255, 255, 255, 1],
          width: 2,
        },
      },
    });

    jimuMapView.view.graphics.add(highlightGraphic);
    highlightGraphicRef.current = highlightGraphic;

    await jimuMapView.view.goTo({
      target: pt,
      zoom: 14,
    });
  };

  React.useEffect(() => {
    return () => {
      if (!jimuMapView?.view || !highlightGraphicRef.current) return;
      jimuMapView.view.graphics.remove(highlightGraphicRef.current);
      highlightGraphicRef.current = null;
    };
  }, [jimuMapView]);

  return (
    <div>
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={setJimuMapView}
      />
      <button onClick={() => zoomToCoords(-117.1825, 34.0556)}>
        Zoom to coordinate
      </button>
    </div>
  );
};

export default Widget;
