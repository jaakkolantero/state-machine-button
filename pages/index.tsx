import { useMachine } from "@xstate/react";
import { Machine } from "xstate";
import { useEffect } from "react";

// The hierarchical (recursive) schema for the states
interface ButtonStateSchema {
  states: {
    idle: {};
    loading: {};
    success: {};
    failure: {};
  };
}

type ButtonEvent =
  | { type: "CLICK" }
  | { type: "RESET" }
  | { type: "LOADED" }
  | { type: "FAILED" };

interface ButtonContext {}

const buttonMachine = Machine<ButtonContext, ButtonStateSchema, ButtonEvent>({
  id: "button",
  initial: "idle",
  states: {
    idle: {
      on: { CLICK: "loading" }
    },
    loading: {
      on: { LOADED: "success", FAILED: "failure" }
    },
    success: {
      on: { RESET: "idle", CLICK: "idle" }
    },
    failure: {
      on: { RESET: "idle", CLICK: "loading" }
    }
  }
});

const TIMEOUT = 2000;

export default () => {
  const [state, send] = useMachine(buttonMachine);

  useEffect(() => {
    console.log("STATE: ", state.value);
    switch (state.value) {
      //MOCKING FETCH
      case "loading":
        Math.random() < 0.5
          ? setTimeout(() => send("LOADED"), TIMEOUT)
          : setTimeout(() => send("FAILED"), TIMEOUT);
        break;
      case "success":
        setTimeout(() => send("RESET"), TIMEOUT);
        break;
      case "failure":
        setTimeout(() => send("RESET"), TIMEOUT);
        break;
    }
  }, [state]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="mb-3 flex justify-center">
        <svg
          className="w-6 h-6 text-pink-400"
          aria-hidden="true"
          viewBox="0 0 24 24"
        >
          <path
            d="M6.27 17.05A2.991 2.991 0 014 22c-1.66 0-3-1.34-3-3s1.34-3 3-3c.18 0 .36 0 .53.05l3.07-5.36-1.74-.99 4.09-1.12 1.12 4.09-1.74-.99-3.06 5.37M20 16c-1.3 0-2.4.84-2.82 2H11v-2l-3 3 3 3v-2h6.18c.42 1.16 1.52 2 2.82 2 1.66 0 3-1.34 3-3s-1.34-3-3-3m-8-8c.18 0 .36 0 .53-.05l3.07 5.36-1.74.99 4.09 1.12 1.12-4.09-1.74.99-3.06-5.37A2.991 2.991 0 0012 2c-1.66 0-3 1.34-3 3s1.34 3 3 3z"
            fill="currentColor"
          />
        </svg>
        <span className="ml-3">{state.value}</span>
      </div>
      <button
        className="py-2 px-4 rounded bg-pink-600 hover:bg-pink-500"
        onClick={() => send("CLICK")}
      >
        <output className="status">
          <div
            className="status-text"
            data-active={state.matches("idle")}
            data-for={state.value}
          >
            Submit
          </div>
          <div
            className="status-text"
            data-active={state.matches("loading")}
            data-for={state.value}
          >
            Loading...
          </div>
          <div
            className="status-text"
            data-active={state.matches("failure")}
            data-for={state.value}
          >
            Retry
          </div>
          <div
            className="status-text"
            data-active={state.matches("success")}
            data-for={state.value}
          >
            Success
          </div>
        </output>
      </button>
      <style jsx>{`
        .status {
          display: grid;
          overflow: hidden;
          display: grid;
          user-select: none;
        }
        .status > div {
          grid-area: 1/1;
        }
        .status-text {
          transition: transform 0.5s ease;
        }
        .status-text[data-for="idle"] {
          transform: translateY(100%);
        }
        .status-text[data-for="loading"] {
          transform: translateY(100%);
        }
        .status-text[data-for="failure"] {
          transform: translateY(100%);
        }
        .status-text[data-for="success"] {
          transform: translateY(100%);
        }
        .status-text[data-active="true"] {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
