import React, { useState, createContext, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "../src/firebase";
import { useNavigate } from "react-router-dom";

// Contextオブジェクトを作成し、exportする
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [uid, setUid] = useState("");
  const [userName, setUserName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  // ページ遷移をさせる記述
  const navigate = useNavigate();

  const login = () => {
    // グーグル認証のコード
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // 認証が成功したら result から取得するuid を設定
        setData(result.user);
      })
      .catch((error) => {
        clearData();
        console.log(error);
      });
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      //userにはログインor登録されているかの状態がtrue/falseで入ってくるので、!userはfalse＝user情報がないとき!
      if (user) {
        setData(user);
        if (window.location.pathname == "/login") {
          navigate("/");
        }
      } else {
        clearData();
        navigate("/login");
      }
    });

    return () => unSub();
  }, [navigate]);

  const beforeLoginCheck = () => {
    if (!isLogin) {
      navigate("/login");
    }
  };

  const googleLogOut = async () => {
    try {
      await signOut(auth);
      clearData();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  const setData = (user) => {
    setUid(user.uid);
    setUserName(user.displayName);
    setIsLogin(true);
  };

  const clearData = () => {
    setUid("");
    setUserName("");
    setIsLogin(false);
  };

  const value = {
    login,
    isLogin,
    uid,
    userName,
    beforeLoginCheck,
    googleLogOut,
  };

  return (
    // Providerで子コンポーネントをラップする
    // valueに子コンポーネントで使いたい変数や関数を与える
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
