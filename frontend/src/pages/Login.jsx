import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.access_token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      if(err.response?.status===429){
        setError("Too many login attempts, try later")
      }
      else {
         setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Log In</h1>

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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
  Don't have an account?{" "}
  <Link to="/signup" className="text-blue-600 hover:underline">
    Sign up
  </Link>
</p>
      </form>
    </div>
  );
}

export default Login;