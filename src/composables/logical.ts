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

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'won' | 'lost'
}

export class GamePlay {
  // [Var]
  // Initial & reactive state
  // `reactive` do not support edit or reinitialize after created
  // So we use `ref` instead
  // const state = reactive<BlockState[][]>(
  public state = ref<GameState>({
    board: [], mineGenerated: false, gameState: 'play'
  }) as Ref<GameState>

  // [Constructor]
  constructor(
    public width: number,
    public height: number,
    public mineExpect: number,
  ) {
    this.resetGame(); // set basic info first
  }

  // [Public method]
  public get board() {
    return this.state.value.board
  }
  public onClick(block: BlockState) {
    if (this.state.value.gameState !== 'play' || block.flagged) return

    // Generate mine
    if (!this.state.value.mineGenerated) {
      this.generateMines(block);
      this.state.value.mineGenerated = true;
    }

    block.revealed = true;
    if (block.mine) {
      this.state.value.gameState = 'lost'
      this.showAllMines()
      return;
    }
    this.expandZero(block);
    // After set state hook, the function will automatically run
    // and no need to load it manually
    // checkGameState();
  }
  public onRightClick(block: BlockState) {
    if (this.state.value.gameState !== 'play' || !this.state.value.mineGenerated)
      return;
    if (block.revealed) return;
    block.flagged = !block.flagged;
    // checkGameState();
  }

  public resetGame() {
    this.state.value.mineGenerated = false;
    this.state.value.gameState = 'play'
    this.board = Array.from({ length: this.height }, (_, y) =>
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
    if (!this.state.value.mineGenerated) return;
    if (
      this.board.flat().every(
        (block) =>
          block.revealed || // revealed
          (block.flagged && block.mine) || // flagged and is mine
          (!block.revealed && block.mine), // not been revealed but is mine
      )
    ) {
      this.state.value.gameState = 'won'
      this.showAllMines()
    }
  }

  // [Utils]
  private set board(b: BlockState[][]) {
    this.state.value.board = b
  }
  // Returns siblings all around the specific block
  private getSibilings(block: BlockState) {
    return directions
      .map(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) return undefined;
        return this.board[y2][x2];
      })
      .filter(Boolean) as BlockState[]; // filter item that equals undefined
  }
  // Update all state numbers
  private updateNumbers() {
    this.board.flat().forEach((block) => {
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

    this.board.flat().forEach((block) => {
      if (block.mine == undefined) {
        block.mine = Math.random() < this.mineExpect;
      }
    });
    this.updateNumbers();
  }
  private showAllMines() {
    this.board.flat().forEach((i) => {
      if (i.mine)
        i.revealed = true
    })
  }
}
