import React from 'react';
import './App.css';
import ProjectsPage from './projects/ProjectsPage';
import ProjectPage from './projects/ProjectPage';
import { Provider } from 'react-redux';
import { store } from './state';
import clock from "./clock";

import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
} from 'react-router-dom';
import HomePage from './home/HomePage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <header className="sticky">
          <span className="logo">
            <img src="/assets/logo-3.svg" alt="logo" width="49" height="99" />
          </span>
          <NavLink to="/" className="button rounded">
            <span className="icon-home"></span>
            Home
          </NavLink>
          <NavLink to="/projects/" className="button rounded">
            Projects
          </NavLink>
        </header>
        <div className="container">
          <h3 data-testid='greeting'>{greeting()}</h3>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );

  function greeting() {
    const currentHour = clock.hour();
    if (currentHour < 4) return "Isn't it past your bedtime?";
    if (currentHour < 6) return "You're up early!";
    if (currentHour < 12) return "Good morning!";
    if (currentHour < 17) return "Good afternoon!";
    if (currentHour < 22) return "Good evening!";
    return "Isn't it past your bedtime?";
  }

}

export default App;
