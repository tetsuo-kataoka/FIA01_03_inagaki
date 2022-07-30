import React from 'react'
import { useState, useEffect } from "react";

const Data = () => {
  const [program, setProgram] = useState({});
  const [data, setData] = useState([]);
  const ApiKey="★別途指定★";

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.nhk.or.jp/v2/pg/now/130/g1.json?key=${ApiKey}`
      );
      const data = await response.json();

      const programList = data.nowonair_list.g1;
      console.log(programList, 'programList');

      setProgram(programList);

    };
    fetchData();
  }, []);

  const handleClick = async (num) => {
    const response = await fetch(`https://api.nhk.or.jp/v2/pg/info/130/g1/${num}.json?key=${ApiKey}`
    ).then((res) => res.json());
    console.log(response.list.g1[0]);
    setData(response.list.g1[0]);
  };

  return (
    <div>
      <div className="viewBox">
        {Object.keys(program).length > 0 && (
          <>
            <div onClick={() => handleClick(program.following.id)}>
              {program.following.title}
            </div>
            <div onClick={() => handleClick(program.present.id)}>
              {program.present.title}
            </div>
            <div onClick={() => handleClick(program.previous.id)}>
              {program.previous.title}
            </div>
          </>
        )}
      </div>
      <div>
        {data.act}
        {data.content}
        <img
           src={`https:${data.program_logo && data.program_logo.url}`}
           alt={data.program_logo} />
      </div>
    </div>
  )
}

export default Data
