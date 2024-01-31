// import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import styles from "./copylink.module.css";
import { setCopyLink, setCopyModal } from "../../features/modalSlice";
import { ToastContainer, toast, Bounce } from "react-toastify";
function CopyLink() {
  const { copyLink } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const handleCopy = () => {
    navigator.clipboard.writeText(copyLink.url);
    toast.success(`${copyLink.qType} copied!`, {
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
      dispatch(setCopyModal());
      dispatch(setCopyLink(null));
    }, 800);
  };
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        Congrats your {copyLink?.qType} is Published!
      </div>
      <div className={styles.copyPart} onClick={handleCopy}>
        {copyLink?.url}
      </div>

      <button className={styles.btn} onClick={handleCopy}>
        Share
      </button>
      <ToastContainer />
    </div>
  );
}

export default CopyLink;
