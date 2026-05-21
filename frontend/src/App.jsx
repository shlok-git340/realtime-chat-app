import { useState } from "react";

import Login from "./Login";
import Chat from "./Chat";

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [userId, setUserId] = useState(() => {

    const savedToken = localStorage.getItem("token");

    if (!savedToken) return null;

    try {

      const payload = JSON.parse(
        atob(savedToken.split(".")[1])
      );

      return payload.user_id;

    } catch {
      return null;
    }
  });

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    setUserId(null);
  };

  if (!token || !userId) {
    return (
      <Login
        setToken={setToken}
        setUserId={setUserId}
      />
    );
  }

  return (
    <div>

      <button
        onClick={logout}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        Logout
      </button>

      <Chat userId={userId} />

    </div>
  );
}

export default App;