const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitsList = document.getElementById('habits-list');
const todayCount = document.getElementById('today-count');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Today's date key (YYYY-MM-DD)
function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

// Render the list
function renderHabits() {
  habitsList.innerHTML = '';
  let completedToday = 0;

  habits.forEach((habit, index) => {
    const today = getTodayKey();
    const isDoneToday = habit.completed && habit.completed.includes(today);

    if (isDoneToday) completedToday++;

    const habitEl = document.createElement('div');
    habitEl.className = `habit-item ${isDoneToday ? 'done' : ''}`;
    
    habitEl.innerHTML = `
      <div class="habit-name">${habit.name}</div>
      <div>
        <button class="check-btn ${isDoneToday ? 'done' : ''}" data-index="${index}">
          ${isDoneToday ? '✓ Done' : 'Mark Done'}
        </button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;

    habitsList.appendChild(habitEl);
  });

  todayCount.textContent = completedToday;
}

// Add new habit
function addHabit() {
  const name = habitInput.value.trim();
  if (!name) return;

  habits.push({
    name: name,
    completed: []   // array of date strings when completed
  });

  habitInput.value = '';
  saveAndRender();
}

// Toggle completion for today
function toggleHabit(index) {
  const today = getTodayKey();
  const habit = habits[index];

  if (!habit.completed) habit.completed = [];

  if (habit.completed.includes(today)) {
    // Undo
    habit.completed = habit.completed.filter(date => date !== today);
  } else {
    // Mark done
    habit.completed.push(today);
  }

  saveAndRender();
}

// Delete habit
function deleteHabit(index) {
  if (confirm('Delete this habit?')) {
    habits.splice(index, 1);
    saveAndRender();
  }
}

// Save to localStorage and re-render
function saveAndRender() {
  localStorage.setItem('habits', JSON.stringify(habits));
  renderHabits();
}

// Event listeners
addBtn.addEventListener('click', addHabit);

habitInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addHabit();
});

habitsList.addEventListener('click', (e) => {
  const index = parseInt(e.target.dataset.index);
  if (!isNaN(index)) {
    if (e.target.classList.contains('check-btn')) {
      toggleHabit(index);
    } else if (e.target.classList.contains('delete-btn')) {
      deleteHabit(index);
    }
  }
});

// Initial render
renderHabits();