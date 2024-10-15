import {useState} from "react";
import {useDispatch} from "react-redux";
import {saveProject} from "./state/projectActions";
import {Project} from "./Project";

export function useProjectForm(initialProject, today = () => ymd(new Date())) {
    const [project, setProject] = useState(initialProject);
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        budget: '',
    });
    const dispatch = useDispatch();

    return {
        project,
        errors,
        handleSubmit,
        changeBudget,
        changeDescription,
        changeName,
        changeActiveStatus,
        changeSignedOn
    };

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

    function changeSignedOn(value) {
        update('contractSignedOn', value);
    }

    function validate(project) {
        let errors = {name: '', description: '', budget: ''};
        nameIsRequired();
        nameIsTooShort();
        descriptionIsRequired();
        budgetCannotBeZero();

        return errors;

        function budgetCannotBeZero() {
            if (project.budget === 0)
                errors.budget = 'Budget must be more than $0.';
        }

        function nameIsTooShort() {
            if (project.name.length > 0 && project.name.length < 3)
                errors.name = 'Name needs to be at least 3 characters.';
        }

        function nameIsRequired() {
            if (project.name.length === 0)
                errors.name = 'Name is required';
        }

        function descriptionIsRequired() {
            if (project.description.length === 0)
                errors.description = 'Description is required.';
        }

    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!isValid()) return;
        dispatch(saveProject(project));
    }

    function update(field, value) {
        setProject(updateProject);
        setErrors(() => validate(updateProject(project)));

        function updateProject(p) {
            return new Project({...p, [field]: value});
        }
    }

    function isValid() {
        return (
            errors.name.length === 0 &&
            errors.description.length === 0 &&
            errors.budget.length === 0
        );

    }
}

export function ymd(date) {
    return date.toISOString().split('T')[0]
}
