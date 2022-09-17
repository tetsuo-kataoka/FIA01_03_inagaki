import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Menu from "./Menu";
import { db } from "../src/firebase"; // .env の情報を呼び出し
import {
  collection,
  query,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const Settings = () => {
  const { beforeLoginCheck, uid } = useContext(AuthContext);
  const [settingsId, setSettingsId] = useState("");
  const [clearTime, setClearTime] = useState(null);
  const [week, setWeek] = useState(1);
  const [message, setMessage] = useState("");
  beforeLoginCheck();

  useEffect(() => {
    const q = query(collection(db, "settings"), where("uid", "==", uid));
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      QuerySnapshot.docs.map((doc) => {
        setSettingsId(doc.id);
        if (doc.data().clearTime) {
          setClearTime(new Date(doc.data().clearTime.seconds * 1000));
        }
        if (doc.data().week) {
          setWeek(doc.data().week);
        }
      });
    });
    return () => unsub();
  }, [uid]);

  const handleSubmit = async (e) => {
    setMessage("");
    e.preventDefault();
    // 既にデータが登録されている場合
    if (settingsId) {
      const settingsDocumentRef = doc(db, "settings", settingsId);
      console.log(clearTime, "clearTime");
      console.log(timestamp(clearTime), "timestamp(clearTime)");
      await updateDoc(settingsDocumentRef, {
        clearTime: timestamp(clearTime),
        week: week,
        updatedAt: serverTimestamp(),
      });
    } else {
      const settingsCollectionRef = collection(db, "settings");
      const documentRef = await addDoc(settingsCollectionRef, {
        uid: uid,
        clearTime: timestamp(clearTime),
        week: week,
        updatedAt: serverTimestamp(),
      });
      setSettingsId(documentRef.id);
    }
    setMessage("更新しました");
  };

  // Datepicker で指定されたDate型をfirebaseに登録する時にはTimestamp型に変換する
  const timestamp = (datetimeStr) => {
    if (datetimeStr) {
      return Timestamp.fromDate(new Date(datetimeStr));
    }
    return "";
  };

  return (
    <Menu>
      <h1>Settings</h1>
      <div>
        <div>完了タスクのクリア時間</div>
        <div>
          <FormControl>
            <InputLabel id="select-week-label">曜日</InputLabel>
            <Select
              labelId="select-week-label"
              id="select-week"
              value={week}
              label="曜日"
              onChange={(e) => setWeek(e.target.value)}
            >
              <MenuItem value={1}>月曜日</MenuItem>
              <MenuItem value={2}>火曜日</MenuItem>
              <MenuItem value={3}>水曜日</MenuItem>
              <MenuItem value={4}>木曜日</MenuItem>
              <MenuItem value={5}>金曜日</MenuItem>
              <MenuItem value={6}>土曜日</MenuItem>
              <MenuItem value={0}>日曜日</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Basic example"
              value={clearTime}
              onChange={(newValue) => {
                setClearTime(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <Button variant="contained" onClick={handleSubmit}>
          更新
        </Button>
        <div>{message}</div>
      </div>
    </Menu>
  );
};
export default Settings;
