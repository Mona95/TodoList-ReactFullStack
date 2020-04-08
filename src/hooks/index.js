import { useState, useEffect } from "react";
import moment from "moment";
import { firebase } from "../firebase";
import { colletedTasksExist } from "../helpers";

/**
 * Getting Tasks from Database according to selectedProject
 * @param {*} selectedProject
 */
export const useTasks = (selectedProject) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    //store tasks collection from firebase
    let unsubscribe = firebase
      .firestore()
      .collection("tasks")
      .where("userId", "==", "jlIFXIwyAL3tzHMtzRbw");

    //Store Task based on selectedProject and its different values
    unsubscribe =
      selectedProject && !colletedTasksExist(selectedProject) //if no selectedProject Exists
        ? (unsubscribe = unsubscribe.where("projectId", "==", selectedProject))
        : selectedProject === "TODAY"
        ? (unsubscribe = unsubscribe.where(
            "date",
            "==",
            moment().format("DD/MM/YYYY")
          ))
        : selectedProject === "INBOX" || selectedProject === 0
        ? (unsubscribe = unsubscribe.where("date", "==", ""))
        : unsubscribe;

    //Using onSnapShot() to get realtime updates in tasks collection
    // for newTasks (Next 7 Days)
    unsubscribe = unsubscribe.onSnapshot((snapshot) => {
      const newTasks = snapshot.docs.map((task) => ({
        id: task.id,
        ...task.data(),
      }));

      setTasks(
        selectedProject === "NEXT_7"
          ? newTasks.filter(
              (task) =>
                moment(task.date, "DD-MM-YYYY").diff(moment(), "days") <= 7 &&
                task.archived !== true
            )
          : newTasks.filter((task) => task.archived !== true)
      );
      //Set Archived Tasks based on `archived` value
      setArchivedTasks(newTasks.filter((task) => task.archived !== false));
    });

    //because we don't want to check the projects all the time,
    // just when there is an update
    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};
/**
 * Getting Projects from Database
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("projects")
      .where("userId", "==", "jlIFXIwyAL3tzHMtzRbw")
      .orderBy("projectId")
      .get()
      .then((snapshot) => {
        const allProjects = snapshot.docs.map((project) => ({
          ...project.data(),
          docId: project.id, //if we wanna delete, we need docId
        }));
        //this condition is for checking if for each update in projects
        //allProjects coming from database is same or no
        if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
          setProjects(allProjects);
        }
      });
  }, [projects]);

  return { projects, setProjects };
};
