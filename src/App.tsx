import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Board from "./pages/Board/Board";
import Home from "./pages/Chat/Home";
import Loader from "./common/Loader";

const App = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(load);
  }, []);

  return (
    <Router>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
