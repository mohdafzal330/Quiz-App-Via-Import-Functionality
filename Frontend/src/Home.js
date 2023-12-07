import { useState } from 'react';
import Quiz from './Quiz'
import './App.css';
import { Link } from 'react-router-dom'

function Home() {

  const [marks, setMarks] = useState(0)
  const [result, setResult] = useState()
  const [max, SetMax] = useState()
  function marksHandler(data) {
    setMarks(marks + data)
  }
  function calScore(data) {
    setResult(marks)
  }
  function setLength(data) {
    SetMax(data);
  }
  return (
    <div className="app-container">
      <Link to='/'>Home</Link>
      <h1 style={{ textAlign: "center" }}><i>Basic Quiz Application</i></h1>
      {result ? <p style={{textAlign:"center", color:"green", margin:"50px"}}><b><i>Result:</i> You Got {result} out of 5 </b></p> : <Quiz getMarks={marksHandler} getLength={setLength} completed={calScore} />}
    </div>
  );
}

export default Home;



