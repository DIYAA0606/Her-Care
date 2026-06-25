import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await api.get("/timeline/");
        setEvents(response.data);
      } catch (err) {
        setError("Could not load timeline.");
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const renderEvent = (event, index) => {
    if (event.type === "cycle") {
      return (
        <div key={index} className="border-l-4 border-purple-500 pl-4 mb-4">
          <p className="text-xs text-gray-400">{event.date}</p>
          <p className="font-medium text-purple-700">🔴 Cycle Started</p>
          {event.data.end_date && (
            <p className="text-sm text-gray-600">Ended: {event.data.end_date}</p>
          )}
          {event.data.notes && (
            <p className="text-sm text-gray-500">{event.data.notes}</p>
          )}
        </div>
      );
    }

    if (event.type === "symptom") {
      return (
        <div key={index} className="border-l-4 border-pink-400 pl-4 mb-4">
          <p className="text-xs text-gray-400">{event.date}</p>
          <p className="font-medium text-pink-700">
            💊 {event.data.symptom_type}
          </p>
          {event.data.severity && (
            <p className="text-sm text-gray-600">Severity: {event.data.severity}/5</p>
          )}
          {event.data.notes && (
            <p className="text-sm text-gray-500">{event.data.notes}</p>
          )}
        </div>
      );
    }

    if (event.type === "lab_report") {
      return (
        <div key={index} className="border-l-4 border-blue-400 pl-4 mb-4">
          <p className="text-xs text-gray-400">{event.date}</p>
          <p className="font-medium text-blue-700">🧪 Lab Report</p>
          {event.data.results.map((r, i) => (
            <p key={i} className="text-sm text-gray-600">
              {r.test_type}: {r.value} {r.unit}
            </p>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Health Timeline</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && events.length === 0 && (
          <p className="text-center text-gray-500">No health data yet.</p>
        )}

        {events.map((event, index) => renderEvent(event, index))}
      </div>
    </div>
  );
}

export default Timeline;