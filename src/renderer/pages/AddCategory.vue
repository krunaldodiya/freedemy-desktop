<template>
  <div class="wrapper">
    <div class="columns">
      <div class="column" style="border: 1px solid #ccc; margin: 1px">
        <input type="text" placeholder="Add Category" class="input" style="margin-bottom: 10px" v-model="credentials.category" @keyup.enter.prevent="addCategory">
        <div v-for="(category, index) in tree.categories" :key="index">
          <div v-text="category.title" :class="{'selected-category': category.id == selected_category.id}" class="category" @click="update_selected_category(category)"></div>
        </div>
      </div>
      <div class="column" style="border: 1px solid #ccc; margin: 1px">
        <input type="text" placeholder="Add Subcategory" class="input" style="margin-bottom: 10px" v-model="credentials.subcategory" @keyup.enter.prevent="addSubCategory">
        <div v-for="(subcategory, index) in tree.subcategories" :key="index" v-if="subcategory.category_id == selected_category.id">
          <div v-text="subcategory.title" :class="{'selected-subcategory': subcategory.id == selected_subcategory.id}" class="subcategory" @click="update_selected_subcategory(subcategory)"></div>
        </div>        
      </div>
      <div class="column" style="border: 1px solid #ccc; margin: 1px">
        <input type="text" placeholder="Add Topic" class="input" style="margin-bottom: 10px" v-model="credentials.topic" @keyup.enter.prevent="addTopic">
        <div v-for="(topic, index) in tree.topics" :key="index" v-if="topic.subcategory_id == selected_subcategory.id">
          <div v-text="topic.title" :class="{'selected-topic': topic.id == selected_topic.id}" class="topic" @click="update_selected_topic(topic)"></div>
        </div>        
      </div>
    </div>
  </div>
</template>

<script>
const randomstring = require("randomstring");
const fs = require("fs");
const category_tree = require("@/assets/json/categories.json");

export default {
  created() {
    this.update_selected_category(this.tree.categories[0]);
  },

  data() {
    return {
      loading: false,
      selected_category: null,
      selected_subcategory: null,
      selected_topic: null,
      credentials: {
        category: null,
        subcategory: null,
        topic: null
      },
      tree: category_tree
    };
  },

  methods: {
    addCourse() {
      this.loading = true;

      const json = JSON.stringify(this.tree);
      fs.writeFile(category_tree, json, "utf8", callback);
    },

    addCategory() {
      this.tree.categories.push({
        id: this.generateUID(),
        title: this.credentials.category
      });

      this.credentials.category = null;
    },

    addSubCategory() {
      this.tree.subcategories.push({
        id: this.generateUID(),
        title: this.credentials.subcategory,
        category_id: this.selected_category.id
      });

      this.credentials.subcategory = null;
    },

    addTopic() {
      this.tree.topics.push({
        id: this.generateUID(),
        title: this.credentials.topic,
        category_id: this.selected_category.id,
        subcategory_id: this.selected_subcategory.id
      });

      this.credentials.topic = null;
    },

    update_selected_category(category) {
      this.selected_category = category;
      this.selected_subcategory = this.tree.subcategories.filter(
        subcategories => subcategories.category_id == this.selected_category.id
      )[0];
      this.selected_topic = this.tree.topics.filter(
        topic => topic.subcategory_id == this.selected_subcategory.id
      )[0];
    },

    update_selected_subcategory(subcategory) {
      this.selected_subcategory = this.tree.subcategories.filter(
        sc => sc.id == subcategory.id
      )[0];
      this.selected_topic = this.tree.topics.filter(
        topic => topic.subcategory_id == this.selected_subcategory.id
      )[0];
    },

    update_selected_topic(topic) {
      this.selected_topic = topic;
    },

    generateUID() {
      return randomstring.generate({
        length: 12,
        charset: "numeric"
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

.category {
  background: skyblue;
  color: black;
  padding: 5px;
  cursor: pointer;
}

.selected-category {
  background: indigo;
  color: white;
}

.subcategory {
  background: skyblue;
  color: black;
  padding: 5px;
  cursor: pointer;
}

.selected-subcategory {
  background: indigo;
  color: white;
}

.topic {
  background: skyblue;
  color: black;
  padding: 5px;
  cursor: pointer;
}

.selected-topic {
  background: indigo;
  color: white;
}
</style>