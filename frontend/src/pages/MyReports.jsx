import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function MyReports() {
  // same fetch-on-load pattern as MyCycles and MySymptoms
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports/");
        setReports(response.data);
      } catch (err) {
        setError("Could not load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Lab Reports</h1>
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

        {!loading && reports.length === 0 && (
          <p className="text-center text-gray-500">
            No reports uploaded yet.{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/upload-reports")}
            >
              Upload your first one.
            </span>
          </p>
        )}

        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100"
          >
            {/* Report header */}
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium">{report.filename}</p>
              <p className="text-gray-400 text-xs">{report.upload_date.slice(0, 10)}</p>
            </div>

            {/* Results list — a loop inside a loop */}
            {report.results.length === 0 ? (
              <p className="text-gray-400 text-sm">No results added yet.</p>
            ) : (
              report.results.map((result) => (
                <div
                  key={result.id}
                  className="flex justify-between items-center py-1 border-t border-gray-50"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {result.test_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {result.value} {result.unit}
                  </p>
                </div>
              ))
            )}

            {/* Button to add more results to this specific report */}
            <button
              onClick={() => navigate(`/add-results/${report.id}`)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Results
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/upload-reports")}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          + Upload Another Report
        </button>
      </div>
    </div>
  );
}

export default MyReports;