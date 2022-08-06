import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Chip, imageListItemBarClasses } from '@mui/material';

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

const List = props => {
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
                      value={item.title}
                      onChange={e => props.onUpdateItems(props.id, index, item, e)}
                    />
                    <button className="Modify-item-btn" onClick={() => props.handleClickOpen(props.id, item.id, item.title)}></button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
              <button className="Add-item-btn" onClick={() => props.handleClickOpen(props.id,"", "")}></button>
{/*           <div class="complete_box">
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
*/}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default List