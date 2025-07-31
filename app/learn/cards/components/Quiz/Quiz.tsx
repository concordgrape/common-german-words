"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type FillInTheBlankProps = {
  question: string;
  question_translated: string;
  answer: string;
  hint: string;
};

export default function FillInTheBlankQuiz({ question, answer, question_translated, hint }: FillInTheBlankProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === answer.toLowerCase()) {
      setStatus("correct");
    } else {
      setStatus("incorrect");
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setInput("");
        setStatus("idle");
      }, 1000);
    }
  };

  return (
    <motion.div
      className={clsx(
        "max-w-xl text-center text-lg font-mono mx-auto my-8 p-4 rounded-lg transition-colors"
      )}
      animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="text-black dark:text-white text-xl">
          {question.split("___").map((chunk, i) => (
            <React.Fragment key={i}>
              {chunk}
              {i === 0 && (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={clsx("inline-block w-32 px-2 py-1 mx-2 text-center border-b-2 border-blue-500 bg-transparent text-black dark:text-white placeholder-gray-500 outline-none",
                                        {
                            "bg-green-400 border-green-500": status === "correct",
                            "bg-red-400 border-red-500": status === "incorrect",
                            })}
                  placeholder="?"
                  disabled={status === "correct"}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-5 text-sm text-gray-300">{question_translated.includes(hint)
            ? <>
                {question_translated.split(hint).map((part, i, arr) => (
                    <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <strong>{hint}</strong>}
                    </React.Fragment>
                ))}
                </>
            : question_translated}
        </p>
        {status !== "correct" && (
        <button
            type="submit"
            className={`mt-4 px-4 py-2 text-white rounded border ${
            status === "incorrect"
                ? "bg-red-400 border-red-500"
                : "bg-blue-500 hover:bg-blue-600 border-blue-500"
            }`}
        >
            Submit
        </button>
        )}
      </form>
    </motion.div>
  );
}
