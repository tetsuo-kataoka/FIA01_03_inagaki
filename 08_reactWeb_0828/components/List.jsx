import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SpeedIcon from "@mui/icons-material/Speed";

//To do list内のアイテム(タスク)のcss
const getItemStyle = (draggableStyle) => ({
  displey: "flex",
  paddingLeft: "1rem",
  paddingTop: "0.1rem",
  paddingBottom: "0.1rem",
  marginBottom: "0.5rem",
  background: "#fff8e8",
  borderLeft: "solid 0.5rem #F2DF3A",
  color: "#282c34",

  ...draggableStyle,
});

//To do listのcss
const getListStyle = (isDraggingOver) => ({
  padding: "0.3rem",
  margin: "0.5rem",
  background: "white",
  // minWidth: '400px',
  // height: '70vh',
  border: isDraggingOver ? "solid 4px lightgray" : "solid 4px white",
  borderRadius: "0.5rem",
  textAlign: "left",
});

const ListTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: bold;
  color: #0078aa;
`;

const CompleteButtonLayout = styled.div`
  text-align: right;
`;

const List = (props) => {
  const listTitle = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    weekend: "Weekend",
    waiting: "Waiting...",
    done: "Done!",
    nextweek: "Next Week",
    future: "In the future",
    complete: "Complete!",
  };

  return (
    <div className="To-do-list">
      <Droppable droppableId={props.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <ListTitle>
              {listTitle[props.id]}
              {props.id === "done" && props.listSize > 0 && (
                <>
                  <div>完了数：{props.listSize}</div>
                  <div>{props.clearTimeMessage}</div>
                </>
              )}
            </ListTitle>
            {props.list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(provided.draggableProps.style)}
                  >
                    <div
                      onClick={() =>
                        props.handleClickOpen(
                          props.id,
                          props.uid,
                          item.id,
                          item.title,
                          item.position,
                          item.memo,
                          item.deadline
                        )
                      }
                    >
                      {/*
                      <IconButton size="small">
                        <SpeedIcon />
                      </IconButton>
                    */}
                      {item.title}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {props.id !== "done" && (
              <IconButton
                aria-label="addTask"
                onClick={() =>
                  props.handleClickOpen(props.id, props.uid, "", "")
                }
                size="small"
                color="primary"
              >
                <AddIcon />
              </IconButton>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default List;
