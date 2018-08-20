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
      path: "/course/add",
      name: "add-course",
      component: require("@/pages/BrowseCourses").default
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
