<template>
  <div class="wrapper">
    <div class="columns">
      <div class="column is-2">
        <div style="padding: 10px">
          Categories
        </div>
      </div>
      <div class="column is-10">
        <div style="padding: 10px" v-if="loading">Please wait, loading...</div>

        <div class="columns is-multiline is-12" style="margin: 0px; padding: 10px; list-style: none;" v-if="courses.length">
          <div class="column is-2" v-for="(course, index) in courses" :key="index" v-if="!loading" style="padding: 0px">
            <div style="border: 1px solid #ccc; margin: 1px">
              <div>
                <div style="padding: 5px">
                  <img :src="course.image_480x270" :alt="course.title">
                </div>
                <div style="padding: 0px 10px">
                  <div style="margin-top: 5px; font-size: 12px; color: #202020; font-weight: bold; text-transform: uppercase; height: 80px" v-text="course.title"></div>
                </div>
                <div style="padding: 0px 10px">
                  <div style="margin-top: 5px; font-size: 12px; color: indigo; height: 60px">https://www.udemy.com{{course.url}}</div>
                </div>
              </div>
              <button type="button" class="button is-primary is-small is-fullwidth" :class="{'is-loading': loading}" :disabled="loading" @click="addCourse(course)">
                Add Course
              </button>
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

import Udemy from "@/services/udemy";
const UdemyService = new Udemy();

export default {
  created() {
    this.loadCourse();
  },

  data() {
    return {
      loading: false,
      courses: []
    };
  },

  watch: {
    $route(to, from) {
      this.loadCourse();
    }
  },

  methods: {
    loadCourse() {
      this.loading = true;

      UdemyService.getCourseList(this.$route.query)
        .then(response => {
          this.loading = false;

          if (response.data.hasOwnProperty("results")) {
            this.courses = response.data.results;
          } else {
            this.courses = [response.data];
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    addCourse(udemy_course) {
      this.loading = true;

      const course = {
        course_id: udemy_course.id,
        image: udemy_course.image_480x270,
        title: udemy_course.title,
        url: udemy_course.url
      };

      DatabaseService.addCourse(course)
        .then(() => {
          this.loading = false;
          this.$router.push(`/course/manage?course_id=${course.course_id}`);
        })
        .catch(error => {
          this.loading = false;
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
