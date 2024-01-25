// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setButtonActive, fetchData } from './redux/actions';

// import { fetchData } from './redux/actions';
// import './App.css';
// import QnAComponent from './QnAComponent';
// import NewQuestionForm from './NewQuestionForm';

// import QuizComponent from './QuizComponent';

// // function App() {
// //   const [button1Active, setButton1Active] = useState(false);
// //   const [button2Active, setButton2Active] = useState(false);
// //   const [button3Active, setButton3Active] = useState(false);
// //   const [questionsData, setQuestionsData] = useState([]);
// //   const [answersData, setAnswersData] = useState([]);
// //   const dispatch = useDispatch();
// //   const button1Active = useSelector(state => state.button1Active); // Приклад, якщо ви хочете зберігати button1Active в Redux
 
// //   useEffect(() => {
// //     dispatch(fetchData());
// //   }, [dispatch]);

// //   const handleButtonClick = (buttonNumber) => {
// //     setButton1Active(buttonNumber === 1);
// //     setButton2Active(buttonNumber === 2);
// //     setButton3Active(buttonNumber === 3);

// //   };

// //   const fetchData = async () => {
// //     try {
// //       const questionsResponse = await fetch('http://localhost:5000/questions');
// //       const questionsData = await questionsResponse.json();
// //       setQuestionsData(questionsData);

// //       const answersResponse = await fetch('http://localhost:5000/answers');
// //       const answersData = await answersResponse.json();
// //       setAnswersData(answersData);
// //     } catch (error) {
// //       console.error('Не вдалось витягти дані', error);
// //     }
// //   };

// //   // useEffect(() => {
// //   //   fetchData();
// //   // }, []); // Опціональний другий аргумент, щоб запобігти нескінченному циклу оновлення

// function App() {
//   const dispatch = useDispatch();
//   const { button1Active, button2Active, button3Active, questionsData, answersData } = useSelector(state => state.buttons);

//   const handleButtonClick = (buttonNumber) => {
//     dispatch(setButtonActive(buttonNumber));
//   };

//   useEffect(() => {
//     dispatch(fetchData());
//   }, [dispatch]);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <div className="navigation-panel">
//           <button
//             className={`nav-button ${button1Active ? 'active' : ''}`}
//             onClick={() => handleButtonClick(1)}
//           >
//             Тестування
//           </button>
//           <button
//             className={`nav-button ${button2Active ? 'active' : ''}`}
//             onClick={() => handleButtonClick(2)}
//           >
//             Редагування
//           </button>
//           <button
//             className={`nav-button ${button3Active ? 'active' : ''}`}
//             onClick={() => handleButtonClick(3)}
//           >
//             Створення
//           </button>
//         </div>


//         {button2Active && <QnAComponent questions={questionsData} answers={answersData} fetchData={fetchData} />
        
//         }
//         {button3Active &&  <NewQuestionForm questions={questionsData} onAddQuestion={fetchData} /> }
//         {button1Active && (
//           <QuizComponent questions={questionsData} answers={answersData} />
//         )}

      
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import './App.css';
import QnAComponent from './QnAComponent';
import NewQuestionForm from './NewQuestionForm';

import QuizComponent from './QuizComponent';

function App() {
  const [button1Active, setButton1Active] = useState(false);
  const [button2Active, setButton2Active] = useState(false);
  const [button3Active, setButton3Active] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [answersData, setAnswersData] = useState([]);

  const handleButtonClick = (buttonNumber) => {
    setButton1Active(buttonNumber === 1);
    setButton2Active(buttonNumber === 2);
    setButton3Active(buttonNumber === 3);

  };

  const fetchData = async () => {
    try {
      const questionsResponse = await fetch('http://localhost:3003/questions');
      const questionsData = await questionsResponse.json();
      setQuestionsData(questionsData);

      const answersResponse = await fetch('http://localhost:3003/answers');
      const answersData = await answersResponse.json();
      setAnswersData(answersData);
    } catch (error) {
      console.error('Не вдалось витягти дані', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  return (
    <div className="App">
      <header className="App-header">
        <div className="navigation-panel">
          <button
            className={`nav-button ${button1Active ? 'active' : ''}`}
            onClick={() => handleButtonClick(1)}
          >
            Кнопка 1
          </button>
          <button
            className={`nav-button ${button2Active ? 'active' : ''}`}
            onClick={() => handleButtonClick(2)}
          >
            Кнопка 2
          </button>
          <button
            className={`nav-button ${button3Active ? 'active' : ''}`}
            onClick={() => handleButtonClick(3)}
          >
            Кнопка 3
          </button>
        </div>


        {button2Active && <QnAComponent questions={questionsData} answers={answersData} fetchData={fetchData} />
        
        }
        {button3Active &&  <NewQuestionForm questions={questionsData} onAddQuestion={fetchData} /> }
        {button1Active && (
          <QuizComponent questions={questionsData} answers={answersData} />
        )}

      
      </header>
    </div>
  );
}

export default App;
