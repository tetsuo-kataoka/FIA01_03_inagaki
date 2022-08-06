import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import './App.css';
import List from './components/List';
import { collection, query, onSnapshot, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // .env の情報を呼び出し
import { async } from '@firebase/util';
import { makeStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

//To do listのタスクの状態
const listName = {
  list1: 'todo1',
  list2: 'todo2',
  list3: 'todo3',
  list4: 'todo4',
  list5: 'todo5',
  list6: 'todo6',
  list7: 'todo7',
  list8: 'todo8',
  list9: 'todo9',
};

//To do listのタスクの状態
const listName1 = {
  list1: 'todo1',
  list2: 'todo2',
  list3: 'todo3',
  list4: 'todo4',
  list5: 'todo5',
  list6: 'todo6',
};

const listName2 = {
  list7: 'todo7',
  list8: 'todo8',
  list9: 'todo9',
};

//To do list内のタスクの順番を変更
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

//To do list内のタスクを削除
const deleteItem = (list, index) => {
  const result = Array.from(list);
  result.splice(index, 1);
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

function ToDoListContainer({taskNumber, setTaskNumber}) {

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
  const [itemCount, setItemCount] = useState(1);

  // firebase からデータの読み込み
  // データへのアクセス
  const todosCollectionRef = collection(db, 'todos')

  useEffect(() => {
    const q = query(todosCollectionRef);
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      const target_todos = QuerySnapshot.docs.map((doc) => ({
          list: doc.data().list,
          id: doc.id,
          position: doc.data().position,
          title: doc.data().title,
      }))
      target_todos.sort((a,b) => {
        if( a.position < b.position) {return -1}
        if( b.position < a.position) {return 1}
      })
      setList1(target_todos.filter(item => (item.list === 'list1')));
      setList2(target_todos.filter(item => (item.list === 'list2')));
      setList3(target_todos.filter(item => (item.list === 'list3')));
      setList4(target_todos.filter(item => (item.list === 'list4')));
      setList5(target_todos.filter(item => (item.list === 'list5')));
      setList6(target_todos.filter(item => (item.list === 'list6')));
      setList7(target_todos.filter(item => (item.list === 'list7')));
      setList8(target_todos.filter(item => (item.list === 'list8')));
      setList9(target_todos.filter(item => (item.list === 'list9')));
    });
    return () => unsub();
  }, []);

  //////////////////////////////////////////
  // Dialog start
  //////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [todo_id, setTodoId] = useState("");
  const [list, setList] = useState("");
  const [title, setTitle] = useState("");

  const useStyles = makeStyles({
    topScrollPaper: {
      alignItems: 'flex-start',
    },
    topPaperScrollBody: {
      verticalAlign: 'top',
    },
  })
  
  const handleClickOpen = (id, item_id, item_content) => {
    setList(id);
    setTodoId(item_id);
    setTitle(item_content);
    setOpen(true);
  };

  const handleClose = () => {
    setList("");
    setTodoId("");
    setTitle("");
    setOpen(false);
  };

  // 送信を押したら登録
  const handleAddSubmit = async (e) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();
    // 既存タスクで無ければ新規登録
    if (todo_id === ""){
      const todoCollectionRef = collection(db, 'todos');
      await addDoc(todoCollectionRef, {
        list: list,
        position: 3,
        title: title,
      });
    // 既存タスクであれば更新
    }else{
      const todoCollectionRef = doc(db, 'todos', todo_id);
      await updateDoc(todoCollectionRef, {
        list: list,
        position: 3,
        title: title,
      });
    }

    // 一時的なデータなので削除しておく
    setList("");
    setTodoId("");
    setTitle("");
    setOpen(false);
  }

  // 送信を押したら削除
  const handleDeleteSubmit = async (e) => {
    // フォームタグは送信の際に画面がリロードされるので、それをさせないおまじないが以下
    e.preventDefault();
    const todoDcoumentRef = doc(db, 'todos', todo_id);
    await deleteDoc(todoDcoumentRef);
    setList("");
    setTodoId("");
    setTitle("");
    setOpen(false);
  }
  
  //////////////////////////////////////////
  // Dialog end
  //////////////////////////////////////////

  const getList = id => {
    if (listName[id] === 'todo1') {
      return todo1;
    } else if (listName[id] === 'todo2') {
      return todo2;
    } else if (listName[id] === 'todo3') {
      return todo3;
    } else if (listName[id] === 'todo4') {
      return todo4;
    } else if (listName[id] === 'todo5') {
      return todo5;
    } else if (listName[id] === 'todo6') {
      return todo6;
    } else if (listName[id] === 'todo7') {
      return todo7;
    } else if (listName[id] === 'todo8') {
      return todo8;
    } else if (listName[id] === 'todo9') {
      return todo9;
    }
  }

  // リストが変更時に呼ばれる
  const setItemInList = async (id, list) => {
    console.log(list, 'list in setItemInList')
    const recreated_todos = await list.map((item, index) => (
      { list: id,
        id: item.id,
        position: index,
        title: item.title,
      }))
    recreated_todos.map(async (item) => {
      const todoDcoumentRef = doc(db, 'todos', item.id);
      const res = await updateDoc(todoDcoumentRef,{list: id, position: item.position})
    });
  
    if (listName[id] === 'todo1') {
      setList1(recreated_todos);
    } else if (listName[id] === 'todo2') {
      setList2(recreated_todos);
    } else if (listName[id] === 'todo3') {
      setList3(recreated_todos);
    } else if (listName[id] === 'todo4') {
      setList4(recreated_todos);
    } else if (listName[id] === 'todo5') {
      setList5(recreated_todos);
    } else if (listName[id] === 'todo6') {
      setList6(recreated_todos);
    } else if (listName[id] === 'todo7') {
      setList7(recreated_todos);
    } else if (listName[id] === 'todo8') {
      setList8(recreated_todos);
    } else if (listName[id] === 'todo9') {
      setList9(recreated_todos);
    }
  }

  const onDragEnd = result => {
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
      console.log("I'm in else");
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
  }

  // Dialog 要のスタイル
  const classes = useStyles()

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="To-do-list-container">
        <div class="left">
          {Object.keys(listName1).map(key => 
            <List 
              key={key} 
              id={key} 
              list={getList(key)} 
              handleClickOpen={handleClickOpen}
            />
          )}
        </div>
        <div class="rigth">
        {Object.keys(listName2).map(key => 
            <List
              key={key} 
              id={key} 
              setList8={setList8}
              list={getList(key)} 
              taskNumber={taskNumber}
              setTaskNumber={setTaskNumber}
              handleClickOpen={handleClickOpen}
            />
          )}
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
          paperScrollBody: classes.topPaperScrollBody
        }}
        >
        <DialogTitle id="form-dialog-title">
          タスク編集
        </DialogTitle>
        <DialogContent>
          <TextField
            id="standard-multiline-static"
            label="タイトル"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            value={title}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleAddSubmit(e);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Subscribe
          </Button>
          <Button onClick={handleDeleteSubmit} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DragDropContext>
  );
}

function App() {
  let count = 0;
  const strage_count = localStorage.getItem("count");
  if (strage_count != null){
    count = strage_count;
  }
  const [taskNumber, setTaskNumber] = useState(count);

  return (
    <div className="App">
      <header className="App-header">
        <h1 class="title">Weekly Manager</h1>
        <h3 class="sub_title">
          You have already completed {taskNumber.toLocaleString()} tasks!
        </h3>
      </header>
      <ToDoListContainer
        taskNumber = {taskNumber}
        setTaskNumber = {setTaskNumber}
      />
    </div>
  );
}

export default App