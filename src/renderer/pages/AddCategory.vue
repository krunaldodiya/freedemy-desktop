<template>
  <div class="wrapper">
    <button type="submit" class="button is-primary" @click="saveTree"
                    :class="{'is-loading': loading}" :disabled="loading">Save</button>
    <div class="columns">
      <div class="column" style="border: 1px solid #ccc; margin: 1px">
        <input type="text" placeholder="Add Category" class="input" style="margin: 10px 0px" v-model="credentials.category" @keyup.enter.prevent="addCategory">
        <div v-for="(category, index) in categories_tree.categories" :key="index">
          <div v-text="category.title" :class="{'selected-category': category.id == selected_category.id}" class="category" @click="update_selected_category(category)"></div>
        </div>
      </div>
      <div class="column" style="border: 1px solid #ccc; margin: 1px">
        <input type="text" placeholder="Add Subcategory" class="input" style="margin: 10px 0px" v-model="credentials.subcategory" @keyup.enter.prevent="addSubCategory">
        <div v-for="(subcategory, index) in categories_tree.subcategories" :key="index" v-if="subcategory.category_id == selected_category.id">
          <div v-text="subcategory.title" :class="{'selected-subcategory': subcategory.id == selected_subcategory.id}" class="subcategory" @click="update_selected_subcategory(subcategory)"></div>
        </div>        
      </div>
      <div class="column" style="border: 1px solid #ccc; margin: 1px">
        <input type="text" placeholder="Add Topic" class="input" style="margin: 10px 0px" v-model="credentials.topic" @keyup.enter.prevent="addTopic">
        <div v-for="(topic, index) in categories_tree.topics" :key="index" v-if="selected_subcategory && topic.subcategory_id == selected_subcategory.id">
          <div :title="topic.id" v-text="topic.title" :class="{'selected-topic': topic.id == selected_topic.id}" class="topic" @click="update_selected_topic(topic)"></div>
        </div>        
      </div>
    </div>
  </div>
</template>

<script>
const { app } = require("electron").remote;
const randomstring = require("randomstring");
const fs = require("fs");
const path = require("path");

const userData = app.getPath("home");
const categories_tree = JSON.parse(
  fs.readFileSync(`${userData}/freedemy/categories.json`)
);

export default {
  created() {
    this.update_selected_category(this.categories_tree.categories[0]);
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
      categories_tree
    };
  },

  methods: {
    saveTree() {
      this.loading = true;

      fs.writeFile(
        `${userData}/freedemy/categories.json`,
        JSON.stringify(this.categories_tree),
        "utf8",
        error => {
          if (error) {
            this.loading = false;
          }

          this.loading = false;
        }
      );
    },

    addCategory() {
      if (!this.credentials.category.length) return;

      const category = {
        id: this.generateUID(),
        title: this.credentials.category
      };

      this.categories_tree.categories.push(category);
      this.update_selected_category(category);
      this.credentials.category = null;
    },

    addSubCategory() {
      if (!this.credentials.subcategory.length) return;

      const subcategory = {
        id: this.generateUID(),
        title: this.credentials.subcategory,
        category_id: this.selected_category.id
      };

      this.categories_tree.subcategories.push(subcategory);
      this.update_selected_subcategory(subcategory);
      this.credentials.subcategory = null;
    },

    addTopic() {
      if (!this.credentials.topic.length) return;

      const topic = {
        id: this.generateUID(),
        title: this.credentials.topic,
        category_id: this.selected_category.id,
        subcategory_id: this.selected_subcategory.id
      };

      this.categories_tree.topics.push(topic);
      this.update_selected_topic(topic);
      this.credentials.topic = null;
    },

    update_selected_category(category) {
      this.selected_category = category;

      const subcategories = this.selected_category
        ? this.categories_tree.subcategories.filter(
            subcategories =>
              subcategories.category_id == this.selected_category.id
          )
        : [];

      this.selected_subcategory = subcategories[0];

      const topics = this.selected_subcategory
        ? this.categories_tree.topics.filter(
            topic => topic.subcategory_id == this.selected_subcategory.id
          )
        : [];

      this.selected_topic = topics[0];
    },

    update_selected_subcategory(subcategory) {
      this.selected_subcategory = subcategory;

      const topics = this.selected_subcategory
        ? this.categories_tree.topics.filter(
            topic => topic.subcategory_id == this.selected_subcategory.id
          )
        : [];

      this.selected_topic = topics[0];
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