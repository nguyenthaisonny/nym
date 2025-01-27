"use client";
import React, { useEffect } from "react";

const MeteorShower = () => {
  useEffect(() => {
    const createMeteor = () => {
      const meteor = document.createElement("div");
      meteor.classList.add("meteor");
      meteor.style.left = `${Math.random() * window.innerWidth}px`;
      meteor.style.top = `${Math.random() * window.innerHeight * 0.5}px`;
      document.body.appendChild(meteor);

      setTimeout(() => {
        meteor.remove();
      }, 2000);
    };

    const interval = setInterval(createMeteor, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <style jsx global>{`
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: linear-gradient(to bottom, #000428, #004e92);
        height: 100vh;
        position: relative;
      }

      .meteor {
        position: absolute;
        width: 5px;
        height: 100px;
        background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0));
        opacity: 0;
        border-radius: 50%;
        transform: rotate(45deg);
        animation: meteor-move 2s linear infinite;
      }

      @keyframes meteor-move {
        0% {
          transform: translateX(0) translateY(0) rotate(45deg);
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          transform: translateX(800px) translateY(800px) rotate(45deg);
          opacity: 0;
        }
      }
    `}</style>
  );
};

export default MeteorShower;
