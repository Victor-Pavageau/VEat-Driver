import { useEffect, useState } from "react";
import { tp } from "../routing";
import { useNavigate } from "react-router-dom";
import { getUserIdFromJWT } from "../api/common";
import {
  MapContainer,
  ScaleControl,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import NavBar from "../components/NavBar";

function MapPage() {
  const [userId] = useState<string | undefined>(getUserIdFromJWT());
  const navigate = useNavigate();

  useEffect(() => {
    if (userId === undefined) {
      navigate(tp("/profile"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex flex-col px-10 pt-3">
        <div className="h-[50vh] mt-3 w-full">
          <MapContainer
            center={[44.86503735265248, -0.5772294255236788]}
            zoom={15}
            minZoom={12}
            scrollWheelZoom
            zoomControl={false}
            className="flex h-full"
          >
            <ScaleControl position="topleft" />
            <ZoomControl position="bottomright" />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default MapPage;
