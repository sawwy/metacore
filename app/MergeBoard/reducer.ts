import { BoardData } from "./types";
import boardData from "../assigment.json";

export const initial: BoardData = {
  ...boardData,
};

export type Action = { type: "DRAG_STARTED" } | { type: "DRAG_ENDED" };

export const reducer = (state: BoardData, action: Action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
