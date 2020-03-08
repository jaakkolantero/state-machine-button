import { useReducer, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

type State = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
type Event = "CLICK" | "RESET" | "LOADED" | "FAILED";

interface StateShift {
  on: OnEvent;
}
type OnEvent = { [E in Event]?: State };
type StateShifts = { [S in State]: StateShift };

interface Machine {
  initial: State;
  states: StateShifts;
}

const ButtonMachine: Machine = {
  initial: "IDLE",
  states: {
    ["IDLE"]: {
      on: {
        ["CLICK"]: "LOADING"
      }
    },
    ["LOADING"]: {
      on: {
        ["LOADED"]: "SUCCESS",
        ["FAILED"]: "FAILURE"
      }
    },
    ["SUCCESS"]: {
      on: {
        ["CLICK"]: "IDLE",
        ["RESET"]: "IDLE"
      }
    },
    ["FAILURE"]: {
      on: {
        ["CLICK"]: "LOADING",
        ["RESET"]: "IDLE"
      }
    }
  }
};

const ButtonReducer = (state: State, event: Event) => {
  return ButtonMachine.states[state].on[event] || state;
};

const TIMEOUT = 2000;

export default () => {
  const [state, dispatch] = useReducer(ButtonReducer, ButtonMachine.initial);
  const { x } = useSpring({
    from: { x: 0 },
    x: state === "SUCCESS" ? 1 : 0,
    config: { duration: 1000 }
  });

  useEffect(() => {
    switch (state) {
      //MOCKING FETCH
      case "LOADING":
        Math.random() < 0.5
          ? setTimeout(() => dispatch("LOADED"), TIMEOUT)
          : setTimeout(() => dispatch("FAILED"), TIMEOUT);
        break;
      case "SUCCESS":
        setTimeout(() => dispatch("RESET"), TIMEOUT);
        break;
      case "FAILURE":
        setTimeout(() => dispatch("RESET"), TIMEOUT);
        break;
    }
  }, [state]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 py-12 px-4 bg-gray-200">
        <div className="flex flex-col justify-center items-center">
          <div className="bg-gray-100 p-12 rounded-lg border border-gray-300">
            <animated.div
              className="flex justify-center"
              style={{
                opacity: x.interpolate({ range: [0, 1], output: [0.3, 1] }),
                transform: x
                  .interpolate({
                    range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                    output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1]
                  })
                  .interpolate(x => `scale(${x})`)
              }}
            >
              {state}
            </animated.div>
            <div className="flex justify-center mt-6">
              <button
                className="py-2 px-4 rounded bg-black text-white hover:text-pink-500 hover:bg-gray-900"
                onClick={() => dispatch("CLICK")}
              >
                Submit
              </button>
              <button
                className="underline text-sm ml-3 text-gray-700"
                onClick={() => dispatch("RESET")}
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black text-white py-12 px-10">footer</div>
    </div>
  );
};
