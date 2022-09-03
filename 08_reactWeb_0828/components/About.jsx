import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import Menu from "./Menu";

const About = () => {
  const { beforeLoginCheck, uid } = useContext(AuthContext);
  beforeLoginCheck();

  return <Menu>About</Menu>;
};
export default About;
