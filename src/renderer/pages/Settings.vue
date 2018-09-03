<template>
    <div class="wrapper">
      <div class="columns">
        <div class="column is-2">
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
          </div>
          <div style="padding: 10px">
            <router-link to="/category/add">
              Add Category
            </router-link>
          </div>
        </div>
        <div class="column-is-10">
          <div style="margin-top: 20px">
            <div style="font-weight: bold">
              Root Storage
            </div>

            <hr>

            <div style="margin-top: 5px">
              <button type="button" class="button is-small" @click="showRootStorage">Choose Root Storage</button>
            </div>

            <div style="margin-top: 5px; border: 1px solid #ccc; padding: 5px 10px; font-size: 12px; font-weight: bold" v-text="storage && storage.volume_path"></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Database from "@/services/database";
const DatabaseService = new Database();
import db from "../libs/database.js";
const axios = require("axios");
const { app, dialog, getCurrentWindow, shell } = require("electron").remote;

export default {
  data() {
    return {
      storage: null
    };
  },

  methods: {
    showRootStorage(course) {
      const path = dialog.showOpenDialog({
        properties: ["openDirectory"]
      });

      if (!path) {
        return dialog.showMessageBox(getCurrentWindow(), {
          type: "info",
          message: "Please, choose a valid root directory."
        });
      }

      const volume_path = path[0];
      db.update(
        { table: "storage" },
        { $set: { volume_path } },
        { upsert: true },
        (err, doc) => {
          if (err) {
            return dialog.showMessageBox(getCurrentWindow(), {
              type: "info",
              message: "Error, Try again."
            });
          }

          return this.$router.push("/");
        }
      );
    }
  },

  created() {
    db.findOne({ table: "storage" }, (err, storage) => {
      this.storage = storage;
    });
  }
};
</script>

<style scoped>
.wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
</style>
