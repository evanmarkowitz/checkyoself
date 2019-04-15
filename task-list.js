class TaskList {
  constructor(id, title, taskItems, urgent,){
    this.id = id;
    this.title = title;
    this.taskItems = taskItems || [];
    this.urgent = urgent || false;
  }
  saveToLocalStorage() {
    var stringifiedTasks = JSON.stringify(tasks);
    localStorage.setItem('tasks', stringifiedTasks)
  }
  deleteFromStorage(taskLocation) {
    return tasks.splice(taskLocation, 1);
    var stringifiedTasks = JSON.stringify(tasks);
    localStorage.setItem('tasks', stringifiedTasks)
  }
  updateToDo(){
    this.urgent = !this.urgent
  }
  updateTask(i){
    this.taskItems[i].checked = !this.taskItems[i].checked;
  }
}

class TaskItem {
  constructor(id, item, checked,){
  this.id = id
  this.item = item;
  this.checked = checked || false;
  }
}