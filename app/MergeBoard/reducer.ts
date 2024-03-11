import { Item, BoardData } from "./types";
import boardData from "../assigment.json";

export const initial: BoardData = {
  ...boardData,
};

export type Action =
  | { type: "DRAG_ENDED"; payload: { item: Item } }
  | { type: "ANIMATION_ENDED" };

export const reducer = (state: BoardData, action: Action) => {
  switch (action.type) {
    case "DRAG_ENDED": {
      console.log("DRAG ENDED");
      const nextState = { ...state };
      const { item } = action.payload;
      console.log("item drag ended", item);

      return nextState;
    }
    case "ANIMATION_ENDED": {
      console.log("ANIMATION ENDED");
      const nextState = { ...state };

      return nextState;
    }
    default: {
      return state;
    }
  }
};
