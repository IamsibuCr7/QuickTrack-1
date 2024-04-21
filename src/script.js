var timer = null;
var startTime = null;
var elapsedTime = 0;

function startTimer() {
  if (timer) return;
  const taskNameInput = document.getElementById("activityName");
  document.getElementById("popupTaskName").querySelector("span").textContent =
    taskNameInput.value || "Unnamed Task";
  document.getElementById("taskPopup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  document.body.classList.add("no-scroll");
  startTime = new Date();
  timer = setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
  const endTime = new Date();
  const taskName =
    document.getElementById("activityName").value || "Unnamed Task";
  logEvent(taskName, startTime, endTime);
  updateLogsDisplay();
  closePopup();
}

function closePopup() {
  document.getElementById("taskPopup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("activityName").value = "";
}

function updateTimerDisplay() {
  const now = new Date();
  elapsedTime = now - startTime;
  const totalSeconds = Math.floor(elapsedTime / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  document.getElementById(
    "timerDisplay"
  ).textContent = `${hours}:${minutes}:${seconds}`;
}

function logEvent(activityName, start, end) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const duration = end - start;
  const durationFormatted = new Date(duration).toISOString().substr(11, 8);
  logs.push({
    activityName,
    startTime: start.toLocaleTimeString(),
    endTime: end.toLocaleTimeString(),
    duration: durationFormatted,
  });
  localStorage.setItem("logs", JSON.stringify(logs));
}

function updateLogsDisplay() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const logList = document.querySelector(".content");
  logList.innerHTML = "<h2>Task list</h2>";

  logs.forEach((log, index) => {
    const div = document.createElement("div");
    div.className = "taskItem";
    div.innerHTML = `
            <h3 class="taskName">${log.activityName}</h3>
            <p class="taskStartEnd">${log.startTime} - ${log.endTime}</p>
            <p class="duration">${log.duration}</p>
            <div class="actions">
                <span class="material-symbols-outlined delete" onclick="deleteLog(${index})">delete</span>
            </div>
        `;
    logList.appendChild(div);
  });
}

function deleteLog(index) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.splice(index, 1);
  localStorage.setItem("logs", JSON.stringify(logs));
  updateLogsDisplay();
}

function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning!";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon!";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening!";
  } else {
    greeting = "Good night!";
  }

  document.getElementById("userGreeting").innerText = greeting;
}
updateGreeting();

function reportData() {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  let totalDuration = 0; // Total duration in milliseconds

  if (logs.length > 0) {
    logs.forEach((log) => {
      const startTime = new Date(log.startTime);
      const endTime = new Date(log.endTime);
      totalDuration += endTime - startTime;
    });

    const totalTasks = logs.length;
    const totalHours = totalDuration / 3600000;
    const averageTime = totalHours / totalTasks;

    document.querySelector(".totalTime h2").textContent =
      formatHoursAndMinutes(totalHours);
    document.querySelector(".totalTasks h2").textContent = totalTasks;
    document.querySelector(".avgTime h2").textContent =
      formatHoursAndMinutes(averageTime);
  } else {
    document.querySelector(".totalTime h2").textContent = "0h 0m";
    document.querySelector(".totalTasks h2").textContent = "0";
    document.querySelector(".avgTime h2").textContent = "0h 0m";
  }
}

document.addEventListener("DOMContentLoaded", reportData);

document.addEventListener("DOMContentLoaded", function () {
  updateLogsDisplay();
});
