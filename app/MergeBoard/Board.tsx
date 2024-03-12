import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useReducer, useRef, useState } from "react";
import "./styles.css";
import styled from "@emotion/styled";
import { initial, reducer } from "./reducer";
import { Item } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "./Modal/Modal";
import { getImageURL } from "~/utils/image-utils";
import { Visibility } from "./enums";

type BoardPositionType = {
  x: number;
  y: number;
};

type BoardRowsType = Array<Array<Item | null>>;

type DraggedItemStateType = {
  originalRowIndex: number;
  originalColumnIndex: number;
  item: Item | null;
} | null;

type SelectedCellType = {
  rowIndex: number;
  columnIndex: number;
};

type DragConstraintsType = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const Board = () => {
  const [state] = useReducer(reducer, initial);
  const [boardRows, setBoardRows] = useState<BoardRowsType>([[]]);
  const [boardPosition, setBoardPosition] = useState<BoardPositionType>({
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLElement | undefined>();
  const isLegalMoveRef = useRef(false);
  const [draggedItemState, setDraggedItemState] =
    useState<DraggedItemStateType>(null);
  const [dragConstraints, setDragConstraints] =
    useState<DragConstraintsType | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCellType | null>(
    null
  );

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
          resultArray[chunkIndex].push(null);
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

    setDragConstraints({
      top: boardPosition.y,
      right: boardPosition.x + boardWidthInPixels,
      bottom: boardPosition.y + boardHeightInPixels,
      left: boardPosition.x,
    });
  };

  const handleOnDrag = (event, info) => {
    const cursorRowIndex = Math.min(
      Math.max(Math.floor((info.point.y - boardPosition.y) / 96), 0),
      state.height - 1
    );

    const cursorColumnIndex = Math.min(
      Math.max(Math.floor((info.point.x - boardPosition.x) / 96), 0),
      state.width - 1
    );

    if (!boardRows[cursorRowIndex][cursorColumnIndex]) {
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
        ] = null;
        return newState;
      });
    }

    setDraggedItemState(null);

    isLegalMoveRef.current = false;
  };

  const handleOnClickAddItem = (
    item: Item,
    rowIndex: number,
    columnIndex: number
  ) => {
    setBoardRows((prevState) => {
      const newState = [...prevState];
      newState[rowIndex][columnIndex] = item;

      return newState;
    });
    setIsAddItemModalOpen(false);
  };

  const createItemContent = (
    item: Item | null,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (item?.itemId) {
      return (
        <>
          <ItemTitle>{item.itemId}</ItemTitle>
          <ItemLevel>{item.itemLevel}</ItemLevel>
        </>
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faPlusCircle}
          size="lg"
          color="green"
          onClick={() => {
            setIsAddItemModalOpen(true);
            setSelectedCell({ rowIndex, columnIndex });
          }}
        />
      );
    }
  };

  const handleOnClickTrash = (rowIndex: number, columnIndex: number) => {
    setBoardRows((prevState) => {
      const newState = [...prevState];
      newState[rowIndex][columnIndex] = null;
      return newState;
    });
  };

  return (
    <Container>
      <BoardContainer ref={containerRef}>
        {boardRows.map((row, rowIndex) => (
          <BoardRow key={rowIndex}>
            {row.map((item, columnIndex) => {
              return item ? (
                <ItemContainer key={`${rowIndex}-${columnIndex}`}>
                  <Item
                    initial={{ zIndex: 1 }}
                    whileTap={{ zIndex: 100 }}
                    key={item.uniqueId}
                    dragSnapToOrigin={!isLegalMoveRef.current}
                    onDragStart={handleOnDragStart}
                    onDrag={handleOnDrag}
                    onDragEnd={handleDragEnd}
                    drag={item.itemType === "empty" ? false : true}
                    visibility={item.visibility}
                    isInsideBubble={item.isInsideBubble}
                  >
                    {createItemContent(item, rowIndex, columnIndex)}
                    {item.itemType !== "empty" && (
                      <Trash
                        onClick={() =>
                          handleOnClickTrash(rowIndex, columnIndex)
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} color="darkred" />
                      </Trash>
                    )}
                  </Item>
                </ItemContainer>
              ) : (
                <ItemContainer key={`${rowIndex}-${columnIndex}`}>
                  <Item
                    key={uuidv4()}
                    initial={{ zIndex: 1 }}
                    visibility={Visibility.VISIBLE}
                    isInsideBubble={false}
                  >
                    {createItemContent(item, rowIndex, columnIndex)}
                  </Item>
                </ItemContainer>
              );
            })}
          </BoardRow>
        ))}
      </BoardContainer>
      <AnimatePresence initial={false} mode="wait">
        {isAddItemModalOpen && (
          <Modal handleClose={() => setIsAddItemModalOpen(false)}>
            {state.addedItems.map((item) => {
              return (
                <AddItemContainer
                  key={item.uniqueId}
                  onClick={() =>
                    selectedCell &&
                    handleOnClickAddItem(
                      item,
                      selectedCell.rowIndex,
                      selectedCell.columnIndex
                    )
                  }
                >
                  <img
                    alt={item.chainId}
                    src={getImageURL(`${item.itemType}.webp`)}
                  ></img>
                </AddItemContainer>
              );
            })}
          </Modal>
        )}
      </AnimatePresence>
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

const AddItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  height: 96px;
  width: 96px;
  cursor: pointer;
`;

const Item = styled(motion.div)<{
  visibility?: string;
  isInsideBubble?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  padding: 4px;
  filter: ${({ visibility }) =>
    visibility === Visibility.VISIBLE ? "blur(0);" : "blur(0.5rem);"};
  background-color: ${({ isInsideBubble }) =>
    isInsideBubble ? "grey;" : "white;"};
  ${({ visibility, isInsideBubble }) =>
    (isInsideBubble || visibility === Visibility.HIDDEN) &&
    "pointer-events: none;"}
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
