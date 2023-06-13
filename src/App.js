import {Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Chat from "./components/Chat";
import Register from "./components/Register";
import React from "react";

function App() {
    const[token,setToken] = React.useState("")
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Login setToken={setToken}/>}/>
          <Route path="/chat" element={<Chat token={token}/>}/>
          <Route path="/register" element={<Register/>}/>
      </Routes>
    </div>
  );
}

export default App;
