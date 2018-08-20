<template>
  <div class="app">
    <div class="columns navbar is-fixed-top">
      <div class="column is-2">
        <Logo/>
      </div>
      <div class="column is-7">
        <Header/>
      </div>
       <div class="column is-3 has-text-right">
        <router-link to="/course/add" v-if="$route.name !== 'add-course'">
          <div class="button">
            Add Course
          </div>
        </router-link>
        <router-link to="/settings">
          <div class="button">
            Settings
          </div>
        </router-link>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo.vue";
import Header from "@/components/Header";

const { app } = require("electron").remote;

export default {
  name: "freedemy",

  components: {
    Logo,
    Header
  }
};
</script>

<style scoped>
.app {
  padding: 0px;
  margin: 0px;
}

.navbar {
  background: cyan;
  padding: 0px;
  margin: 0px;
}

.content {
  margin-top: 60px;
}

.button {
  text-transform: uppercase;
}
</style>
