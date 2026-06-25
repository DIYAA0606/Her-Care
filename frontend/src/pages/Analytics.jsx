import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Analytics(){
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const navigate=useNavigate();
const handleDownloadPDF = async () => {
  try {
    const response = await api.get("/export/pdf", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hercare_report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert("Could not generate PDF. Please try again.");
  }
};
    useEffect(()=>{
        const fetch=async () => {
            try {
                const response=await api.get("/analytics/");
                setData(response.data)
            } catch (err) {
                setError("Could not load analytics");
            }finally{
                setLoading(false);
            }
        };
        fetch();
    },[]);
     if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!data) return null;
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Health Analytics</h1>
          <button
  onClick={handleDownloadPDF}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
>
  Download PDF Report
</button>
          <button onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700">
            Back to Dashboard
          </button>
        </div>

        {/* Health Flags */}
        {data.flags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Health Flags</h2>
            {data.flags.map((flag, i) => (
              <div key={i} className={`p-4 rounded-lg mb-2 text-sm ${
                flag.type === "low" || flag.type === "trending_down"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : flag.type === "high" || flag.type === "trending_up"
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {flag.message}
              </div>
            ))}
          </div>
        )}

        {/* Cycle Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-medium mb-3">Cycle Summary</h2>
          <p className="text-sm text-gray-600">Total cycles logged: <span className="font-medium">{data.cycle_count}</span></p>
          <p className="text-sm text-gray-600">Average cycle length: <span className="font-medium">{data.avg_cycle_length ? `${data.avg_cycle_length} days` : "Not enough data"}</span></p>
          <p className="text-sm text-gray-600">Average period length: <span className="font-medium">{data.avg_period_length ? `${data.avg_period_length} days` : "Not enough data"}</span></p>
        </div>

        {/* Top Symptoms */}
        {data.most_frequent_symptoms.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-medium mb-3">Most Frequent Symptoms</h2>
            {data.most_frequent_symptoms.map((s, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                <p className="text-sm text-gray-700">{s.symptom}</p>
                <p className="text-sm text-gray-500">{s.count}x</p>
              </div>
            ))}
          </div>
        )}

        {/* Lab Trends */}
        {Object.keys(data.lab_trends).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-medium mb-3">Lab Value History</h2>
            {Object.entries(data.lab_trends).map(([testType, readings]) => (
              <div key={testType} className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">{testType}</p>
                {readings.map((r, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-500 pl-2">
                    <span>{r.date}</span>
                    <span>{r.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {data.flags.length === 0 && data.cycle_count === 0 && data.symptom_count === 0 && (
          <p className="text-center text-gray-500 mt-8">Log some health data to see your analytics here.</p>
        )}
      </div>
    </div>
  );
}
export default Analytics;