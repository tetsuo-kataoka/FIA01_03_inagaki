import React, { useContext, useEffect, useState } from "react";
import Menu from "../components/Menu";
import { AuthContext } from "./AuthContext";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import { useNavigate } from "react-router-dom";
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
} from "@material-ui/core";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

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

const QuestionCard = styled.div`
  border-radius: 8px;
  background-color: #fff;
  padding: 8px;
  text-align: center;
`;

const Questions = () => {
  const { beforeLoginCheck, uid, isAdmin } = useContext(AuthContext);
  beforeLoginCheck();

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
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
  }, [uid]);

  // ページ遷移をさせる記述
  const navigate = useNavigate();

  const handleAnswerOpen = (e, questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <Menu isAdmin={isAdmin}>
      <h3>質問集</h3>
      <Grid container spacing={2}>
        {questions.map((row) => (
          <Grid item xs={12} md={2} lg={2} key={row.id}>
            <QuestionCard key={row.id}>
              {row.title}
              <br />
              <IconButton
                onClick={(e) => handleAnswerOpen(e, row.id)}
                size="small"
                color="primary"
              >
                <QuestionAnswerIcon />
              </IconButton>
            </QuestionCard>
          </Grid>
        ))}
      </Grid>
    </Menu>
  );
};

export default Questions;
