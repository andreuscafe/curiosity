import React from "react";
import Header from "./components/Header/Header";
import Background from "./components/Background/Background";
import ButtonBoard from "./components/BotonHome/ButtonBoard";

const Home = () => {
  return (
    <div className="min-h-screen relative">
      <Background />
      <Header />
      <ButtonBoard />
    </div>
  );
};

export default Home;