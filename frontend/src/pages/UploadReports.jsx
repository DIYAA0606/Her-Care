import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function UploadReport() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [extractedValues, setExtractedValues] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReportId(response.data.report_id);
      setExtractedValues(response.data.extracted_values || []);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleValueChange = (index, field, newValue) => {
    const updated = [...extractedValues];
    updated[index] = { ...updated[index], [field]: newValue };
    setExtractedValues(updated);
  };

  const handleRemove = (index) => {
    setExtractedValues(extractedValues.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/reports/${reportId}/results`, extractedValues);
      setSaved(true);
    } catch (err) {
      setError("Could not save results. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Upload Reports</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Stage 1: upload form */}
        {!reportId && (
          <form
            onSubmit={handleUpload}
            className="bg-white p-6 rounded-lg shadow-sm mb-4"
          >
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <label className="block text-sm font-medium mb-1">
              Select Report (PDF, JPG, PNG)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full border rounded px-3 py-2 mb-4"
              required
            />

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading & Extracting..." : "Upload Report"}
            </button>
          </form>
        )}

        {/* Stage 2: review extracted values */}
        {reportId && !saved && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-1">Review Extracted Values</h2>
            <p className="text-gray-500 text-sm mb-4">
              We found these values in your report. Edit or remove anything
              that looks wrong, then confirm.
            </p>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            {extractedValues.length === 0 ? (
              <p className="text-gray-400 text-sm mb-4">
                No values were automatically extracted. You can add them
                manually below.
              </p>
            ) : (
              extractedValues.map((item, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    value={item.test_type}
                    onChange={(e) =>
                      handleValueChange(index, "test_type", e.target.value)
                    }
                    className="border rounded px-2 py-1 w-36 text-sm"
                    placeholder="Test type"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={item.value}
                    onChange={(e) =>
                      handleValueChange(index, "value", e.target.value)
                    }
                    className="border rounded px-2 py-1 w-24 text-sm"
                    placeholder="Value"
                  />
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) =>
                      handleValueChange(index, "unit", e.target.value)
                    }
                    className="border rounded px-2 py-1 w-24 text-sm"
                    placeholder="Unit"
                  />
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                disabled={saving || extractedValues.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {saving ? "Saving..." : "Confirm & Save"}
              </button>
              <button
                onClick={() => navigate(`/add-results/${reportId}`)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                Add Manually Instead
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: success */}
        {saved && (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-green-600 font-medium text-lg mb-4">
              ✓ Results saved successfully!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/my-reports")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                View My Reports
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadReport;