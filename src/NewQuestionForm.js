
import React, { useState } from 'react';

const NewQuestionForm = ({ questions, onAddQuestion }) => {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedNextQuestion, setSelectedNextQuestion] = useState('');

  const addQuestionToDatabase = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        console.error('Помилка при збереженні нового питання:', response.statusText);
        return null;
      }
      onAddQuestion();
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Помилка при взаємодії з сервером:', error.message);
      return null;
    }
  };
  
  const addAnswerToDatabase = async (text, questionIndex, nextQuestionIndex) => {
    try {
      const response = await fetch('http://localhost:5000/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, questionIndex, nextQuestionIndex }),
      });
  
      if (!response.ok) {
        console.error('Помилка при збереженні нової відповіді:', response.statusText);
        return null;
      }
      onAddQuestion();
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Помилка при взаємодії з сервером:', error.message);
      return null;
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) {
      console.error('Введіть текст нового питання');
      return;
    }

    // Додати нове питання до бази даних
    const newQuestionData = await addQuestionToDatabase(newQuestionText);

    if (newQuestionData) {
      onAddQuestion(); // Оновити дані питань після додавання нового питання
      setNewQuestionText(''); // Очистити поле для нового питання
    }
  };

  // const handleAddAnswer = async () => {
  //   if (!newAnswerText.trim() || !selectedQuestion || !selectedNextQuestion) {
  //     console.error('Введіть текст нової відповіді та оберіть питання та наступне питання');
  //     return;
  //   }

  //   // Додати нову відповідь до бази даних
  //   await addAnswerToDatabase(newAnswerText, parseInt(selectedQuestion), parseInt(selectedNextQuestion));

  //   setNewAnswerText(''); // Очистити поле для нової відповіді
  // };
  const handleAddAnswer = async () => {
    if (!newAnswerText.trim() || !selectedQuestion || !selectedNextQuestion) {
      console.error('Введіть текст нової відповіді та оберіть питання та наступне питання');
      return;
    }
  
    console.log('Before addAnswerToDatabase:', newAnswerText, selectedQuestion, selectedNextQuestion);
    console.log('newAnswerText:', newAnswerText);
    console.log('selectedQuestion:',  selectedQuestion);
    console.log('selectedNextQuestion:', selectedNextQuestion);
  
    // Додати нову відповідь до бази даних
    const responseData = await addAnswerToDatabase(
      newAnswerText,
      parseInt(selectedQuestion),
      parseInt(selectedNextQuestion)
    );
  
    console.log('After addAnswerToDatabase:', responseData);
  
    onAddQuestion();
    setNewAnswerText('');
  };
  

  return (
    <div>
      <h2>Додати нове питання:</h2>
      <input
        type="text"
        placeholder="Текст нового питання"
        value={newQuestionText}
        onChange={(e) => setNewQuestionText(e.target.value)}
      />
      <button onClick={handleAddQuestion}>Додати питання</button>

      <h2>Додати нову відповідь:</h2>
      <input
        type="text"
        placeholder="Текст нової відповіді"
        value={newAnswerText}
        onChange={(e) => setNewAnswerText(e.target.value)}
      />
      <select value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)}>
        <option value="">Виберіть питання</option>
        {questions.map((question) => (
          <option key={question._id} value={question._id}>
            {question.text}
          </option>
        ))}
      </select>
      <select value={selectedNextQuestion} onChange={(e) => setSelectedNextQuestion(e.target.value)}>
        <option value="">Виберіть наступне питання</option>
        {questions.map((question) => (
          <option key={question._id} value={question._id}>
            {question.text}
          </option>
        ))}
      </select>
      
      <button onClick={handleAddAnswer}>Додати відповідь</button>
    </div>
  );
};

export default NewQuestionForm;
