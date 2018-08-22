<template>
  <div class="columns is-12" style="padding: 20px; background: #444" v-if="!loading">      
    <div class="column is-3" style="overflow: auto; max-height: 730px;">
      <ul style="margin: 0px; list-style: none;">
        <li v-for="(section, index) in tree" :key="index">
          <div style="background: black; color: white; padding: 10px" v-text="section.section"></div>
  
          <ul style="margin: 0px; list-style: none;">
            <li :class="{selected: lecture.lecture == selected_lecture}" v-for="(lecture, index) in section.courses" :key="index" @click='browse(lecture)'>
              <div class="lecture" style="color: black; padding: 10px 20px" v-text="lecture.lecture"></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="column is-9" style="padding: 20px">
      <div style="margin: 5px 10px 10px 5px">
        <div class="level" style="margin: 0px; padding: 0px">
          <div class="level-left">
            <h1 class="title" style="color: white; font-size: 22px" v-text="course.title"></h1>            
          </div>
          <div class="level-right">
            <router-link :to="`/course/manage?course_id=${course.course_id}`" style="padding-left: 5px; color: white">
              <font-awesome-icon icon="cog" />
            </router-link>
          </div>
        </div>
      </div>
      <div class="player-wrapper">
        <Player v-if="load_video" :file="file" :poster="course.image"/>
      </div>
    </div>
  </div>
</template>

<script>
import Player from "@/components/Player.vue";
import Database from "@/services/database";

const DatabaseService = new Database();
const fs = require("fs");
const path = require("path");
const extensions = [".mp4", ".m4v", ".html", ".txt", ".pdf"];

export default {
  components: {
    Player
  },

  created() {
    const course_id = this.$route.params.course_id;

    this.loading = true;
    this.load_video = true;

    DatabaseService.getCourseByCourseId(course_id)
      .then(course => {
        this.course = course;

        DatabaseService.getVolumeByCourseId(course_id)
          .then(volume => {
            this.loading = false;
            this.volume = volume;
          })
          .catch(e => {
            this.loading = false;
            console.log(e);
          });
      })
      .catch(e => {
        this.loading = false;
        console.log(e);
      });
  },

  computed: {
    selected_lecture() {
      const initial_course = this.tree[0]["courses"][0];
      return this.$route.query.lecture
        ? this.$route.query.lecture
        : initial_course.lecture;
    },

    selected_section() {
      const initial_course = this.tree[0]["courses"][0];
      return this.$route.query.section
        ? this.$route.query.section
        : initial_course.section;
    },

    file() {
      const file_path = path.join(
        this.volume.volume_path,
        this.selected_section,
        this.selected_lecture
      );
      return "file://" + encodeURI(file_path);
    },

    tree() {
      if (this.loading) {
        return [];
      }

      const course_directory_path = this.volume.volume_path;
      const tree = [];

      fs
        .readdirSync(course_directory_path)
        .forEach((section, section_index) => {
          const section_path = course_directory_path + "/" + section;
          const isDirectory = fs.lstatSync(section_path).isDirectory();

          if (isDirectory) {
            tree.push({ section, section_index, courses: [] });

            fs
              .readdirSync(course_directory_path + "/" + section)
              .forEach(lecture => {
                const lecture_path = section_path + "/" + lecture;
                const isDirectory = fs.lstatSync(lecture_path).isDirectory();
                const ext = path.extname(lecture_path);

                if (!isDirectory && extensions.indexOf(ext) > -1) {
                  tree.forEach(section => {
                    if (section.section_index == section_index) {
                      section.courses.push({
                        section: section.section,
                        lecture: lecture
                      });
                    }
                  });
                }
              });
          }
        });

      return tree;
    }
  },

  methods: {
    browse(lecture) {
      this.$router.push({
        name: "show-course-detail",
        query: {
          ...this.$route.query,
          section: lecture.section,
          lecture: lecture.lecture
        }
      });

      this.load_video = false;
      setTimeout(() => {
        this.load_video = true;
      }, 1000);
    }
  },

  data() {
    return {
      loading: false,
      load_video: false,
      course: null,
      volume: null
    };
  }
};
</script>

<style scoped>
.wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.player-wrapper {
  background: #444;
  width: 100%;
}

li > ul > li {
  cursor: pointer;
}

li > .lecture {
  background: whitesmoke !important;
}

li.selected > .lecture {
  background: cyan !important;
}
</style>
