import React from "react";
import classNames from "classnames";

export default function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => {
        const optionClass = classNames("btn", "btn-option", {
          answer: index === answer,
          correct: hasAnswered && index === question.correctOption,
          wrong: hasAnswered && index !== question.correctOption,
        });

        return (
          <button
            className={optionClass}
            key={option}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
