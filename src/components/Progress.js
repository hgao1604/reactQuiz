import React from "react";

export default function Progress({
  numQuestions,
  index,
  points,
  maxPossiblePoints,
  answer,
}) {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={answer !== null ? index + 1 : index}
      ></progress>
      <p>
        Question <strong>{answer !== null ? index + 1 : index}</strong>/
        {numQuestions}
      </p>
      <p>
        <strong>{points}</strong>/{maxPossiblePoints}
      </p>
    </header>
  );
}
