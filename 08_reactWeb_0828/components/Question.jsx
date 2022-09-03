import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import Menu from "../components/Menu";
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import {
  Grid,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
} from "@material-ui/core";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CloseIcon from "@mui/icons-material/Close";

// 日付用
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import styled from "styled-components";

const GridItemWidth = styled(Grid)`
  min-width: 400px;
  max-width: 600px;
`;

const QuestionCard = styled.div`
  border-radius: 8px;
  background-color: #fff;
`;

const QuestionTitle = styled.p`
  padding: 20px 0;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  background-color: #3f51b5;
  color: #fff;
`;

const QuestionContent = styled.p`
  padding: 20px 0;
  whitespace: "pre-line";
`;

const QuestionQuestion = styled.p`
  padding: 20px 0 30px 0;
  whitespace: "pre-line";
`;

const EachField = styled.div`
  padding: 10px 0px;
`;

const Question = () => {
  const { beforeLoginCheck, uid, isAdmin } = useContext(AuthContext);
  beforeLoginCheck();

  const params = useParams();
  const [questionId, setQuestionId] = useState(params.id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [answerId, setAnswerId] = useState("");
  const [answer, setAnswer] = useState("");
  const [tempAnswer, setTempAnswer] = useState("");

  // 質問の内容を読み込む
  useEffect(() => {
    if (questionId) {
      const questionDocumentRef = doc(db, "questions", questionId);
      getDoc(questionDocumentRef).then((doc) => {
        if (doc.exists()) {
          setTitle(doc.data().title);
          setContent(doc.data().content);
          setQuestion(doc.data().question);
        } else {
          console.log("no such document.");
        }
      });
    }
  }, [questionId]);

  // 24時間以内の回答結果を読み込む
  const [editAnswer, setEditAnswer] = useState(false);

  useEffect(() => {
    if (questionId) {
      const answersCollectionRef = collection(db, "answers");

      // ２４時間以内の回答は最新の回答として出す
      const today = new Date();
      today.setDate(today.getDate() - 1);

      const q = query(
        answersCollectionRef,
        where("uid", "==", uid),
        where("questionId", "==", questionId),
        where("updatedAt", ">=", today),
        orderBy("updatedAt", "desc")
      );
      const unsub = onSnapshot(q, (QuerySnapshot) => {
        const answers = QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          answer: doc.data().answer,
          updatedAt: new Date(doc.data().updatedAt.seconds * 1000),
        }));
        if (answers[0]) {
          setEditAnswer(false);
          setAnswerId(answers[0].id);
          setAnswer(answers[0].answer);
          setTempAnswer(answers[0].answer);
        } else {
          setEditAnswer(true);
        }
      });
      return () => unsub();
    }
  }, [uid, questionId]);

  // 関連するTODOを読み込む
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    if (answerId) {
      const todosCollectionRef = collection(db, "todos");
      const q = query(
        todosCollectionRef,
        where("uid", "==", uid),
        where("questionId", "==", questionId),
        where("answerId", "==", answerId),
        where("list", "!=", "deleted")
      );
      const unsub = onSnapshot(q, (QuerySnapshot) => {
        const todos = QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          list: doc.data().list,
          title: doc.data().title,
          memo: doc.data().memo,
          deadline: doc.data().deadline,
        }));
        setTodos(todos);
      });
      return () => unsub();
    }
  }, [answerId]);

  // 回答内容を保存する
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answer === "") {
    } else {
      if (answerId) {
        // 更新の場合
        const answerDcoumentRef = doc(db, "answers", answerId);
        await setDoc(
          answerDcoumentRef,
          {
            answer: tempAnswer,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        // 新規の場合
        const answersCollectionRef = collection(db, "answers");
        await addDoc(answersCollectionRef, {
          uid: uid,
          questionId: questionId,
          answer: tempAnswer,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
  };

  const handleEditAbort = () => {
    setEditAnswer(false);
    setTempAnswer(answer);
  };
  // Datepicker で指定されたDate型をfirebaseに登録する時にはTimestamp型に変換する
  const timestamp = (datetimeStr) => {
    if (datetimeStr) {
      return Timestamp.fromDate(new Date(datetimeStr));
    }
    return "";
  };

  //////////////////////////////////////////
  // Dialog start
  //////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [todoId, setTodoId] = useState("");
  const [list, setList] = useState("");
  const [position, setPosition] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleClickOpen = ({
    item_id,
    item_list,
    item_title,
    item_position,
    item_memo,
    item_deadline,
  }) => {
    setTodoId(item_id || "");
    if (item_list) {
      setList(item_list);
    } else {
      // 作成日の曜日を設定
      const today = new Date().getDay();
      let listname;
      switch (today) {
        case 0:
          listname = "weekend";
          break;
        case 1:
          listname = "monday";
          break;
        case 2:
          listname = "tuesday";
          break;
        case 3:
          listname = "wednesday";
          break;
        case 4:
          listname = "thursday";
          break;
        case 5:
          listname = "friday";
          break;
        case 6:
          listname = "weekend";
          break;
        default:
          listname = "monday";
      }
      setList(listname);
    }
    setTodoTitle(item_title || "");
    setPosition(item_position || 0);
    if (item_memo) {
      setMemo(item_memo);
    }
    if (item_deadline) {
      // firebase のTimestamp型をJavaScriptのDate型に変換する
      setDeadline(new Date(item_deadline.seconds * 1000));
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 保存ボタン
  const handleAddSubmit = async (e) => {
    // タイトルは必須なので、無ければ何もしない
    if (title === "") {
    } else {
      // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
      e.preventDefault();
      setOpen(false);

      if (todoId === "") {
        // 既存タスクで無ければ新規登録
        // 順番は最後
        const todoCollectionRef = collection(db, "todos");
        await addDoc(todoCollectionRef, {
          list: list,
          uid: uid,
          position: position,
          title: todoTitle,
          memo: memo,
          deadline: timestamp(deadline),
          questionId: questionId,
          answerId: answerId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // 既存タスクであれば更新
        // 登録先既存と異なれば、最後に追加
        const todoDocumentRef = doc(db, "todos", todoId);
        await setDoc(
          todoDocumentRef,
          {
            list: list,
            position: position,
            title: todoTitle,
            memo: memo,
            deadline: deadline,
            questionId: questionId,
            answerId: answerId,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    }
  };

  // コピーを押したら今のは登録して新しいタスクを作成
  const handleCopySubmit = async (e) => {
    await handleAddSubmit(e);
    // データをコピーしてダイアログを起動
    handleClickOpen({
      item_id: "",
      itme_list: list,
      item_title: todoTitle + "(copy)",
      item_position: 0,
      item_memo: memo,
      item_deadline: timestamp(deadline),
    });
  };

  // 押したら削除
  const handleDeleteSubmit = async (e) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();
    setOpen(false);
    console.log(todoId, "todoId");
    const todoDcoumentRef = doc(db, "todos", todoId);
    setDoc(
      todoDcoumentRef,
      {
        beforeList: list,
        list: "deleted",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  //////////////////////////////////////////
  // Dialog end
  //////////////////////////////////////////

  return (
    <Menu isAdmin={isAdmin}>
      <Grid
        container
        alignItems="flex-start"
        justifyContent="center"
        spacing={1}
        direction="row"
      >
        <GridItemWidth item xs={12} md={6}>
          <QuestionCard>
            <QuestionTitle>{title}</QuestionTitle>
            <QuestionContent style={{ whiteSpace: "pre-line" }}>
              {content}
            </QuestionContent>
            <QuestionQuestion style={{ whiteSpace: "pre-line" }}>
              {question}
            </QuestionQuestion>
          </QuestionCard>
        </GridItemWidth>
        <GridItemWidth item xs={12} md={6}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              {editAnswer && (
                <QuestionCard>
                  <QuestionTitle>あなたの回答</QuestionTitle>
                  <TextField
                    required
                    id="answer"
                    label="回答"
                    variant="outlined"
                    onChange={(e) => setTempAnswer(e.target.value)}
                    multiline
                    minRows={5}
                    fullWidth
                    value={tempAnswer}
                  />
                  <IconButton
                    onClick={(e) => handleSubmit(e)}
                    size="small"
                    color="primary"
                  >
                    <SaveIcon />
                  </IconButton>
                  {answerId && (
                    <IconButton
                      aria-label="close"
                      onClick={handleEditAbort}
                      size="small"
                      color="primary"
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </QuestionCard>
              )}
              {!editAnswer && (
                <QuestionCard>
                  <QuestionTitle>あなたの回答</QuestionTitle>
                  <QuestionQuestion style={{ whiteSpace: "pre-line" }}>
                    {answer}
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setEditAnswer(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </QuestionQuestion>
                </QuestionCard>
              )}
            </Grid>
            <Grid item>
              {answerId && (
                <>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>タスク</TableCell>
                          <TableCell align="center">編集</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {todos.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                              {row.title}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleClickOpen({
                                    item_id: row.id,
                                    itme_list: row.list,
                                    item_title: row.title,
                                    item_position: row.position,
                                    item_memo: row.memo,
                                    item_deadline: row.deadline,
                                  })
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <IconButton
                    onClick={() => handleClickOpen({})}
                    size="small"
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth="sm"
                    fullWidth={true}
                  >
                    <Grid container>
                      <Grid item xs={10}>
                        <Grid container justifyContent="flex-start" spacing={0}>
                          <Grid item>
                            <DialogTitle>
                              タスクの{todoId ? "編集" : "作成"}
                            </DialogTitle>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2} style={{ margin: "auto" }}>
                        <Grid container justifyContent="flex-end" spacing={0}>
                          <Grid item>
                            <IconButton
                              aria-label="close"
                              onClick={handleClose}
                              size="small"
                              color="primary"
                            >
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <DialogContent dividers>
                      <EachField>
                        <TextField
                          id="dialog_task_title"
                          label="タイトル"
                          autoFocus={true}
                          onChange={(e) => setTodoTitle(e.target.value)}
                          variant="outlined"
                          fullWidth
                          required={true}
                          value={todoTitle}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddSubmit(e);
                            }
                          }}
                        />
                        {todoTitle === "" && (
                          <FormHelperText>必須です</FormHelperText>
                        )}
                      </EachField>
                      <EachField>
                        <TextField
                          id="dialog_task_memo"
                          label="メモ（任意）"
                          variant="outlined"
                          onChange={(e) => setMemo(e.target.value)}
                          multiline
                          minRows={5}
                          fullWidth
                          value={memo}
                        />
                      </EachField>
                      <EachField>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="締切日（任意）"
                            inputFormat="yyyy/MM/dd"
                            value={deadline || null}
                            onChange={(newDate) => setDeadline(newDate)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </EachField>
                    </DialogContent>
                    <DialogActions>
                      <Grid container>
                        <Grid item xs={8}>
                          <Grid
                            container
                            justifyContent="flex-start"
                            spacing={0}
                          >
                            <Grid item>
                              <IconButton
                                onClick={(e) => handleAddSubmit(e)}
                                size="small"
                                color="primary"
                              >
                                <SaveIcon />
                              </IconButton>
                            </Grid>
                            <Grid item>
                              <IconButton
                                aria-label="fileCopy"
                                onClick={handleCopySubmit}
                                size="small"
                                color="primary"
                              >
                                <FileCopyIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={3}>
                          <Grid container justifyContent="flex-end">
                            {todoId && (
                              <IconButton
                                aria-label="delete"
                                onClick={(e) => {
                                  if (
                                    window.confirm(
                                      "Do you really want to delete?"
                                    )
                                  ) {
                                    handleDeleteSubmit(e);
                                  }
                                }}
                                size="small"
                                color="primary"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </Grid>
          </Grid>
        </GridItemWidth>
      </Grid>
    </Menu>
  );
};

export default Question;
