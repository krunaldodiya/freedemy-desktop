<template>
  <div class="player">
    <video id="my-video" class="video-js vjs-default-skin vjs-16-9" controls preload="auto" :poster="poster" data-setup="{}" autoplay="true" style="width: 100%; max-height: 630pt;">
        <source :src="file" type="video/mp4">        
    </video>
  </div>
</template>

<script>
export default {
  props: ["file", "poster"]
};
</script>

<style scoped>
.player {
  padding: 5px;
}
</style>

