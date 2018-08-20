import db from "../libs/database";

export default class Database {
  getCourses(query) {
    return new Promise((resolve, reject) => {
      db.find(query, (err, docs) => {
        if (err) {
          return reject(err);
        }

        return resolve(docs);
      });
    });
  }

  getCourseByCourseId(course_id) {
    course_id = parseInt(course_id);

    return new Promise((resolve, reject) => {
      db.findOne({ table: "courses", course_id }, (err, doc) => {
        if (err) {
          return reject(err);
        }

        return resolve(doc);
      });
    });
  }

  getVolumeByCourseId(course_id) {
    course_id = parseInt(course_id);

    return new Promise((resolve, reject) => {
      db.findOne({ table: "volumes", course_id }, (err, doc) => {
        if (err) {
          return reject(err);
        }

        return resolve(doc);
      });
    });
  }

  deleteCourse(course_id) {
    course_id = parseInt(course_id);

    return new Promise((resolve, reject) => {
      db.remove({ table: "courses", course_id }, (err, numRemoved) => {
        if (err) {
          return reject(err);
        }

        db.remove({ table: "volumes", course_id }, (err, numRemoved) => {
          if (err) {
            return reject(err);
          }

          return resolve(numRemoved);
        });
      });
    });
  }

  addVolumeToCourse(course_id, volume_path) {
    course_id = parseInt(course_id);

    return new Promise((resolve, reject) => {
      db.update(
        { table: "volumes", course_id },
        { table: "volumes", course_id, volume_path },
        { upsert: true },
        (err, doc) => {
          if (err) {
            return reject(err);
          }

          return resolve(doc);
        }
      );
    });
  }

  validation(data) {
    return Object.keys(data)
      .filter(key => !data[key].length)
      .map(key => {
        return {
          field: key,
          message: `${key} field is required`
        };
      });
  }

  addCourse(credentials) {
    const udemy_url = "https://www.udemy.com";
    const data = {
      ...credentials,
      url: udemy_url + credentials.url,
      table: "courses"
    };
    const selector = { table: data.table, course_id: data.course_id };

    return new Promise((resolve, reject) => {
      db.update(selector, data, { upsert: true }, (err, numRows) => {
        if (err) {
          return reject(err);
        }

        return resolve(numRows);
      });
    });
  }
}
