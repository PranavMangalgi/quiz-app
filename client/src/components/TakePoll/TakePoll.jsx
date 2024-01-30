import { useCallback, useEffect, useState } from "react";
import styles from "./takepoll.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";

function TakeQuiz() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [optionType, setOptionType] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState(
    Array.from({ length: questions.length })
  );


  const handleNextQuestion = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log(answers);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/pollresult/${id}`,{answers}
      );

      console.log(response);
      if (response.status === 200) {
        setResult(response.data.count);
      }
    }
  }, [answers, currentQuestionIndex, id, questions.length]);

  

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/getpolldata/${id}`
        );
        const { optionType, questions} = response.data.data;
        setOptionType(optionType);
        setQuestions(questions);
  
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const currentQuestion = questions[currentQuestionIndex];


  useEffect(() => {
    console.log(answers);
  }, [answers]);

  return (
    <div className={styles.container}>
      {result === null ? (
        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.currentQuestion}>
              {currentQuestionIndex + 1}/{questions.length}
            </div>
            
          </div>
          <div className={styles.question}>
            {currentQuestion && currentQuestion.questionContent}
          </div>
          <div className={styles.options}>
            {currentQuestion &&
              currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${
                    answers[currentQuestionIndex] === index
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => {
                    const updatedAnswers = [...answers];
                    updatedAnswers.splice(currentQuestionIndex, 1, index);
                    setAnswers(updatedAnswers);
                  }}
                >
                  {optionType.includes("text") && (
                    <>
                      <div className={styles.textImg}>{option.text}</div>
                      {optionType === "image&text" && (
                        <div className={styles.textImg}>
                          <img src={option?.image} alt="no-img" />
                        </div>
                      )}
                    </>
                  )}

                  {optionType === "image" && (
                    <div className={styles.onlyImg}>
                      <img src={option.image} alt="no-img" />
                    </div>
                  )}
                </div>
              ))}
          </div>
          <button onClick={handleNextQuestion}>Next</button>
        </div>
      ) : (
        <div className={styles.result}>
          <div className={styles.heading}>Thank you for participating in the Poll!</div>
          
        </div>
      )}
    </div>
  );
}

export default TakeQuiz;
