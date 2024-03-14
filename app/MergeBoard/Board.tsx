import { v4 as uuidv4 } from "uuid";
import { PanInfo, motion } from "framer-motion";
import { useEffect, useReducer, useRef, useState } from "react";
import "./styles.css";
import styled from "@emotion/styled";
import { initial, reducer } from "./reducer";
import {
  BoardRowsType,
  DraggedItemStateType,
  EditItemType,
  ItemType,
  SelectedCellType,
} from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlusCircle,
  faHammer,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../components/Modal/Modal";
import { Visibility } from "./enums";
import { EditItem } from "../components/EditItem";
import { AddItem } from "~/components/AddItem";

// The code is currently coupled with the exact square side lengths
// Update square side in Item style as well
const LENGTH_OF_SQUARE_SIDE = 96;

export const Board = () => {
  const [state] = useReducer(reducer, initial);
  const [boardRows, setBoardRows] = useState<BoardRowsType>([[]]);
  const [boardPosition, setBoardPosition] = useState<DOMRect>({} as DOMRect);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLegalMoveRef = useRef(false);
  const [draggedItemState, setDraggedItemState] =
    useState<DraggedItemStateType>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCellType | null>(
    null
  );
  const [editItemState, setEditItemState] = useState<EditItemType>();

  useEffect(() => {
    const itemsPerChunk = state.width;

    const boardRows = state.items.reduce(
      (resultArray: BoardRowsType, item, index) => {
        const chunkIndex = Math.floor(index / itemsPerChunk);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
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
      const rects = containerRef.current.getBoundingClientRect();
      setBoardPosition(rects);
    }
  }, [boardRows.length]);

  const handleOnDragStart = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const cursorRowIndex = Math.floor(
      (info.point.y - boardPosition.y) / LENGTH_OF_SQUARE_SIDE
    );
    const cursorColumnIndex = Math.floor(
      (info.point.x - boardPosition.x) / LENGTH_OF_SQUARE_SIDE
    );
    setDraggedItemState({
      originalColumnIndex: cursorColumnIndex,
      originalRowIndex: cursorRowIndex,
      item: boardRows[cursorRowIndex][cursorColumnIndex],
    });
  };

  const handleOnDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const cursorRowIndex = Math.min(
      Math.max(
        Math.floor((info.point.y - boardPosition.y) / LENGTH_OF_SQUARE_SIDE),
        0
      ),
      state.height - 1
    );

    const cursorColumnIndex = Math.min(
      Math.max(
        Math.floor((info.point.x - boardPosition.x) / LENGTH_OF_SQUARE_SIDE),
        0
      ),
      state.width - 1
    );

    if (
      !boardRows[cursorRowIndex][cursorColumnIndex] &&
      info.point.x > boardPosition.left &&
      info.point.x < boardPosition.right &&
      info.point.y > boardPosition.top &&
      info.point.y < boardPosition.bottom
    ) {
      isLegalMoveRef.current = true;
    } else {
      isLegalMoveRef.current = false;
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const cursorRowIndex = Math.floor(
      (info.point.y - boardPosition.y) / LENGTH_OF_SQUARE_SIDE
    );
    const cursorColumnIndex = Math.floor(
      (info.point.x - boardPosition.x) / LENGTH_OF_SQUARE_SIDE
    );

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

    isLegalMoveRef.current = false;
  };

  const handleOnClickAddItem = (
    item: ItemType,
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
    item: ItemType | null,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (item) {
      return (
        <>
          <ItemTitle visibility={item.visibility}>{item.itemId}</ItemTitle>
          <ItemLevel visibility={item.visibility}>{item.itemLevel}</ItemLevel>
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

  const handleOnDeleteItem = (rowIndex: number, columnIndex: number) => {
    setBoardRows((prevState) => {
      const newState = [...prevState];
      newState[rowIndex][columnIndex] = null;
      return newState;
    });
  };

  const handleOnEditItem = (
    item: ItemType,
    rowIndex: number,
    columnIndex: number
  ) => {
    setEditItemState({ item, rowIndex, columnIndex });
  };

  const handleOnSaveEditItem = (editItem: EditItemType) => {
    setBoardRows((prevState) => {
      const newState = [...prevState];
      newState[editItem.rowIndex][editItem.columnIndex] = editItem.item;
      return newState;
    });
    setEditItemState(undefined);
  };

  const handleOnCancelEditItem = () => {
    setEditItemState(undefined);
  };

  const checkIfDraggable = (item: ItemType) => {
    if (item) {
      if (item.visibility === Visibility.HIDDEN) {
        return false;
      } else if (item.isInsideBubble) {
        return false;
      }
    }

    return true;
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
                    key={item.uniqueId}
                    initial={{ zIndex: 1 }}
                    whileTap={{ zIndex: 100 }}
                    dragSnapToOrigin={!isLegalMoveRef.current}
                    onDragStart={handleOnDragStart}
                    onDrag={handleOnDrag}
                    onDragEnd={handleDragEnd}
                    drag={checkIfDraggable(item)}
                    isInsideBubble={item.isInsideBubble}
                    dragConstraints={containerRef}
                  >
                    {createItemContent(item, rowIndex, columnIndex)}
                    {item && (
                      <ActionBar>
                        <Edit
                          onClick={() =>
                            handleOnEditItem(item, rowIndex, columnIndex)
                          }
                        >
                          <FontAwesomeIcon icon={faHammer} color="darkred" />
                        </Edit>
                        <Trash
                          onClick={() =>
                            handleOnDeleteItem(rowIndex, columnIndex)
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} color="darkred" />
                        </Trash>
                      </ActionBar>
                    )}
                  </Item>
                </ItemContainer>
              ) : (
                <ItemContainer key={`${rowIndex}-${columnIndex}`}>
                  <Item
                    key={uuidv4()}
                    initial={{ zIndex: 1 }}
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

      {isAddItemModalOpen && (
        <Modal>
          <span>Broom Cabinet</span>
          <AddItemContainer>
            {state.addedItems.map((item) => {
              return (
                <AddItem
                  key={item.uniqueId}
                  item={item}
                  onClickItem={() =>
                    selectedCell &&
                    handleOnClickAddItem(
                      item,
                      selectedCell.rowIndex,
                      selectedCell.columnIndex
                    )
                  }
                />
              );
            })}
          </AddItemContainer>
          <ButtonRow>
            <CancelButton
              onClick={() => setIsAddItemModalOpen(false)}
              whileHover={{ opacity: 0.5, transition: { duration: 0.15 } }}
            >
              Cancel
            </CancelButton>
          </ButtonRow>
        </Modal>
      )}
      {!!editItemState && (
        <Modal>
          <EditItem
            editItem={editItemState}
            onCancel={handleOnCancelEditItem}
            onSave={handleOnSaveEditItem}
          />
        </Modal>
      )}
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

const ActionBar = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

const Item = styled(motion.div)<{
  isInsideBubble?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 94px;
  height: 94px;
  padding: 4px;
  background-color: ${({ isInsideBubble }) =>
    isInsideBubble ? "lightgrey;" : "white;"};
`;

const ItemTitle = styled.div<{ visibility?: string }>`
  font-size: 1em;
  user-select: none;
  filter: ${({ visibility }) =>
    visibility === Visibility.VISIBLE ? "blur(0);" : "blur(0.5rem);"};
`;

const ItemLevel = styled.div<{ visibility?: string }>`
  font-size: 0.8em;
  position: absolute;
  top: 4px;
  left: 4px;
  user-select: none;
  filter: ${({ visibility }) =>
    visibility === Visibility.VISIBLE ? "blur(0);" : "blur(0.5rem);"};
`;

const Trash = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  > svg {
    cursor: pointer;
  }
`;

const Edit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  > svg {
    cursor: pointer;
  }
`;

const ButtonRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  margin-top: 2rem;
  width: 100%;
`;

const CancelButton = styled(motion.div)`
  justify-self: flex-start;
  align-self: center;
  cursor: pointer;
  color: darkblue;
`;
