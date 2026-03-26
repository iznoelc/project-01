import { useEffect, useRef, useState } from "react";



function sortTasksList(DataArray){
  let returnArray = [...DataArray];
    
    returnArray.sort((a, b) => {
        const diff = a.date - b.date;
        return diff;
    });


    return returnArray;
}


function toDateOnly(dateString) {
  // dateString like "2026-03-25T14:30"
  return new Date(dateString.slice(0, 10));
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}


function isSameWeek(dateA, dateB) {
  return (
    startOfWeek(dateA).getTime() ===
    startOfWeek(dateB).getTime()
  );
}
``




export default function ToDoPage() {
  const calendarRef = useRef();

  
  useEffect(() => {
    if (!calendarRef.current) return;

    function handleDateChange(e) {
        if(e != null){
        setFormData(prev => ({
          ...prev,
          selectedDay: e.target.value
        }));
      }
    }
    calendarRef.current.addEventListener("change", handleDateChange);
    
    return () => {
      //calendarRef.current.removeEventListener("change", handleDateChange);
    };
  }, []);

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


  const [isWeekly, setIsWeekly] = useState(false);

  // Sets weekly to whatever the toggle is set to
  const handleWeekly = (event) => {
    setIsWeekly(event.target.checked);
  };



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

      //setTasksList(sortTasksList(tasksList));

      };

    const removeTask = (task) => {
        setTasksList(tasksList.filter(tasks =>
            tasks != task));
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
      <div className="grid grid-cols-2 gap-4">

        <calendar-date className="cally bg-base-100 border border-base-300 shadow-lg rounded-box"
            name="selectedDay"
            ref={calendarRef}
            value={formData.selectedDay}
            >
          <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
          <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          <calendar-month></calendar-month>
          </calendar-date>
        <list>
          
          <label className="label">
            Daily
            <input
              type="checkbox"
              className="toggle"
              checked={isWeekly}
              onChange={handleWeekly}
            />

            Weekly
          </label>
          <h1>This Day’s Tasks</h1>

          <ul className="mt-2">
            {tasksList.length === 0 && <li>No tasks yet.</li>}

            {
              tasksList.filter(task => {
                const taskDate = toDateOnly(task.date);
                const selectedDate = toDateOnly(formData.selectedDay);

                if (isWeekly) {
                  return isSameWeek(taskDate, selectedDate);
                }

                // Daily
                return taskDate.toDateString() === selectedDate.toDateString();
              })

              .map((t, idx) => (
              <li key={idx} className="py-1">
                <span className="font-medium">{t.task}</span>{" "}
                <span className="opacity-70">
                  — {new Date(t.date).toLocaleString().slice(0, -6) + new Date(t.date).toLocaleString().slice(-3)}
                </span>
                
                <button type="button"
                        className="btn"
                        onClick = {() => removeTask(t)}>
                        Complete Task</button>
                        
              </li>
            ))}
          </ul>
        </list>
      </div>
    </>
  );
}

