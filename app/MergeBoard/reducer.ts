import { BoardDataType } from "./types";
import boardData from "../assigment.json";
import addedItems from "../addedItems.json";
import { v4 as uuidv4 } from "uuid";

export const initial: BoardDataType = {
  ...boardData,
  addedItems: addedItems.map((item) => ({ ...item, uniqueId: uuidv4() })),
};

export type Action = { type: "DRAG_STARTED" } | { type: "DRAG_ENDED" };

export const reducer = (state: BoardDataType, action: Action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
