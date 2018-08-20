<template>
  <div class="wrapper">
    <div v-if="!courses.length">Please wait, loading...</div>
    <div class="columns is-multiline is-12" style="margin: 0px; list-style: none;" v-if="courses.length">
      <div class="column is-2" v-for="(course, index) in courses" :key="index" v-if="!loading">
        <div style="border: 1px solid #ccc; margin: 1px">
          <div>
            <div style="padding: 5px">
              <img :src="course.image_480x270" :alt="course.title">
            </div>
            <div style="padding: 0px 10px">
              <div style="margin-top: 5px; font-size: 12px; color: #202020; font-weight: bold; text-transform: uppercase; height: 70px" v-text="course.title"></div>
            </div>
          </div>
          <button type="button" class="button is-primary is-small is-fullwidth" :class="{'is-loading': loading}" :disabled="loading" @click="addCourse(course)">
            Add Course
          </button>
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

      UdemyService.getCourseList(this.$route.query.keywords)
        .then(response => {
          this.loading = false;
          this.courses = response.data.results;
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
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.form {
  margin: 10px;
}
</style>
