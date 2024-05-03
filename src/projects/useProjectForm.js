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

    function handleChange(event) {
        const {type, name, value, checked} = event.target;
        // if input type is checkbox use checked
        // otherwise it's type is text, number etc. so use value
        let updatedValue = type === 'checkbox' ? checked : value;

        //if input type is number convert the updatedValue string to a +number
        if (type === 'number') {
            updatedValue = Number(updatedValue);
        }
        const change = {
            [name]: updatedValue,
        };

        let updatedProject;
        // need to do functional update b/c
        // the new project state is based on the previous project state
        // so we can keep the project properties that aren't being edited +like project.id
        // the spread operator (...) is used to
        // spread the previous project properties and the new change
        setProject((p) => {
            updatedProject = new Project({...p, ...change});
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

    return {project, errors, handleSubmit, handleChange};
}