// Project class and related logic
class Project {
  constructor({ id, name, todos = [] }) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.todos = todos;
  }
}

export default Project;
