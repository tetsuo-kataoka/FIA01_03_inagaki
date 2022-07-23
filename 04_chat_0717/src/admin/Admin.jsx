import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // .env の情報を呼び出し
import Add from './Add';

export const Admin = () => {
  //1.useState を準備して、データを取得出来るようにする
  const [data, setData] = useState([
    {
      id: "",
      title: "",
      explanation: "",
      question: "",
    }
  ]);

  // 3.登録用のuseState
  const [titleValue, setTitleValue] = useState("");
  const [explanationValue, setExplanationValue] = useState("");
  const [questionValue, setQuestionValue] = useState("");

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

  //4.inputのonChangeのイベントを記述
  const handleInputTitle = (e) => {
    setTitleValue(e.target.value);
  }
  const handleInputExplanation = (e) => {
    setExplanationValue(e.target.value);
  }
  const handleInputQuestion = (e) => {
    setQuestionValue(e.target.value);
  }

  //5.addData
  const addData = async () => {
    await addDoc(
      collection(db, "questions"),
      {
        title: titleValue,
        explanation: explanationValue,
        question: questionValue,
      }
    );
    setTitleValue("");
    setExplanationValue("");
    setQuestionValue("");
  }

  return (
    <>
      <Link to="/">Home</Link>
      <div>
        <h1>管理者用メニュー</h1>
      </div>

      <Add
        addData={addData}
        titleValue={titleValue}
        explanationValue={explanationValue}
        questionValue={questionValue}
        handleInputTitle={handleInputTitle}
        handleInputExplanation={handleInputExplanation}
        handleInputQuestion={handleInputQuestion}
        />
    </>
  );
};
  