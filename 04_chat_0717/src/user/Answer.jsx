import { Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDoc, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // .env の情報を呼び出し

export const Answer = () => {
  const params = useParams();
  const location = useLocation();
  console.log(params, 'params');
  console.log(location, 'location');
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
        <h1>回答メニュー/{params.id}/{location.pathname}</h1>
      </div>

      {data.map((item, index) => (
          <div key={index}>
            <div>{index}</div>
            <div>{item.title}</div>
            <div>{item.explanation}</div>
            <div>{item.question}</div>
          </div>
        ))}


    </>
  );
};
  