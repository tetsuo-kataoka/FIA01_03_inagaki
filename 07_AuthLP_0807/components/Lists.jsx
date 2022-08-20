import { React, useState, useEffect, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import List from "./List";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import {
  collection,
  query,
  onSnapshot,
  where,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import {
  makeStyles,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
} from "@material-ui/core";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import styled from "styled-components";
// 日付用
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//To do listのタスクの状態
const listName1 = {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  weekend: "weekend",
};

const listName2 = {
  waiting: "waiting",
  nextweek: "nextweek",
  future: "future",
};

const listName3 = {
  done: "done",
};

//listName1とlistName2を足したものを値渡しで作成
const listName = Object.assign({}, listName1);
Object.assign(listName, listName2);
Object.assign(listName, listName3);

//To do list内のタスクの順番を変更
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

//To do listのタスクの状態を変更
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

const Header = styled.header`
  align-items: center;
  padding: 5px 0;
  color: #282c34;
  background-color: #3ab4f2;
`;

const Lists = ({ uid, userMemo }) => {
  // 各リスト向けの格納データ
  const [todo1, setList1] = useState([]);
  const [todo2, setList2] = useState([]);
  const [todo3, setList3] = useState([]);
  const [todo4, setList4] = useState([]);
  const [todo5, setList5] = useState([]);
  const [todo6, setList6] = useState([]);
  const [todo7, setList7] = useState([]);
  const [todo8, setList8] = useState([]);
  const [todo9, setList9] = useState([]);
  const [todo10, setList10] = useState([]);
  const [todo11, setList11] = useState([]);

  // firebase からデータの読み込み
  // データへのアクセス
  const todosCollectionRef = collection(db, "todos");

  useEffect(() => {
    // 認証済みのユーザーIDに関するTODOを取得
    const q = query(todosCollectionRef, where("uid", "==", uid));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      const target_todos = QuerySnapshot.docs.map((doc) => ({
        list: doc.data().list,
        id: doc.id,
        position: doc.data().position,
        title: doc.data().title,
        memo: doc.data().memo,
        deadline: doc.data().deadline,
      }));
      target_todos.sort((a, b) => {
        if (a.position < b.position) {
          return -1;
        }
        if (b.position < a.position) {
          return 1;
        }
      });
      setList1(target_todos.filter((item) => item.list === "monday"));
      setList2(target_todos.filter((item) => item.list === "tuesday"));
      setList3(target_todos.filter((item) => item.list === "wednesday"));
      setList4(target_todos.filter((item) => item.list === "thursday"));
      setList5(target_todos.filter((item) => item.list === "friday"));
      setList6(target_todos.filter((item) => item.list === "weekend"));
      setList7(target_todos.filter((item) => item.list === "waiting"));
      setList8(target_todos.filter((item) => item.list === "done"));
      setList9(target_todos.filter((item) => item.list === "nextweek"));
      setList10(target_todos.filter((item) => item.list === "future"));
      setList11(target_todos.filter((item) => item.list === "complete"));
    });
    return () => unsub();
  }, [uid]);

  //////////////////////////////////////////
  // Dialog start
  //////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [todo_id, setTodoId] = useState("");
  const [userId, setUserId] = useState("");
  const [list, setList] = useState("");
  const [moveToList, setMoveToList] = useState("");
  const [position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [deadline, setDeadline] = useState("");

  // Dialog用のスタイル
  const useStyles = makeStyles({
    topScrollPaper: {
      alignItems: "flex-start",
    },
    topPaperScrollBody: {
      verticalAlign: "top",
    },
  });

  const classes = useStyles();

  const clearTempData = () => {
    setList("");
    setMoveToList("");
    setUserId("");
    setTodoId("");
    setTitle("");
    setPosition("");
    setMemo("");
    setDeadline("");
  };

  const handleClickOpen = (
    id,
    uid,
    item_id,
    item_title,
    item_position,
    item_memo,
    item_deadline
  ) => {
    setList(id);
    setMoveToList(id);
    setUserId(uid);
    setTodoId(item_id);
    setTitle(item_title);
    setPosition(item_position);
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
    clearTempData();
  };

  // Datepicker で指定されたDate型をfirebaseに登録する時にはTimestamp型に変換する
  const timestamp = (datetimeStr) => {
    if (datetimeStr) {
      return Timestamp.fromDate(new Date(datetimeStr));
    }
    return "";
  };

  // 登録・更新を押したら登録
  const handleAddSubmit = async (e, specificListName = "") => {
    let newList = moveToList;
    if (specificListName !== "" && list !== specificListName) {
      newList = specificListName;
    }

    let newPosition = position;
    if (!newPosition || list !== newList) {
      // 異動先のリストが異なれば、登録対象の順序で最大値に変更する
      newPosition = 1;
      getList(newList).map((item) => {
        if (newPosition <= item.position) {
          newPosition = item.position + 1;
        }
      });
    }

    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();
    // タイトルは必須なので、無ければ何もしない
    if (title === "") {
    } else {
      setOpen(false);
      if (todo_id === "") {
        // 既存タスクで無ければ新規登録
        // 順番は最後
        const todoCollectionRef = collection(db, "todos");
        await addDoc(todoCollectionRef, {
          list: newList,
          uid: userId,
          position: newPosition,
          title: title,
          memo: memo,
          deadline: timestamp(deadline),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // 既存タスクであれば更新
        // 登録先既存と異なれば、最後に追加
        const todoCollectionRef = doc(db, "todos", todo_id);
        await updateDoc(todoCollectionRef, {
          list: newList,
          position: newPosition,
          title: title,
          memo: memo,
          deadline: deadline,
          updatedAt: serverTimestamp(),
        });
      }
      // 一時的なデータなので削除しておく
      clearTempData();
    }
  };

  // コピーを押したら今のは登録して新しいタスクを作成
  const handleCopySubmit = async (e) => {
    await handleAddSubmit(e);
    // データをコピーしてダイアログを起動
    handleClickOpen(list, userId, "", title + "(copy)", "", memo, deadline);
  };

  // 押したら削除
  const handleDeleteSubmit = (e) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    setOpen(false);
    const todoDcoumentRef = doc(db, "todos", todo_id);
    deleteDoc(todoDcoumentRef);
    clearTempData();
  };

  //////////////////////////////////////////
  // Dialog end
  //////////////////////////////////////////

  const getList = (id) => {
    if (listName[id] === "monday") {
      return todo1;
    } else if (listName[id] === "tuesday") {
      return todo2;
    } else if (listName[id] === "wednesday") {
      return todo3;
    } else if (listName[id] === "thursday") {
      return todo4;
    } else if (listName[id] === "friday") {
      return todo5;
    } else if (listName[id] === "weekend") {
      return todo6;
    } else if (listName[id] === "waiting") {
      return todo7;
    } else if (listName[id] === "done") {
      return todo8;
    } else if (listName[id] === "nextweek") {
      return todo9;
    } else if (listName[id] === "future") {
      return todo10;
    } else if (listName[id] === "complete") {
      return todo11;
    }
  };

  // リストが変更時に呼ばれる
  const setItemInList = async (id, list) => {
    const recreated_todos = await list.map((item, index) => ({
      list: id,
      id: item.id,
      position: index + 1,
      title: item.title,
    }));
    recreated_todos.map(async (item) => {
      const todoDcoumentRef = doc(db, "todos", item.id);
      await updateDoc(todoDcoumentRef, {
        list: id,
        position: item.position,
      });
    });

    if (listName[id] === "monday") {
      setList1(recreated_todos);
    } else if (listName[id] === "tuesday") {
      setList2(recreated_todos);
    } else if (listName[id] === "wednesday") {
      setList3(recreated_todos);
    } else if (listName[id] === "thursday") {
      setList4(recreated_todos);
    } else if (listName[id] === "friday") {
      setList5(recreated_todos);
    } else if (listName[id] === "weekend") {
      setList6(recreated_todos);
    } else if (listName[id] === "waiting") {
      setList7(recreated_todos);
    } else if (listName[id] === "done") {
      setList8(recreated_todos);
    } else if (listName[id] === "nextweek") {
      setList9(recreated_todos);
    } else if (listName[id] === "future") {
      setList10(recreated_todos);
    } else if (listName[id] === "complete") {
      setList11(recreated_todos);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!result.destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const update = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      setItemInList(source.droppableId, update);
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      // データを更新
      setItemInList(source.droppableId, result[source.droppableId]);
      setItemInList(destination.droppableId, result[destination.droppableId]);
    }
  };

  return (
    <>
      <Header>
        <h3 class="sub_title">You have already completed 100 tasks!</h3>
      </Header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="To-do-list-container">
          <div class="left">
            {Object.keys(listName1).map((key) => (
              <List
                key={key}
                id={key}
                uid={uid}
                list={getList(key)}
                handleClickOpen={handleClickOpen}
              />
            ))}
          </div>
          <div class="rigth">
            {Object.keys(listName2).map((key) => (
              <List
                key={key}
                id={key}
                uid={uid}
                list={getList(key)}
                handleClickOpen={handleClickOpen}
              />
            ))}
          </div>
          <div class="rigth">
            {Object.keys(listName3).map((key) => (
              <List
                key={key}
                id={key}
                uid={uid}
                list={getList(key)}
                handleClickOpen={handleClickOpen}
                setList8={setList8}
                listSize={todo8.length}
              />
            ))}
          </div>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="sm"
          fullWidth={true}
          classes={{
            scrollPaper: classes.topScrollPaper,
            paperScrollBody: classes.topPaperScrollBody,
          }}
        >
          <DialogContent>
            <TextField
              id="dialog_task_title"
              label="タイトル"
              autoFocus={todo_id === ""} // 新規登録時のみフォーカスさせる
              onChange={(e) => setTitle(e.target.value)}
              error
              helperText="必須です"
              fullWidth
              required={true}
              value={title}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddSubmit(e);
                }
              }}
            />
            <TextField
              id="dialog_task_memo"
              label="メモ（任意）"
              onChange={(e) => setMemo(e.target.value)}
              multiline
              minRows={5}
              fullWidth
              value={memo}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="締切日（任意）"
                inputFormat="yyyy/MM/dd"
                value={deadline || null}
                onChange={(newDate) => setDeadline(newDate)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogContent>
            <FormControl>
              <FormLabel id="week_radio"></FormLabel>
              <RadioGroup
                row
                aria-labelledby="week_radio"
                name="row-radio-buttons-group"
                value={moveToList}
                color="primary"
                onChange={(e) => setMoveToList(e.target.value)}
              >
                <FormControlLabel
                  value="monday"
                  control={<Radio color="primary" />}
                  label="月"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="tuesday"
                  control={<Radio color="primary" />}
                  label="火"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="wednesday"
                  control={<Radio color="primary" />}
                  label="水"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="thursday"
                  control={<Radio color="primary" />}
                  label="木"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="friday"
                  control={<Radio color="primary" />}
                  label="金"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="weekend"
                  control={<Radio color="primary" />}
                  label="週末"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="waiting"
                  control={<Radio color="primary" />}
                  label="待ち"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="nextweek"
                  control={<Radio color="primary" />}
                  label="翌週"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
                <FormControlLabel
                  value="future"
                  control={<Radio color="primary" />}
                  label="未来"
                  labelPlacement="top"
                  style={{ margin: "1px" }}
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Grid container>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-start" spacing={0}>
                  <Grid item>
                    <Button
                      onClick={(e) => handleAddSubmit(e)}
                      size="small"
                      color="primary"
                    >
                      {todo_id ? "更新" : "登録"}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={(e) => handleAddSubmit(e, "done")}
                      size="small"
                      color="primary"
                    >
                      完了
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                  {todo_id && (
                    <IconButton
                      aria-label="fileCopy"
                      onClick={handleCopySubmit}
                      size="small"
                      color="primary"
                    >
                      <FileCopyIcon />
                    </IconButton>
                  )}
                  {todo_id && (
                    <IconButton
                      aria-label="delete"
                      onClick={handleDeleteSubmit}
                      size="small"
                      color="primary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
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
          </DialogActions>
        </Dialog>
      </DragDropContext>
    </>
  );
};

export default Lists;
