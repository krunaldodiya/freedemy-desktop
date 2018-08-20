<template>
    <form class="form" @submit.prevent="search()">  
        <div class="field has-addons search">
            <p class="control is-expanded">
                <input class="input" type="text" placeholder="Search for Courses" 
                v-model="keywords" style="outline: none; box-shadow: none">
            </p>

            <p class="control">
                <button type="submit" class="button search-button">
                  Search
                </button>
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
      keywords: this.$route.query.keywords
    };
  },

  methods: {
    search() {
      if (this.keywords.length < 1) return;

      this.$router.push({
        name: this.$route.name === "add-course" ? "add-course" : "home",
        query: {
          ...this.$route.query,
          keywords: this.keywords
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
