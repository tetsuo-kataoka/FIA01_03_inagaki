import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from '@mui/material/Button';
import { Chip } from '@mui/material';
import './App.css';

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

//To do list内のアイテム(タスク)のcss
const getItemStyle = draggableStyle => ({
  displey: 'flex',
  paddingLeft: '1rem',
  paddingTop: '0.1rem',
  paddingBottom: '0.1rem',
  marginBottom: '0.5rem',
  background: '#fff8e8',
  borderLeft: 'solid 0.5rem #F2DF3A',
  color: '#282c34',

  ...draggableStyle
});

//To do listのcss
const getListStyle = isDraggingOver => ({
  padding: '0.3rem',
  margin: '0.5rem',
  background: 'white',
  minWidth: '400px',
  // height: '70vh',
  border: isDraggingOver ? 'solid 4px lightgray' : 'solid 4px white',
  borderRadius: '0.5rem',
  textAlign: 'left',
});

function List(props) {
  const listTitle = {
    list1: 'Monday',
    list2: 'Tuesday',
    list3: 'Wednesday',
    list4: 'Thursday',
    list5: 'Friday',
    list6: 'Weekend',
    list7: 'Waiting...',
    list8: 'Done!',
    list9: 'Next Week',
  };

  const completeClick = () => {
    // list8のタスクを全て削除
    const completed_todos = props.todo.filter(function(elem) {
      return (elem.list !== 'list8');
    });
    console.log(completed_todos, "completed_todos");

    // list8の中身をクリア
    props.setTaskNumber(Number(props.taskNumber) + Number(props.list.length));
    props.setList8([]);
    props.setTodo([...completed_todos]);
  }

  return (
    <div className="To-do-list">
      <Droppable droppableId={props.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div class="week">{listTitle[props.id]}</div>
            {props.list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(provided.draggableProps.style)}
                  >
                    <input
                      type="text"
                      className="Item-form"
                      placeholder="Please enter your task"
                      value={item.text}
                      onChange={e => props.onUpdateItems(props.id, index, item, e)}
                    />
                    <button className="Delete-item-btn" onClick={() => props.onDeleteItemForList(props.id, index)}></button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div class="complete_box">
              <button className="Add-item-btn" onClick={() => props.onAddItems(props.id)}></button>
              {props.id === 'list8' && (
                <div class="complete">
                  <Chip
                    label="Complete!"
                    color="primary"
                    onClick={completeClick}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

function ToDoListContainer({taskNumber, setTaskNumber}) {
  // データの読み込み
  const getTodo = (id) => {
    const todo_data = localStorage.getItem("todo");
    if (todo_data) {
      const todos = JSON.parse(todo_data);
      const target_todos = todos.filter(function(elem){
        return elem.list === id;
      });
      return target_todos.sort(
        function(first, second){
          if(first.position > second.position){
            return 1;
          } else {
            return -1;
          }
        }
      );
    } else {
      return [];
    }
  }
  // 登録されているデータを保持するuseState
  const [todo1, setList1] = useState(getTodo('list1'));
  const [todo2, setList2] = useState(getTodo('list2'));
  const [todo3, setList3] = useState(getTodo('list3'));
  const [todo4, setList4] = useState(getTodo('list4'));
  const [todo5, setList5] = useState(getTodo('list5'));
  const [todo6, setList6] = useState(getTodo('list6'));
  const [todo7, setList7] = useState(getTodo('list7'));
  const [todo8, setList8] = useState(getTodo('list8'));
  const [todo9, setList9] = useState(getTodo('list9'));
  const [itemCount, setItemCount] = useState(1);

  // データの読み込み
  const getAllTodo = () => {
    const todo_data = localStorage.getItem("todo");
    if (todo_data) {
      const todos = JSON.parse(todo_data);
      const num_arr = todos.map(function (elem) {
        return Number(elem.id.replace('item-', ''));
      })
      setItemCount(Math.max(...num_arr));
      // todo からデータを取得
      return todos;
    } else {
      return [];
    }
  }
  // TODOの設定
  const [todo, setTodo] = useState(getAllTodo);

  // useStateの[todo]に変更があったらlocalStrageを更新する
  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todo));
    localStorage.setItem("count", taskNumber);
  }, [todo, taskNumber]);
  
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
          text: elem.text
        })
      })
      setTodo([...reordered_todos]);

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
            text: elem.text
          })
        })
      }
      setTodo([...result_todos]);

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
          text: ''
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
        elem.text = e.target.value;
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
        text: e.target.value
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
              onDeleteItemForList={deleteItemForList}
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
              onDeleteItemForList={deleteItemForList}
            />
          )}
        </div>
      </div>
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