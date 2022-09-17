// import "../src/Reset.css";
import "../src/Login.css";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Button } from "@material-ui/core";

const Login = () => {
  const { login } = useContext(AuthContext);
  return (
    <div class="login">
      <section id="mainbg" class="wrapper">
        <div class="main-image">
          <div class="main-image__text">
            <p class="main-image__text_first">1up Quesiton</p>
            <p class="main-image__text_second"></p>
          </div>
        </div>
      </section>

      {/* about */}
      <section id="about" class="wrapper">
        <div class="about-wrapper">
          <h2 class="text-center title text-yellow">About</h2>
          <h3 class="text-center about__name">1up Quesitonについて</h3>
          <div class="about__text">
            <p class="about__sentence">うんちく</p>
            <p class="about__sentence">
              あれこれ
              <br />
              あれこれ
            </p>
            <p class="about__sentence">あれこれ</p>
            <p class="about__sentence">
              あれこれ
              <br />
              あれこれ
            </p>
          </div>
        </div>
      </section>

      {/* login */}
      <section id="login" class="wrapper">
        <div class="login-wrapper">
          <Button variant="contained" color="primary" onClick={login}>
            google LogIn
          </Button>
        </div>
      </section>

      {/* footer */}
      <footer class="footer text-center wrapper">
        <div class="wrapper">
          <a href="#" class="btn-pagetop">
            <span class="fa fa-angle-up icon-up"></span>
          </a>
          <small class="copyrights">
            copyrights 2022 XXXXX All RIghts Reserved.
          </small>
        </div>
      </footer>
    </div>
  );
};

export default Login;
