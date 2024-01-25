import React, { useState } from 'react';
import './QuizComponent.css';
import williamsImage from './williams.avif';
import alpharomeo from './alfa romeo.avif';
import alphatauri from './alphatauri.avif';
import alpine from './alpine.avif';
import astonmartin from './astonmartin.png';
import ferrari from './ferrari.jpg';
import haas from './haas.avif';
import mclaren from './mclaren.webp';
import mercedes from './mercedes.jpg';
import redbull from './red bull.avif';

const QuizComponent = ({ questions, answers }) => {
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState('');
  const [quizImage, setQuizImage] = useState('');

  const handleAnswerClick = (answer) => {
    const nextQuestionIndex = answer.nextQuestionIndex;
    const nextQuestion = questions.find((q) => q._id === nextQuestionIndex);

    if (nextQuestion && answers.some((a) => a.questionIndex === nextQuestion._id)) {
      setCurrentQuestion(nextQuestion);
    } else {
      // Тест завершено
      setIsQuizCompleted(true);
      setQuizResult(nextQuestion ? nextQuestion.text : currentQuestion.text);
      setQuizImage(getQuizImage(nextQuestion ? nextQuestion._id : currentQuestion._id));
    }
  };

  const getQuizImage = (questionId) => {
    // Логіка визначення картинки відповідно до значення питання
    console.log(questionId);
    switch (questionId) {
      case 11:
        return williamsImage ;
      case 12:
        return redbull;
        case 13:
        return astonmartin;
        case 14:
        return ferrari;
        case 15:
        return mclaren;
        case 16:
        return alphatauri;
        case 17:
        return alpharomeo;
        case 18:
        return haas;
        case 19:
        return alpine;
        case 20:
        return mercedes;
      // і так далі...
      default:
        return 'default-image.jpg';
    }
  };

  return (
    <div className="quiz-container">
      {!isQuizCompleted ? (
        <div>
          <h2 className="question-text">{currentQuestion.text}</h2>
          <ul className="answers-list">
            {answers
              .filter((answer) => answer.questionIndex === currentQuestion._id)
              .map((answer) => (
                <li
                  key={answer._id}
                  className="answer-item"
                  onClick={() => handleAnswerClick(answer)}
                >
                  {answer.text}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>Тест завершено!</h2>
          <p>Результат: {quizResult}</p>
          {quizImage && <img className="scaled-image" src={quizImage} alt="Результат" />}
      </div>
      )}
    </div>
  );
};

export default QuizComponent;
