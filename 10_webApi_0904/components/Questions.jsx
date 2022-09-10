import React, { useContext, useEffect, useState } from "react";
import Menu from "../components/Menu";
import { AuthContext } from "./AuthContext";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot } from "firebase/firestore";
import styled from "styled-components";
import {
  Grid,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
} from "@material-ui/core";
import { IconButton } from "@mui/material";

const Content = styled.div`
  margin: 0px 10px;
`;

const Questions = () => {
  const { beforeLoginCheck, uid, isAdmin } = useContext(AuthContext);
  beforeLoginCheck();

  // 書籍情報の取得
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "books"));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      const books = QuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        author: doc.data().author,
        imgUrl: doc.data().imgUrl,
      }));
      setBooks(books);
    });
    return () => unsub();
  }, [uid]);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "questions"));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      const questions = QuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        bookId: doc.data().bookId,
        title: doc.data().title,
        content: doc.data().content,
        question: doc.data().question,
        updatedAt: new Date(doc.data().updatedAt.seconds * 1000),
      }));
      setQuestions(questions);
    });
    return () => unsub();
  }, [books]);

  // ページ遷移をさせる記述
  const navigate = useNavigate();

  const handleAnswerOpen = (e, questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <Menu isAdmin={isAdmin}>
      <h3>質問集</h3>
      <Content>
        {books.map((book) => (
          <Grid container spacing={2} key={book.id}>
            <Grid item xs={12} md={2} key={book.id}>
              <Card key={book.id}>
                <CardContent>{book.title}</CardContent>
                <CardMedia
                  component="img"
                  height={140}
                  image={`../img/${book.imgUrl}`}
                  alt="green iguana"
                />
                <CardContent>{book.author}</CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={10} key={book.id}>
              <Grid container spacing={2} key={book.id}>
                {questions
                  .filter((question) => question.bookId == book.id)
                  .map((row) => (
                    <Grid item xs={12} md={3} lg={3} key={row.id}>
                      <Card key={row.id}>
                        <CardContent>{row.title}</CardContent>
                        <CardActions>
                          <Button
                            onClick={(e) => handleAnswerOpen(e, row.id)}
                            size="small"
                            color="primary"
                          >
                            回答する
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Content>
    </Menu>
  );
};

export default Questions;
