const API_URL = "/api/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

function showMessage(text) {
  message.textContent = text;
}

// READ: Fetch tasks from the server
async function loadTasks() {
  try {
    showMessage("Loading tasks...");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks = await response.json();

    renderTasks(tasks);
    showMessage(`${tasks.length} task(s) loaded from API.`);
  } catch (error) {
    showMessage("Cannot connect to API. Check whether the server is running.");
  }
}

// Display API data dynamically
function renderTasks(tasks) {
  taskList.replaceChildren();

  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("completedCount").textContent =
    tasks.filter(task => task.completed).length;
  document.getElementById("pendingCount").textContent =
    tasks.filter(task => !task.completed).length;

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No tasks yet. Add your first task!";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task completed");

    checkbox.addEventListener("change", () => {
      updateTask(task.id, { completed: checkbox.checked });
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    if (task.completed) {
      title.classList.add("done");
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTask(task));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actions.append(editBtn, deleteBtn);
    item.append(checkbox, title, actions);
    taskList.appendChild(item);
  });
}

// CREATE: Send a new task to the API
taskForm.addEventListener("submit", async event => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    showMessage("Please enter a task title.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to add task");
    }

    taskInput.value = "";
    showMessage("Task added successfully!");
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
});

// UPDATE: Edit a task title
async function editTask(task) {
  const newTitle = prompt("Edit task title:", task.title);

  if (newTitle === null) return;

  if (!newTitle.trim()) {
    showMessage("Task title cannot be empty.");
    return;
  }

  await updateTask(task.id, { title: newTitle.trim() });
}

// UPDATE: Send changes to the API
async function updateTask(id, updates) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Update failed");
    }

    showMessage("Task updated successfully!");
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

// DELETE: Remove a task through the API
async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Delete failed");
    }

    showMessage("Task deleted successfully!");
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

// Load API data when the page opens
loadTasks();