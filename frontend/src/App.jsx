import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LogCycle from "./pages/LogCycle";
import LogSymptom from "./pages/LogSymptom";
import MyCycles from "./pages/MyCycles";
import MySymptoms from "./pages/MySymptoms";
import UploadReports from "./pages/UploadReports";
import AddResults from "./pages/AddResults";
import MyReports from "./pages/MyReports";
import Timeline from "./pages/Timeline";
import Signup from "./pages/Signup";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/log-cycle" element={<ProtectedRoute><LogCycle /></ProtectedRoute>}/>
        <Route path="/my-cycles" element={<ProtectedRoute><MyCycles/></ProtectedRoute>}/>
        <Route path="/log-symptom" element={<ProtectedRoute><LogSymptom/></ProtectedRoute>}/>
        <Route path="/my-symptoms" element={<ProtectedRoute><MySymptoms/></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/upload-reports" element={<ProtectedRoute><UploadReports/></ProtectedRoute>}/>
        <Route path="/add-results/:report_id" element={<ProtectedRoute><AddResults/></ProtectedRoute>}/>
        <Route path="/my-reports" element={<ProtectedRoute><MyReports/></ProtectedRoute>}/>
        <Route path="/timeline" element={<ProtectedRoute><Timeline/></ProtectedRoute>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;