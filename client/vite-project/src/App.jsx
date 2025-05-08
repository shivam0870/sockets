import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app-bg">
      <div className="chat-card">
        <div className="chat-header">
          <h2>Socket.IO Chat</h2>
          <span className="socket-id">ID: {socketID}</span>
        </div>
        <form className="room-form" onSubmit={joinRoomHandler}>
          <input
            className="room-input"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room Name"
          />
          <button className="join-btn" type="submit">Join</button>
        </form>
        <div className="messages-area">
          {messages.map((m, i) => (
            <div key={i} className="message">
              {typeof m === "object" ? JSON.stringify(m) : m}
            </div>
          ))}
        </div>
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
          <input
            className="room-input"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room"
          />
          <button className="send-btn" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default App;