export interface ItemResponse {
  chainId: string;
  createdAt: string;
  isInsideBubble: boolean;
  itemId: number;
  itemLevel: number;
  itemType: string;
  pausedUntil: string | null;
  visibility: string;
}

export interface Item extends ItemResponse {
  uniqueId: string;
}

export interface BoardData {
  width: number;
  height: number;
  boardId: string;
  items: Array<ItemResponse | null>;
  addedItems: Array<Item>;
}
