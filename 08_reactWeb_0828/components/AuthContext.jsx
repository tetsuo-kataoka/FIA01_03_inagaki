import React, { useState, createContext, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, where } from "firebase/firestore";

// Contextオブジェクトを作成し、exportする
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [uid, setUid] = useState("");
  const [userName, setUserName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [clearTime, setClearTime] = useState(null);
  const [clearWeek, setClearWeek] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
        console.log(error, "login error message");
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

  // uid が取得出来たらSetting情報を取得
  useEffect(() => {
    const q = query(collection(db, "settings"), where("uid", "==", uid));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      QuerySnapshot.docs.map((doc) => {
        setClearTime(new Date(doc.data().clearTime.seconds * 1000));
        setClearWeek(doc.data().week);
        setIsAdmin(doc.data().isAdmin);
      });
    });
    return () => unsub();
  }, [uid]);

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
    setIsAdmin(false);
    setClearTime(null);
    setClearWeek(null);
  };

  const value = {
    login,
    isLogin,
    uid,
    userName,
    clearTime,
    clearWeek,
    isAdmin,
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
