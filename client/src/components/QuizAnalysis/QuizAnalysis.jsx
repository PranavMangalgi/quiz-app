// import React from 'react'
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./analysis.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
function Analysis() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("")
  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/quizanalysis/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("data::", response.data);
        setData(response.data.questions);
        setTitle(response.data.title)
      } catch (e) {
        console.error(e);
      }
    })();
  },[id]);
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.analysis}>
        <div className={styles.title}>{title}</div>
        <div className={styles.questions}>
          {/* loop below */}
          {data.length > 0 &&
            data.map((q, idx) => (
              <div className={styles.question} key={idx}>
                <div className={styles.questionContent}>
                  {`Q.${idx + 1} ${q.questionContent}`}{" "}
                </div>
                <div className={styles.statCards}>
                  <div className={styles.stat}>
                    <div>{q.totalCount}</div>
                    <div>People answered this question</div>
                  </div>
                  <div className={styles.stat}>
                    <div>{q.correctCount}</div>
                    <div>People answered this question correct</div>
                  </div>
                  <div className={styles.stat}>
                    <div>{q.wrongCount}</div>
                    <div>People answered this question incorrect</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Analysis;
