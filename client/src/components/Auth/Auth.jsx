import { useState } from "react";
import styles from "./auth.module.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function Auth() {
  const [showSignUp, setShowSignUp] = useState(true);
  return (
    <div className={styles.container}>
      <div className={styles.component}>
        <h1 className={styles.heading}>QUIZZIE</h1>
        <div className={styles.authEntry}>
          <button
            className={styles.authBtn}
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={styles.authBtn}
            onClick={() => setShowSignUp(false)}
          >
            Login
          </button>
        </div>
        {showSignUp ? <Register setShowSignUp={setShowSignUp} /> : <Login />}
      </div>
    </div>
  );
}

export default Auth;
