import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase"; // .env の情報を呼び出し
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

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

  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [questionNum, setQuestionNum] = useState("");

  const handleClickOpen = (questionNo) => {
    setQuestionNum(questionNo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 送信を押したら登録
  const handleAddSubmit = (e) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();

    setNote("");
    setOpen(false);
  }

  // 送信を押したら削除
  const deleteTodo = (e) => {
    setTodo(
      todo.filter((n, index) => index !== e['index'])
    );
  }

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
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(6)}>
                6
              </Button>
            </div>
            <div class="question_cell">
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(3)}>
                3
              </Button>
            </div>
            <div class="question_cell">
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(7)}>
                7
              </Button>
            </div>
          </div>
        </div>
        <div class="question_row_group">
          <div class="question_row">
            <div class="question_cell">
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(2)}>
                2
              </Button>
            </div>
            <div class="question_cell">
              課題を解決する
            </div>
            <div class="question_cell">
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(4)}>
                4
              </Button>
            </div>
          </div>
        </div>
        <div class="question_row_group">
          <div class="question_row">
            <div class="question_cell">
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(5)}>
                5
              </Button>
            </div>
            <div class="question_cell">
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(1)}>
                1
              </Button>
            </div>
            <div class="question_cell">
              <Button variant="outlined" color="primary" onClick={() => handleClickOpen(8)}>
                8
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
        <DialogTitle id="form-dialog-title">
          {questions[questionNum]}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="standard-multiline-static"
            label="回答"
            multiline
            rows={4}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            value={note}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};
