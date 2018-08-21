<template>
  <div class="wrapper">
    <div class="columns">
      <div class="column is-2" style="padding: 0px">
        <div class="field" style="margin-top: 20px; margin-left: 20px">
          <div class="control">
            <input type="text" placeholder="Filter Courses" class="input" v-model="filter">
          </div>
        </div>
      </div>
      <div class="column is-10">
        <div style="padding: 10px" v-if="!courses.length">No course added yet.</div>

        <div v-if="courses.length" style="padding: 10px">({{ courses.length }}) courses available.</div>

        <div class="columns is-multiline is-12" style="margin: 0px; padding: 10px; list-style: none" v-if="courses.length">
          <div class="column is-2" v-for="(course, index) in courses" :key="index" style="padding: 0px">
            <div style="border: 1px solid #ccc; margin: 1px">
              <router-link :to="`/course/manage?course_id=${course.course_id}`">
                <div style="margin-top: 3px; margin-left: 5px">
                  <font-awesome-icon icon="cog" />
                </div>
              </router-link>
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

  data() {
    return {
      loading: true,
      courses: [],
      filter: null
    };
  },

  methods: {
    getCourseList() {
      const keywords = this.filter;

      const query = {
        table: "courses"
      };

      if (keywords) {
        query["title"] = {
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
