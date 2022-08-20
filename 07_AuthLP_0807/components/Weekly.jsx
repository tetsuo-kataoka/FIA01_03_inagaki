import React, { useContext, useEffect, useState } from "react";
import Lists from "./Lists";
import Menu from "../components/Menu";
import { AuthContext } from "./AuthContext";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import {
  collection,
  query,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

const Weekly = () => {
  const { beforeLoginCheck, uid, memo } = useContext(AuthContext);
  beforeLoginCheck();

  const [recentClearDate, setRecentClearDate] = useState("");

  useEffect(() => {
    let week = "";
    let clearTime = "";

    const q = query(collection(db, "settings"), where("uid", "==", uid));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      QuerySnapshot.docs.map(async (doc) => {
        week = doc.data().week;
        clearTime = new Date(doc.data().clearTime.seconds * 1000);
      });

      // 過去直近の曜日における指定時刻
      const retDate = new Date();
      retDate.setDate(
        new Date().getDate() + (((week || 0) - retDate.getDay()) % 7)
      );
      // 設定されているクリア時刻を設定（規定値はAM9時）
      retDate.setHours(clearTime.getHours() || 9);
      retDate.setMinutes(clearTime.getMinutes() || 0);
      retDate.setSeconds(clearTime.getSeconds() || 0);
      retDate.setMilliseconds(clearTime.getMilliseconds() || 0);
      setRecentClearDate(retDate);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    // 時刻が取得出来たら完了タスクをクリア
    const q = query(collection(db, "todos"), where("uid", "==", uid));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      QuerySnapshot.docs.map(async (document) => {
        if (document.data().list === "done") {
          const updateDate = new Date(document.data().updatedAt.seconds * 1000);
          if (updateDate.getTime() < recentClearDate.getTime()) {
            const todoDcoumentRef = doc(db, "todos", document.id);
            await updateDoc(todoDcoumentRef, {
              list: "complete",
            });
          }
        }
      });
    });
    return () => unsub();
  }, [recentClearDate]);

  return (
    <Menu>
      <Lists uid={uid} memo={memo} />
    </Menu>
  );
};

export default Weekly;
