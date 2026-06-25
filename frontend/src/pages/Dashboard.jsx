import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-semibold mb-2">Welcome to HerCare</h1>
      <p className="text-gray-600 mb-6">Logged in as: {user?.email}</p>

      <div className="flex flex-col gap-3 w-64">
        <button
          onClick={() => navigate("/log-cycle")}
          className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Log a Cycle
        </button>
        <button
        onClick={()=>navigate("/log-symptom")}
        className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
          Log a Symptom
        </button>
        <button onClick={()=>navigate("/my-cycles")}
        className="bg-pink-600 text-white py-2 rounded hover:bg-purple-700">
          View My Cycles
        </button>
        <button onClick={()=>navigate("/my-symptoms")}
        className="bg-pink-600 text-white py-2 rounded hover:bg-purple-700">
          View My Symptoms
        </button>
        <button onClick={()=>navigate("/upload-reports")}
        className="bg-yellow-600 text-white py-2 rounded hover:bg-purple-700">
          Upload Lab Report
        </button>
        <button onClick={()=>navigate("/my-reports")}
        className="bg-yellow-600 text-white py-2 rounded hover:bg-purple-700">
          View my reports
        </button>
        <button onClick={()=>navigate("/timeline")}
        className="bg-yellow-600 text-white py-2 rounded hover:bg-purple-700">
          Health Timeline
        </button>
        <button onClick={()=>navigate("/Analytics")}
        className="bg-yellow-600 text-white py-2 rounded hover:bg-purple-700">
          Analytics
        </button>
        <button
          onClick={logout}
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;