import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SpeedIcon from "@mui/icons-material/Speed";
import { red, amber, yellow, brown } from "@mui/material/colors";

//list全体のcss
const getListStyle = (isDraggingOver, holidayFlg) => ({
  padding: "0.3rem",
  margin: "0.5rem",
  background: holidayFlg === "yes" ? "#f5f5f5" : "white",
  // minWidth: '400px',
  // height: '70vh',
  border: isDraggingOver ? "solid 4px lightgray" : "solid 4px white",
  borderRadius: "0.5rem",
  textAlign: "left",
});

//To do list内のアイテム(タスク)のcss
const getItemStyle = (draggableStyle, deadline, createdAt) => ({
  displey: "flex",
  paddingLeft: "1rem",
  paddingTop: "0.1rem",
  paddingBottom: "0.1rem",
  marginBottom: "0.5rem",
  background: `#fff8e8`,
  // background: ColorChange(deadline, createdAt),
  borderLeft: "solid 0.5rem " + `${ColorChange(deadline, createdAt)}`,
  color: "#282c34",

  ...draggableStyle,
});

// ベースカラー　#fff8e8(255,248,232)
// #F2DF3A(242,223,58)
// 7日間後に色は変化
{
  /*
const ColorChange = (num) => {
  let level = 0;
  if (Math.abs(num) > 7) {
    if (num <= 0) {
      level = num * 2;
    } else {
      level = num * 2;
    }
  }
  return `rgb(${242 - level}, ${223 - level}, ${58 - level})`;
};
*/
}

const ColorChange = (deadline, createdAt) => {
  const today = new Date();
  let num = "";
  if (deadline) {
    const deadtime = new Date(deadline.seconds * 1000);
    num = today.getTime() - deadtime.getTime();
  } else {
    const createtime = new Date(createdAt.seconds * 1000);
    num = today.getTime() - createtime.getTime();
  }

  let level = Math.round(Math.abs(num / (1000 * 60 * 60 * 24)) / 3) * 100;

  if (deadline) {
    // 期日のあるケース
    if (num < 0) {
      // 締め切り前
      level = 900 - level;
      if (level <= 100) {
        level = 100;
      } else if (level > 900) {
        level = "A700";
      }
    } else {
      // 締め切り後は変わらず
      level = "A700";
    }
    return red[level];
    //return amber[level];
  } else {
    // 開始日のあるケース
    if (level <= 100) {
      return yellow[100];
    } else if (level <= 900) {
      return yellow[level];
    } else if (level <= 1500) {
      return brown[level - 700];
    } else {
      return brown[900];
    }
  }
};

const ListTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: bold;
  color: #0078aa;
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
            style={getListStyle(snapshot.isDraggingOver, props.holidayFlg)}
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
                    style={getItemStyle(
                      provided.draggableProps.style,
                      item.deadline,
                      item.createdAt
                    )}
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
                          item.deadline,
                          item.createdAt
                        )
                      }
                    >
                      {/*
                      <IconButton size="small">
                        <SpeedIcon />
                      </IconButton>
                    */}
                      {item.title}
                      {item.passedDate}
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
