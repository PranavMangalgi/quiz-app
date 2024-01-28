import { useState, useCallback, useEffect, useRef } from "react";
import styles from "./quiz.module.css";
import { IoAdd } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuizModal,
  setQuizUpdateId,
  setQuizUpdating,
} from "../../features/modalSlice";
function Quiz() {
  const initialRender = useRef(true);
  const { quizUpdating, quizUpdateId } = useSelector((state) => state.modal);
  const [questionsCount, setQuestionsCount] = useState(1);
  const { title } = useSelector((state) => state.modal);
  const [questionType, setQuestionType] = useState("text");

  

  const getInitialOptionState = useCallback(() => {
    if (questionType === "text") {
      return [{ text: "" }, { text: "" }];
    } else if (questionType === "image") {
      return [{ image: "" }, { image: "" }];
    } else if (questionType === "image&text") {
      return [
        { text: "", image: "" },
        { text: "", image: "" },
      ];
    }
  }, [questionType]);

  const [questions, setQuestions] = useState(
    Array.from({ length: questionsCount }, () => ({
      questionContent: "",
      options: getInitialOptionState(),
      correctOption: undefined,
    }))
  );

  const [cross, setCross] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(1000);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const handleAddQuestion = () => {
    setQuestionsCount((prevCount) => prevCount + 1);
    setCurrentIndex((c) => c + 1);
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        questionContent: "",
        options: getInitialOptionState(),
        correctOption: undefined,
      },
    ]);
  };

  const handleRemoveOption = (questionIdx, optionIdxToRemove) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIdx].options.splice(optionIdxToRemove, 1);
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (qIdx) => {
    const updatedQuestions = [...questions];
    const newOption = {};
    if (questionType === "text") {
      newOption.text = "";
    } else if (questionType === "image") {
      newOption.image = "";
    } else if (questionType === "image&text") {
      newOption.text = "";
      newOption.image = "";
    }
    updatedQuestions[qIdx].options.push(newOption);
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (qIdx) => {
    setCross(true);

    const updatedQuestions = [...questions];
    updatedQuestions.splice(qIdx, 1);
    setQuestions(updatedQuestions);
    setQuestionsCount(updatedQuestions.length);
  };

  useEffect(() => {
    if (initialRender && quizUpdating && quizUpdateId) {
      console.log(quizUpdateId);
      (async () => {
        try {
          const token = Cookies.get("token");
          const response = await axios.get(
            `${
              import.meta.env.VITE_APP_BACKEND_URL
            }/getquizdata/${quizUpdateId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.data);
          initialRender.current = false;
          setQuestions(response.data.data.questions);
          setQuestionsCount(response.data.data.questions.length);
          setQuestionType(response.data.data.questionType);
          setTimer(response.data.data.timer);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [initialRender, quizUpdating, quizUpdateId]);

  useEffect(() => {
    setError(false);
    if (cross) {
      setCurrentIndex((c) => c - 1);
      setCross(false);
    }
  }, [cross]);

  useEffect(() => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        const newOptions = getInitialOptionState();
        return {
          ...question,
          options: newOptions,
          correctOption: undefined,
        };
      });
    });
  }, [questionType, getInitialOptionState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!timer || !questionType) {
      setError(true);
      return;
    }

    const incomplete = questions.some(
      (q) =>
        !q.questionContent ||
        q.correctOption === undefined ||
        !q.options ||
        q.options.length < 2 ||
        q.options.some((option) => {
          return (
            (questionType === "text" && option.text.trim() === "") ||
            (questionType === "image" && option.image.trim() === "") ||
            (questionType === "image&text" &&
              (option.text.trim() === "" || option.image.trim() === ""))
          );
        })
    );

    if (incomplete) {
      setError(true);
      toast.error("Have few empty questions or fields, check again", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    } else {
      setError(false);
      const token = Cookies.get("token");
      try {
        if (!quizUpdateId && !quizUpdating) {
          const response = await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_URL}/createquiz`,
            {
              title,
              questions,
              questionType,
              timer,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          

          if (response.status === 201) {
            toast.success("quiz created!", {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              closeButton: false,
              transition: Bounce,
            });

            setTimeout(() => {
              dispatch(setQuizModal());
            }, 1300);
          }
        } else {
          console.log({ timer, questionType, questions });

          const response = await axios.post(
            `${
              import.meta.env.VITE_APP_BACKEND_URL
            }/postupdatedquizdata/${quizUpdateId}`,
            { timer, questionType, questions },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          if (response.status === 200) {
            toast.success("quiz updated!", {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              closeButton: false,
              transition: Bounce,
            });
            setTimeout(() => {
              dispatch(setQuizUpdateId(null));
              dispatch(setQuizUpdating());
            }, 1300);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.questionNumbers}>
          {Array.from({ length: questionsCount }, (_, idx) => idx).map(
            (q, idx) => (
              <div
                key={q}
                className={`${styles.eachQuestionNumber} ${
                  currentIndex === idx && styles.selected
                }`}
                onClick={() => setCurrentIndex(q)}
              >
                <div>{q + 1}</div>
                {idx !== 0 && (
                  <div
                    className={styles.cross}
                    onClick={() => handleRemoveQuestion(idx)}
                  >
                    x
                  </div>
                )}
              </div>
            )
          )}
          {questionsCount != 5 && (
            <div onClick={handleAddQuestion} className={styles.add}>
              <IoAdd size="1.75rem" />
            </div>
          )}
        </div>
        <div>Max 5 questions</div>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map(
          (question, idx) =>
            currentIndex === idx && (
              <div key={idx} className={styles.forms}>
                <input
                  type="text"
                  className={`${styles.questionContent} ${
                    error &&
                    question.questionContent.trim() == "" &&
                    styles.error
                  }`}
                  value={question.questionContent}
                  placeholder={`Quiz Question ${idx + 1}`}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[idx].questionContent = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                />
                <div className={styles.questionType}>
                  <div>Option Type:</div>
                  <div className={styles.questionTypeRadios}>
                    <div>
                      <input
                        type="radio"
                        name="questionType"
                        id="text"
                        checked={questionType === "text"}
                        onClick={() => setQuestionType("text")}
                      />
                      <label htmlFor="text">Text</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="questionType"
                        id="image"
                        checked={questionType === "image"}
                        onClick={() => setQuestionType("image")}
                      />
                      <label htmlFor="image">Image</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="questionType"
                        id="imageAndText"
                        checked={questionType === "image&text"}
                        onClick={() => setQuestionType("image&text")}
                      />
                      <label htmlFor="imageAndText">Image & Text</label>
                    </div>
                  </div>
                </div>
                <div className={styles.mid}>
                  <div className={styles.inputOptions}>
                    {question.options.map((option, optionIdx) => (
                      <div key={optionIdx}>
                        <input
                          type="radio"
                          name={`correctOption${idx}`}
                          checked={question.correctOption === optionIdx}
                          onChange={() => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[idx].correctOption = optionIdx;
                            setQuestions(updatedQuestions);
                          }}
                        />
                        {questionType.includes("text") && (
                          <input
                            type="text"
                            placeholder="text"
                            className={`${
                              question.correctOption === optionIdx &&
                              styles.correct
                            } ${
                              error &&
                              option.text &&
                              option.text.trim() === "" &&
                              questionType.includes("text") &&
                              styles.error
                            } ${error && !option.text && styles.error}`}
                            onChange={(e) => {
                              const updatedQuestions = [...questions];
                              updatedQuestions[idx].options[optionIdx].text =
                                e.target.value;
                              setQuestions(updatedQuestions);
                            }}
                            value={option.text || ""}
                          />
                        )}
                        {questionType.includes("image") && (
                          <input
                            type="text"
                            placeholder="image"
                            className={`${
                              question.correctOption === optionIdx &&
                              styles.correct
                            } ${
                              error &&
                              option.image &&
                              option.image.trim() === "" &&
                              questionType.includes("image") &&
                              styles.error
                            } ${error && !option.image && styles.error}`}
                            onChange={(e) => {
                              const updatedQuestions = [...questions];
                              updatedQuestions[idx].options[optionIdx].image =
                                e.target.value;
                              setQuestions(updatedQuestions);
                            }}
                            value={option.image || ""}
                          />
                        )}

                        {(optionIdx === 2 || optionIdx === 3) && (
                          <div
                            onClick={() => handleRemoveOption(idx, optionIdx)}
                          >
                            <MdDelete
                              size="1.5rem"
                              style={{ color: "red", alignSelf: "center" }}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    {question.options.length != 4 && (
                      <div
                        className={styles.addOption}
                        onClick={() => handleAddOption(idx)}
                      >
                        Add Option
                      </div>
                    )}
                    {questions[idx].correctOption === undefined && error && (
                      <div
                        className={styles.errorText}
                        style={{ marginLeft: "2rem" }}
                      >
                        Select correct option
                      </div>
                    )}
                  </div>
                  <div className={styles.timerDiv}>
                    <div
                      onClick={() => setTimer(1000)}
                      className={timer === 1000 && styles.timerSelection}
                    >
                      OFF
                    </div>
                    <div
                      onClick={() => setTimer(5)}
                      className={timer === 5 && styles.timerSelection}
                    >
                      5 sec
                    </div>
                    <div
                      onClick={() => setTimer(10)}
                      className={timer === 10 && styles.timerSelection}
                    >
                      10 sec
                    </div>
                  </div>
                </div>
              </div>
            )
        )}

        <div className={styles.buttons}>
          <button onClick={() => dispatch(setQuizModal())}>Cancel</button>
          {quizUpdating ? (
            <button>Update Quiz</button>
          ) : (
            <button type="submit">Create Quiz</button>
          )}
        </div>
        <ToastContainer />
      </form>
    </div>
  );
}

export default Quiz;
