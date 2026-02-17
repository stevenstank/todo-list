// Todo class and related logic
class Todo {
  constructor({ id, title, description, dueDate, priority, notes = '', checklist = [], completed = false }) {
    this.id = id || crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = completed;
  }
}

export default Todo;
