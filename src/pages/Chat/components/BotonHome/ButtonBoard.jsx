import React from "react";
import { Link } from "react-router-dom";

const ButtonBoard = () => {
  return (
    <Link to="/board">
    <button className="overflow-hidden w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group mt-20 uppercase">
      ¿VAMOS?
      <span className="absolute w-36 h-32 -top-8 -left-2 bg-violet-200 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom"></span>
      <span className="absolute w-36 h-32 -top-8 -left-2 bg-violet-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom"></span>
      <span className="absolute w-36 h-32 -top-8 -left-2 bg-violet-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-bottom"></span>
      <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 right-5 z-10 text-base">
        ¡al board!
      </span>
    </button>
  </Link>
  );
};

export default ButtonBoard;