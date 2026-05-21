import { useEffect, useState } from "react";
import API from "./api";

function Chat({ userId }) {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [socket, setSocket] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const fetchUsers = async () => {

    try {

      const response = await API.get(
        "/chat/users/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const selectUser = async (user) => {

    setSelectedUser(user);

    try {

      const response = await API.get(
        `/chat/messages/${user.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const connectWebSocket = () => {

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${userId}/`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {

      const data = JSON.parse(event.data);

      setMessages((prev) => {

        const exists = prev.some(
          (msg) =>
            msg.message === data.message &&
            msg.sender_id === data.sender_id
        );

        if (exists) return prev;

        return [...prev, data];
      });
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(ws);
  };

  const sendMessage = () => {

    if (!socket || !selectedUser) return;

    socket.send(JSON.stringify({
      sender_id: userId,
      receiver_id: selectedUser.id,
      message: newMessage,
    }));

    setNewMessage("");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#111827",
        color: "white",
      }}
    >

      <div
        style={{
          width: "30%",
          borderRight: "1px solid gray",
          padding: "20px",
        }}
      >
        <h2>Users</h2>

        {
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              style={{
                padding: "15px",
                cursor: "pointer",
                borderBottom: "1px solid gray",
              }}
            >
              {user.username}
            </div>
          ))
        }
      </div>

      <div
        style={{
          width: "70%",
          padding: "20px",
        }}
      >

        <h2>
          Chat
        </h2>

        <div
          style={{
            height: "75vh",
            overflowY: "scroll",
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px",
          }}
        >

          {
            messages.map((msg, index) => (

              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  textAlign:
                    String(msg.sender_id || msg.sender?.id)
                    === String(userId)
                      ? "right"
                      : "left",
                }}
              >

                <strong>
                  {
                    String(msg.sender_id)
                    === String(userId)
                      ? "You"
                      : "Them"
                  }
                </strong>

                : {msg.message || msg.content}

              </div>
            ))
          }

        </div>

        <input
          value={newMessage}
          onChange={(e) =>
            setNewMessage(e.target.value)
          }
          placeholder="Type message"
          style={{
            width: "80%",
            padding: "12px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px",
            marginLeft: "10px",
          }}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default Chat;