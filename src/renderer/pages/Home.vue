<template>
  <div class="wrapper">
    <div class="columns">
      <div class="column is-2" style="padding: 0px">
        <div class="field" style="margin-top: 20px; margin-left: 20px">
          <div class="control">
            <input type="text" placeholder="Filter Courses" class="input" v-model="filter_keywords">
          </div>

          <div style="padding: 5px; margin-top: 5px; font-size: 10px; text-transform: uppercase; cursor: pointer" v-if="filter_topic" @click="clear_filter('filter_topic')">clear filters</div>
          <div style="max-height: 650px; overflow: auto; border: 1px solid #e2dbdb; margin-top: 5px; padding: 0px">
            <div v-for="(tree, index) in topics" :key="index" v-if="tree.topics.length">
              <div v-text="tree.category.title" style="cursor: pointer; background: #e2dbdb; color: black; padding: 5px"></div>
              <div v-for="(topic, index) in tree.topics" :key="index" style="padding: 5px" :class="{'selected-topic': filter_topic && filter_topic.id == topic.id}">
                <div v-text="topic.title" @click="filter_topic = topic" style="color: blue; cursor: pointer; padding-left: 5px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-10">
        <div style="padding: 10px" v-if="!courses.length && !loading">No course added yet.</div>
        <div v-if="courses.length" style="padding: 10px">{{ courses.length }} courses available.</div>

        <div class="columns is-multiline is-12" style="margin: 0px; padding: 10px; list-style: none" v-if="courses.length">
          <div class="column is-2" v-for="(course, index) in courses" :key="index" style="padding: 0px">
            <div style="border: 1px solid #e2dbdb; margin: 3px; padding-top: 5px; background: whitesmoke; box-shadow: 1px 1px #e2dbdb;" :class="{'volume-missing': !courseExists(course)}">
              <div class="level" style="margin: 0px">
                <div class="level-left">
                  <router-link :to="`/course/manage?course_id=${course.course_id}`" style="padding-left: 10px; color: blue">
                    <font-awesome-icon icon="cog" />
                  </router-link>
                  <span @click="openUrl(course)" style="padding-left: 10px; color: blue; cursor: pointer">
                    <font-awesome-icon icon="external-link-alt" />
                  </span>
                </div>
                <div class="level-right">
                  <div v-text="'#'+course.course_id" style="margin-right: 10px; font-size: 12px"></div>
                </div>
              </div>
              <router-link style="color: black" :to="`/course/detail/${course.course_id}`">
                <div>
                  <div style="padding: 5px">
                    <img :src="course.image" :alt="course.title">
                  </div>
                  <div style="padding: 0px 10px">
                    <div style="margin-top: 5px; font-size: 12px; color: #202020; font-weight: bold; text-transform: uppercase; height: 80px" v-text="course.title"></div>
                  </div>
                </div>
              </router-link>
              <div style="padding: 0px 10px; height: 70px">
                <span style="margin-top: 5px; font-size: 12px; color: indigo" v-text="course.category ? course.category.title: 'Unknown'"></span>
                <span>|</span>
                <span style="margin-top: 5px; font-size: 12px; color: indigo" v-text="course.subcategory ? course.subcategory.title: 'Unknown'"></span>
                <span>|</span>
                <span style="margin-top: 5px; font-size: 12px; color: indigo" v-text="course.topic ? course.topic.title: 'Unknown'"></span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="busy" style="text-align: center; padding: 20px">Please wait, loading...</div>
        <div v-if="!hasMore && !busy && count > limit" style="text-align: center; padding: 20px">No more data.</div>
      </div>
    </div>
  </div>
</template>

<script>
const { app, shell } = require("electron").remote;

const fs = require("fs");
const path = require("path");
const userData = app.getPath("home");

import Database from "@/services/database";
const DatabaseService = new Database();

import { getVolumePath, storage_url } from "@/libs/helpers";

export default {
  created() {
    this.categories_tree = JSON.parse(
      fs.readFileSync(`${userData}/freedemy/categories.json`)
    );

    window.addEventListener("scroll", this.handleScroll);
    this.getCourseList();
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  watch: {
    $route(from, to) {
      this.getCourseList();
    },

    filter_topic() {
      this.courses = [];
      this.getCourseList();
    },

    filter_keywords() {
      this.courses = [];
      this.getCourseList();
    }
  },

  computed: {
    topics() {
      return this.categories_tree.categories.map(category => {
        return {
          category,
          topics: this.categories_tree.topics.filter(
            topic => topic.category_id == category.id
          )
        };
      });
    },

    hasMore() {
      return this.count > this.courses.length;
    }
  },

  data() {
    return {
      busy: false,
      loading: false,
      courses: [],
      filter_topic: null,
      filter_keywords: null,
      categories_tree: null,
      page: 0,
      limit: 300,
      count: null
    };
  },

  methods: {
    courseExists(course) {
      const course_folder_name = getVolumePath(course);

      return fs.existsSync(`${storage_url}/${course_folder_name}`);
    },

    openUrl(course) {
      shell.openExternal(course.url);
    },

    clear_filter(type) {
      this.page = 0;
      type == "filter_topic"
        ? (this.filter_topic = "")
        : (this.filter_keywords = "");
    },

    handleScroll(event) {
      if (this.busy == false && this.hasMore) {
        const scrollArea = window.innerHeight + window.scrollY + 15;
        if (scrollArea >= document.body.offsetHeight) {
          this.getCourseList();
        }
      }
    },

    getCourseList() {
      this.loading = true;
      this.busy = true;

      const keywords = this.filter_keywords;
      const topic = this.filter_topic;
      let query = {};

      if (keywords) {
        query = {
          filter: true,
          data: {
            table: "courses",
            keywords: {
              $regex: RegExp(keywords, "i")
            }
          }
        };
      }

      if (topic) {
        query = {
          filter: true,
          data: {
            table: "courses",
            "topic.title": topic.title
          }
        };
      }

      DatabaseService.getCourses(query, this.page, this.limit)
        .then(courses => {
          setTimeout(() => {
            this.page++;

            this.courses = [...this.courses, ...courses.data];
            this.count = courses.count;

            this.loading = false;
            this.busy = false;
          }, 100);
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    }
  }
};
</script>

<style scoped>
.wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.volume-missing {
  border: 1px solid red !important;
}

.selected-topic {
  background: #d9e4e4;
}
</style>
