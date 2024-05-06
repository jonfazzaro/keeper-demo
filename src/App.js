import React from 'react';
import './App.css';
import ProjectsPage from './projects/ProjectsPage';
import ProjectPage from './projects/ProjectPage';
import { Provider } from 'react-redux';
import { store } from './state';

import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
} from 'react-router-dom';
import HomePage from './home/HomePage';
import clock from "./clock";

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
            <Route path="/" element={<HomePage/>}/>
            <Route path="/projects" element={<ProjectsPage/>}/>
            <Route path="/projects/:id" element={<ProjectPage/>}/>
          </Routes>
        </div>
      </Router>
    </Provider>
  );



  /***************************************/
  /**                                   **/
  /** Copyright (c) 1993 Initech        **/
  /** No holds barred                   **/
  /** (thanks Roger)                    **/
  /**                                   **/
  /***************************************/
  function greeting() {
    let result = null;
    const currentHour = clock.hour()

    if (currentHour >= 4) {
      if (currentHour < 6) {
        result = "You're up early!";
      } else if (currentHour >= 12) {
        let GOOD = "Good ";
        result = GOOD;

        /////////////////////////////////////////////////
        // Just what do you think you are doing, Dave? //
        /////////////////////////////////////////////////
        if (currentHour < 17 !== false) {
          result += "afternoon!";
        } else { // if (clock.hour() < 17))
          if (currentHour >= 22 && result === GOOD) {
            return "Isn't it past your bedtime?";
          }
          result = GOOD + "evening!";
        }
      } else { // if (!clock.now().hour < 12))
        result = "Good morning!";
      }
    } else { // if (!clock.now().hour < 4))

      // tee-hee, Kevin we did it again!!!!11!!1
      result = "Isn't it past your bedtime?";
    }

    return result || "Isn't it past your bedtime?";
  }

}

export default App;
