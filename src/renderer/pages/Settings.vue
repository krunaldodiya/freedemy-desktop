<template>
    <div class="wrapper">
      <div style="padding: 10px">
        export database
      </div>
      <div style="padding: 10px">
        import database
      </div>
      <div style="padding: 10px">
        <router-link to="/course/add">
          Add Course
        </router-link>
      </div><div style="padding: 10px">
        <router-link to="/category/add">
          Add Category
        </router-link>
      </div>
    </div>
</template>

<script>
import Database from "@/services/database";
const DatabaseService = new Database();
const axios = require("axios");

export default {
  created() {
    axios
      .get("http://192.168.2.200:8080/status.txt")
      .then(response => {
        const status = response.statusText;
        console.log(status);
      })
      .catch(error => {
        if (error.response.status == 404) {
          console.log("Invalid Server");
        }
      });
  }
};
</script>

<style scoped>
.wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
</style>
