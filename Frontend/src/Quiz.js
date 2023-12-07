import './Quiz.css';
import { useEffect, useState } from "react";
// import questions from './questions.json'
import axios from 'axios';
import { baseUrl } from './http/http-config';
 
export default function Quiz({ getMarks ,completed,getLength}) {
  let questions = []
  

  const [QueueQuestion, setQueueQuestion] = useState([...questions]);
  useEffect(()=>{
    getLength(QueueQuestion.length)
    axios.get(baseUrl+'/questions').then((result)=>{
    console.log(result.data);
    let data = []
    result.data.forEach(element => {
      data.push({
        question: element.question,
        options: [element.optionA,element.optionB,element.optionC,element.optionD,],
        answer: element.answer
      })
    });
    data.sort((first, second)=>{
      return first.question.charAt(1) - second.question.charAt(1)
    })
    setQueueQuestion(data)
    setCurrentQuestion(data[0])
  })
  },[])
 
  const [currentQuestion, setCurrentQuestion] = useState(QueueQuestion[0]);
  const [selectedOption, setSelectedOption] = useState('');
  const [QNum, setQNum] = useState(1);

  function handleOptionChange(option) {
    setSelectedOption(option);
  }

  function handleNext() {
    // const score = selectedOption === currentQuestion.answer ? 1 : 0;
    const score =selectedOption.charAt(0) === currentQuestion.answer.charAt(8) ? 1 : 0;
    console.log(selectedOption, currentQuestion);
    console.log(selectedOption.charAt(0), currentQuestion.answer.charAt(8));
    getMarks(score);
    const updatedQueue = QueueQuestion.slice(1);
    setQueueQuestion(updatedQueue);
    setCurrentQuestion(updatedQueue[0]); 
    setSelectedOption(''); 
    setQNum(QNum+1);
  }
function handleNextFinal(){
  handleNext();
  completed(true);
}
  return (
    <div className="quiz-container">
      {currentQuestion ? (
        <>
          <p className="question-heading"> {currentQuestion.question}</p>
          <ul className="options-list">
            {currentQuestion.options.map((option, index) => (
              <li key={index}>
                <input
                  type="radio"
                  name="options" 
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                  id={index+"_"+option}
                />
                { (QNum==2 && index==0) || QNum==3 ? <label htmlFor={index+"_"+option}> <img src={option} /> </label> : <label htmlFor={index+"_"+option}>{option}</label> }
                
              </li>
            ))}
          </ul>
          {QueueQuestion ? (
            QueueQuestion.length === 1 ? (
              <button className="next-button" onClick={handleNextFinal}>Submit</button>
            ) : (
              <button className="next-button" onClick={handleNext}>Next</button>
            )
          ) : <button className="next-button" onClick={handleNext}>Next</button>}


        </>
      ) : null
      }
    </div >
  );
}


