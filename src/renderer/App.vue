<template>
  <div class="app">
    <div class="columns navbar is-fixed-top">
      <div class="column is-2">
        <Logo/>
      </div>
      <div class="column is-7">
        <Header/>
      </div>
       <div class="column is-3">
         <div class="field is-grouped is-pulled-right">
          <p class="control" v-if="$route.name !== 'add-course'">
            <router-link class="button is-default" to="/course/add">
              Browse Courses  
            </router-link>
          </p>
          <p class="control">
            <router-link class="button is-link" to="/settings">
              Settings
            </router-link>
          </p>
        </div>
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
