// QnAComponent.js
import React, { useState, useRef } from 'react';
import './QnAComponent.css';

const QnAComponent = ({ questions, answers, fetchData }) => {
  const [editableQuestions, setEditableQuestions] = useState({});
  const [editableAnswers, setEditableAnswers] = useState({});
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const containerRefs = useRef({});

  const handleEditClick = (type, _id) => {
    if (type === 'question') {
      setEditableQuestions({ ...editableQuestions, [_id]: true });
      setEditableAnswers({});
    } else if (type === 'answer') {
      setEditableAnswers({ ...editableAnswers, [_id]: true });
      setEditableQuestions({});
    }
  };

  const saveQuestionText = async (questionIndex, newText) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${questionIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: questionIndex, text: newText }),
      });

      if (!response.ok) {
        console.error('Помилка збереження тексту питання:', response.statusText);
        return null;
      }

      const savedQuestion = await response.json();
      console.log('Текст питання успішно збережений:', savedQuestion);
      return savedQuestion;
    } catch (error) {
      console.error('Помилка збереження тексту питання:', error.message);
      return null;
    }
  };

  const handleSaveClick = async (questionIndex, type) => {
    const newText = containerRefs.current[questionIndex].querySelector('input').value;

    // Зберігаємо зміни тексту питання
    await saveQuestionText(questionIndex, newText);

    // Оновлюємо дані питань після успішного збереження
    fetchData();

    if (type === 'question') {
      setEditableQuestions({});
    } else if (type === 'answer') {
      setEditableAnswers({});
    }
  };

  const deleteQuestion = async (questionIndex) => {
    try {
      // Знаходимо всі відповіді, які відносяться до цього питання
      const relatedAnswers = answers.filter((answer) => answer.questionIndex === questionIndex);

      // Видаляємо питання
      const questionResponse = await fetch(`http://localhost:5000/questions/${questionIndex}`, {
        method: 'DELETE',
      });

      if (!questionResponse.ok) {
        console.error('Помилка видалення питання:', questionResponse.statusText);
        return;
      }

      console.log('Питання успішно видалено');


      // Видаляємо всі залежні відповіді
      // await Promise.all(
      //   relatedAnswers.map(async (answer) => {
      //     const answerResponse = await fetch(`http://localhost:5000/answers/${answer._id}`, {
      //       method: 'DELETE',
      //     });

      //     if (!answerResponse.ok) {
      //       console.error('Помилка видалення відповіді:', answerResponse.statusText);
      //     } else {
      //       console.log('Відповідь успішно видалена');
      //     }
      //   })
      // );
      fetchData();
    } catch (error) {
      console.error('Помилка видалення питання:', error.message);
    }
  };

  const handleDeleteClick = async (questionIndex) => {
    // Викликаємо функцію видалення питання
    await deleteQuestion(questionIndex);
    fetchData();

    // Після видалення скасовуємо режим редагування
    setEditableQuestions({});
  };

  const handleSelectChange = (answerIndex, event) => {
    console.log('handleSelectChange:', answerIndex); // Додайте цей рядок для логування
  
    const selectedQuestionId = parseInt(event.target.value);
    setSelectedQuestions({ ...selectedQuestions, [answerIndex]: selectedQuestionId });
  
    // Оновлюємо nextQuestionIndex тут
    const containerRef = containerRefs.current[answerIndex];
    console.log('containerRef:', containerRef); // Додайте цей рядок для логування
  
    if (containerRef) {
      const inputElement = containerRef.querySelector('input');
      if (inputElement) {
        const newText = inputElement.value;
        saveAnswerText(answerIndex, newText, selectedQuestionId);
      }
    }
  };
  

  const handleSaveAnswerClick = async (answerIndex) => {
    const selectedQuestionId = selectedQuestions[answerIndex] || answers.find((a) => a._id === answerIndex)?.nextQuestionIndex;
    const questionId = answers.find((a) => a._id === answerIndex)?.questionIndex;
  
    // Отримуємо текст питання зі списку питань
    const questionText = questions.find((q) => q._id === questionId)?.text || '';
  
    // Зберігаємо зміни тексту відповіді та nextQuestionIndex
    await saveAnswerText(answerIndex, questionText, selectedQuestionId, questionId);
    fetchData();
  
    // Скасовуємо режим редагування
    setEditableAnswers({});
  };

  const saveAnswerText = async (answerIndex, newText, nextQuestionId, questionId) => {
    try {
      console.log('saveAnswerText - answerIndex:', answerIndex);
      console.log('saveAnswerText - newText:', newText);
      console.log('saveAnswerText - nextQuestionId:', nextQuestionId);
      console.log('saveAnswerText - questionId:', questionId);
  
      const response = await fetch(`http://localhost:5000/answers/${answerIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText, nextQuestionIndex: nextQuestionId, questionIndex: questionId }),
      });
      fetchData();
  
      if (!response.ok) {
        console.error('Помилка збереження тексту відповіді:', response.statusText);
      } else {
        console.log('Текст відповіді та nextQuestionIndex успішно збережені');
      }
    } catch (error) {
      console.error('Помилка збереження тексту відповіді:', error.message);
    }
  };
  const deleteAnswer = async (answerIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/answers/${answerIndex}`, {
        method: 'DELETE',
      });
      fetchData();

      if (!response.ok) {
        console.error('Помилка видалення відповіді:', response.statusText);
      } else {
        console.log('Відповідь успішно видалена');
      }
    } catch (error) {
      console.error('Помилка видалення відповіді:', error.message);
    }
  };

  const handleDeleteAnswerClick = async (answerIndex) => {
    // Викликаємо функцію видалення відповіді
    await deleteAnswer(answerIndex);

    // Після видалення скасовуємо режим редагування
    setEditableAnswers({});
  };

 
  const renderQuestionOptions = (answerIndex) => {
    return questions.map((question) => (
      <option key={question._id} value={question._id} className="editable">
        {question.text}
      </option>
    ));
  };

  return (
    <div>
      <h2>Питання та відповіді:</h2>
      {questions.map((question) => (
        <div key={question._id} className="container" ref={(ref) => (containerRefs.current[question._id] = ref)}>
          <p className={`question editable ${editableQuestions[question._id] ? 'selected' : ''}`} onDoubleClick={() => handleEditClick('question', question._id)}>
            Питання {question._id}: {editableQuestions[question._id] ? (
              <>
                <input type="text" defaultValue={question.text} key={`question-${question._id}`} />
                <button onClick={() => handleSaveClick(question._id, 'question')}>Зберегти</button>
                <button onClick={() => handleDeleteClick(question._id)}>Видалити</button>
              </>
            ) : (
              question.text
            )}
          </p>
          <ul>
            {answers
              .filter((answer) => answer.questionIndex === question._id)
              .map((filteredAnswer) => (
                <li
                  key={filteredAnswer._id}
                  className={`answer editable ${editableAnswers[filteredAnswer._id] ? 'selected' : ''}`}
                  onDoubleClick={() => handleEditClick('answer', filteredAnswer._id)}
                >
                  {editableAnswers[filteredAnswer._id] ? (
                    <>
                      <input type="text" defaultValue={filteredAnswer.text} key={`answer-${filteredAnswer._id}`} />
                      <select
                        value={selectedQuestions[filteredAnswer._id] || filteredAnswer.nextQuestionIndex}
                        onChange={(event) => handleSelectChange(filteredAnswer._id, event)}
                      >
                        {renderQuestionOptions(filteredAnswer._id)}
                      </select>
                      <button onClick={() => handleSaveAnswerClick(filteredAnswer._id)}>Зберегти</button>
                      <button onClick={() => handleDeleteAnswerClick(filteredAnswer._id)}>Видалити</button>
                    </>
                  ) : (
                    filteredAnswer.text
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QnAComponent;