import styles from "./dashboard.module.css";
import SideBar from "../Sidebar/Sidebar";
import { MdOutlineRemoveRedEye } from "react-icons/md";
function Dashboard() {
  const x = [1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13];
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.dashboard}>
        <div className={styles.metricDetails}>
          <div className={`${styles.metric} ${styles.orangeCol}`}>
            <div className={styles.metricReading}>12</div>
            <div>Quiz Created</div>
          </div>
          <div className={`${styles.metric} ${styles.greenCol}`}>
            <div className={styles.metricReading}>12</div>
            <div>Questions Created</div>
          </div>
          <div className={`${styles.metric} ${styles.blueCol}`}>
            <div className={styles.metricReading}>12</div>
            <div>Impressions Created</div>
          </div>
        </div>
        <div className={styles.quizs}>
          <h2>Trending quizs</h2>
          <div className={styles.allQuizs}>
            {x.map((card) => (
              <>
                <div className={styles.quizCard} key={card}>
                  <div className={styles.quizCardContent}>
                    <div>Quiz1</div>
                    <div className={styles.orangeCol}>
                      667{" "}
                      <MdOutlineRemoveRedEye style={{ alignSelf: "center" }} />
                    </div>
                  </div>
                  <div
                    className={styles.greenCol}
                    style={{ fontSize: ".8rem" }}
                  >
                    Created on : 04 Sep, 2023
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
