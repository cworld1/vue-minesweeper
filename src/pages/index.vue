<script setup lang="ts">
import { BlockState } from "~/types";

const WIDTH = 13;
const HEIGHT = 13;
const mineExpect = 0.2;
// Initial & reactive state
// `reactive` do not support edit or reinitialize after created
// So we use `ref` instead
// const state = reactive<BlockState[][]>(
const state = ref<BlockState[][]>(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from(
      { length: WIDTH },
      (_, x): BlockState => ({
        x,
        y,
        revealed: false,
        adjacentMines: 0,
      }),
    ),
  ),
);

// Generate mines data
function generateMines(initial: BlockState) {
  initial.mine = false;
  getSibilings(initial).forEach((s) => (s.mine = false));

  state.value.flat().forEach((block) => {
    if (block.mine == undefined) {
      block.mine = Math.random() < mineExpect;
    }
  });
  updateNumbers();
}

// Update numbers of adjacentMines
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
function getSibilings(block: BlockState) {
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return undefined;
      return state.value[y2][x2];
    })
    .filter(Boolean) as BlockState[]; // filter item that equals undefined
}
function updateNumbers() {
  state.value.flat().forEach((block) => {
    if (block.mine) return;
    getSibilings(block).forEach((s) => {
      if (s.mine) block.adjacentMines += 1;
    });
  });
}

// Update styles that calculated
const numberColors = [
  "text-transparent",
  "text-blue-700 dark:text-blue-300",
  "text-green-700 dark:text-green-300",
  "text-red-700 dark:text-red-300",
  "text-purple-700 dark:text-purple-300",
  "text-yellow-700 dark:text-yellow-300",
  "text-orange-700 dark:text-orange-300",
  "text-pink-700 dark:text-pink-300",
];
function getBlockClass(block: BlockState) {
  // Not been revealed
  if (!block.revealed) return "bg-gray-400/20 hover:bg-gray/30";

  return block.mine
    ? "bg-red-500/30 text-red-700 dark:text-red-300"
    : numberColors[block.adjacentMines];
}

// Gaming
let mineGenerated = false;
function onClick(block: BlockState) {
  // Generate mine
  if (!mineGenerated) {
    generateMines(block);
    mineGenerated = true;
  }

  if (block.flagged) return;
  block.revealed = true;
  if (block.mine) {
    alert("BOOOOM!");
    dev = true;
    return;
  }
  expandZero(block);
  checkGameState();
}
function onRightClick(block: BlockState) {
  if (block.revealed) return;
  block.flagged = !block.flagged;
  checkGameState();
}
function expandZero(block: BlockState) {
  // If it has numbers, you should expand by yourself
  if (block.adjacentMines) return;

  getSibilings(block).forEach((s) => {
    if (!s.flagged && !s.revealed) {
      s.revealed = true;
      expandZero(s);
    }
  });
}
function checkGameState() {
  if (!mineGenerated) return;
  if (
    state.value
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
</script>

<template>
  <div>
    Minesweeper

    <div p5>
      <div
        v-for="(row, y) in state"
        :key="y"
        flex="~"
        items-center
        justify-center
      >
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        >
        </MineBlock>
      </div>
    </div>
  </div>
</template>
