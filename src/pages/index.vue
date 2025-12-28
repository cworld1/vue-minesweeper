<script setup lang="ts">
import { reactive } from "vue";

interface BlockState {
  x: number;
  y: number;
  revealed: boolean;
  mine: boolean;
  flagged: boolean;
  adjacentMines: number;
}

const WIDTH = 10;
const HEIGHT = 10;

const state = reactive<BlockState[][]>(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from(
      { length: WIDTH },
      (_, x): BlockState => ({
        x,
        y,
        revealed: false,
        mine: false,
        flagged: false,
        adjacentMines: 0,
      }),
    ),
  ),
);

function generateMines() {
  for (const row of state) {
    for (const block of row) {
      block.mine = Math.random() < 0.3;
      block.revealed = false;
      block.flagged = false;
      block.adjacentMines = 0;
    }
  }
}

function onClick(x: number, y: number) {
  console.log(`Clicked at ${x}, ${y}`);
}

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

const numberColors = [
  "text-transparent",
  "text-blue-500",
  "text-green-500",
  "text-red-500",
  "text-purple-500",
  "text-yellow-500",
  "text-orange-500",
  "text-pink-500",
];

function updateNumbers() {
  state.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine) return;
      block.adjacentMines = 0;
      directions.forEach(([dx, dy]) => {
        const x2 = x + dx;
        const y2 = y + dy;

        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return;
        if (state[y2][x2].mine) block.adjacentMines += 1;
      });
    });
  });
}

function getBlockClass(block: BlockState) {
  return block.mine ? "bg-red-500/10 text-red-200" : "text-grey";
}

generateMines();
updateNumbers();
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
          v-for="(item, x) in row"
          :key="x"
          flex="~"
          items-center
          justify-center
          w-10
          h-10
          border="1 gray-300/30"
          hover="bg-gray/30"
          :class="getBlockClass(item)"
          @click="onClick(x, y)"
        >
          <div v-if="item.mine" i-mdi-mine />
          <div v-else>{{ item.adjacentMines }}</div>
        </button>
      </div>
    </div>
  </div>
</template>
