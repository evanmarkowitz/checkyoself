var tasks =[];
var taskItems =[];
var taskTitleInput = document.querySelector('#task-title-input');
var taskItemInput = document.querySelector('.task-item-input');
var newTaskItemsSection = document.querySelector('.new-task-items-section');
var addTaskItemButton = document.querySelector('.add-task-item-button');
var makeTaskListButton = document.querySelector('.make-task-list-button');
var deleteCardImage = document.querySelector('.delete-card-img');
var clearAllButton = document.querySelector('.clear-all-button');
var filterUrgencyButton = document.querySelector('.filter-urgency-button');
var searchInput = document.querySelector('.search-input');
var searchButton = document.querySelector('.search-img')
var column1 = document.querySelector('.column-1');
var column2 = document.querySelector('.column-2');

column2.addEventListener('click', changeUrgent);
addTaskItemButton.addEventListener('click', makeTaskItems);
makeTaskListButton.addEventListener('click', makeNewTaskList);
column1.addEventListener('click', removeUncommitedTaskItem);
column2.addEventListener('click', deleteCard);
clearAllButton.addEventListener('click', clearAll);
column2.addEventListener('click', taskItemUpdate);
column1.addEventListener('keyup', disableTaskListButton);
taskTitleInput.addEventListener('keyup', enableTaskList);
filterUrgencyButton.addEventListener('click', filterUrgent);
searchInput.addEventListener('keyup', searchTasks);
searchButton.addEventListener('click', displaySearchMbl)

retrieveTasks();
defaultMessage();

makeTaskListButton.disabled = true;
addTaskItemButton.disabled = true;


function makeNewTaskList(e) {
  var newTaskList = new TaskList(Date.now(), taskTitleInput.value, taskItems, false);
  tasks.push(newTaskList);
  newTaskList.saveToLocalStorage()
  removeNewTaskFromDom(e)
  newTaskListCard(newTaskList);
  taskItems =[];
  makeTaskListButton.disabled = true;
  removeDefaultMessage()
}

function newTaskListCard(newTaskList) {
  var urgentImg;
  newTaskList.urgent ? urgentImg = 'images/urgent-active.svg' : urgentImg = 'images/urgent.svg';
  column2.insertAdjacentHTML('afterbegin', `
    <article class="card" data-id="${newTaskList.id}">
      <header class="card-header">${newTaskList.title}</header>
        <ul class="card-tasks">
          ${newListItems(newTaskList)} 
        </ul>
        <div class="card-footer">
          <div class="card-footer-sides">
            <img class ="card-urgent-img" src="${urgentImg}">
            <span id="urgent-card-text"><p>Urgent</p></span>
          </div>
          <div class="card-footer-sides">
            <img class="delete-card-img" src="images/delete.svg">
            <p>Delete</p>
          </div>
        </div>
    </article> 
  `)
  if (newTaskList.urgent === true){
    addClassList('.card', 'urgent-yellow');
    addClassList('#urgent-card-text', 'urgent-card-text');
    addClassList('.card-tasks', 'urgent-yellow-borders');
  } 
}

function addClassList(targetLocation, classListName) {
  var location = (document.querySelector(targetLocation));
  location.classList.add(classListName);
}

function newListItems(newTaskList){
  var taskItemsIteration =""
  for (var i = 0; i < newTaskList.taskItems.length; i++){
    taskItemsIteration +=
      `<li> <input type="checkbox" class="list-item-checkbox" data-id="${newTaskList.taskItems[i].id}" 
      id="${newTaskList.taskItems[i].id}" ${newTaskList.taskItems[i].checked ? 'checked' : ''}/>
      <label for="${newTaskList.taskItems[i].id}"">${newTaskList.taskItems[i].item}</label></li>` 
  } 
  return taskItemsIteration;
}

function removeNewTaskFromDom(e){
  taskTitleInput.value = ""
  var uncommitedTasks = document.querySelectorAll(".uncommited-task-line");
  uncommitedTasks.forEach(function(element) {
  element.remove();
  })
}

function findId(e) {
  var targetedCard = e.target.closest(".card");
  var targetedId = parseInt(targetedCard.getAttribute('data-id'));
  var taskLocation = tasks.findIndex(i => i.id === targetedId);
  return taskLocation
}

function makeTaskItems (e) {
  newTaskItemsSection.insertAdjacentHTML('beforeend', 
    `<div class="uncommited-task-line"><img class="delete-image" src="images/delete.svg">
    <p class="uncommited-task-items">${taskItemInput.value}</p></div>`);
  var newTaskItem = new TaskItem(Date.now(), taskItemInput.value, false);
  taskItems.push(newTaskItem);
  taskItemInput.value = "";
  addTaskItemButton.disabled = true;
  if (taskTitleInput.value.length > 0 ) {
    makeTaskListButton.disabled = false;
  }
}

function removeUncommitedTaskItem(e) {
  if (e.target.className === "delete-image") {
    var closestLine = e.target.closest(".uncommited-task-line");
    var indexToBeRemoved = taskItems.indexOf(closestLine.childNodes[1].innerText);
    taskItems.splice(indexToBeRemoved, 1);
    closestLine.remove();
  }
}

function retrieveTasks() {
  var retrievedTasks = localStorage.getItem("tasks");
  var parsedTasks = JSON.parse(retrievedTasks);
  for (var i = 0; i < parsedTasks.length; i++) {
    var newTaskList = new TaskList (parsedTasks[i].id, parsedTasks[i].title, parsedTasks[i].taskItems,  parsedTasks[i].urgent);
    tasks.push(newTaskList);
    newTaskListCard(newTaskList);
  }
}

function deleteCard(e) {
  if (e.target.className === "delete-card-img") {
    var taskLocation = findId(e)
    var key = tasks[taskLocation].taskItems.findIndex(i => i.checked === false)
    if (key === -1) {
    } else {
      return 
    }
    e.target.closest(".card").remove();
    tasks[taskLocation].deleteFromStorage(taskLocation);
    var stringifiedTasks = JSON.stringify(tasks);
    localStorage.setItem('tasks', stringifiedTasks)
  }
}

function defaultMessage() {
  if(tasks.length === 0){
    column2.insertAdjacentHTML("afterbegin", `<h1 class="default-message">Add a task!</h1>`);
  }
}
function removeDefaultMessage() {
  var defaultMessage = document.querySelector(".default-message");
  defaultMessage.remove();
}

function clearAll(e) {
  if (taskTitleInput.length === 0 && taskItemInput.length === 0) {
    clearAllButton.disabled = true;
    } else if (e.target === clearAllButton) {
    clearDom()
    var uncommitedTasks = document.querySelectorAll(".uncommited-task-line");
    taskItems =[];
    uncommitedTasks.forEach(function(element) {
    element.remove();
  })
  }
}

function clearDom() {
  taskTitleInput.value = "";
  taskItemInput.value = "";
  makeTaskListButton.disabled = true;
  addTaskItemButton.disabled = true;
}

function changeUrgent(e) {
  if (e.target.className === 'card-urgent-img'){
    taskLocation = findId(e);
    tasks[taskLocation].updateToDo()
    tasks[taskLocation].saveToLocalStorage()
    toggleClasses(e.target.closest(".card"), 'urgent-yellow')
    toggleClasses((e.target.parentNode.childNodes[3]), 'urgent-card-text')
    toggleClasses((e.target.closest('.card').childNodes[3]), 'urgent-yellow-borders')
    e.target.src.match("images/urgent.svg") ? e.target.src = "images/urgent-active.svg" : e.target.src = "images/urgent.svg";
  }
}

function toggleClasses(targetlocation, classAfter){
  var locationToChange = targetlocation;
  locationToChange.classList.toggle(classAfter)
}

function taskItemUpdate(e) {
  if(e.target.className === 'list-item-checkbox') {
    var taskLocation = findId(e)
    var taskLists = tasks[taskLocation].taskItems
    var listItem = parseInt(e.target.getAttribute("data-id"));
    var listItemLocation = taskLists.findIndex(i => i.id === listItem)
    tasks[taskLocation].updateTask(listItemLocation);
    tasks[taskLocation].saveToLocalStorage();
  }
}

function disableTaskListButton(e) {
  if (taskItemInput.value.length > 0) {
  addTaskItemButton.disabled = false;
  } else if (taskItemInput.value.length === 0) {
  addTaskItemButton.disabled = true;
  } 
} 

function enableTaskList(e) {
  if (taskItems.length > 0 && taskTitleInput.value.length > 0) {
  makeTaskListButton.disabled = false; 
  } else if (taskTitleInput.value.length >= 0) {
  makeTaskListButton.disabled = true; 
  }
}

function filterUrgent(e) {
  filterUrgencyButton.classList.toggle("filter-urgency-button-active")
  if (e.target.classList.contains("filter-urgency-button-active")) {
  var filterResults = tasks.filter(task => task.urgent === true)
  } else {
  var filterResults = tasks.filter(task => task.urgent === task.urgent)
  }
  column2.innerHTML = ""
  for (var i = 0; i < filterResults.length; i++){
  newTaskListCard(filterResults[i])
}}

function searchTasks(e) {
  var keyword = searchInput.value.toLowerCase();
  var matchingTasks = tasks.filter(task => task.title.toLowerCase().includes(keyword)) 
  column2.innerHTML = '';
  for (var i = 0; i < matchingTasks.length; i++){
  newTaskListCard(matchingTasks[i])
  }
}

function displaySearchMbl(e){
  toggleClasses(searchInput, 'search-input-display')
}














