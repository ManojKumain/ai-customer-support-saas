import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testRequest = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/test"); // make sure backend has a test route
      console.log(res.data);
      alert("Backend connected successfully!");
    } catch (err) {
      console.error(err);
      setError("Backend connection failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login Page</h2>

      <button onClick={testRequest} disabled={loading}>
        {loading ? "Loading..." : "Test Backend Connection"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}