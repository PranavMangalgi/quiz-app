import { useState, useReducer } from "react";
import styles from "../../auth.module.css";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "update":
      return { ...state, [action.field]: action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
};
function Register({ setShowSignUp }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState(false);

  const handleUpdate = (field, value) => {
    dispatch({ type: "update", field, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const { name, email, password, confirmPassword } = state;
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      setError(true);
      return;
    } else {
      console.log("inside else");
      setError(false);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/signup`,
          state
        );

        if (response.status === 201) {
          toast.success("User created!", {
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
            setShowSignUp(false);
          }, 1200);
        }
        console.log(response);
      } catch (e) {
        console.log(e);
        if (e?.response?.status === 409) {
          toast.error("Email registered already", {
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
        }
      }
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={state.name}
          className={error && !state.name && styles.error}
          placeholder={error && !state.name && `Invalid name`}
          onChange={(e) => handleUpdate("name", e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={state.email}
          className={error && !state.email && styles.error}
          placeholder={error && !state.email && `Invalid email`}
          onChange={(e) => handleUpdate("email", e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={state.password}
          className={error && !state.password && styles.error}
          placeholder={error && !state.password && `Weak Password`}
          onChange={(e) => handleUpdate("password", e.target.value)}
        />
      </div>
      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={state.confirmPassword}
          className={
            error &&
            (!state.confirmPassword ||
              state.confirmPassword !== state.password) &&
            styles.error
          }
          placeholder={
            error &&
            (!state.confirmPassword ||
              state.confirmPassword !== state.password) &&
            `Password does not match`
          }
          onChange={(e) => handleUpdate("confirmPassword", e.target.value)}
        />
      </div>
      <button type="submit">Sign Up</button>
      <ToastContainer />
    </form>
  );
}

Register.propTypes = {
  setShowSignUp: PropTypes.func.isRequired,
};

export default Register;
