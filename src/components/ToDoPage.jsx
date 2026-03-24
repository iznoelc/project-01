import { useState } from "react";

export default function ToDoPage() {
  // List of tasks: each task has { task: string, date: string }
  const [tasksList, setTasksList] = useState([]);

    //  Holds a String - Task
    //  Holds a String - Date
    //              Format - (YYYY-MM-DD-HH)
    //                              Y = Year
    //                              M = Month
    //                              D = Day
    //                              H = Hour (Between 1-24)
  const [formData, setFormData] = useState({
    task: "",
    date: "", // datetime-local format: "YYYY-MM-DDTHH:MM"
    selectedDay: ""
  });


  const handleChange = (event) => {
    // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTask = () => {
    const { task, date } = formData;

    
    if (!task.trim() || !date.trim()) {
      return;
    }

    // This form is updated by addTask whenever the add task button is pressed
    setTasksList((prev) => [...prev, { task: task.trim(), date }]);

    // Clear the inputs, except the selected day
    setFormData(prev => ({
      ...prev,
      task: "",
      date: ""
    }));

      };

  return (
    <>
      <h1>To-Do</h1>

      <input
        type="text"
        className="input"
        placeholder="What is your next task"
        list="tasks"
        name="task"                 
        value={formData.task}
        onChange={handleChange}
      />

      <datalist id="tasks">
        <option value="Take Pills" />
        <option value="Do The Dishes" />
        <option value="Do The Laundry" />
        <option value="Clean The Floors" />
        <option value="Dust" />
        <option value="Clean The Dishes" />
      </datalist>

      <input
        type="datetime-local"
        className="input"
        name="date"                 
        value={formData.date}
        onChange={handleChange}
      />

      <button
        type="button"
        className="btn"
        onClick={addTask}           
      >
        Add Task
      </button>

      <calendar-date className="cally bg-base-100 border border-base-300 shadow-lg rounded-box"
          name="selectedDay"
          
          value={formData.selectedDay}
          onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                selectedDay: e.target.value   // ALWAYS "YYYY-MM-DD"
                
              }));
            }}
          >
        <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
        <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
        <calendar-month></calendar-month>
        </calendar-date>

      <h1>This Day’s Tasks</h1>

      <ul className="mt-2">
        {tasksList.length === 0 && <li>No tasks yet.</li>}
        {tasksList.filter(task =>
            task.date.slice(0, 10) === formData.selectedDay
          )
          .map((t, idx) => (
          <li key={idx} className="py-1">
            <span className="font-medium">{t.task}</span>{" "}
            <span className="opacity-70">
              — {new Date(t.date).toLocaleString().slice(0, -6) + new Date(t.date).toLocaleString().slice(-3)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

