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
    const q = query(todosCollectionRef, where("uid", "==", uid));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      const target_dones = [];
      QuerySnapshot.docs.map((doc) => {
        if (doc.data().list === "complete") {
          target_dones.push({
            list: doc.data().list,
            id: doc.id,
            position: doc.data().position,
            title: doc.data().title,
            memo: doc.data().memo,
            deadline: doc.data().deadline,
            updatedAt: new Date(doc.data().updatedAt.seconds * 1000),
          });
        }
      });
      target_dones.sort((a, b) => {
        if (a.updatedAt.getTime() < b.updatedAt.getTime()) {
          return -1;
        }
        if (b.updatedAt.getTime() < a.updatedAt.getTime()) {
          return 1;
        }
      });
      setDones(target_dones);
    });
    return () => unsub();
  }, [uid]);

  return (
    <Menu>
      <h1>Complete</h1>
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
