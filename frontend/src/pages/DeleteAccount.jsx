import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function DeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await api.delete("/auth/delete-account");
      logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#FFF8F9",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 20px"
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>

        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#FFF0F3", border: "2px solid #F7C5CE",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px"
        }}>
          <i className="ti ti-trash" style={{ fontSize: 26, color: "#C0445A" }} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 22, fontWeight: 700, color: "#2D1F2A",
          textAlign: "center", margin: "0 0 10px"
        }}>
          Delete your account
        </h1>
        <p style={{
          fontSize: 14, color: "#A07890", textAlign: "center",
          lineHeight: 1.6, margin: "0 0 32px"
        }}>
          This will permanently delete your account and all associated data — cycles, symptoms, lab reports, and results. This action cannot be undone.
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FFF0F3", border: "1px solid #F7C5CE",
            borderRadius: 12, padding: "10px 14px", marginBottom: 20
          }}>
            <p style={{ fontSize: 13, color: "#C0445A", margin: 0, textAlign: "center" }}>{error}</p>
          </div>
        )}

        {!confirming ? (
          /* Step 1 — initial warning */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => setConfirming(true)}
              style={{
                width: "100%", background: "white",
                border: "1.5px solid #F7C5CE", borderRadius: 14,
                padding: "13px", fontSize: 15, fontWeight: 600,
                color: "#C0445A", cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#FFF0F3"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
            >
              Yes, delete my account
            </button>

            <button
              onClick={() => navigate("/profile")}
              style={{
                width: "100%", background: "#E8748A",
                border: "none", borderRadius: 14,
                padding: "13px", fontSize: 15, fontWeight: 600,
                color: "white", cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#D95F75"}
              onMouseLeave={e => e.currentTarget.style.background = "#E8748A"}
            >
              Keep my account
            </button>
          </div>
        ) : (
          /* Step 2 — final confirmation */
          <div style={{
            background: "white", border: "1px solid #F2E8EA",
            borderRadius: 20, padding: "24px"
          }}>
            <p style={{
              fontSize: 13, fontWeight: 700, color: "#C0445A",
              textAlign: "center", margin: "0 0 6px",
              textTransform: "uppercase", letterSpacing: "0.06em"
            }}>
              Final confirmation
            </p>
            <p style={{
              fontSize: 14, color: "#6B4F6B", textAlign: "center",
              lineHeight: 1.6, margin: "0 0 24px"
            }}>
              Are you absolutely sure? Every piece of your data will be erased immediately.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  width: "100%",
                  background: deleting ? "#E8A0A0" : "#C0445A",
                  border: "none", borderRadius: 14,
                  padding: "13px", fontSize: 15, fontWeight: 600,
                  color: "white", cursor: deleting ? "not-allowed" : "pointer",
                  transition: "background 0.2s"
                }}
              >
                {deleting ? "Deleting..." : "Delete permanently"}
              </button>

              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                style={{
                  width: "100%", background: "none",
                  border: "1px solid #F2E8EA", borderRadius: 14,
                  padding: "13px", fontSize: 15, fontWeight: 600,
                  color: "#A07890", cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FFF8F9"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                Go back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeleteAccount;