import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Menu from "./Menu";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
import styled from "styled-components";
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Avatar,
  Card,
  CardContent,
} from "@material-ui/core";
import { format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { indigo } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Content = styled.div`
  min-width: 400px;
  max-width: 700px;
  margin: 50px auto;
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;
  flex-direction: column;
`;

const DateHeader = styled.div`
  // background-color: black;
`;

const CompleteNumber = styled.div`
  margin: 10px auto;
`;

const TableContainerWidth = styled(TableContainer)`
  margin: auto;
`;

const AvatarColor = styled(Avatar)`
  color: #fff;
  background-color: ${(props) => {
    const level = parseInt(props.number / 2) * 100;
    if (level <= 100) {
      return indigo[100];
    } else if (level > 900) {
      return indigo[A100];
    } else {
      return indigo[level];
    }
  }};
`;

const useStyles = makeStyles((theme) => ({
  weekDisplay: {
    textAlign: "center",
    border: "0.5px solid #25316D",
    color: "#fff",
    backgroundColor: "#25316D",
  },
}));

const Complete = () => {
  const { beforeLoginCheck, uid } = useContext(AuthContext);
  // useEffect でラップしないといけないらしい
  useEffect(() => {
    beforeLoginCheck();
  }, []);

  const classes = useStyles();

  const [dones, setDones] = useState([]);
  const dateExp = "yyyy/MM/dd";

  // firebase からデータの読み込み
  // データへのアクセス
  const todosCollectionRef = collection(db, "todos");

  const getStart = () => {
    // 5週間前の日曜日を取得する
    const start = new Date();
    start.setDate(start.getDate() - 7 * 5 - start.getDay());
    return start;
  };

  const getEnd = () => {
    // 4週間前の土曜日を取得する
    const end = new Date();
    end.setDate(end.getDate() - 7 * 1 - end.getDay() + 6);
    return end;
  };

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 開始日と完了日を取る
    const start = getStart();
    const end = getEnd();

    // 認証済みのユーザーIDに関するTODOを取得
    const q = query(
      todosCollectionRef,
      where("uid", "==", uid),
      where("list", "==", "complete"),
      where("updatedAt", ">=", start),
      where("updatedAt", "<=", end),
      orderBy("updatedAt")
    );

    const counts = [];
    const todos = [];
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      QuerySnapshot.docs.map((doc) => {
        todos.push({
          id: doc.id,
          title: doc.data().title,
          memo: doc.data().memo,
          date: format(new Date(doc.data().updatedAt.seconds * 1000), dateExp),
        });
        const date = format(
          new Date(doc.data().updatedAt.seconds * 1000),
          dateExp
        );
        if (counts[date]) {
          counts[date]++;
        } else {
          counts[date] = 1;
        }
      });
      setDones(counts);
      setTodos(todos);
    });
    return () => unsub();
  }, [uid]);

  const [calendar, setCalender] = useState("");

  useEffect(() => {
    if (dones) {
      // カレンダーの作成
      // 開始日と完了日を取る
      const start = getStart();
      const end = getEnd();
      const days = [];

      // 曜日合わせのループ
      [...Array(Number(start.getDay()))].map((_, i) =>
        days.push(<Box key={i}></Box>)
      );

      // 日付のループ
      while (start.getTime() <= end.getTime()) {
        const date = format(start, dateExp);
        days.push(
          <Box
            sx={{
              aspectRatio: "1 / 1",
              border: "0.5px solid #25316D",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
            key={start.getTime()}
          >
            <DateHeader>
              {start.getDate() == 1 && `${start.getMonth() + 1}/`}
              {start.getDate()}
            </DateHeader>
            <CompleteNumber>
              {dones[date] && (
                <AvatarColor
                  number={dones[date]}
                  id={format(start, dateExp)}
                  onClick={(e) => {
                    clickHandle(e.target.id);
                  }}
                >
                  {dones[date]}
                </AvatarColor>
              )}
            </CompleteNumber>
          </Box>
        );
        start.setDate(start.getDate() + 1);
      }
      setCalender(days);
    }
  }, [dones]);

  // 完了タスクの表示
  const [targetDate, setTargetDate] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [targetTodo, setTargetTodo] = useState("");

  // 日付をクリックしたときに完了タスクをリスト化する
  const clickHandle = (targetDate) => {
    const tempTodos = todos.filter((todo) => todo.date === targetDate);
    setTargetDate(targetDate);
    setTargetTodo("");
    setCompletedTodos(tempTodos);
  };

  // 完了タスクをクリックしたときに詳細を見せる
  const clickTaskDetail = (todoId) => {
    const todo = todos.filter((todo) => todo.id === todoId);
    setTargetTodo(todo[0]);
  };

  return (
    <Menu>
      <Content>
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1>完了タスク</h1>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            margin: "auto",
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0,
            border: "0.5px solid #25316D",
          }}
        >
          <Box className={classes.weekDisplay}>日</Box>
          <Box className={classes.weekDisplay}>月</Box>
          <Box className={classes.weekDisplay}>火</Box>
          <Box className={classes.weekDisplay}>水</Box>
          <Box className={classes.weekDisplay}>木</Box>
          <Box className={classes.weekDisplay}>金</Box>
          <Box className={classes.weekDisplay}>土</Box>
          {calendar}
        </Box>
        {completedTodos.length > 0 && (
          <Box>
            <h3>{targetDate} 完了タスク</h3>
            <TableContainerWidth component={Paper}>
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>タスク名</TableCell>
                    <TableCell align="right">詳細</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedTodos.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            clickTaskDetail(row.id);
                          }}
                          size="small"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainerWidth>
          </Box>
        )}
        {targetTodo !== "" && (
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              margin: "30px auto",
            }}
          >
            <Card>
              <CardContent>
                {targetTodo.title}
                <hr />
                <p style={{ textAlign: "left", whiteSpace: "pre-line" }}>
                  {targetTodo.memo}
                </p>
              </CardContent>
            </Card>
          </Box>
        )}
      </Content>
    </Menu>
  );
};

export default Complete;
