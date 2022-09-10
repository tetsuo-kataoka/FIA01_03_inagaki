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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@material-ui/core";

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

const Complete = () => {
  const { beforeLoginCheck, uid } = useContext(AuthContext);
  beforeLoginCheck();

  const [dones, setDones] = useState([]);

  // firebase からデータの読み込み
  // データへのアクセス
  const todosCollectionRef = collection(db, "todos");

  useEffect(() => {
    // 認証済みのユーザーIDに関するTODOを取得
    const q = query(
      todosCollectionRef,
      where("uid", "==", uid),
      where("list", "==", "complete"),
      orderBy("updatedAt")
    );
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      const target_dones = QuerySnapshot.docs.map((doc) => ({
        list: doc.data().list,
        id: doc.id,
        position: doc.data().position,
        title: doc.data().title,
        memo: doc.data().memo,
        deadline: doc.data().deadline,
        updatedAt: new Date(doc.data().updatedAt.seconds * 1000),
      }));
      setDones(target_dones);
    });
    return () => unsub();
  }, [uid]);

  const [end, setEnd] = useState(new Date());
  const [calendar, setCalender] = useState([]);

  useEffect(() => {
    if (dones) {
      // カレンダーの作成
      // 5週間前の日曜日を取得する
      const start = new Date();
      start.setDate(start.getDate() - 7 * 5 - start.getDay());

      // 4週間前の土曜日を取得する
      const end = new Date();
      end.setDate(end.getDate() - 7 * 1 - end.getDay() + 6);
      setEnd(end);

      const days = [];

      // 曜日合わせのループ
      [...Array(Number(start.getDay()))].map((_, i) =>
        days.push(<Box key={i}></Box>)
      );

      // 日付のループ
      while (start.getTime() <= end.getTime()) {
        days.push(
          <Box sx={{ aspectRatio: "1 / 1" }} key={start.getTime()}>
            {start.getDate() == 1 && `${start.getMonth() + 1}/`}
            {start.getDate()}
          </Box>
        );
        start.setDate(start.getDate() + 1);
      }
      setCalender(days);
    }
  }, [dones]);

  return (
    <Menu>
      <h1>Complete</h1>
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
        }}
      >
        {end.getMonth() + 1}月
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0,
        }}
      >
        <Box sx={{ textAlign: "center", color: "#f00" }}>日</Box>
        <Box sx={{ textAlign: "center" }}>月</Box>
        <Box sx={{ textAlign: "center" }}>火</Box>
        <Box sx={{ textAlign: "center" }}>水</Box>
        <Box sx={{ textAlign: "center" }}>木</Box>
        <Box sx={{ textAlign: "center" }}>金</Box>
        <Box sx={{ textAlign: "center", color: "#00f" }}>土</Box>
        {calendar}
      </Box>
      <Content>
        <TableContainerWidth component={Paper}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>タスク名</TableCell>
                <TableCell align="right">更新日付</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dones.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">
                    {row.updatedAt.toDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainerWidth>
      </Content>
    </Menu>
  );
};

export default Complete;
