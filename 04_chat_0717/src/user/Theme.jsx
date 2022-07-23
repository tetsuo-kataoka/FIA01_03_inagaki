import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase"; // .env の情報を呼び出し

export const Theme = () => {
  //1.useState を準備して、データを取得出来るようにする
  const [data, setData] = useState([
    {
      id: "",
      theme: "",
      position: "",
    }
  ]);

  //2.useEffect を使って画面表示の際にfirebaseからデータを取得する
  useEffect(() => {
    const q = query(collection(db, 'themes'), orderBy("position")); // データにアクセス
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      setData(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          theme: doc.data().theme,
          position: doc.data().position,
        }))
      );
    });
    return () => unsub();
  }, []);

  return (
    <section id="theme" class="theme-wrapper">
      <div class="theme__title">
        テーマを選ぼう
      </div>

      {data.map((item, index) => (
          <div key={index}>
            <div>
              <Link
                to={`/questions/${item.id}`}
                key={index}
              >{item.theme}</Link>
            </div>
          </div>
        ))}
    </section>
  );
};
