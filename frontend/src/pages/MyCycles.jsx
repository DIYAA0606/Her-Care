import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function MyCycles() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const response = await api.get("/cycles/");
        setCycles(response.data);
      } catch (err) {
        setError("Could not load cycles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Cycles</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && cycles.length === 0 && (
          <p className="text-center text-gray-500">
            No cycles logged yet.{" "}
            <span
              className="text-purple-600 cursor-pointer"
              onClick={() => navigate("/log-cycle")}
            >
              Log your first one.
            </span>
          </p>
        )}

        {cycles.map((cycle) => (
          <div
            key={cycle.id}
            className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100"
          >
            <p className="font-medium">
  Started: {cycle.start_date}
</p>
            {cycle.end_date && (
  <p className="text-gray-600 text-sm">
    Ended: {cycle.end_date}
  </p>
)}
            {cycle.notes && (
              <p className="text-gray-500 text-sm mt-1">Notes: {cycle.notes}</p>
            )}
          </div>
        ))}

        <button
          onClick={() => navigate("/log-cycle")}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          + Log Another Cycle
        </button>
      </div>
    </div>
  );
}

export default MyCycles;