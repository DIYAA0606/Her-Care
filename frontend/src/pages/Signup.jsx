import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth/signup", {
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign Up</h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6"
          required
        />
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6"
          required
        />


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
         <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;