import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import geoJsonData from "./geoJSON-sm.json";

export default function MyMap({ className = "", deviceData = [] }) {
  const [selectedData, setSelectedData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [mapData, setMapData] = useState(undefined);
  const [maxDevice, setMaxDevice] = useState(0);
  const onMouseMove = (e) => {
    setPopupPosition(e.latlng);
  };
  const onMouseOver = (e) => {
    const { postal, name, device } = e.target.feature.properties;
    setSelectedData({
      postal,
      name,
      device,
    });
  };
  const onMouseOut = (e) => {
    setSelectedData(null);
    setPopupPosition(null);
  };
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: onMouseOver,
      mouseout: onMouseOut,
      mousemove: onMouseMove,
    });
  };
  const mapPolygonColorToDevice = (device) => {
    return device === 0
      ? "#e2e2e2"
      : device < maxDevice / 2
      ? "#fce2c5"
      : "#f8bd7a";
  };
  const mapStyle = {
    height: "500px",
    width: "700px",
  };
  const style = (feature) => {
    return {
      fillColor: mapPolygonColorToDevice(feature.properties.device),
      weight: 2,
      opacity: 1,
      color:
        selectedData && feature.properties.name === selectedData.name
          ? "#a50f15"
          : "white",
      fillOpacity: 1,
    };
  };

  useEffect(() => {
    if (geoJsonData && deviceData.length > 0) {
      const temp = geoJsonData.features.map((e) => {
        const t1 = deviceData.find((el) => el?.name === e.properties.postal);
        const s = t1 ? t1?.count : 0;
        return {
          ...e,
          properties: { ...e.properties, device: s },
        };
      });
      setMapData({ type: "FeatureCollection", features: temp });
      const max = deviceData.reduce((prev, current) => {
        return prev?.count > current?.count ? prev : current;
      });
      setMaxDevice(max?.count);
    }
  }, [deviceData, geoJsonData]);

  return (
    <div className={`${className} my-map`}>
      <h5 className="px-6 py-2 text-xl font-medium text-[#0D192D]">
        Device Map
      </h5>
      <MapContainer
        center={[35, 0]}
        zoom={2}
        scrollWheelZoom={false}
        minZoom={1}
        maxZoom={2}
        style={mapStyle}
        // preferCanvas={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        {mapData && (
          <GeoJSON data={mapData} style={style} onEachFeature={onEachFeature} />
        )}
        {popupPosition && selectedData && (
          <Popup position={popupPosition} closeButton={false}>
            <h1 className="font-extrabold text-2xl">{selectedData.postal}</h1>
            <h1 className="font-bold text-xl">{selectedData.name}</h1>
            {selectedData.device > 0 ? (
              <div className="flex flex-row items-end gap-2">
                <div>
                  <h1 className="text-lg">Devices</h1>
                </div>
                <div className="text-lg">
                  <h1 className="text-green-600">{selectedData.device}</h1>
                </div>
              </div>
            ) : (
              <h1 className="text-lg text-gray-300 italic">
                No data available
              </h1>
            )}
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
