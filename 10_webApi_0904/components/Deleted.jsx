import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Menu from "./Menu";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
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
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";

const Content = styled.div`
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;
`;

const TableContainerWidth = styled(TableContainer)`
  min-width: 400px;
  max-width: 700px;
  margin: auto;
`;

const listName = {
  monday: "月曜日",
  tuesday: "火曜日",
  wednesday: "水曜日",
  thursday: "木曜日",
  friday: "金曜日",
  weekend: "週末",
  waiting: "待ち",
  nextweek: "翌週",
  future: "未来",
  done: "完了",
};

const Deleted = () => {
  const { beforeLoginCheck, uid } = useContext(AuthContext);
  beforeLoginCheck();

  const [deleteTodos, setDeleteTodos] = useState([]);

  // firebase からデータの読み込み
  // データへのアクセス
  const todosCollectionRef = collection(db, "todos");

  useEffect(() => {
    // 2週間前の日付を作成
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 14);

    // 2週間以前のタスクを削除する
    const deleteQ = query(
      todosCollectionRef,
      where("uid", "==", uid),
      where("list", "==", "deleted"),
      where("updatedAt", "<=", Timestamp.fromDate(targetDate))
    );
    const taskDelete = () => {
      onSnapshot(deleteQ, (QuearySnapshot) => {
        QuearySnapshot.docs.map((doc) => {
          deleteDoc(doc.ref);
        });
      });
    };

    taskDelete();

    // 認証済みのユーザーIDに関するTODOを取得
    const q = query(todosCollectionRef, where("uid", "==", uid));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      const delete_todos = [];
      QuerySnapshot.docs.map((doc) => {
        if (doc.data().list === "deleted") {
          delete_todos.push({
            list: doc.data().list,
            id: doc.id,
            position: doc.data().position,
            title: doc.data().title,
            memo: doc.data().memo,
            deadline: doc.data().deadline,
            beforeList: doc.data().beforeList,
            updatedAt: new Date(doc.data().updatedAt.seconds * 1000),
          });
        }
      });
      delete_todos.sort((a, b) => {
        if (a.updatedAt.getTime() < b.updatedAt.getTime()) {
          return -1;
        }
        if (b.updatedAt.getTime() < a.updatedAt.getTime()) {
          return 1;
        }
      });
      setDeleteTodos(delete_todos);
    });
    return () => unsub();
  }, [uid]);

  // 押したら戻に戻す
  const handleReturnSubmit = async (e, todoId, beforeListName) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();

    const todoDcoumentRef = doc(db, "todos", todoId);
    await updateDoc(todoDcoumentRef, {
      list: beforeListName || "monday",
      beforeList: "",
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <Menu>
      <h1>削除済みタスク</h1>
      <Content>
        <TableContainerWidth component={Paper}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>タスク名</TableCell>
                <TableCell align="right">更新日付</TableCell>
                <TableCell align="center">削除前</TableCell>
                <TableCell align="center">戻す</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deleteTodos.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">
                    {row.updatedAt.toDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {listName[row.beforeList]}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) =>
                        handleReturnSubmit(e, row.id, row.beforeList)
                      }
                      size="small"
                      color="primary"
                    >
                      <UndoIcon />
                    </IconButton>
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

export default Deleted;
