import { useState } from "react";
import api from "../api/axios";
import {useNavigate } from "react-router-dom";

const SYMPTOM_OPTIONS = [
  "Cramps", "Headache", "Fatigue", "Bloating", "Mood swings",
  "Back pain", "Acne", "Nausea", "Breast tenderness", "Spotting"
];
function LogSymptom(){
    const [symptomType,setSymptomType]=useState("");
    const [date,setDate]=useState("");
    const [severity,setSeverity]=useState("");
    const [notes,setNotes]=useState("");
    const [success,setSuccess]=useState("");
    const [error,setError]=useState("");
    const navigate=useNavigate();
    const handleSubmit =async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await api.post(
        "/symptoms/",
        {
          date: date,
          symptom_type: symptomType ,
          severity: severity||null,
          notes: notes || null,
        }
      );

      setSuccess("Symptom logged successfully!");
      setDate("");
      setSymptomType("");
      setSeverity("");
      setNotes("");
            
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };
    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-semibold mb-6 text-center">Log a Symptom</h1>

      {error && (
        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mb-4 text-center">{success}</p>
      )}

      <label className="block text-sm font-medium mb-1">
        Date <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        required
      />

      <label className="block text-sm font-medium mb-1">
        Symptom <span className="text-red-500">*</span>
      </label>
      <select
        value={symptomType}
        onChange={(e) => setSymptomType(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        required
      >
        <option value="">Select a symptom</option>
        {SYMPTOM_OPTIONS.map((symptom) => (
          <option key={symptom} value={symptom}>{symptom}</option>
        ))}
      </select>

      <label className="block text-sm font-medium mb-1">
        Severity (1 = mild, 5 = severe)
      </label>
      <input
        type="number"
        min={1}
        max={5}
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
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
        placeholder="Any additional notes..."
      />

      <button
        type="submit"
        className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
      >
        Save Symptom
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
export default LogSymptom;