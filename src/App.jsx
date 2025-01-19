import { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Explore from "./components/explore";
import Chatbot from "./components/chatbot";
import OptionsComponent from "./components/exploreOption";
import OptedCourse from "./components/OptedCourse";
import Course from "./components/course";
import Analysis from "./components/Analysis";

import { AuthContext, AuthProvider } from "./context/authcontext";
import ProtectedRoute from "./protectedroute";
import { courseContext } from "./context/courseContext";
import { topicContext } from "./context/topicContext";
import { analysisContext } from "./context/analysisContext";

import "./App.css";
import Topic from "./components/Topic";
import InsideAnalysis from "./components/InsideAnalysis";

function App() {
  const user = useContext(AuthContext);
  const [count, setCount] = useState(0);
  const [selectedTopic, setselectedTopic] = useState();
  const [topicSub, settopicSub] = useState(() => {
    const savedTopic = localStorage.getItem("topic");
    return savedTopic ? JSON.parse(savedTopic) : "";
  });
  const [opt, setopt] = useState(() => {
    const savedCourse = localStorage.getItem("course");
    return savedCourse ? JSON.parse(savedCourse) : "";
  });
  useEffect(() => {
    localStorage.setItem("course", JSON.stringify(opt));
  }, [opt]);
  useEffect(() => {
    localStorage.setItem("topic", JSON.stringify(topicSub));
  }, [topicSub]);

  return (
    <>
      <AuthProvider>
        <analysisContext.Provider value={{ selectedTopic, setselectedTopic }}>
          <topicContext.Provider value={{ topicSub, settopicSub }}>
            <courseContext.Provider value={{ opt, setopt }}>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/explore"
                    element={
                      <ProtectedRoute>
                        <Explore />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chatbot"
                    element={
                      <ProtectedRoute>
                        <Chatbot />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/opted"
                    element={
                      <ProtectedRoute>
                        <OptedCourse />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/opted/topic/course"
                    element={
                      <ProtectedRoute>
                        <Course />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/opted/topic"
                    element={
                      <ProtectedRoute>
                        <Topic />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analysis"
                    element={
                      <ProtectedRoute>
                        <Analysis />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analysis/course"
                    element={
                      <ProtectedRoute>
                        <InsideAnalysis />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </courseContext.Provider>
          </topicContext.Provider>
        </analysisContext.Provider>
      </AuthProvider>
    </>
  );
}

export default App;
