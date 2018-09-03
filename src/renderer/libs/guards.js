import db from "../libs/database";
const fs = require("fs");

const checkStorage = (to, from, next) => {
  const course_id = parseInt(to.params.course_id);

  db.findOne({ table: "storage" }, (err, storage) => {
    db.findOne({ table: "courses", course_id }, (err, doc) => {
      if (doc) {
        const storage_url = storage.volume_path;
        const course_directory = `${storage_url}/${doc.volume_path}`;
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
  });
};

const checkRootStorage = (to, from, next) => {
  db.findOne({ table: "storage" }, (err, doc) => {
    if (doc) {
      next();
    } else {
      next("/settings");
    }
  });
};

export { checkStorage, checkRootStorage };
