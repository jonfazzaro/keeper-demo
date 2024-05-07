import {useState} from "react";
import {useDispatch} from "react-redux";
import {saveProject} from "./state/projectActions";
import {Project} from "./Project";

export function useProjectForm(initialProject) {
    const [project, setProject] = useState(initialProject);
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        budget: '',
    });
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isValid()) return;
        dispatch(saveProject(project));
    };

    function update(field, value) {
        let updatedProject;
        setProject((p) => {
            p[field] = value
            updatedProject = new Project({...p});
            return updatedProject;
        });
        setErrors(() => validate(updatedProject));
    }

    function validate(project) {
        let errors = {name: '', description: '', budget: ''};
        if (project.name.length === 0) {
            errors.name = 'Name is required';
        }
        if (project.name.length > 0 && project.name.length < 3) {
            errors.name = 'Name needs to be at least 3 characters.';
        }
        if (project.description.length === 0) {
            errors.description = 'Description is required.';
        }
        if (project.budget === 0) {
            errors.budget = 'Budget must be more than $0.';
        }
        return errors;
    }

    function isValid() {
        return (
            errors.name.length === 0 &&
            errors.description.length === 0 &&
            errors.budget.length === 0
        );
    }

    function changeBudget(value) {
        update('budget', Number(value));
    }

    function changeName(value) {
        update('name', value);
    }

    function changeDescription(value) {
        update('description', value);
    }

    function changeActiveStatus(value) {
        update('isActive', value);
    }

    return {
        project,
        errors,
        handleSubmit,
        changeBudget,
        changeDescription,
        changeName,
        changeActiveStatus
    };
}