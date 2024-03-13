// "itemId": 1177,
// "itemType": "BroomCabinet_08",
// "chainId": "BroomCabinet",
// "pausedUntil": null,
// "createdAt": "2023-05-29T17:10:06.9080000Z",
// "visibility": "hidden",
// "itemLevel": 8,
// "isInsideBubble": false

import { SyntheticEvent, useState } from "react";
import { EditItemType, Item } from "./types";
import styled from "@emotion/styled";

type EditItemPropsType = {
  editItem: EditItemType;
  onSave: (item: Item, rowIndex: number, columnIndex: number) => void;
  onCancel: () => void;
};

export const EditItem = ({ editItem, onSave, onCancel }: EditItemPropsType) => {
  const [itemDraft, setItemDraft] = useState<Item>(editItem.item);

  const handleChange = (event, key) => {
    console.log("event", event.target.value);
    setItemDraft((prevItem) => {
      const newItem = { ...prevItem };
      newItem[key] = event.target.value;
      return newItem;
    });
  };

  console.log("itemDraft", itemDraft);

  return (
    <EditContainer>
      <Fields>
        {Object.entries(itemDraft)
          .filter(([key]) => {
            return key !== "uniqueId";
          })
          .map(([key, value], i) => (
            <Field
              key={i}
              value={value ?? ""}
              onChange={(event) => handleChange(event, key)}
            />
          ))}
      </Fields>
      <ButtonRow>
        <Button></Button>
        <Button></Button>
      </ButtonRow>
    </EditContainer>
  );
};

const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
`;

const Field = styled.input`
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Button = styled.div`
  display: flex;
  flex-direction: row;
`;
