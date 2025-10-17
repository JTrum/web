// DOM Elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

// 数据初始化
let todos = [];
let currentFilter = "all";

// 事件监听器
addTaskBtn.addEventListener("click", () => {
  addTodo(taskInput.value);
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  });
});

// 添加新任务
function addTodo(text) {
  if (text.trim() === "") return;
  
  const todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false
  };
  
  todos.push(todo);
  saveTodos();
  renderTodos();
  taskInput.value = "";
}

// 切换任务完成状态
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

// 删除任务
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

// 清除已完成的任务
function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

// 保存任务到本地存储
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

// 更新剩余任务计数
function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed);
  const count = uncompletedTodos.length;
  itemsLeft.textContent = `${count} item${count !== 1 ? "s" : ""} left`;
  
  // 更新清除按钮状态
  const completedCount = todos.filter((todo) => todo.completed).length;
  clearCompletedBtn.disabled = completedCount === 0;
}

// 检查空状态显示
function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }
}

// 渲染任务列表
function renderTodos() {
  todosList.innerHTML = "";
  const filteredTodos = filterTodos(currentFilter);

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) todoItem.classList.add("completed");

    // 创建复选框容器
    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    // 创建任务文本
    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    // 创建删除按钮
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    // 组装任务项
    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(deleteBtn);

    todosList.appendChild(todoItem);
  });
}

// 过滤任务
function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

// 设置活动过滤器
function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((item) => {
    if (item.getAttribute("data-filter") === filter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  
  renderTodos();
}

// 设置日期
function setDate() {
  const options = { 
    weekday: "long", 
    month: "short", 
    day: "numeric" 
  };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

// 加载保存的任务
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    try {
      todos = JSON.parse(storedTodos);
    } catch (e) {
      console.error("Error loading todos:", e);
      todos = [];
    }
  }
  renderTodos();
  checkEmptyState();
}

// 页面加载完成后初始化
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  updateItemsCount();
  checkEmptyState();
  setDate();
});
