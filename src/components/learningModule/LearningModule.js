import React from 'react';
import SelectionBox from '../selectionBox/SelectionBox';
import Button from '../button/Button';

import './Styles.scss';

const LearningModule = ({setGameStatus, setProgress}) => {
  const [currentQuestionId, setCurrentQuestionId] = React.useState(0);
  const [quizData, setQuizData] = React.useState({});
  let currentQuestion = quizData.questionArr ? quizData.questionArr[currentQuestionId]: {};
  React.useEffect(()=>{
    getQuizData();
  },[]);

  const getQuizData=()=>{
    fetch("http://localhost:8080/problems")
      .then((res)=>{
        return res.json();
      }).then((data)=>{
        setQuizData(data);
      }).catch((err)=>{
        console.log(err);
      });
  }

  const handleSubmit=()=> {
    if(currentQuestionId < quizData.totalQuestions-1){
      setCurrentQuestionId(currentQuestionId+1);
    } else {
      setCurrentQuestionId(0);
      setGameStatus({message: "Great Job! Play again.", loadIntro: true});
    }
  }
  let possibleAnswers = [];
  if(currentQuestion.possibleAnswers){
    possibleAnswers = currentQuestion.possibleAnswers.map((answer, index) => {
      return <SelectionBox id={index} key={index} answer={answer} />
    })
  }

// update progress status for ProgressBar Component 
  if(quizData.totalQuestions){
    setProgress(Math.round((currentQuestionId+1)*100/(quizData.totalQuestions+1)));
  }

  return (
    <div className="learningModule">
      { currentQuestion.title &&
        <>
          <div className="learningModule__header">
            <div className="learningModule__title">
              { currentQuestion.title }
            </div>
            <div className="learningModule__subHeader">
              { currentQuestion.additionalInfo }
            </div>
          </div>

          <div className="learningModule__answerArea">
            <div className="learningModule__selections">
              { possibleAnswers }
            </div>
            <div className="learningModule__submitButtonContainer">
              <Button label="Submit" inactive handleSubmit={ handleSubmit } />
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default LearningModule;
