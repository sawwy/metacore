import { motion } from "framer-motion";

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

import { useState } from "react";
import { EditItemType, ItemType } from "../MergeBoard/types";
import styled from "@emotion/styled";
import { Switch } from "~/components/Switch";

type EditItemPropsType = {
  editItem: EditItemType;
  onCancel: () => void;
  onSave: (editItem: EditItemType) => void;
};

export const EditItem = ({ editItem, onCancel, onSave }: EditItemPropsType) => {
  const [editItemDraft, setEditItemDraft] = useState<ItemType>(editItem.item);

  const handleChange = <K extends keyof ItemType>(
    event: React.ChangeEvent<HTMLInputElement>,
    key: K
  ) => {
    setEditItemDraft((prevEditItem) => {
      return {
        ...prevEditItem,
        [key]: event.target.value,
      };
    });
  };

  const handleToggleSwitch = () => {
    setEditItemDraft((prevEditItem) => {
      const newEditItem = { ...prevEditItem };
      newEditItem["isInsideBubble"] = !newEditItem["isInsideBubble"];

      return newEditItem;
    });
  };

  return (
    <EditContainer>
      <Fields>
        {(Object.entries(editItemDraft) as Entries<typeof editItemDraft>)
          .filter(([key]) => {
            return !["uniqueId", "isInsideBubble"].includes(key);
          })
          .map(([key, value], i) => (
            <Row key={i}>
              <Label>{key}:</Label>
              <Field
                value={value ?? ""}
                onChange={(event) => handleChange(event, key)}
              />
            </Row>
          ))}
        <Row>
          <Label>isInsideBubble:</Label>
          <Switch
            isOn={editItemDraft.isInsideBubble}
            onClick={handleToggleSwitch}
          />
        </Row>
      </Fields>
      <ButtonRow>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <SaveButton
          onClick={() => onSave({ ...editItem, item: editItemDraft })}
        >
          Save
        </SaveButton>
      </ButtonRow>
    </EditContainer>
  );
};

const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 400px;
`;

const Fields = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.div`
  display: flex;
  margin-right: 1rem;
`;

const Field = styled.input`
  display: flex;
  flex-direction: column;
  width: 65%;
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

const SaveButton = styled(motion.div)`
  justify-self: flex-end;
  background-color: green;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`;
