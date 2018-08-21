<template>
  <div class="round">
    <div @click="goToHome()" class="logo">
      <span v-text="($route.name == 'show-course-detail') ? 'Go Back': 'Udemy - Offline'"></span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      return this.$router.push({
        name: "home"
      });
    }
  }
};
</script>

<style scoped>
.round {
  border: 1px solid indigo;
  padding: 5px;
}

.logo {
  color: indigo;
  text-align: center;
  font-weight: normal;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
}
</style>

