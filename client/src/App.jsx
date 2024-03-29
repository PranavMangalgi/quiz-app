import Auth from "./components/Auth/Auth";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import { useSelector } from "react-redux";
import Dashboard from "./components/Dashboard/Dashboard";
import Analytics from "./components/Analytics/Analytics";
import QuizAnalysis from "./components/QuizAnalysis/QuizAnalysis";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import TakeQuiz from "./components/TakeQuiz/TakeQuiz";
import TakePoll from "./components/TakePoll/TakePoll";
import PollAnalysis from "./components/PollAnalysis/PollAnalysis";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/auth" replace={true} />
            )
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/analytics" element={<Analytics/>} />
          <Route path="/createquiz" element={<CreateQuiz/>} />
          <Route path="/quiz/analysis/:id" element={<QuizAnalysis/>} />
          <Route path="/poll/analysis/:id" element={<PollAnalysis/>} />
        </Route>
        <Route path="/takequiz/:id" element={<TakeQuiz/>}/>
        <Route path="/takepoll/:id" element={<TakePoll/>}/>
      </Routes>
    </>
  );
}

export default App;
