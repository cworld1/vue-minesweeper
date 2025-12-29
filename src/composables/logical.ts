import { BlockState } from "~/types";

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

export class GamePlay {
  // [Var]
  // Initial & reactive state
  // `reactive` do not support edit or reinitialize after created
  // So we use `ref` instead
  // const state = reactive<BlockState[][]>(
  public state = ref<BlockState[][]>([]);
  private mineGenerated = false;

  // [Constructor]
  constructor(
    public width: number,
    public height: number,
    public mineExpect: number,
  ) {
    this.resetGame(); // set basic info first
  }

  // [Public method]
  public onClick(block: BlockState) {
    // Generate mine
    if (!this.mineGenerated) {
      this.generateMines(block);
      this.mineGenerated = true;
    }

    if (block.flagged) return;
    block.revealed = true;
    if (block.mine) {
      alert("BOOOOM!");
      return;
    }
    this.expandZero(block);
    // After set state hook, the function will automatically run
    // and no need to load it manually
    // checkGameState();
  }
  public onRightClick(block: BlockState) {
    if (block.revealed) return;
    block.flagged = !block.flagged;
    // checkGameState();
  }

  public resetGame() {
    this.mineGenerated = false;
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from(
        { length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          revealed: false,
          adjacentMines: 0,
        }),
      ),
    );
  }

  // Check if the game is successful
  public checkGameState() {
    if (!this.mineGenerated) return;
    if (
      this.state.value
        .flat()
        .every(
          (block) =>
            block.revealed ||
            (block.flagged && block.mine) ||
            (!block.revealed && block.mine),
        )
    ) {
      alert("You win!");
    }
  }

  // [Utils]
  // Returns siblings all around the specific block
  private getSibilings(block: BlockState) {
    return directions
      .map(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) return undefined;
        return this.state.value[y2][x2];
      })
      .filter(Boolean) as BlockState[]; // filter item that equals undefined
  }
  // Update all state numbers
  private updateNumbers() {
    this.state.value.flat().forEach((block) => {
      if (block.mine) return;
      this.getSibilings(block).forEach((s) => {
        if (s.mine) block.adjacentMines += 1;
      });
    });
  }
  // Expand all siblings that numbers zero
  private expandZero(block: BlockState) {
    // If it has numbers, you should expand by yourself
    if (block.adjacentMines) return;

    this.getSibilings(block).forEach((s) => {
      if (!s.flagged && !s.revealed) {
        s.revealed = true;
        this.expandZero(s);
      }
    });
  }

  // [Gaming]
  // Generate mines data
  private generateMines(initial: BlockState) {
    initial.mine = false;
    this.getSibilings(initial).forEach((s) => (s.mine = false));

    this.state.value.flat().forEach((block) => {
      if (block.mine == undefined) {
        block.mine = Math.random() < this.mineExpect;
      }
    });
    this.updateNumbers();
  }
}
