import {Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Chat from "./components/Chat";
import Register from "./components/Register";
import React from "react";
import CameraDisplay from "./components/CameraDisplay";

function App() {
    const[token,setToken] = React.useState("")
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Login setToken={setToken}/>}/>
          <Route path="/chat" element={<Chat token={token}/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/camera" element={<CameraDisplay/>}/>

      </Routes>
    </div>
  );
}

export default App;
