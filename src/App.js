import React from "react";
import { ProjectsProvider, SelectedProjectsProvider } from "./context";
import { Header } from "./components/layout/Header";
import { Content } from "./components/layout/Content";

export const App = () => (
  <SelectedProjectsProvider>
    <ProjectsProvider>
      <div className="App">
        <Header />
        <Content />
      </div>
    </ProjectsProvider>
  </SelectedProjectsProvider>
);
