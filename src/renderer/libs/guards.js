import db from "../libs/database";
import { server_url } from "./helpers";
const fs = require("fs");

const checkStorage = (to, from, next) => {
  const course_id = parseInt(to.params.course_id);

  db.findOne({ table: "courses", course_id }, (err, doc) => {
    if (doc) {
      const course_directory = server_url + doc.volume_path;
      const isDirectory = fs.lstatSync(course_directory).isDirectory();
      if (isDirectory) {
        next();
      } else {
        next(`/course/manage?course_id=${course_id}&error=no_volume`);
      }
    } else {
      next(`/course/manage?course_id=${course_id}&error=no_volume`);
    }
  });
};

export { checkStorage };
