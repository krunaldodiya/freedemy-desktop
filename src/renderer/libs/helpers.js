export const getVolumePath = course => {
  const data = course.url.split("/");
  const index = data.length - 2;
  return course.course_id + " - " + data[index];
};

export const server_url = "/Volumes/SAMSUNG/Media/udemy/";
