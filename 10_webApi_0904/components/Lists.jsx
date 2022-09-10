import { React, useState, useEffect, useRef, forwardRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import List from "./List";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  setDoc,
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
  DialogTitle,
  DialogActions,
  DialogContent,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Grid,
  Slide,
} from "@material-ui/core";
import { IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import styled from "styled-components";
// 日付用
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";

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

//listName1とlistName2,listName3を足したものを値渡しで作成
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

const EachField = styled.div`
  padding: 10px 0px;
`;

const Lists = ({ uid, clearTime, clearWeek }) => {
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

  const calc = (deadline, createdAt) => {
    const today = new Date();
    let range = "";
    if (deadline) {
      const deadtime = new Date(deadline.seconds * 1000);
      range = today.getTime() - deadtime.getTime();
    } else {
      const createtime = new Date(createdAt.seconds * 1000);
      range = today.getTime() - createtime.getTime();
    }
    return parseInt(range / (1000 * 60 * 60 * 24));
  };

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
        passedDate: calc(doc.data().deadline, doc.data().createdAt),
        createdAt: doc.data().createdAt,
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

  // 完了タスクのクリア時間を表示
  const [clearTimeMessage, setClearTimeMessage] = useState("");

  useEffect(() => {
    if (clearTime !== null) {
      const h = clearTime.getHours() || 9;
      const m = clearTime.getMinutes() || 0;
      let w = null;
      switch (clearWeek) {
        case 0:
          w = "日";
        case 1:
          w = "月";
        case 2:
          w = "火";
        case 3:
          w = "水";
        case 4:
          w = "木";
        case 5:
          w = "金";
        case 6:
          w = "土";
        default:
          w = "月";
      }
      setClearTimeMessage(`${w} ${h}:${m}`);
    }
  }, [clearTime, clearWeek]);

  // 祝日の取得
  const [holidayFlgs, setHolidayFlgs] = useState({});
  useEffect(() => {
    const holidayFlgs = {};
    // その週の月曜日を探す
    const retDate = new Date();
    for (let week = 0; week <= 6; week++) {
      let targetDate = new Date();
      targetDate.setDate(
        targetDate.getDate() + ((week - 7 - retDate.getDay()) % 7)
      );

      async function fetchData() {
        const targetDateString =
          targetDate.getFullYear().toString() +
          ("00" + String(targetDate.getMonth() + 1)).slice(-2) +
          ("00" + String(targetDate.getDate())).slice(-2);
        const response = await fetch(
          `https://s-proj.com/utils/checkHoliday.php?kind=h&date=${targetDateString}`
        );

        const holiday = await response.text();
        const holidayFlg = holiday === "holiday" ? "yes" : "no";
        switch (week) {
          case 1:
            holidayFlgs.monday = holidayFlg;
            break;
          case 2:
            holidayFlgs.tuesday = holidayFlg;
            break;
          case 3:
            holidayFlgs.wednesday = holidayFlg;
            break;
          case 4:
            holidayFlgs.thursday = holidayFlg;
            break;
          case 5:
            holidayFlgs.friday = holidayFlg;
            break;
          default:
            holidayFlgs.weekend = holidayFlg;
        }
        setHolidayFlgs(holidayFlgs);
      }
      fetchData();
    }
  }, []);

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
  const [createdAt, setCreatedAt] = useState("");

  {
    /* 
      const Transition = forwardRef(function Transition(props, ref) {
        return (
          <Slide
            direction="up"
            in={true}
            enter={false}
            exit={false}
            ref={ref}
            {...props}
          />
        );
      });
    */
  }
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
    setCreatedAt("");
  };

  const handleClickOpen = (
    id,
    uid,
    item_id,
    item_title,
    item_position,
    item_memo,
    item_deadline,
    item_createdAt
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
    if (item_createdAt) {
      setCreatedAt(format(new Date(item_createdAt.seconds * 1000), "yyyy/M/d"));
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
        const todoDocumentRef = doc(db, "todos", todo_id);
        await setDoc(
          todoDocumentRef,
          {
            list: newList,
            position: newPosition,
            title: title,
            memo: memo,
            deadline: deadline,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
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
  const handleDeleteSubmit = async (e) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();
    setOpen(false);
    const todoDcoumentRef = doc(db, "todos", todo_id);
    setDoc(
      todoDcoumentRef,
      {
        beforeList: list,
        list: "deleted",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

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
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6} lg={4}>
          {Object.keys(listName1).map((key) => (
            <List
              key={key}
              id={key}
              uid={uid}
              list={getList(key)}
              holidayFlg={holidayFlgs[key]}
              handleClickOpen={handleClickOpen}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {Object.keys(listName2).map((key) => (
            <List
              key={key}
              id={key}
              uid={uid}
              list={getList(key)}
              holidayFlg={holidayFlgs[key]}
              handleClickOpen={handleClickOpen}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {Object.keys(listName3).map((key) => (
            <List
              key={key}
              id={key}
              uid={uid}
              list={getList(key)}
              holidayFlg={holidayFlgs[key]}
              handleClickOpen={handleClickOpen}
              setList8={setList8}
              listSize={todo8.length}
              clearTimeMessage={clearTimeMessage}
            />
          ))}
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="form-dialog-title"
        // aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth={true}
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <Grid container>
          <Grid item xs={10}>
            <Grid container justifyContent="flex-start" spacing={0}>
              <Grid item>
                <DialogTitle>タスクの{todo_id ? "編集" : "作成"}</DialogTitle>
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
              autoFocus={todo_id === ""} // 新規登録時のみフォーカスさせる
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              fullWidth
              required={true}
              value={title}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddSubmit(e);
                }
              }}
            />
            {title === "" && <FormHelperText>必須です</FormHelperText>}
          </EachField>
          <EachField>
            <TextField
              id="dialog_task_memo"
              label="メモ（任意）"
              onChange={(e) => setMemo(e.target.value)}
              variant="outlined"
              multiline
              minRows={5}
              fullWidth
              value={memo}
            />
          </EachField>
          <EachField>
            <div>{createdAt}</div>
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
          <EachField>
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
          </EachField>
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item xs={5}>
              <Grid container justifyContent="flex-start" spacing={0}>
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
                <Grid item>
                  <IconButton
                    aria-label="waiting"
                    onClick={(e) => handleAddSubmit(e, "waiting")}
                    size="small"
                    color="primary"
                  >
                    <HourglassBottomIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container justifyContent="center">
                <IconButton
                  onClick={(e) => handleAddSubmit(e, "done")}
                  size="small"
                  color="primary"
                  aria-label="done"
                >
                  <DoneIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid container justifyContent="flex-end">
                {todo_id && (
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                      if (window.confirm("Do you really want to delete?")) {
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
    </DragDropContext>
  );
};

export default Lists;
