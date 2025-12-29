<script setup lang="ts">
import { BlockState } from "~/types";
import { isDev } from "~/composables";

defineProps<{
  block: BlockState;
}>();

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
</script>

<template>
  <button
    flex="~"
    items-center
    justify-center
    w-10
    h-10
    border="1 gray-400/20"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else>{{ block.adjacentMines }}</div>
    </template>
  </button>
</template>
