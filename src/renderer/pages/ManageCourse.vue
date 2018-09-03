<template>
  <div class="wrapper">
    <div v-if="loading" style="padding: 10px">loading...</div>
    <div class="columns" v-if="!loading">
      <div class="column is-4" style="margin: 10px 0;">
        <div class="form">
          <div class="field">
            <div class="control">
                <img :src="course.image" :alt="course.title">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <span v-text="course.course_id" style="font-size: 22px; max-width: 480px"></span>
              <span> - </span>
              <span v-text="course.title" style="font-size: 22px; max-width: 480px"></span>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <span @click="openUrl(course)" v-text="course.url" style="font-size: 14px; color: indigo; cursor: pointer"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-4" style="margin: 20px 0;">
        <div style="margin-bottom: 5px">
          <select class="select" name="" id="" style="min-width: 200px" v-model="selected_category">
            <option value="">select a category</option>
            <option v-for="(category, index) in categories" :key="index" :value="category" v-text="category.title"></option>
          </select>
        </div>
        <div style="margin-bottom: 5px">
          <select class="select" name="" id="" style="min-width: 200px" v-model="selected_subcategory">
            <option value="">select a subcategory</option>
            <option v-for="(subcategory, index) in subcategories" :key="index" :value="subcategory" v-text="subcategory.title"></option>
          </select>
        </div>
        <div style="margin-bottom: 5px">
          <select class="select" name="" id="" style="min-width: 200px" v-model="selected_topic">
            <option value="">select a topic</option>
            <option v-for="(topic, index) in topics" :key="index" :value="topic" v-text="topic.title"></option>
          </select>
        </div>
        <button @click="saveTopic">
          Save
        </button>
      </div>

      <div class="column is-4" style="margin: 20px 0" v-if="this.selected_topic">
        <div class="field is-grouped">
          <p class="control">
            <a class="button is-link" @click.prevent="addVolume" :class="{'is-loading': adding_volume}" :disabled="adding_volume">
              <span v-if="course.volume_path">Change Volume</span>    
              <span v-if="!course.volume_path">Add Volume</span>    
            </a>
          </p>
          <p class="control">
            <router-link class="button is-default" style="color: black" :to="`/course/detail/${course.course_id}`" v-if="course.volume_path">
              Browse Course
            </router-link>
          </p>
          <p class="control">
            <a class="button is-danger" @click.prevent="deleteCourse($route.query.course_id)" :class="{'is-loading': deleting_course}" :disabled="deleting_course">
              Delete Course
            </a>
          </p>
          <p class="control">
            <a class="button is-default" @click.prevent="renameVolume()" :class="{'is-loading': renaming_volume}" :disabled="renaming_volume" v-if="course.volume_path">
              Rename Volume
            </a>
          </p>
        </div>

        <div v-if="$route.query.error == 'no_volume' && !adding_volume" style="color: red">
          Please, add a volume.
        </div>
        
        <div style="border: 1px solid #ccc; padding: 5px" v-if="course.volume_path">
          <div v-for="(volume, index) in volume_path" :key="index">
            <div v-if="index > 0" style="font-size: 12px; font-weight: 400; font-family: tahoma; padding: 2px">
              > {{ volume }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { app, dialog, getCurrentWindow, shell } = require("electron").remote;

const fs = require("fs");
const path = require("path");
const userData = app.getPath("home");

import ValidationErrors from "@/libs/validation-errors";
import Database from "@/services/database";
const DatabaseService = new Database();

import { getVolumePath } from "@/libs/helpers";
import db from "@/libs/database";

export default {
  created() {
    db.findOne({ table: "storage" }, (err, storage) => {
      this.root_storage = storage.volume_path;
    });

    this.categories_tree = JSON.parse(
      fs.readFileSync(`${userData}/freedemy/categories.json`)
    );

    this.loadCourse();
  },

  computed: {
    volume_path() {
      const course_volume = `${this.root_storage}/${this.course.volume_path}`;

      return course_volume.split("/");
    },

    categories() {
      return this.categories_tree.categories;
    },

    subcategories() {
      if (this.selected_category) {
        return this.categories_tree.subcategories.filter(
          subcategory => subcategory.category_id == this.selected_category.id
        );
      }

      return [];
    },

    topics() {
      if (this.selected_subcategory) {
        return this.categories_tree.topics.filter(
          topic => topic.subcategory_id == this.selected_subcategory.id
        );
      }

      return [];
    }
  },

  data() {
    return {
      loading: false,
      renaming_volume: false,
      adding_volume: false,
      deleting_course: false,
      root_storage: null,
      course: {
        table: "courses",
        title: "",
        url: "",
        image: "",
        volume_path: ""
      },
      categories_tree: null,
      selected_category: "",
      selected_subcategory: "",
      selected_topic: "",
      errors: new ValidationErrors()
    };
  },

  watch: {
    $route(to, from) {
      this.loadCourse();
    }
  },

  methods: {
    renameVolume() {
      const course_folder_name = getVolumePath(this.course);
      const old_volume_path = `${this.root_storage}/${this.course.volume_path}`;

      const old_volume_path_array = old_volume_path.split("/");
      old_volume_path_array.pop();
      old_volume_path_array.push(course_folder_name);

      const new_volume_path = old_volume_path_array.join("/");
      if (fs.existsSync(new_volume_path)) {
        return dialog.showMessageBox(getCurrentWindow(), {
          type: "info",
          message: "Folder already exists."
        });
      }

      this.renaming_volume = true;
      fs.rename(old_volume_path, new_volume_path, () => {
        DatabaseService.renameVolume(this.course, course_folder_name)
          .then(volume => {
            if (volume) {
              this.course = volume;
            }

            this.renaming_volume = false;
          })
          .catch(e => {
            this.renaming_volume = false;
          });
      });
    },

    openUrl(course) {
      shell.openExternal(course.url);
    },

    saveTopic() {
      if (
        this.selected_category &&
        this.selected_subcategory &&
        this.selected_topic
      ) {
        return DatabaseService.saveTopic(
          this.course,
          this.selected_category,
          this.selected_subcategory,
          this.selected_topic
        )
          .then(() => {
            dialog.showMessageBox(getCurrentWindow(), {
              type: "info",
              message: "Topic has been updated successfully."
            });
          })
          .catch(e => console.log(e));
      }

      return dialog.showMessageBox(getCurrentWindow(), {
        type: "error",
        message: "Please, choose a valid topic."
      });
    },

    loadCourse() {
      const course_id = this.$route.query.course_id;

      if (course_id) {
        this.loading = true;

        DatabaseService.getCourseByCourseId(course_id)
          .then(course => {
            this.loading = false;
            this.course = course;
            this.selected_category = course.category || "";
            this.selected_subcategory = course.subcategory || "";
            this.selected_topic = course.topic || "";
          })
          .catch(e => {
            this.loading = false;
          });
      }
    },

    deleteCourse(course_id) {
      const choice = dialog.showMessageBox(getCurrentWindow(), {
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message: "Are you sure you want to delete?"
      });

      if (choice === 1) return;
      this.deleting_course = true;

      DatabaseService.deleteCourse(course_id)
        .then(course => {
          this.deleting_course = false;
          return this.$router.push("/");
        })
        .catch(error => {
          this.deleting_course = false;
          this.errors.record(error);
        });
    },

    addVolume() {
      this.adding_volume = true;

      const course_id = this.course.course_id;
      const path = dialog.showOpenDialog({
        properties: ["openDirectory"],
        defaultPath: this.root_storage
      });

      if (!path) {
        this.adding_volume = false;

        return false;
      }

      const volume_path = path[0];

      if (!volume_path.includes(storage_url)) {
        this.adding_volume = false;

        return dialog.showMessageBox(getCurrentWindow(), {
          type: "error",
          message: "Please, choose a valid course directory."
        });
      }

      const chunk = volume_path.split(storage_url);
      const chunk_url = chunk[1].split("/")[1];

      if (chunk.length != 2) {
        this.adding_volume = false;

        return dialog.showMessageBox(getCurrentWindow(), {
          type: "error",
          message: "Course must be inside root directory."
        });
      }

      DatabaseService.updateVolumePath(course_id, chunk_url)
        .then(data => {
          this.adding_volume = false;
          return this.$router.push(`/course/detail/${course_id}`);
        })
        .catch(e => {
          this.adding_volume = false;
        });
    }
  }
};
</script>

<style scoped>
.wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.form {
  margin: 10px;
}
</style>
