export interface ItemResponseType {
  chainId: string;
  createdAt: string;
  isInsideBubble: boolean;
  itemId: number;
  itemLevel: number;
  itemType: string;
  pausedUntil: string | null;
  visibility: string;
}

export interface ItemType extends ItemResponseType {
  uniqueId: string;
}

export interface BoardDataType {
  width: number;
  height: number;
  boardId: string;
  items: Array<ItemResponseType | null>;
  addedItems: Array<ItemType>;
}

export type SelectedCellType = {
  rowIndex: number;
  columnIndex: number;
};

export type EditItemType = {
  item: ItemType;
} & SelectedCellType;

export type BoardRowsType = Array<Array<ItemType | null>>;

export type DraggedItemStateType = {
  originalRowIndex: number;
  originalColumnIndex: number;
  item: ItemType | null;
} | null;
