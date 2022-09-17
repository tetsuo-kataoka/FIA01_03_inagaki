import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import AdminMenu from "../components/AdminMenu";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import {
  collection,
  query,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import styled from "styled-components";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const Content = styled.div`
  margin: auto;
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;
`;

const TableContainerWidth = styled(TableContainer)`
  min-width: 400px;
  max-width: 700px;
  margin: auto;
`;

const GridItemWidth = styled(Grid)`
  // min-width: 400px;
  // max-width: 700px;
  width: 100%;
  margin: auto;
  padding: 10px 20px;
  background-color: #fff;
`;

const Edit = () => {
  const { beforeLoginCheck, uid, isAdmin } = useContext(AuthContext);
  useEffect(() => {
    beforeLoginCheck();
  }, []);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "questions"));
      const unsub = onSnapshot(q, (QuerySnapshot) => {
        const questions = QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          content: doc.data().content,
          question: doc.data().question,
          updatedAt: new Date(doc.data().updatedAt.seconds * 1000),
        }));
        setQuestions(questions);
      });
      return () => unsub();
    }
  }, [isAdmin]);

  const [questionId, setQuestionId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  const clearDate = () => {
    setEditOpen(false);
    setQuestionId("");
    setTitle("");
    setContent("");
    setQuestion("");
  };

  // 新規作成開始
  const handleAddOpen = () => {
    setEditOpen(true);
    setTitle("");
    setContent("");
    setQuestion("");
  };

  // 編集開始
  const handleEditOpen = (id, title, content, question) => {
    setEditOpen(true);
    setQuestionId(id);
    setTitle(title);
    setContent(content);
    setQuestion(question);
  };

  // 編集コミット
  const handleSubmit = async (e) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();
    if (questionId) {
      const questionDcoumentRef = doc(db, "questions", questionId);
      await setDoc(
        questionDcoumentRef,
        {
          title: title,
          content: content,
          question: question,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      const questionsCollectionRef = collection(db, "questions");
      await addDoc(questionsCollectionRef, {
        title: title,
        content: content,
        question: question,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    clearDate();
  };

  return (
    <AdminMenu isAdmin={isAdmin}>
      <h3>質問の編集</h3>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Content>
            <TableContainerWidth component={Paper}>
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>質問名</TableCell>
                    <TableCell align="right">更新日付</TableCell>
                    <TableCell align="center">編集</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">
                        {row.updatedAt.toDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() =>
                            handleEditOpen(
                              row.id,
                              row.title,
                              row.content,
                              row.question
                            )
                          }
                          size="small"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainerWidth>
          </Content>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {!editOpen && (
            <Grid container alignItems="center" justifyContent="space-around">
              <Grid item>
                <IconButton
                  onClick={(e) => handleAddOpen(e)}
                  size="small"
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          )}

          {editOpen && (
            <Grid
              container
              alignItems="center"
              justifyContent="space-around"
              direction="column"
            >
              <GridItemWidth item>
                <TextField
                  id="question_title"
                  label="タイトル"
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required={true}
                  value={title}
                />
                {title === "" && <FormHelperText>必須です</FormHelperText>}
              </GridItemWidth>
              <GridItemWidth item>
                <TextField
                  id="question_content"
                  label="内容"
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  minRows={5}
                  fullWidth
                  variant="outlined"
                  required={true}
                  value={content}
                />
                {content === "" && <FormHelperText>必須です</FormHelperText>}
              </GridItemWidth>
              <GridItemWidth item>
                <TextField
                  id="question_question"
                  label="質問"
                  onChange={(e) => setQuestion(e.target.value)}
                  multiline
                  minRows={5}
                  variant="outlined"
                  fullWidth
                  required={true}
                  value={question}
                />
                {question === "" && <FormHelperText>必須です</FormHelperText>}
              </GridItemWidth>
              <GridItemWidth item>
                <IconButton
                  onClick={(e) => handleSubmit(e)}
                  size="small"
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  aria-label="close"
                  onClick={() => setEditOpen(false)}
                  size="small"
                  color="primary"
                >
                  <CloseIcon />
                </IconButton>
              </GridItemWidth>
            </Grid>
          )}
        </Grid>
      </Grid>
    </AdminMenu>
  );
};

export default Edit;
