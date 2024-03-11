import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

import { useEffect, useReducer, useRef, useState } from "react";
import "./styles.css";
import styled from "@emotion/styled";
import { initial, reducer } from "./reducer";
import { Item, EmptyItem } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type BoardPositionType = {
  x: number;
  y: number;
};

type BoardRowsType = Array<Array<Item | EmptyItem>>;

type DraggedItemStateType = {
  originalRowIndex: number;
  originalColumnIndex: number;
  item: Item | EmptyItem;
} | null;

export const Board = () => {
  const [state] = useReducer(reducer, initial);
  const [boardRows, setBoardRows] = useState<BoardRowsType>([[]]);
  const [boardPosition, setBoardPosition] = useState<BoardPositionType>({
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLElement>(null);
  const isLegalMoveRef = useRef(false);
  const [draggedItemState, setDraggedItemState] =
    useState<DraggedItemStateType>(null);

  useEffect(() => {
    const perChunk = state.width; // items per chunk

    const boardRows = state.items.reduce(
      (resultArray: BoardRowsType, item, index) => {
        const chunkIndex = Math.floor(index / perChunk);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        if (item) {
          resultArray[chunkIndex].push({ ...item, uniqueId: uuidv4() });
        } else {
          resultArray[chunkIndex].push({
            uniqueId: uuidv4(),
            itemType: "empty",
          });
        }

        return resultArray;
      },
      []
    );

    setBoardRows(boardRows);
  }, [state.width, state.items]);

  useEffect(() => {
    if (containerRef.current) {
      const { x, y } = containerRef.current.getBoundingClientRect();
      setBoardPosition({ x, y });
    }
  }, [boardRows.length]);

  const boardWidthInPixels = state.width * 96;
  const boardHeightInPixels = state.height * 96;

  const handleOnDragStart = (event, info) => {
    const cursorRowIndex = Math.floor((info.point.y - boardPosition.y) / 96);
    const cursorColumnIndex = Math.floor((info.point.x - boardPosition.x) / 96);
    setDraggedItemState({
      originalColumnIndex: cursorColumnIndex,
      originalRowIndex: cursorRowIndex,
      item: boardRows[cursorRowIndex][cursorColumnIndex],
    });
  };

  const handleOnDrag = (event, info) => {
    const cursorRowIndex = Math.floor((info.point.y - boardPosition.y) / 96);
    const cursorColumnIndex = Math.floor((info.point.x - boardPosition.x) / 96);

    if (boardRows[cursorRowIndex][cursorColumnIndex].itemType === "empty") {
      isLegalMoveRef.current = true;
    } else {
      isLegalMoveRef.current = false;
    }
  };

  const handleDragEnd = (event, info) => {
    const cursorRowIndex = Math.floor((info.point.y - boardPosition.y) / 96);
    const cursorColumnIndex = Math.floor((info.point.x - boardPosition.x) / 96);

    if (isLegalMoveRef.current && draggedItemState) {
      setBoardRows((prevState) => {
        const newState = [...prevState];
        newState[cursorRowIndex][cursorColumnIndex] = draggedItemState.item;
        newState[draggedItemState.originalRowIndex][
          draggedItemState.originalColumnIndex
        ] = { uniqueId: uuidv4(), itemType: "empty" };
        return newState;
      });
    }

    isLegalMoveRef.current = false;
  };

  const createItemTitle = (item: Item | EmptyItem) => {
    if (item.itemId) {
      return (
        <>
          <ItemTitle>{item.itemId}</ItemTitle>
          <ItemLevel>{item.itemLevel}</ItemLevel>
        </>
      );
    } else {
      return "";
    }
  };

  const handleOnClickTrash = (rowIndex: number, columnIndex: number) => {
    setBoardRows((prevState) => {
      const newState = [...prevState];
      newState[rowIndex][columnIndex] = {
        uniqueId: uuidv4(),
        itemType: "empty",
      };
      return newState;
    });
  };

  return (
    <Container>
      <BoardContainer ref={containerRef}>
        {boardRows.map((row, rowIndex) => (
          <BoardRow key={rowIndex}>
            {row.map((item, columnIndex) => (
              <ItemContainer key={`${rowIndex}-${columnIndex}`}>
                <Item
                  key={item.uniqueId}
                  dragSnapToOrigin={!isLegalMoveRef.current}
                  onDragStart={handleOnDragStart}
                  onDrag={handleOnDrag}
                  onDragEnd={handleDragEnd}
                  initial={false}
                  drag
                >
                  {createItemTitle(item)}
                </Item>
                {item.itemType !== "empty" && (
                  <Trash
                    onClick={() => handleOnClickTrash(rowIndex, columnIndex)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Trash>
                )}
              </ItemContainer>
            ))}
          </BoardRow>
        ))}
      </BoardContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoardRow = styled(motion.div)`
  display: flex;
  flex-direction: row;
`;

const ItemContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  height: 96px; // drag and drop targeting needs to use same!
  width: 96px; // drag and drop targeting needs to use same!
`;

const Item = styled(motion.div)`
  padding: 4px;
`;

const ItemTitle = styled.div`
  font-size: 1em;
`;

const ItemLevel = styled.div`
  font-size: 0.8em;
  position: absolute;
  top: 4px;
  left: 4px;
`;

const Trash = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  > svg {
    cursor: pointer;
  }
`;
