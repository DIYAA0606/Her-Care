import { useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const TEST_OPTIONS = [
  { label: "Hemoglobin", value: "HEMOGLOBIN", unit: "g/dL" },
  { label: "TSH", value: "TSH", unit: "mIU/L" },
  { label: "Vitamin D", value: "VITAMIN_D", unit: "ng/mL" },
  { label: "Ferritin", value: "FERRITIN", unit: "ng/mL" },
  { label: "Glucose", value: "GLUCOSE", unit: "mg/dL" },
  { label: "Platelets", value: "PLATELETS", unit: "lakh/µL" },
];

function AddResults() {
  const { report_id } = useParams();
  const navigate = useNavigate();

  const [testType, setTestType] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // auto-fill unit when test type is selected
  const handleTestTypeChange = (e) => {
    const selected = TEST_OPTIONS.find((t) => t.value === e.target.value);
    setTestType(e.target.value);
    setUnit(selected ? selected.unit : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post(`/reports/${report_id}/results`, {
        test_type: testType,
        value: parseFloat(value),
        unit: unit,
      });

      setSuccess("Result added!");
      setTestType("");
      setValue("");
      setUnit("");
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
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Add Lab Results
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Report #{report_id}
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">{success}</p>
        )}

        <label className="block text-sm font-medium mb-1">Test Type</label>
        <select
          value={testType}
          onChange={handleTestTypeChange}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        >
          <option value="">Select a test</option>
          {TEST_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Value</label>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium mb-1">Unit</label>
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6"
          placeholder="e.g. g/dL"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Result
        </button>

        <button
          type="button"
          onClick={() => navigate("/my-reports")}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          View All Reports
        </button>
      </form>
    </div>
  );
}

export default AddResults;