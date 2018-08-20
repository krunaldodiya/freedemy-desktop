<template>
  <div class="columns">
    <div class="column is-6" style="margin: 10px 0">
      <div class="form">
        <div class="field">
          <div class="control">
              <img :src="course.image" :alt="course.title">
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div v-text="course.title" style="font-size: 22px"></div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <span v-text="course.url" style="font-size: 14px; color: indigo; cursor: pointer"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-6" style="margin: 20px 0">
      <div class="field is-grouped">
        <p class="control">
          <a class="button is-link" @click.prevent="addVolume" :class="{'is-loading': adding_volume}" :disabled="adding_volume">
            <span v-if="volume.volume_path.length">Change Volume</span>    
            <span v-if="!volume.volume_path.length">Add Volume</span>    
          </a>
        </p>
        <p class="control">
          <a class="button is-danger" @click.prevent="deleteCourse($route.query.course_id)" :class="{'is-loading': deleting_course}" :disabled="deleting_course">
            Delete Course
          </a>
        </p>
      </div>

      <div v-if="$route.query.error == 'no_volume' && !adding_volume" style="color: red">
        Please, add a volume.
      </div>
      
      <div style="border: 1px solid #ccc; padding: 5px" v-if="volume.volume_path.length">
        <div v-for="(volume, index) in volume.volume_path.split('/')" :key="index">
          <div v-if="index > 0" style="font-size: 12px; font-weight: 400; font-family: tahoma; padding: 2px">
            > {{ volume }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { dialog } = require("electron").remote;
import ValidationErrors from "@/libs/validation-errors";
import Database from "@/services/database";
const DatabaseService = new Database();

export default {
  created() {
    this.loadCourse();
  },

  data() {
    return {
      loading: false,
      adding_volume: false,
      deleting_course: false,
      course: {
        table: "courses",
        title: "",
        url: "",
        image: ""
      },
      volume: {
        table: "volumes",
        volume_path: ""
      },
      errors: new ValidationErrors()
    };
  },

  watch: {
    $route(to, from) {
      this.loadCourse();
    }
  },

  methods: {
    loadCourse() {
      const course_id = this.$route.query.course_id;

      if (course_id) {
        this.loading = true;

        DatabaseService.getCourseByCourseId(course_id)
          .then(course => {
            this.course = course;

            DatabaseService.getVolumeByCourseId(course_id)
              .then(volume => {
                this.loading = false;
                if (volume) {
                  this.volume = volume;
                }
              })
              .catch(e => {
                this.loading = false;
              });
          })
          .catch(e => {
            this.loading = false;
          });
      }
    },

    deleteCourse(course_id) {
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
      const path = dialog.showOpenDialog({ properties: ["openDirectory"] });
      const volume_path = path[0];

      DatabaseService.addVolumeToCourse(course_id, volume_path)
        .then(data => {
          this.adding_volume = false;
          return this.$router.push(`/course/detail?course_id=${course_id}`);
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
