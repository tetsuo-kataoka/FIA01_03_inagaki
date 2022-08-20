import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext from "../components/AuthContext";
import Weekly from "../components/Weekly";
import Login from "../components/Login";
import Complete from "../components/Complete";
import About from "../components/About";
import Settings from "../components/Settings";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext>
          <Routes>
            <Route path="/" element={<Weekly />} />
            <Route path="/login" element={<Login />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AuthContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
