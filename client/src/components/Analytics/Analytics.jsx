import styles from "./analytics.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { IoMdShare } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setQuizUpdating,setQuizUpdateId} from "../../features/modalSlice";
import { ToastContainer, toast, Bounce } from "react-toastify";


function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const dispatch = useDispatch();

  const editSelected = (id) =>{
    dispatch(setQuizUpdating());
    dispatch(setQuizUpdateId(id))
  }

  const fetchData =async () => {
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
      setAnalytics(response.data.data.quizes);
      console.log("quizes:", response.data.data.quizes);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  
  const getCreatedDate = (date) => {
    let timestamp = new Date(date);

    let day = timestamp.getDate();
    let month = timestamp.toLocaleString("default", { month: "short" });
    let year = timestamp.getFullYear();

    let formattedDate =  day + " " + month + ", " + year;
    return formattedDate
  };

  const deleteQuizRecord = async(id) =>{
    const token   = Cookies.get("token");
    const response = await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/deletequiz/${id}`,{headers:{
      authorization:`Bearer ${token}`
    }})
    if(response.status===200){
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
      fetchData();
    }
  }

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
              analytics.map((quiz, idx) => (
                <>
                  <tr key={idx} className={idx % 2 != 0 && styles.odd}>
                    <td>{idx + 1}</td>
                    <td>{quiz.title}</td>
                    <td>{getCreatedDate(quiz.createdAt)}</td>
                    <td
                      style={{ paddingRight: "4rem", paddingLeft: "1.75rem" }}
                    >
                      2023
                    </td>
                    <td className={styles.icon} onClick={()=>editSelected(quiz._id)}>
                      <TbEdit size="1.2rem" />
                    </td>
                    <td className={styles.icon} onClick={()=>deleteQuizRecord(quiz._id)}>
                      <MdDelete size="1.2rem" />
                    </td>
                    <td className={styles.icon}>
                      <IoMdShare size="1.2rem" />
                    </td>
                    <td>Question wise Analysis</td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Analytics;
