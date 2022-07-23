import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase"; // .env の情報を呼び出し

export const Questions = () => {
  const params = useParams();

  //1.useState を準備して、データを取得出来るようにする
  const [data, setData] = useState([
    {
      id: "",
      question: "",
      position: ""
    }
  ]);

  //2.useEffect を使って画面表示の際にfirebaseからデータを取得する
  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy("position")); // データにアクセス
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      setData(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          question: doc.data().question,
          position: doc.data().position,
        }))
      );
    });

    return () => unsub();
  }, []);

  const questions = [];
  data.map((item) => (
    questions[item.position] = item.question
  ));

  return (
    <section id="question" class="question-wrapper">
      <div class="question__title">
        質問Box
      </div>

      <div class="question_table">
        <div class="question_row_group">
          <div class="question_row">
            <div class="question_cell">
              {questions[6]}
            </div>
            <div class="question_cell">
              {questions[3]}
            </div>
            <div class="question_cell">
              {questions[7]}
            </div>
          </div>
        </div>
        <div class="question_row_group">
          <div class="question_row">
            <div class="question_cell">
              {questions[2]}
            </div>
            <div class="question_cell">
            </div>
            <div class="question_cell">
              {questions[4]}
            </div>
          </div>
        </div>
        <div class="question_row_group">
          <div class="question_row">
            <div class="question_cell">
              {questions[5]}
            </div>
            <div class="question_cell">
              {questions[1]}
            </div>
            <div class="question_cell">
              {questions[8]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
