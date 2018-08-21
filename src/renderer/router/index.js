import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// guards
import { checkStorage } from "@/libs/guards";

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "home",
      component: require("@/pages/Home").default
    },

    {
      path: "/course/browse",
      name: "browse-course",
      component: require("@/pages/BrowseCourses").default
    },

    {
      path: "/course/add",
      name: "add-course",
      component: require("@/pages/AddCourse").default
    },

    {
      path: "/course/manage",
      name: "manage-course",
      component: require("@/pages/ManageCourse").default
    },

    {
      path: "/course/detail/:course_id",
      name: "show-course-detail",
      component: require("@/pages/Course").default,
      beforeEnter(to, from, next) {
        return checkStorage(to, from, next);
      }
    },

    {
      path: "/category/add",
      name: "add-category",
      component: require("@/pages/AddCategory").default
    },

    {
      path: "/settings",
      name: "settings",
      component: require("@/pages/Settings").default
    },

    {
      path: "*",
      redirect: "/"
    }
  ]
});
