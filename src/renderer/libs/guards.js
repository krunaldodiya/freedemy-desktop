import db from "../libs/database";
const fs = require("fs");

const checkStorage = (to, from, next) => {
  const course_id = parseInt(to.params.course_id);

  db.findOne({ table: "volumes", course_id }, (err, doc) => {
    if (doc) {
      const isDirectory = fs.lstatSync(doc.volume_path).isDirectory();
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
