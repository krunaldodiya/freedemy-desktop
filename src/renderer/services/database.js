import db from "../libs/database";

export default class Database {
  getAllCourses() {
    return new Promise((resolve, reject) => {
      db.find({ table: "courses" }, (err, docs) => {
        if (err) {
          return reject(err);
        }

        return resolve({
          data: docs,
          count
        });
      });
    });
  }

  getCourses(query, page, limit) {
    const skip = page * limit;

    return new Promise((resolve, reject) => {
      db.count(query, (err, count) => {
        if (query.filter) {
          db.find(query.data, (err, docs) => {
            if (err) {
              return reject(err);
            }

            return resolve({
              data: docs,
              count
            });
          });
        }

        db.find(query.data)
          .sort({ title: 1 })
          .skip(skip)
          .limit(limit)
          .exec((err, docs) => {
            if (err) {
              return reject(err);
            }

            return resolve({
              data: docs,
              count
            });
          });
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

  renameVolume(course, new_volume_path) {
    return new Promise((resolve, reject) => {
      db.update(
        { course_id: course.course_id, table: "courses" },
        {
          $set: {
            volume_path: new_volume_path
          }
        },
        { upsert: true },
        (err, doc) => {
          if (err) {
            return reject(err);
          }

          db.findOne(
            { table: "courses", course_id: course.course_id },
            (err, doc) => {
              if (err) {
                return reject(err);
              }

              return resolve(doc);
            }
          );
        }
      );
    });
  }

  deleteCourse(course_id) {
    course_id = parseInt(course_id);

    return new Promise((resolve, reject) => {
      db.remove({ table: "courses", course_id }, (err, numRemoved) => {
        if (err) {
          return reject(err);
        }

        return resolve(numRemoved);
      });
    });
  }

  updateVolumePath(course_id, volume_path) {
    course_id = parseInt(course_id);

    return new Promise((resolve, reject) => {
      db.update(
        { table: "courses", course_id },
        { $set: { volume_path } },
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

  validation(data, rules) {
    return Object.keys(data)
      .filter(key => {
        if (rules.hasOwnProperty(key)) {
          return !data[key].toString().length;
        }

        return false;
      })
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
      course_id: parseInt(credentials.course_id),
      url: udemy_url + credentials.url,
      table: "courses"
    };

    const selector = { table: data.table, course_id: data.course_id };

    return new Promise((resolve, reject) => {
      const isInvalid = this.validation(credentials, {
        course_id: "required",
        title: "required",
        image: "required",
        url: "required"
      });

      if (isInvalid.length) {
        return reject(isInvalid);
      }

      db.update(selector, { $set: data }, { upsert: true }, (err, numRows) => {
        if (err) {
          return reject(err);
        }

        return resolve(numRows);
      });
    });
  }

  saveTopic(course, category, subcategory, topic) {
    return new Promise((resolve, reject) => {
      db.update(
        { course_id: course.course_id, table: "courses" },
        {
          $set: {
            keywords: `${course.title} ${topic.title}`,
            category,
            subcategory,
            topic
          }
        },
        {},
        (err, numReplaced) => {
          if (err) {
            return reject(err);
          }

          return resolve(numReplaced);
        }
      );
    });
  }
}
