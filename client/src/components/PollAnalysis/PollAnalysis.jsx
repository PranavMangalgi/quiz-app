// import React from 'react'
import { useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./analysis.module.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function PollAnalysis() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/getpolldata/${id}`
        );
        console.log(response.data.data);
        setTitle(response.data.data.title);
        setOptionType(response.data.data.optionType);
        setQuestions(response.data.data.questions);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const [optionType, setOptionType] = useState("image&text");
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.analysis}>
        <div className={styles.title}>{title}</div>
        <div className={styles.questions}>
          {questions.map((q, idx) => (
            <div className={styles.question} key={idx}>
              <div className={styles.questionContent}>
                Q.{idx+1} {q.questionContent}
              </div>
              <div className={styles.options}>
                {q.options.map((opt,idx)=>(
                  <div className={styles.option} key={idx}>
                    <div className={styles.count}>{opt.count}</div>
                  {optionType.includes("text") && <div>{opt.text}</div>}
                  {optionType.includes("image") && (
                    <div>
                      <img src={opt.image} alt="no-img" />
                    </div>
                  )}
                </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PollAnalysis;
