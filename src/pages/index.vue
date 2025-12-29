<script setup lang="ts">
import { isDev, toggleDev } from "~/composables";
import { GamePlay } from "~/composables/logical";

const WIDTH = 13;
const HEIGHT = 13;
const mineExpect = 0.2;

const play = new GamePlay(WIDTH, HEIGHT, mineExpect);
const state = play.state;
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
