import {Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Chat from "./components/Chat";
import Register from "./components/Register";
import React from "react";
import CameraDisplay from "./components/CameraDisplay";

function App() {
    const[token,setToken] = React.useState("")
    if ('serviceWorker' in navigator) {
      // Register a service worker hosted at the root of the
      // site using the default scope.
      navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`).then(
        registration => {
          console.log('Service worker registration succeeded:', registration);
        },
        /*catch*/ error => {
          console.error(`Service worker registration failed: ${error}`);
        }
      );
    } else {
      console.error('Service workers are not supported.');
    }

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
