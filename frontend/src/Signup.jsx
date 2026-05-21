import { useState } from "react";
import API from "./api";

function Signup({ goToLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      await API.post("/users/register/", {
        username,
        password,
      });

      alert("Signup successful");

      goToLogin();

    } catch (error) {

      console.error(error);

      alert("Signup failed");
    }
  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>Signup</h2>

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

      <button onClick={handleSignup}>
        Signup
      </button>

      <br /><br />

      <button onClick={goToLogin}>
        Back to Login
      </button>

    </div>
  );
}

export default Signup;