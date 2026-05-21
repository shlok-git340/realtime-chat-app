import { useState } from "react";

import API from "./api";
import Signup from "./Signup";

function Login({ setToken, setUserId }) {

  const [showSignup, setShowSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await API.post(
        "/users/login/",
        {
          username,
          password,
        }
      );

      const token = response.data.access;

      localStorage.setItem("token", token);

      setToken(token);

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      setUserId(payload.user_id);

    } catch (error) {

      console.error(error);

      alert("Login failed");
    }
  };

  if (showSignup) {

    return (
      <Signup
        goToLogin={() => setShowSignup(false)}
      />
    );
  }

  return (

    <div style={{ padding: "20px" }}>

      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

      <br /><br />

      <button
        onClick={() => setShowSignup(true)}
      >
        Create Account
      </button>

    </div>
  );
}

export default Login;