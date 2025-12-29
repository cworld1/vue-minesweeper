export interface BlockState {
  x: number;
  y: number;
  revealed: boolean; // is revealed
  adjacentMines: number; // number of mines that adjacent
  mine?: boolean; // is mine
  flagged?: boolean; // is flagged
}
