import { useNavigate } from "react-router-dom";
import styles from "./sidebar.module.css";
import Modal from "react-modal";
import Poll from "../Poll/Poll";
import CreateQuiz from "../CreateQuiz/CreateQuiz";
import Quiz from "../Quiz/Quiz";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import CopyLink from "../CopyLink/CopyLink";
import {
  setQuizModal,
  setQuizTypeModal,
  setPollModal,
  setCopyModal
} from "../../features/modalSlice";
Modal.setAppElement("#root");

const modalStyle = {
  content: {
    width: "500px",
    height: "300px",
    margin: "auto",
    overflow: "hidden",
  },
};

const quizModalStyle = {
  content: {
    width: "700px",
    height: "fit-content",
    margin: "auto",
    overflow: "hidden",
  },
};
const copyModalStyle = {
  content: {
    width: "450px",
    height: "fit-content",
    margin: "auto",
    overflow: "hidden",
  },
};

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizTypeModal, quizModal, pollModal,copyModal } = useSelector(
    (state) => state.modal
  );

  return (
    <div className={styles.container}>
      <div className={styles.heading}>QUIZZIE</div>
      <div className={styles.navigation}>
        <div className={styles.navigate} onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>
        <div className={styles.navigate} onClick={() => navigate("/analytics")}>
          Analytics
        </div>
        <div
          className={styles.navigate}
          onClick={() => dispatch(setQuizTypeModal())}
        >
          Create Quiz
        </div>
      </div>
      <div className={styles.logoutContainer}>
        <hr />
        <div
          onClick={() => {
            Cookies.remove("token");
            window.location.reload();
          }}
        >
          Logout
        </div>
      </div>
      <Modal
        isOpen={quizTypeModal}
        onRequestClose={() => dispatch(setQuizTypeModal())}
        style={modalStyle}
      >
        <CreateQuiz />
      </Modal>

      {/* quiz modal */}
      <Modal
        isOpen={quizModal}
        onRequestClose={() => dispatch(setQuizModal())}
        style={quizModalStyle}
      >
        <Quiz />
      </Modal>

      {/* poll modal */}
      <Modal
        isOpen={pollModal}
        onRequestClose={() => dispatch(setPollModal())}
        style={quizModalStyle}
      >
        <Poll />
      </Modal>

      {/* copy link modal */}
      <Modal
        isOpen={copyModal}
        onRequestClose={() => dispatch(setCopyModal())}
        style={copyModalStyle}
      >
        <CopyLink />
      </Modal>
    </div>
  );
}

export default HomePage;
