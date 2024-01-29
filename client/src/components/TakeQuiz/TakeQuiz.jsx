//! working with timer perfectly below
import { useEffect, useState } from "react";
import styles from "./takequiz.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import trophy from "../../assets/trophy.png";

function TakeQuiz() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [optionType, setOptionType] = useState("");
  const [timer, setTimer] = useState(1000);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState(
    Array.from({ length: questions.length })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer !== 1000) {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    1000;
    if (
      timer === 0 &&
      timer !== 1000 &&
      currentQuestionIndex < questions.length - 1
    ) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      // Reset timer to 5 seconds when manually moving to the next question
      setTimer(5);
    }
  }, [timer, currentQuestionIndex, questions]);

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(timer);
    } else {
      console.log(answers);
      const token = Cookies.get("token");
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/quizresult/${id}`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.status === 200) {
        setResult(response.data.count);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/getquizdata/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { optionType, questions, timer } = response.data.data;
        setOptionType(optionType);
        setQuestions(questions);
        setTimer(timer);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const currentQuestion = questions[currentQuestionIndex];
  const formattedTimer = `00:${timer < 10 ? "0" + timer : timer}`;

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
            {timer !== 1000 && (
              <div className={styles.timer}>{formattedTimer}</div>
            )}
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
                      <div className={styles.textImg}>
                        <img src={option?.image} alt="no-img" />
                      </div>
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
          <div className={styles.heading}>Congrats you completed the Quiz!</div>
          <div>
            <img src={trophy} alt="no-img" />
          </div>
          <div className={styles.scoreDiv}>
            Your Score is{" "}
            <span className={styles.greenSpan}>
              {result}/{questions.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeQuiz;
