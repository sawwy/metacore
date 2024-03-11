import { range } from "lodash-es";

import React, { useEffect, useReducer, useRef, useState } from "react";
import "./styles.css";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { initial, reducer } from "./reducer";
import { Item } from "./types";

type BoardPositionType = {
  x: number;
  y: number;
};

export const Board = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const [boardPosition, setBoardPosition] = useState<BoardPositionType>({
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { x, y } = containerRef.current.getBoundingClientRect();
      setBoardPosition({ x, y });
    }
  }, []);

  console.log("state", state);

  const perChunk = state.width; // items per chunk

  const boardRows = state.items.reduce(
    (resultArray: Array<Array<Item | null>>, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    },
    []
  );

  const boardWidthInPixels = state.width * 96;
  const boardHeightInPixels = state.height * 96;

  const handleDragEnd = (event, info) => {
    console.log("event info", event, info);
    console.log(
      "point in board",
      info.point.x - boardPosition.x,
      info.point.y - boardPosition.y
    );
  };

  return (
    <Container>
      <BoardContainer ref={containerRef}>
        {boardRows.map((row, i) => (
          <div key={i}>
            {row.map((item) => (
              <Item
                key={item?.itemId}
                drag
                dragConstraints={{
                  top: -50,
                  left: -50,
                  right: 50,
                  bottom: 50,
                }}
                dragSnapToOrigin
                dragElastic={1}
                onDragEnd={handleDragEnd}
              >
                {item ? item.itemId : ""}
              </Item>
            ))}
          </div>
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
`;

const Item = styled(motion.div)`
  border: 1px solid #ccc;
  height: 92px;
  width: 92px;
`;
