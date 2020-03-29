import { useState, useEffect } from "react";
import { firebase } from "./firebase";
import { moment } from "moment";
import { collectedTasksExist } from "../helpers";

export const useTasks = selectedProject => {
  const [tasks, settasks] = useState([]);
  useEffect(() => {
    let unsubscribe = firebase
      .firebase()
      .collections("tasks")
      .where("userId", "==", "xQqnTrjP");

    unsubscribe =
      selectedProject && !collectedTasksExist(selectedProject)
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
  }, [selectedProject]);
};
