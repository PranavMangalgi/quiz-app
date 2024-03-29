import styles from "./dashboard.module.css";
import SideBar from "../Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "axios";
function Dashboard() {
  const [impressions, setImpressions] = useState(0);
  const [trendingQuizes, setTrendingQuizes] = useState([]);
  const [quizNumber, setQuizNumber] = useState(0);
  const [questionCount, setQuestionCount] =useState(0);

  const getCreatedDate = (date) => {
    let timestamp = new Date(date);

    let day = timestamp.getDate();
    let month = timestamp.toLocaleString("default", { month: "short" });
    let year = timestamp.getFullYear();

    let formattedDate = "Created on : " + day + " " + month + ", " + year;
    return formattedDate
  };

  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/userdata`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setTrendingQuizes(response.data.quizes);
        setImpressions(response.data.impressions);
        setQuizNumber(response.data.quizesNumber);
        setQuestionCount(response.data.questionCount);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.dashboard}>
        <div className={styles.metricDetails}>
          <div className={`${styles.metric} ${styles.orangeCol}`}>
            <div className={styles.metricReading}>{quizNumber}</div>
            <div>Quiz Created</div>
          </div>
          <div className={`${styles.metric} ${styles.greenCol}`}>
            <div className={styles.metricReading}>{questionCount}</div>
            <div>Questions Created</div>
          </div>
          <div className={`${styles.metric} ${styles.blueCol}`}>
            <div className={styles.metricReading}>{impressions}</div>
            <div>Impressions Created</div>
          </div>
        </div>
        <div className={styles.quizs}>
          <h2>Trending quizes</h2>
          <div className={styles.allQuizs}>
            {trendingQuizes.length > 0 ?
              trendingQuizes.map((quiz) => (
                <>
                  <div className={styles.quizCard} key={quiz}>
                    <div className={styles.quizCardContent}>
                      <div>{quiz.title}</div>
                      <div className={styles.orangeCol}>
                        {quiz.visitedHistory.length}{" "}
                        <MdOutlineRemoveRedEye
                          style={{ alignSelf: "center" }}
                        />
                      </div>
                    </div>
                    <div
                      className={styles.greenCol}
                      style={{ fontSize: ".8rem" }}
                    >
                     {getCreatedDate(quiz.createdAt)}
                    </div>
                  </div>
                </>
              )):<div>No trending quizes</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
