<template>
  <div class="wrapper">
    <div class="columns">
      <div class="column is-2" style="padding: 0px">
        <div class="field" style="margin-top: 20px; margin-left: 20px">
          <div class="control">
            <input type="text" placeholder="Filter Courses" class="input" v-model="filter">
          </div>

          <div style="padding: 5px; margin-top: 5px; font-size: 10px; text-transform: uppercase; cursor: pointer" v-if="filter" @click="filter = ''">clear filters</div>
          <div style="padding: 10px; max-height: 650px; overflow: auto; border: 1px solid #e2dbdb; margin-top: 5px; padding: 0px">
            <div v-for="(topic, index) in topics" :key="index" style="padding: 5px">
              <div v-text="topic" @click="filter = topic" style="color: blue; cursor: pointer"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-10">
        <div style="padding: 10px" v-if="!courses.length">No course added yet.</div>

        <div v-if="courses.length" style="padding: 10px">({{ courses.length }}) courses available.</div>

        <div class="columns is-multiline is-12" style="margin: 0px; padding: 10px; list-style: none" v-if="courses.length">
          <div class="column is-2" v-for="(course, index) in courses" :key="index" style="padding: 0px">
            <div style="border: 1px solid #e2dbdb; margin: 3px; padding-top: 5px; background: whitesmoke; box-shadow: 1px 1px #e2dbdb;">
              <div class="level" style="margin: 0px">
                <div class="level-left">
                <router-link :to="`/course/manage?course_id=${course.course_id}`" style="padding-left: 5px; color: blue">
                  <font-awesome-icon icon="cog" />
                </router-link>
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
      </div>
    </div>
  </div>
</template>

<script>
import Database from "@/services/database";
const DatabaseService = new Database();
const tree = require("@/assets/json/categories.json");

export default {
  created() {
    this.getCourseList();
  },

  watch: {
    $route(from, to) {
      this.getCourseList();
    },

    filter() {
      this.getCourseList();
    }
  },

  computed: {
    topics() {
      return [...new Set(this.tree.topics.map(topic => topic.title))];
    }
  },

  data() {
    return {
      loading: true,
      courses: [],
      filter: null,
      tree
    };
  },

  methods: {
    getCourseList() {
      const keywords = this.filter;

      const query = {
        table: "courses"
      };

      if (keywords) {
        query["keywords"] = {
          $regex: RegExp(keywords, "i")
        };
      }

      DatabaseService.getCourses(query)
        .then(courses => {
          this.loading = false;
          this.courses = courses;
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
</style>
