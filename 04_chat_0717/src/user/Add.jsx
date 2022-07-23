import React from 'react'

function Add({ addData, handleInputChange, handleInputChange2, titleValue, title2Value }) {
  return (
    <div>
      <hr />
      <h1>登録の処理</h1>
      <p>{titleValue}</p>
      <p>{title2Value}</p>
      <input type="text" value={titleValue} onChange={handleInputChange} />
      <input type="text" value={title2Value} onChange={handleInputChange2} />
      <button onClick={addData}>送信</button>
    </div>
  )
}

export default Add