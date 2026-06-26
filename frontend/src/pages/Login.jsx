import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Mascot from "../components/Mascot";
import DecorativeWave from "../components/DecorativeWave";

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
      const response = await api.post("/auth/login", { email, password });
      login(response.data.access_token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Too many login attempts, please try again later.");
      } else {
        setError("Invalid email or password.");
      }
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: "1px solid #F2E8EA", borderRadius: 12,
    padding: "11px 14px", fontSize: 14, color: "#2D1F2A",
    background: "#FFFAFB", outline: "none",
    transition: "border-color 0.2s"
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#FFF8F9",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px", position: "relative",
      overflow: "hidden"
    }}>
      <DecorativeWave position="top-right" opacity={0.45} />
      <DecorativeWave position="bottom-left" opacity={0.25} />

      <div style={{ width: "100%", maxWidth: 360, position: "relative", zIndex: 1 }}>

        {/* Mascot + brand */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Mascot size={100} />
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: "#2D1F2A",
            margin: "12px 0 4px", letterSpacing: "-0.02em"
          }}>
            HerCare
          </h1>
          <p style={{ fontSize: 14, color: "#A07890", margin: 0 }}>
            Your personal health companion
          </p>
        </div>

        <div style={{
          background: "white", borderRadius: 24,
          border: "1px solid #F2E8EA", padding: "32px 28px"
        }}>
          <h2 style={{
            fontSize: 20, fontWeight: 700, color: "#2D1F2A",
            margin: "0 0 24px", textAlign: "center"
          }}>
            Welcome back
          </h2>

          {error && (
            <div style={{
              background: "#FFF0F3", border: "1px solid #F7C5CE",
              borderRadius: 12, padding: "10px 14px", marginBottom: 20
            }}>
              <p style={{ fontSize: 13, color: "#C0445A", margin: 0, textAlign: "center" }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 13, fontWeight: 600, color: "#6B4F6B",
                display: "block", marginBottom: 6
              }}>
                Email
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#E8748A"}
                onBlur={e => e.target.style.borderColor = "#F2E8EA"}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{
                fontSize: 13, fontWeight: 600, color: "#6B4F6B",
                display: "block", marginBottom: 6
              }}>
                Password
              </label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                required style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#E8748A"}
                onBlur={e => e.target.style.borderColor = "#F2E8EA"}
              />
            </div>

            <button type="submit" style={{
              width: "100%", background: "#E8748A", color: "white",
              border: "none", borderRadius: 14, padding: "13px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              transition: "background 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#D95F75"}
              onMouseLeave={e => e.currentTarget.style.background = "#E8748A"}
            >
              Log in
            </button>
          </form>

          <p style={{
            textAlign: "center", fontSize: 13,
            color: "#A07890", margin: "20px 0 0"
          }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{
              color: "#E8748A", fontWeight: 600, textDecoration: "none"
            }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;