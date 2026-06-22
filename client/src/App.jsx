import { useEffect, useState } from "react";
import axios from "axios";
import FarmerMap from "./components/FarmerMap";
import {
  Users,
  Sprout,
  MapPinned,
  PlusCircle,
  Search,
  Trash2,
  Pencil,
} from "lucide-react";

export default function App() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(5);
  const [nearbyFarmers, setNearbyFarmers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const API = "https://farmer-land-registry.onrender.com";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cropType: "",
    plotSize: "",
  });

  const fetchFarmers = async () => {
    try {
      const res = await axios.get(`${API}/farmers`);
      setFarmers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.cropType ||
      !formData.plotSize
    ) {
      alert("Please fill all fields");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const payload = {
          ...formData,
          plotSize: Number(formData.plotSize),
          location: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };

        if (editingId) {
          await axios.put(
            `${API}/farmers/${editingId}`,
            payload
          );
        } else {
          await axios.post(
            `${API}/farmers`,
            payload
          );
        }

        setFormData({
          name: "",
          phone: "",
          cropType: "",
          plotSize: "",
        });

        setEditingId(null);
        fetchFarmers();
      },
      () => {
        alert("Location access denied");
      }
    );
  };

  const editFarmer = (farmer) => {
    setEditingId(farmer._id);

    setFormData({
      name: farmer.name,
      phone: farmer.phone,
      cropType: farmer.cropType,
      plotSize: farmer.plotSize,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteFarmer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this farmer?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API}/farmers/${id}`
      );

      fetchFarmers();
    } catch (error) {
      console.log(error);
    }
  };

  const findNearbyFarmers = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await axios.get(
            `${API}/farmers/nearby?lat=${lat}&lng=${lng}&km=${radius}`
          );

          console.log(res.data);

          setNearbyFarmers(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      farmer.cropType
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalAcres = farmers.reduce(
    (sum, farmer) => sum + farmer.plotSize,
    0
  );

  const totalCropTypes = new Set(
    farmers.map((f) => f.cropType)
  ).size;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HERO */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold">
            🌾 Farmer Land Registry
          </h1>

          <p className="mt-3 text-lg text-green-100">
            Smart Agriculture Management Platform
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Total Farmers
                </p>
                <h2 className="text-4xl font-bold">
                  {farmers.length}
                </h2>
              </div>

              <Users
                size={42}
                className="text-green-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Total Acres
                </p>

                <h2 className="text-4xl font-bold">
                  {totalAcres.toFixed(1)}
                </h2>
              </div>

              <MapPinned
                size={42}
                className="text-blue-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Crop Types
                </p>

                <h2 className="text-4xl font-bold">
                  {totalCropTypes}
                </h2>
              </div>

              <Sprout
                size={42}
                className="text-emerald-600"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Nearby Farmers
                </p>

                <h2 className="text-4xl font-bold">
                  {nearbyFarmers.length}
                </h2>
              </div>

              <MapPinned
                size={42}
                className="text-purple-600"
              />
            </div>
          </div>

        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Register New Farmer
          </h2>

          <div className="grid md:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="Farmer Name"
              className="border rounded-xl p-3"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="border rounded-xl p-3"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Crop Type"
              className="border rounded-xl p-3"
              value={formData.cropType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cropType: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Plot Size (Acres)"
              className="border rounded-xl p-3"
              value={formData.plotSize}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  plotSize: e.target.value,
                })
              }
            />

          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <PlusCircle size={20} />
            {editingId ? "Update Farmer" : "Register Farmer"}
          </button>
        </div>

        {/* MAP */}
        <FarmerMap farmers={farmers} />

        {/* SEARCH */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex items-center gap-3">

            <Search className="text-gray-500" />

            <input
              type="text"
              placeholder="Search by farmer name or crop type..."
              className="w-full outline-none"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <h2 className="text-xl font-bold mb-4">
            📍 Nearby Farmers Search
          </h2>

          <div className="flex gap-4">

            <input
              type="number"
              value={radius}
              onChange={(e) =>
                setRadius(e.target.value)
              }
              className="border rounded-lg p-3 w-40"
            />

            <button
              onClick={findNearbyFarmers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
            >
              Find Nearby Farmers
            </button>

          </div>

        </div>

        {nearbyFarmers.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Nearby Farmers ({nearbyFarmers.length})
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {nearbyFarmers.map((farmer) => (
                <div
                  key={farmer._id}
                  className="border rounded-xl p-4 hover:shadow-md"
                >
                  <h3 className="font-bold text-lg">
                    {farmer.name}
                  </h3>

                  <p>📞 {farmer.phone}</p>

                  <p>🌱 {farmer.cropType}</p>

                  <p>📏 {farmer.plotSize} Acres</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              Registered Farmers
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>

                  <th className="p-4 text-left">
                    #
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Crop
                  </th>

                  <th className="p-4 text-left">
                    Acres
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredFarmers.map((farmer, index) => (
                  <tr
                    key={farmer._id}
                    className="border-t hover:bg-green-50 transition-colors"
                  >
                    <td className="p-4">
                      {index + 1}
                    </td>

                    <td className="p-4">
                      {farmer.name}
                    </td>

                    <td className="p-4">
                      {farmer.phone}
                    </td>

                   <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        {farmer.cropType}
                    </span>
                   </td>

                    <td className="p-4">
                      {farmer.plotSize}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">

                        <button
                          onClick={() => editFarmer(farmer)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteFarmer(farmer._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}