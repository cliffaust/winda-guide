import React from "react";
import Map, { Source, Layer, GeolocateControl, Marker } from "react-map-gl";
import Image from "next/image";

function MapBox() {
  const [viewState, setViewState] = React.useState({
    longitude: 36.8172449,
    latitude: -1.2832533,
    zoom: 14,
  });

  const [moving, setMoving] = React.useState(false);

  const geolocateControlRef = React.useCallback((ref) => {
    if (ref) {
      // Activate as soon as the control is loaded
      ref.trigger();
    }
  }, []);

  return (
    <Map
      reuseMaps
      width="100%"
      height="100%"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      {...viewState}
      onMove={(evt) => {
        setViewState(evt.viewState);
        setMoving(true);
      }}
      onMoveEnd={(evt) => {
        setMoving(false);
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      // mapStyle="mapbox://styles/cliffaustin/cl0psgnss008714n29bmcpx68"
    >
      <Marker longitude={viewState.longitude} latitude={viewState.latitude}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={"h-10 w-10 absolute " + (moving ? "-top-1.5" : "")}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      </Marker>
    </Map>
  );
}

export default MapBox;
