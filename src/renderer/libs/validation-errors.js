export default class ValidationErrors {
  constructor() {
    this.errors = {};
  }

  has() {
    return this.errors.hasOwnProperty;
  }

  get(field) {
    if (this.errors[field]) {
      return this.errors[field];
    }
  }

  record(errors) {
    const errorEntity = {};

    errors.forEach(error => {
      errorEntity[error.field] = error.message;
    });

    this.errors = errorEntity;
  }

  clear(field) {
    delete this.errors[field];
  }
}
