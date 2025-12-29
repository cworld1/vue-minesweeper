<script setup lang="ts">
import { reactive } from "vue";

interface BlockState {
  x: number;
  y: number;
  revealed: boolean; // is revealed
  adjacentMines: number; // number of mines that adjacent
  mine?: boolean; // is mine
  flagged?: boolean; // is flagged
}

const WIDTH = 10;
const HEIGHT = 10;

// Initial & reactive state
const state = reactive<BlockState[][]>(
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
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1) continue;
      if (Math.abs(initial.y - block.y) <= 1) continue;
      block.mine = Math.random() < 0.3;
    }
  }
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
      return state[y2][x2];
    })
    .filter(Boolean) as BlockState[]; // filter item that equals undefined
}
function updateNumbers() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return;
      getSibilings(block).forEach((s) => {
        if (s.mine) block.adjacentMines += 1;
      });
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
  if (!block.revealed) return "bg-gray-400/20";

  return block.mine
    ? "bg-red-500/30 text-red-700 dark:text-red-300"
    : numberColors[block.adjacentMines];
}

// Gaming
let mineGenerated = false;
const dev = true;
function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block);
    mineGenerated = true;
  }

  block.revealed = true;
  if (block.mine) alert("BOOOOM!");
  expandZero(block);
}
function expandZero(block: BlockState) {
  // If it has numbers, you should expand by yourself
  if (block.adjacentMines) return;

  getSibilings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true;
      expandZero(s);
    }
  });
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
        <button
          v-for="(block, x) in row"
          :key="x"
          flex="~"
          items-center
          justify-center
          w-10
          h-10
          border="1 gray-400/20"
          :hover="!block.revealed && 'bg-gray/30'"
          :class="getBlockClass(block)"
          @click="onClick(block)"
        >
          <template v-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine />
            <div v-else>{{ block.adjacentMines }}</div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
