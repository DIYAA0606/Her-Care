import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function MySymptoms() {
  // sticky notes: symptoms (starts as []), loading (starts true), error
  const [symptoms, setSymptoms]=useState([]);
  const [loading, setLoading]=useState(true);
  const [error,setError]=useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        // call api.get("/symptoms/")
        // save response.data into symptoms sticky note
        const response= await api.get("/symptoms/");
        setSymptoms(response.data);
      } catch (err) {
        // set error message
        setError("Could not load symptoms. Please try again.");
      } finally {
        // set loading to false
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  return (
    // same structure as MyCycles
    // show loading, error, empty state
    // map over symptoms, show: date, symptom_type, severity, notes
    // back to dashboard button
    // log another symptom button
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Symptoms</h1>
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

        {!loading && symptoms.length === 0 && (
          <p className="text-center text-gray-500">
            No symptoms logged yet.{" "}
            <span
              className="text-purple-600 cursor-pointer"
              onClick={() => navigate("/log-symptom")}
            >
              Log your first one.
            </span>
          </p>
        )}

        {symptoms.map((symptom) => (
          <div
            key={symptom.id}
            className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100"
          >
            <p className="font-medium">
  Date: {symptom.date}
</p>
<p className="font-medium">
  Symptom: {symptom.symptom_type}
</p>
            {symptom.severity && (
  <p className="text-gray-600 text-sm">
    Severity: {symptom.severity} / 5
  </p>
)}
            {symptom.notes && (
              <p className="text-gray-500 text-sm mt-1">Notes: {symptom.notes}</p>
            )}
          </div>
        ))}

        <button
          onClick={() => navigate("/log-symptom")}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          + Log Another Symptom
        </button>
      </div>
    </div>
  );
}

export default MySymptoms;