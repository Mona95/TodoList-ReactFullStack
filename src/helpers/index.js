import { collectedTasks } from "../constants";

export const colletedTasksExist = (selectedProject) =>
  collectedTasks.find((task) => task.key === selectedProject);
