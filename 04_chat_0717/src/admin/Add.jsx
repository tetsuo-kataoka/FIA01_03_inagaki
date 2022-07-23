import React from 'react'

function Add({
  addData, 
  titleValue, 
  explanationValue,
  questionValue,
  handleInputTitle, 
  handleInputExplanation,
  handleInputQuestion
 }) {
   
  return (
    <div>
      <hr />
      <h1>登録の処理</h1>
      <input type="text" value={titleValue} onChange={handleInputTitle} />
      <textarea value={explanationValue} onChange={handleInputExplanation} />
      <input type="text" value={questionValue} onChange={handleInputQuestion} />
      <button onClick={addData}>送信</button>
    </div>
  )
}

export default Add