import Header from "./Header";
import Main from "./Main";

import { useEffect, useMemo, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
  questions: [],
  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": {
      return { ...state, questions: action.payload, status: "ready" };
    }
    case "error": {
      return { ...state, error: action.payload, status: "error" };
    }
    case "start": {
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    }
    case "newAnswer": {
      const isCorrect =
        state.questions[state.index].correctOption === action.payload;
      const option_points = state.questions[state.index].points;
      return {
        ...state,
        answer: action.payload,
        points: isCorrect ? state.points + option_points : state.points,
      };
    }
    case "nextQuestion": {
      return { ...state, index: state.index + 1, answer: null };
    }
    case "finished": {
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.highscore, state.points),
      };
    }
    case "reset": {
      return {
        ...state,
        status: "ready",
        highscore: state.highscore,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: 10,
      };
    }
    case "tick": {
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining <= 0 ? "finished" : state.status,
      };
    }
    default: {
      throw new Error("Undefined action type");
    }
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = useMemo(
    () => questions.reduce((acc, question) => acc + question.points, 0),
    [questions]
  );
  useEffect(() => {
    //fetch("http://localhost:9000/questions")
    fetch("https://run.mocky.io/v3/2a0f59dd-5e83-4e16-b7b0-9e2fb8a667a9")
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data.questions });
      })
      .catch((err) => {
        dispatch({ type: "error", payload: "Fail to fetch data" });
      });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
