import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function FarmerMap({ farmers }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">
        🌍 Farmer Locations
      </h2>

      <MapContainer
        center={[11.8745, 75.3704]}
        zoom={8}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {farmers.map((farmer) => {
          const [lng, lat] =
            farmer.location.coordinates;

          return (
            <Marker
              key={farmer._id}
              position={[lat, lng]}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">
                    {farmer.name}
                  </h3>

                  <p>
                    Crop: {farmer.cropType}
                  </p>

                  <p>
                    Area: {farmer.plotSize} Acres
                  </p>

                  <p>
                    Phone: {farmer.phone}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}