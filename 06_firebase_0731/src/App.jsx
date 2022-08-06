import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import './App.css';
import List from './components/List';
import { collection, query, onSnapshot, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // .env の情報を呼び出し
import { async } from '@firebase/util';
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

  // TODOの設定
  // これは本来いらない
  const [todo, setTodo] = useState([]);
  // 登録されているデータを保持するuseState
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
      console.log(target_todos,'target_todos');
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

  const deleteTodo = async (id) => {
    const q = query(todosCollectionRef, where('list', '==', 'list1'));
    const querySnapshot = await getDocs(q);
    console.log(q,'q in deleteTodo');
    querySnapshot.forEach(async (document) => {
      const todoDocumentRef = doc(db, 'todos', document.id);
      await deleteDoc(todoDocumentRef);
    });
  }

  //////////////////////////////////////////
  // Dialog start
  //////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [todo_id, setTodoId] = useState("");
  const [list, setList] = useState("");
  const [title, setTitle] = useState("");

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

    setTitle("");
    setOpen(false);
  }

  // 送信を押したら削除
  const handleDeleteSubmit = (e) => {
    setTodo(
      todo.filter((n, index) => index !== e['index'])
    );
  }
  
  //////////////////////////////////////////
  // Dialog end
  //////////////////////////////////////////

  // useStateの[todo1]に変更があったらlocalStrageを更新する
  useEffect(() => {
    // deleteTodo('list1');
    // localStorage.setItem("todo", JSON.stringify(todo));
    // localStorage.setItem("count", taskNumber);
  }, [todo1]);
  
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

  const setItemInList = (id, list) => {
    if (listName[id] === 'todo1') {
      setList1(list);
    } else if (listName[id] === 'todo2') {
      setList2(list);
    } else if (listName[id] === 'todo3') {
      setList3(list);
    } else if (listName[id] === 'todo4') {
      setList4(list);
    } else if (listName[id] === 'todo5') {
      setList5(list);
    } else if (listName[id] === 'todo6') {
      setList6(list);
    } else if (listName[id] === 'todo7') {
      setList7(list);
    } else if (listName[id] === 'todo8') {
      setList8(list);
    } else if (listName[id] === 'todo9') {
      setList9(list);
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
      // データを更新
      // 移動対象となったオブジェクトは削除
      const reordered_todos = todo.filter(function(elem) {
        return (elem.list !== source.droppableId);
      });

      update.map(function(elem,index){
        reordered_todos.push({
          list: source.droppableId,
          id: elem.id,
          position: index,
          title: elem.title
        })
      })
      // setTodo([...reordered_todos]);

      setItemInList(source.droppableId, update);
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      // データを更新
      // 移動対象となったオブジェクトは削除
      const result_todos = todo.filter(function(elem) {
        return (elem.list !== source.droppableId && elem.list !== destination.droppableId);
      });

      // 順序を指定しなおして作成
      for (let key in result){
        result[key].map(function(elem, index){
          result_todos.push({
            list: key,
            id: elem.id,
            position: index,
            title: elem.title
          })
        })
      }
      // setTodo([...result_todos]);

      setItemInList(source.droppableId, result[source.droppableId]);
      setItemInList(destination.droppableId, result[destination.droppableId]);
    }
  }

  const addItems = id => {
    setItemInList(
      id,
      getList(id).concat(
        {
          id: `item-${itemCount + 1}`,
          position: '',
          title: ''
        }
      )
    );
    setItemCount(itemCount + 1);
  }

  const updateItems = (id, idx, item, e) => {
    const list_copy = getList(id).slice();
    list_copy[idx].text = e.target.value;
    setItemInList(id, list_copy);

    let new_target = true;
    // データが登録されていたら更新
    todo.some(function(elem) {
      if (elem.id === item.id) {
        elem.title = e.target.value;
        elem.position = idx;
        new_target = false;
      }
    });
    // データが新規だったら登録
    if(new_target){
      let pushTodo = {
        list: id,
        id: item.id,
        position: idx,
        title: e.target.value
      };
      setTodo([...todo, pushTodo]);
    } else {
      setTodo([...todo]);
    }
  }

  const deleteItemForList = (id, idx) => {
    // データを削除
    let removed_todo = todo.filter(function(elem){
      return elem.id !== getList(id)[idx].id;
    });
    setTodo([...removed_todo]);

    const removed = deleteItem(getList(id),idx);
    setItemInList(id, removed);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="To-do-list-container">
        <div class="left">
          {Object.keys(listName1).map(key => 
            <List 
              key={key} 
              id={key} 
              list={getList(key)} 
              onAddItems={addItems} 
              onUpdateItems={updateItems}
              handleClickOpen={handleClickOpen}
            />
          )}
        </div>
        <div class="rigth">
        {Object.keys(listName2).map(key => 
            <List
              key={key} 
              id={key} 
              todo={todo}
              setTodo={setTodo}
              setList8={setList8}
              list={getList(key)} 
              taskNumber={taskNumber}
              setTaskNumber={setTaskNumber}
              onAddItems={addItems} 
              onUpdateItems={updateItems}
              handleClickOpen={handleClickOpen}
            />
          )}
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
        <DialogTitle id="form-dialog-title">
          タスク編集
        </DialogTitle>
        <DialogContent>
          {todo_id}
          <TextField
            id="standard-multiline-static"
            label="内容"
            multiline
            minRows={4}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            value={title}
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