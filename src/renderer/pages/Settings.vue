<template>
    <div class="wrapper">
      <div style="padding: 10px">
        export database
      </div>
      <div style="padding: 10px">
        import database
      </div>
    </div>
</template>

<script>
import Database from "@/services/database";
const DatabaseService = new Database();

export default {
  created() {
    //
  }
};
</script>

<style scoped>
.wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
</style>
