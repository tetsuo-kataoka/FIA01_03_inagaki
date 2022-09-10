import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext from "../components/AuthContext";
import Weekly from "../components/Weekly";
import Login from "../components/Login";
import Complete from "../components/Complete";
import About from "../components/About";
import Settings from "../components/Settings";
import Deleted from "../components/Deleted";
import Edit from "../components/Edit";
import Questions from "../components/Questions";
import Question from "../components/Question";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Weekly />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/question/:id" element={<Question />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="/deleted" element={<Deleted />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/edit" element={<Edit />} />
          </Routes>
        </AuthContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
