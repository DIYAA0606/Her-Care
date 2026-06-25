import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function LogCycle() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post(
        "/cycles/",
        {
          start_date: startDate,
          end_date: endDate || null,
          notes: notes || null,
        }
      );

      setSuccess("Cycle logged successfully!");
      setStartDate("");
      setEndDate("");
      setNotes("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Log a Cycle
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">{success}</p>
        )}

        <label className="block text-sm font-medium mb-1">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium mb-1">
          End Date (optional)
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block text-sm font-medium mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6"
          rows={3}
          placeholder="Any notes about this cycle..."
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Save Cycle
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default LogCycle;