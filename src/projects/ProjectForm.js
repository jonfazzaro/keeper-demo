import React from 'react';
import PropTypes from 'prop-types';
import {Project} from './Project';
import {useProjectForm} from "./useProjectForm";

function ProjectForm({ project: initialProject, onCancel }) {
  const {project, errors, handleSubmit, handleChange} = useProjectForm(initialProject);

  return (
    <form
      aria-label="Edit a Project"
      name="projectForm"
      className="input-group vertical"
      onSubmit={handleSubmit}
    >
      <label htmlFor="name">Project Name</label>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="enter name"
        value={project.name}
        onChange={handleChange}
      />
      {errors.name.length > 0 && (
        <div role="alert" className="card error">
          {errors.name}
        </div>
      )}
      <label htmlFor="description">Project Description</label>
      <textarea
        id="description"
        name="description"
        aria-label="project description"
        placeholder="enter description"
        value={project.description}
        onChange={handleChange}
      />
      {errors.description.length > 0 && (
        <div role="alert" className="card error">
          <p>{errors.description}</p>
        </div>
      )}

      <label htmlFor="budget">Project Budget</label>
      <input
        id="budget"
        type="number"
        name="budget"
        placeholder="enter budget"
        value={project.budget}
        onChange={handleChange}
      />
      {errors.budget.length > 0 && (
        <div role="alert" className="card error">
          <p>{errors.budget}</p>
        </div>
      )}
      <label htmlFor="isActive">Active?</label>
      <input
        id="isActive"
        type="checkbox"
        name="isActive"
        checked={project.isActive}
        onChange={handleChange}
      />
      <div className="input-group">
        <button className="primary bordered medium">Save</button>
        <span />
        <button type="button" className="bordered medium" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

ProjectForm.propTypes = {
  project: PropTypes.instanceOf(Project),
  onCancel: PropTypes.func.isRequired,
};

export default ProjectForm;
