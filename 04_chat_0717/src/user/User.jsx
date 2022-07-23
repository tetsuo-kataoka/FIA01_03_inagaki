import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // .env の情報を呼び出し

export const User = () => {
  //1.useState を準備して、データを取得出来るようにする
  const [data, setData] = useState([
    {
      id: "",
      title: "",
      explanation: "",
      question: "",
    }
  ]);

  //2.useEffect を使って画面表示の際にfirebaseからデータを取得する
  useEffect(() => {
    const q = query(collection(db, 'questions')); // データにアクセス
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      setData(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          explanation: doc.data().explanation,
          question: doc.data().question,
        }))
      );
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Link to="/">Home</Link>
      <div>
        <h1>質問の一覧</h1>
      </div>

      {data.map((item, index) => (
          <div key={index}>
            <div>1{index}</div>
            <div>2{item.title}</div>
            <div>3{item.explanation}</div>
            <div>4{item.question}</div>
          </div>
        ))}

    </>
  );
};
  