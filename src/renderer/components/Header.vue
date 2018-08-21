<template>
  <form class="form" @submit.prevent="search()">  
    <div class="field has-addons">
      <p class="control">
        <span class="select">
          <select class="select" name="type" v-model="type">
            <option value="keywords">Keywords</option>
            <option value="course_id">Course ID</option>
          </select>
        </span>
      </p>
      <p class="control is-expanded">
        <input class="input" type="text" placeholder="Search for Courses" 
              v-model="keywords" style="outline: none; box-shadow: none">
      </p>
      <p class="control">
        <a class="button search-button" @click.prevent="search()">
          Search
        </a>
      </p>
    </div>
  </form>
</template>

<script>
export default {
  created() {
    //
  },

  data() {
    return {
      type: this.$route.query.type || "keywords",
      keywords: this.$route.query.keywords || null
    };
  },

  watch: {
    $route(to, from) {
      this.keywords = to.query.keywords;
    }
  },

  methods: {
    search() {
      if (!this.keywords || this.keywords.length < 1) return;
      if (this.type == "course_id" && isNaN(this.keywords)) return;

      this.$router.push({
        name: "browse-course",
        query: {
          ...this.$route.query,
          keywords: this.keywords,
          type: this.type
        }
      });
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 12px;
  margin-right: 10px;
  padding-right: 10px;
  border-right: 1px solid grey;
  color: black;
}

.search-button {
  background: green;
  color: white;
}
</style>
