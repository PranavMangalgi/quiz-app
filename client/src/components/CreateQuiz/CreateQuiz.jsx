import { useEffect, useState } from "react";
import styles from "./createquiz.module.css";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {setQuizTypeModal, setQuizModal,setPollModal, setTitle} from '../../features/modalSlice'
function CreateQuiz() {
  const dispatch = useDispatch()
  const [error, setError] = useState(false);
  const [state, setState] = useState({
    title: "",
    option: "",
  });
  useEffect(() => {
    console.log(state);
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, option } = state;
    if (!title || !option) {
      setError(true);
      return;
    } else {
      setError(false);
      option==="quiz"?dispatch(setQuizModal()):dispatch(setPollModal())
      dispatch(setTitle(state.title));
      dispatch(setQuizTypeModal())
    }
  };
  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Quiz name"
        value={state.title}
        onChange={(e) =>
          setState((prevState) => ({ ...prevState, title: e.target.value }))
        }
      />

      <div className={styles.options}>
        <div>Quiz Type:</div>
        <div
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              option: "quiz",
            }))
          }
          className={state.option === "quiz" && styles.selected}
        >
          Q&a
        </div>
        <div
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              option: "poll",
            }))
          }
          className={state.option === "poll" && styles.selected}
        >
          Poll
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={()=>dispatch(setQuizTypeModal())}>Cancel</button>
        <button>Continue</button>
      </div>
      {error && (
        <div style={{ color: "red", marginTop: "-.5rem" }}>
          One of the fields are missing
        </div>
      )}
    </form>
  );
}
CreateQuiz.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  setQuizOpen: PropTypes.func.isRequired,
};

export default CreateQuiz;
