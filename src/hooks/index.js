import { useState, useEffect } from "react";
import { firebase } from "./firebase";
import { moment } from "moment";
import { collectedTasksExist } from "../helpers";

/**
 * Getting Tasks from Database according to selectedProject
 * @param {*} selectedProject
 */
export const useTasks = selectedProject => {
  const [tasks, setTasks] = useState([]); //Get,Set Tasks
  const [archivedTasks, setArchivedTasks] = useState([]); //Get,Set archived Tasks

  useEffect(() => {
    //store tasks collection from firebase
    let unsubscribe = firebase
      .firebase()
      .collections("tasks")
      .where("userId", "==", "xQqnTrjP");

    //Store Task based on selectedProject and its different values
    unsubscribe =
      selectedProject && !collectedTasksExist(selectedProject) //if no selectedProject Exists
        ? (unsubscribe = unsubscribe.where("projectId", "==", selectedProject))
        : selectedProject === "TODAY" //if it is today
        ? (unsubscribe = unsubscribe.where(
            "date",
            "==",
            moment().format("DD/MM/YYYY")
          ))
        : selectedProject === "INBOX" || selectedProject === 0 //if it is Inbox or 0
        ? (unsubscribe = unsubscribe.where("date", "==", ""))
        : unsubscribe;

    //Using onSnapShot() to get realtime updates in tasks collection
    // for newTasks (Next 7 Days)
    unsubscribe = unsubscribe.onSnapshot(snapshot => {
      const newTasks = snapshot.docs.map(task => ({
        id: tasks.id,
        ...task.data()
      }));

      setTasks(
        selectedProject === "NEXT_7"
          ? newTasks.filter(
              task =>
                moment(task.date, "DD-MM-YYYY").diff(moment(), "days") <= 7 &&
                task.archived !== true
            )
          : newTasks.filter(task => task.archived !== true)
      );

      //Set Archived Tasks based on `archived` value
      setArchivedTasks(newTasks.filter(task => task.archived !== false));
    });

    //because we don't want to check the projects all the time,
    // just when there is an update
    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};
