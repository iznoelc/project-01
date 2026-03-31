import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase/firebase.config";
import { errorNotify } from "../utils/ToastifyNotifications";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";

function sortTasksList(DataArray){
  let returnArray = [...DataArray];
    
    returnArray.sort((a, b) => {
        const diff = toDateOnly(a.date) - toDateOnly(b.date);
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
  const { user } = useAuth();
  const calendarRef = useRef();

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

  /**
   * Helper function to determine if a UID already has a tasksList associated with it.
   * It searches through the chats and assigns it to existingChat. If this is not null, it returns this id.
   * Otherwise, it must create a new chat, so it adds a doc to the chats collection in firestore, adding the
   * two users (friend and current user) as participants of the chat. Then, it returns the id of this new chat
   * @param {} UID 
   * @returns ID of existing chat or new chat
   */
  const createOrGetTasksList = async (UID) =>{
      // check if the chat already exists. if it does, return the id
      const q = query(
        collection(db, "tasksList"),
        where("participants", "array-contains", UID)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs[0].id; 
      }
      

      // otherwise, create a new chat and then return its id
      const docRef = await addDoc(collection(db, "tasksList"), {
        participants: [UID],
        createdAt: serverTimestamp(),
      });

      return docRef.id;
  }
    
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
  const [tasksListId, setTasksListId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const init = async () => {
      const id = await createOrGetTasksList(user.uid);
      setTasksListId(id);

      const q = query(
        collection(db, "tasksList", id, "tasks"),
        orderBy("createdAt", "asc")
      );

      return onSnapshot(q, snapshot => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasksList(tasks);
      });
    };

    const unsubscribePromise = init();

    return () => {
      unsubscribePromise?.then(unsub => unsub && unsub());
    };
  }, [user]);





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

  const addTask = async () => {
    const { task, date } = formData;

    if (!task.trim() || !date.trim() || !tasksListId) return;

    // Check to see if the task is already added or if the task is set to before today.
    
    const newTaskName = task.trim().toLowerCase();
    const newTaskDate = toDateOnly(date).getTime();

    const alreadyExists = tasksList.some(t => {
      const existingName = t.task.toLowerCase();
      const existingDate = toDateOnly(t.date).getTime();

      return existingName === newTaskName && existingDate === newTaskDate;
    });

    

    // If we already have the task in the tasks list do not add the task
    if (alreadyExists) {
        errorNotify("That task already exists for this day.");
        return;
      }

    
    const taskDate = new Date(date);   // full date + time
    // Get current date
    const now = new Date();

      if (taskDate < now) {
        errorNotify("This date is in the past");
        return;
      }


    await addDoc(
      collection(db, "tasksList", tasksListId, "tasks"),
      {
        task: task.trim(),
        date,
        createdAt: serverTimestamp(),
      }
    );

    setFormData(prev => ({
      ...prev,
      task: "",
      date: ""
    }));
  };

  const removeTask = async (taskId) => {
    if (!tasksListId) return;

    await deleteDoc(
      doc(db, "tasksList", tasksListId, "tasks", taskId)
    );
  };

  function Download(myList){
    // parse array to text
    const text = myList
    .map(task => `${task.task} (${task.date}) \n`) 
    .join("\n"); 

    // Create Blob 
    const file = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(file);

    // trigger the download on click
    const a = document.createElement("a"); a.href = url;
    a.download = "YourTasks.txt";
    a.click();
    URL.revokeObjectURL(url); 

    return;
}

return (
  <>
    <div className="flex flex-col min-h-screen">
      <div className="flex w-full p-4 justify-center bg-base-200">
        <h1 className="text-5xl">Your To-Do List</h1>
      </div>
    <div className="flex flex-1 w-full items-stretch">
      <div className="flex flex-col items-center w-1/2 p-4 gap-10">
      <h1 className="text-3xl fontdiner-swanky-regular">Add Your Next Task Here...</h1>
      <input
        type="text"
        className="input w-lg"
        placeholder="What is your next task?"
        list="tasks"
        name="task"
        value={formData.task}
        onChange={handleChange}
        />
        <div className="flex">
          <datalist id="tasks">
            <option value="Take Pills" /> <option value="Do The Dishes" /> <option value="Do The Laundry" /> <option value="Clean The Floors" /> <option value="Dust" /> <option value="Clean The Dishes" />
          </datalist>
          <input type="datetime-local" className="input" name="date" value={formData.date} onChange={handleChange} min="1900-01-01T00:00" max="9999-12-31T23:59"
            />
          <button type="button" className="btn" onClick={addTask} > Add Task </button>
          <button type="button" className="btn" onClick={() => Download(tasksList)}  > save downloads </button>
        </div>
        {/* <div className="grid grid-cols-2 gap-4"> */}
        <div className="flex flex-col gap-2 pt-16 items-center">
          <h2 className="text-neutral text-2xl">Pick a Day to Display the Tasks Of:</h2>
          <calendar-date className="cally bg-base-100 border border-base-300 shadow-lg rounded-box" name="selectedDay" ref={calendarRef} value={formData.selectedDay} >
            <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
            <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
            <calendar-month></calendar-month> </calendar-date>
        </div>
      </div>
      <div className="flex flex-col w-1/2 items-center bg-base-300 p-4">
        <h1 className="text-3xl fontdiner-swanky-regular">Your Tasks</h1>
        <list>
          <label className="label"> Today <input type="checkbox" className="toggle" checked={isWeekly} onChange={handleWeekly} /> This Week </label>
          {!formData.selectedDay && (
            <p className="text-pink-400 pt-20">Select a date to view tasks</p>
          )}
          <ul className="mt-2"> {tasksList.length === 0 && <p>No tasks yet.</p>}
          { tasksList.filter(task => {
            if (!formData.selectedDay) return;
            const taskDate = toDateOnly(task.date); const selectedDate = toDateOnly(formData.selectedDay); if (isWeekly) { return isSameWeek(taskDate, selectedDate); } // Daily
          return taskDate.toDateString() === selectedDate.toDateString(); }) .map((t, idx) => ( <li key={idx} className="py-1"> <span className="font-medium">{t.task}</span>{" "} <span className="opacity-70"> — {new Date(t.date).toLocaleString().slice(0, -6) + new Date(t.date).toLocaleString().slice(-3)} </span>
          <button type="button" className="btn" onClick={() => removeTask(t.id)} > Complete Task </button> </li> ))}
          </ul>
          <button type="button" className="btn" onClick={() => Download(tasksList)}  > Download Tasks </button>
        </list>
      </div>
      </div>
      </div>
      </>
      );
    }