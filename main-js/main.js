
const title = document.querySelector(".title");

// Function to create the animation effect for each letter
function animateLetter(letter, index) {
  setTimeout(() => {
    letter.classList.add("show");
  }, index * 100);
  setTimeout(() => {
    letter.classList.remove("show");
  }, index * 100 + 3000); // Adjust 3000 to change the duration of the animation
}

// Split the text into individual letters and wrap them in span elements
title.innerHTML = title.innerText
  .split("")
  .map((ltr, idx) => {
    return `<span class="ltr" style="--delay: ${idx * 100}ms">${ltr}</span>`;
  })
  .join(" ");

// Get the span elements for each letter
const ltrs = document.querySelectorAll(".title .ltr");

// Start the animation for each letter
ltrs.forEach((ltr, idx) => {
  animateLetter(ltr, idx);
  setInterval(() => {
    animateLetter(ltr, idx);
  }, ltrs.length * 100 + 3000); // Repeat the animation after all letters have finished
});

//////////////////////////////////////////////////////////////////////////////////////////////////

// SELECT ELEMENTS
const form = document.getElementById("to-do-form");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
let message = document.getElementById("message");
const deleteAllButton = document.getElementById("deleteAll");
const totalTasks = document.querySelector("#total-tasks");
const completeTasks = document.querySelector("#complete-tasks");
const remainingTasks = document.querySelector("#Remaining-tasks");
const progressbar = document.querySelector(".progressbar");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 1st render
renderTodos();
countTasks();

// form submit
form.addEventListener("submit", function (event) {
  event.preventDefault();
  saveTodo();
  renderTodos();
  countTasks();

  //   enableprogressbar();
  localStorage.setItem("todos", JSON.stringify(todos));
});

// savetodo
function saveTodo() {
  const todoValue = todoInput.value;

  //if input = empty
  const isEmpty = todoValue === "";

  // check for duplicate todos
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );

  if (isEmpty) {
    message.innerHTML = `please check your input`;
    message.style.color = "red";
  } else if (isDuplicate) {
    message.innerHTML = `this name aleardy exit`;
    message.style.color = "red";
  } else {
    todos.push({
      value: todoValue,
      checked: false,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
    todoInput.value = "";
    message.innerHTML = `correct input`;
    message.style.color = "green";
    countTasks();
  }
}

// render todos
function renderTodos() {
  // CLEAR ELEMENT BEFORE A RE-RENDER
  todosListEl.innerHTML = "";
  // RENDER TODOS
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? "checked" : ""}" data-action="check">${
      todo.value
    }</p>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    
    `;
  });
}

// CLICK EVENT LISTENER FOR ALL THE TODOS
todosListEl.addEventListener("click", (event) => {
  const target = event.target;

  //   console.log(target);

  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  // t o d o id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // target action
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "delete" && deleteTodo(todoId);
});

// CHECK A TODO

function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
  countTasks();
}

// DELETE TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;
  // re-render
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
  countTasks();
}

// delete all
deleteAllButton.addEventListener("click", () => {
  if (
    todos.length === 0 ||
    confirm("Are you sure you want to delete all todos?")
  ) {
    todos = [];
    renderTodos(); // Assuming renderTodos is a function that updates the UI
    localStorage.setItem("todos", JSON.stringify(todos));
    countTasks();
  }
});

// count tasks
function countTasks() {
  const completeTasksArray = todos.filter((task) => task.checked === true);
  totalTasks.textContent = todos.length;
  remainingTasks.textContent = todos.length - completeTasksArray.length;

  const percentageComplete = (
    (completeTasksArray.length / todos.length) *
    100
  ).toFixed(1);
  progressbar.setAttribute("aria-valuenow", percentageComplete);

  // Hide or show the progress bar based on the number of tasks
  if (todos.length > 0) {
    progressbar.style.visibility = "inherit";
  } else {
    progressbar.style.visibility = "hidden";
  }

  //  Hide or show button delete all  based on the number of tasks
  if (todos.length > 0) {
    deleteAllButton.style.display = "flex";
  } else {
    deleteAllButton.style.display = "none";
  }
  localStorage.setItem("completionPercentage", percentageComplete);
}

// darkmode and lightmode
const toggle = document.getElementById("toggleDark");
const body = document.querySelector("body");
const darkMode = document.querySelector(".dark-mode");

toggle.addEventListener("click", function () {
  this.classList.toggle("bi-moon-fill");
  if (this.classList.contains("bi-moon-fill")) {
    body.style.background = "black";
    darkMode.style.color = "white";
    todosListEl.style.color = "white";
    localStorage.setItem("darkMode", "true");
  } else {
    body.style.background = "white";
    darkMode.style.color = "black";
    todosListEl.style.color = "black";
    localStorage.setItem("darkMode", "false");
  }
});

// Check for dark mode preference in localStorage
const isDarkMode = localStorage.getItem("darkMode") === "true";

// Apply dark mode styles if the preference is true
if (isDarkMode) {
  toggle.classList.add("bi-moon-fill");
  body.style.background = "black";
  darkMode.style.color = "white";
  todosListEl.style.color = "white";
} else {
  toggle.classList.remove("bi-moon-fill");
  body.style.background = "white";
  darkMode.style.color = "black";
  todosListEl.style.color = "black";
}


// if ("serviceWorker" in navigator) {}
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("../sw.js")
    .then((reg) => {
      console.log("file is register", reg);
    })
    .catch((err) => {
      console.log("error", err);
    });
}

