<template>
  <div id="wrapper">
    <div class="player">
      <VueDPlayer :options="options" @play="play" ref="player"></VueDPlayer>
    </div>
  </div>
</template>

<script>
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";

export default {
  props: ["file", "poster"],

  components: {
    VueDPlayer
  },

  data() {
    return {
      options: {
        video: {
          url: null
        }
      },
      player: null
    };
  },

  mounted() {
    this.player = this.$refs.player.dp;
    this.playSelectedVideo();
  },

  watch: {
    file(current, previous) {
      this.playSelectedVideo();
    }
  },

  methods: {
    play() {
      console.log("playing...");
    },

    playSelectedVideo() {
      if (!this.file) return false;

      this.player.switchVideo({
        url: this.file
      });

      this.player.play();
    }
  }
};
</script>

<style scoped>
#wrapper {
  margin: 0px;
  padding: 0px;
}

.dplayer {
  height: 100%;
}

.player {
  height: 100%;
}

.head {
  font-size: 14px;
}
</style>

