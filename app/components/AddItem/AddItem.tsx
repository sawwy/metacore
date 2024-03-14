import styled from "@emotion/styled";
import { getImageURL } from "~/utils/image-utils";
import { motion } from "framer-motion";
import { Item } from "~/MergeBoard/types";

type AddItemPropsType = {
  onClickItem: () => void;
  item: Item;
};

export const AddItem = ({ onClickItem, item }: AddItemPropsType) => {
  return (
    <>
      <AddItemContainer onClick={onClickItem} whileHover={{ scale: 1.1 }}>
        <img
          alt={item.chainId}
          src={getImageURL(`${item.itemType}.webp`)}
        ></img>
        <Level>{item.itemLevel}</Level>
      </AddItemContainer>
    </>
  );
};

const AddItemContainer = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  height: 96px;
  width: 96px;
  cursor: pointer;
`;

const Level = styled.div`
  position: absolute;
  font-size: 0.8em;
  top: 0;
  left: 8px;
`;
