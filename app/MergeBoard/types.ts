export interface Item {
  uniqueId: string;
  chainId: string;
  createdAt: string;
  isInsideBubble: boolean;
  itemId: number;
  itemLevel: number;
  itemType: string;
  pausedUntil: string | null;
  visibility: string;
}

export interface EmptyItem {
  uniqueId: string;
  itemType: string;
}

export interface BoardData {
  width: number;
  height: number;
  boardId: string;
  items: Array<Item | null>;
  addedItems: Array<Item>;
}
