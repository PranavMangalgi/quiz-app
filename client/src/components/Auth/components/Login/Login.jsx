import { useState, useReducer } from "react";
import styles from "../../auth.module.css";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import {login} from '../../../../features/authSlice';


const initialState = {
  email: "",
  password: "",
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
function Login() {
  const [state, dispatchLogin] = useReducer(reducer, initialState);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  // const { login } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleUpdate = (field, value) => {
    dispatchLogin({ type: "update", field, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const { email, password } = state;
    if (!email || !password) {
      setError(true);
      return;
    } else {
      setError(false);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/login`,
          state
        );
        console.log('response:',response);
        if (response.status === 200) {
          const token = response.data.token;
          
          dispatch(login(response.data.user));
          Cookies.set("token", token, { expires: 7, secure: true });
          toast.success("Logged in!", {
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
            navigate("/dashboard");
          }, 1500);
        }
      } catch (e) {
        toast.error("Incorrect credentials", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        console.error(e);
      }
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <button type="submit">Login</button>
      <ToastContainer />
    </form>
  );
}

export default Login;
