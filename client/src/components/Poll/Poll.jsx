import { useState, useCallback, useEffect, useRef } from "react";
import styles from "./poll.module.css";
import { IoAdd } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setPollModal,
  setPollUpdateId,
  setPollUpdating, setCopyModal, setCopyLink
} from "../../features/modalSlice";
function Poll() {
  const initialRender = useRef(true);
  const { pollUpdating, pollUpdateId } = useSelector((state) => state.modal);
  const [questionsCount, setQuestionsCount] = useState(1);
  const { title } = useSelector((state) => state.modal);
  const [optionType, setOptionType] = useState("text");

  const getInitialOptionState = useCallback(() => {
    if (optionType === "text") {
      return [
        { text: "", count: 0 },
        { text: "", count: 0 },
      ];
    } else if (optionType === "image") {
      return [
        { image: "", count: 0 },
        { image: "", count: 0 },
      ];
    } else if (optionType === "image&text") {
      return [
        { text: "", image: "", count: 0 },
        { text: "", image: "", count: 0 },
      ];
    }
  }, [optionType]);

  const [questions, setQuestions] = useState(
    Array.from({ length: questionsCount }, () => ({
      questionContent: "",
      options: getInitialOptionState(),
    }))
  );

  const [cross, setCross] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (optionType === "text") {
      newOption.text = "";
    } else if (optionType === "image") {
      newOption.image = "";
    } else if (optionType === "image&text") {
      newOption.text = "";
      newOption.image = "";
    }
    newOption.count = 0;
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
    if (initialRender && pollUpdating && pollUpdateId) {
      console.log(pollUpdateId);
      (async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_APP_BACKEND_URL
            }/getpolldata/${pollUpdateId}`);
          console.log(response.data.data);
          initialRender.current = false;
          setQuestions(response.data.data.questions);
          setQuestionsCount(response.data.data.questions.length);
          setOptionType(response.data.data.optionType);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [initialRender, pollUpdating, pollUpdateId]);

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
        };
      });
    });
  }, [optionType, getInitialOptionState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!optionType) {
      setError(true);
      return;
    }

    const incomplete = questions.some(
      (q) =>
        !q.questionContent ||
        !q.options ||
        q.options.length < 2 ||
        q.options.some((option) => {
          return (
            (optionType === "text" && option.text.trim() === "") ||
            (optionType === "image" && option.image.trim() === "") ||
            (optionType === "image&text" &&
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
      console.log({ title, questions, optionType });
      try {
        if (!pollUpdateId && !pollUpdating) {
          const response = await axios.post(
            `${import.meta.env.VITE_APP_BACKEND_URL}/createpoll`,
            {
              title,
              questions,
              optionType,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.status);
          if (response.status === 201) {
            console.log("poll created!!");
            toast.success("poll created!", {
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
              dispatch(setPollModal());
              dispatch(setCopyModal());
              dispatch(setCopyLink({qType:'Poll',url:response.data.url}))
            }, 1300);
          }
        } else {
          console.log({ optionType, questions });

          const response = await axios.post(
            `${
              import.meta.env.VITE_APP_BACKEND_URL
            }/postupdatedpolldata/${pollUpdateId}`,
            { optionType, questions },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          if (response.status === 200) {
            toast.success("poll updated!", {
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
              dispatch(setPollUpdateId(null));
              dispatch(setPollUpdating());
              dispatch(setCopyModal());
              dispatch(setCopyLink({qType:'Poll',url:response.data.url}))
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
                  placeholder={`Poll Question ${idx + 1}`}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[idx].questionContent = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                />
                <div className={styles.optionType}>
                  <div>Option Type:</div>
                  <div className={styles.optionTypeRadios}>
                    <div>
                      <input
                        type="radio"
                        name="optionType"
                        id="text"
                        checked={optionType === "text"}
                        onClick={() => setOptionType("text")}
                      />
                      <label htmlFor="text">Text</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="optionType"
                        id="image"
                        checked={optionType === "image"}
                        onClick={() => setOptionType("image")}
                      />
                      <label htmlFor="image">Image</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="optionType"
                        id="imageAndText"
                        checked={optionType === "image&text"}
                        onClick={() => setOptionType("image&text")}
                      />
                      <label htmlFor="imageAndText">Image & Text</label>
                    </div>
                  </div>
                </div>
                <div className={styles.mid}>
                  <div className={styles.inputOptions}>
                    {question.options.map((option, optionIdx) => (
                      <div key={optionIdx}>
                        {optionType.includes("text") && (
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
                              optionType.includes("text") &&
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
                        {optionType.includes("image") && (
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
                              optionType.includes("image") &&
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
                  </div>
                </div>
              </div>
            )
        )}

        <div className={styles.buttons}>
          <button
            onClick={() => dispatch(setPollModal())}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          {pollUpdating ? (
            <button>Update Poll</button>
          ) : (
            <button type="submit">Create Poll</button>
          )}
        </div>
        <ToastContainer />
      </form>
    </div>
  );
}

export default Poll;
