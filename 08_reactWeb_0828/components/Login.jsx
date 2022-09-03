import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  return (
    <div>
      <h2>GoogleLogin</h2>
      <button onClick={login}>ログインgoogleLogIn</button>
    </div>
  );
};

export default Login;
