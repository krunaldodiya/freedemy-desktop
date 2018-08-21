<template>
  <div class="wrapper">
    <form class="form" @keydown="errors.clear($event.target.name)" @submit.prevent="addCourse">
        <div class="field">
            <label for="course_id" class="label">Course ID:</label>
            <div class="control">
                <input name="course_id" type="text" placeholder="1133488"
                :class="{ 'is-danger': errors.get('course_id') }" class="input" v-model="credentials.course_id">
                        <p class="help is-danger" v-if="errors.get('course_id')" v-text="errors.get('course_id')"></p>
            </div>
        </div>

        <div class="field">
            <label for="title" class="label">Course Title:</label>
            <div class="control">
                <input name="title" type="text" placeholder="Learn object oriented programming in Javascript"
                :class="{ 'is-danger': errors.get('title') }" class="input" v-model="credentials.title">
                        <p class="help is-danger" v-if="errors.get('title')" v-text="errors.get('title')"></p>
            </div>
        </div>

        <div class="field">
            <label for="image" class="label">Course Image:</label>
            <div class="control">
                <input name="image" type="text" placeholder="https://udemy-images.udemy.com/course/<SIZE>/<IMAGE>"
                :class="{ 'is-danger': errors.get('image') }" class="input" v-model="credentials.image">
                        <p class="help is-danger" v-if="errors.get('image')" v-text="errors.get('image')"></p>
            </div>
        </div>

        <div class="field">
            <label for="url" class="label">Course URL:</label>
            <div class="control">
                <input name="url" type="text" placeholder="https://www.udemy.com/<URL>"
                :class="{ 'is-danger': errors.get('url') }" class="input" v-model="credentials.url">
                        <p class="help is-danger" v-if="errors.get('url')" v-text="errors.get('url')"></p>
            </div>
        </div>

        <div class="field columns" style="margin-top: 20px">
            <div class="column is-1">
                <button type="submit" class="button is-primary" 
                    :class="{'is-loading': loading}" :disabled="loading">Add Course</button>
            </div>
        </div>
    </form>
  </div>
</template>

<script>
import ValidationErrors from "@/libs/validation-errors";

import Database from "@/services/database";
const DatabaseService = new Database();

export default {
  data() {
    return {
      loading: false,
      credentials: {
        course_id: "",
        title: "",
        image: "",
        url: ""
      },
      errors: new ValidationErrors()
    };
  },

  methods: {
    addCourse() {
      this.loading = true;

      const udemy_course = this.credentials;
      const course = {
        course_id: udemy_course.course_id,
        image: udemy_course.image,
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
          this.errors.record(error);
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