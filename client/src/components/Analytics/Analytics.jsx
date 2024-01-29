import styles from "./analytics.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { IoMdShare } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  setQuizUpdating,
  setQuizUpdateId,
  setPollUpdating,
  setPollUpdateId,
} from "../../features/modalSlice";
import { ToastContainer, toast, Bounce } from "react-toastify";

function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/analytics`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setAnalytics(response.data.tableData);
      console.log("quizes and polls:", response.data.tableData);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getCreatedDate = (date) => {
    let timestamp = new Date(date);

    let day = timestamp.getDate();
    let month = timestamp.toLocaleString("default", { month: "short" });
    let year = timestamp.getFullYear();

    let formattedDate = day + " " + month + ", " + year;
    return formattedDate;
  };

  const deleteRecord = async (qType, id) => {
    const token = Cookies.get("token");
    if (qType === "Quiz") {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_URL}/deletequiz/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        //toast message;
        toast.success("quiz deleted!", {
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
        console.log(`record deleted!`);
      }
    } else {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_URL}/deletepoll/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        //toast message;
        toast.success("poll deleted!", {
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
        console.log(`record deleted!`);
      }
    }
    fetchData();
  };

  const editSelected = (qType, id) => {
    if (qType === "Quiz") {
      dispatch(setQuizUpdating());
      dispatch(setQuizUpdateId(id));
    } else {
      dispatch(setPollUpdating());
      dispatch(setPollUpdateId(id));
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.analytics}>
        <table className={styles.table}>
          <caption className={styles.heading}>Quiz Analytics</caption>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th colSpan={5} style={{ textAlign: "left", padding: "0" }}>
                Impression
              </th>
            </tr>
          </thead>

          <tbody>
            {analytics.length > 0 &&
              analytics.map((record, idx) => (
                <>
                  <tr key={idx} className={idx % 2 != 0 && styles.odd}>
                    <td>{idx + 1}</td>
                    <td>{record.title}</td>
                    <td>{getCreatedDate(record.createdAt)}</td>
                    <td
                      style={{ paddingRight: "4rem", paddingLeft: "1.75rem" }}
                    >
                      2023
                    </td>
                    <td
                      className={styles.icon}
                      onClick={() =>
                        editSelected(record.questionType, record._id)
                      }
                    >
                      <TbEdit size="1.2rem" />
                    </td>
                    <td
                      className={styles.icon}
                      onClick={() =>
                        deleteRecord(record.questionType, record._id)
                      }
                    >
                      <MdDelete size="1.2rem" />
                    </td>
                    <td className={styles.icon}>
                      <IoMdShare size="1.2rem" />
                    </td>
                    <td className={styles.questionWise}>Question wise Analysis</td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Analytics;
