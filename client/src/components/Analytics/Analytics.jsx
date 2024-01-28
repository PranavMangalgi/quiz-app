// import React from 'react'
import styles from "./analytics.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { IoMdShare } from "react-icons/io";
function Analytics() {
  const x = [1, 2, 3, 4, 5, 6, 6, 7, 7, 7, 7, 77,];
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
            {x.map((i) => (
              <>
                <tr key={i}>
                  <td>1</td>
                  <td>Quiz1</td>
                  <td>04 Sep, 2023</td>
                  <td style={{ paddingRight: "4rem", paddingLeft: "1.75rem" }}>
                    2023
                  </td>
                  <td className={styles.icon}>
                    <TbEdit size="1.2rem" />
                  </td>
                  <td className={styles.icon}>
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
    </div>
  );
}

export default Analytics;
