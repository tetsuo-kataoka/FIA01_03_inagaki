import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Menu from "./Menu";

const About = () => {
  const { beforeLoginCheck, uid } = useContext(AuthContext);
  useEffect(() => {
    beforeLoginCheck();
  }, []);

  return <Menu>About</Menu>;
};
export default About;
