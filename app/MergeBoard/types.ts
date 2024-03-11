export interface Item {
  chainId: string;
  createdAt: string;
  isInsideBubble: boolean;
  itemId: number;
  itemLevel: number;
  itemType: string;
  pausedUntil: string | null;
  visibility: string;
}

export type BoardData = {
  width: number;
  height: number;
  boardId: string;
  items: Array<Item | null>;
};
