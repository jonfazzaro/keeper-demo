import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {Project} from '../Project';
import ProjectForm from '../ProjectForm';
import {Provider} from 'react-redux';
import {store} from '../../state';
import userEvent from '@testing-library/user-event';
import {saveProject} from '../state/projectActions'

describe.skip('<ProjectForm />', () => {

    beforeEach(() => {
        saveProject.mockClear()
        project = arrangeProject();
        updatedProject = arrangeUpdatedProject();
    });

    describe('given a project', () => {

        beforeEach(() => {
            renderProjectForm()
        });

        it('loads it into the form', () => {
            expect(
                screen.getByRole('form', {
                    name: /edit a project/i,
                })
            ).toHaveFormValues({
                name: project.name,
                description: project.description,
                budget: project.budget,
                isActive: project.isActive,
            });
        });

        describe('when editing', () => {
            let user;
            beforeEach(() => {
                user = userEvent.setup();
            });

            describe('the name', () => {
                beforeEach(async () => {
                    await user.clear(nameTextBox);
                    await user.type(nameTextBox, updatedProject.name);
                });

                it.only('updates the name', async () => {
                    expect(nameTextBox).toHaveValue(updatedProject.name);
                });

                describe('and submitting', () => {
                    beforeEach(async () => {
                        await user.click(screen.getByText('Save'))
                    });

                    it('should submit when saved', async () => {
                        expect(saveProject).toHaveBeenCalled()
                    });
                });

                describe('given a blank name', () => {
                    beforeEach(async () => {
                        await user.clear(nameTextBox);
                    });

                    it('displays required validation', () => {
                        expect(screen.getByRole('alert')).toBeInTheDocument();
                        expect(screen.getByRole('alert')).toHaveTextContent(/name is required$/i);
                    });
                });

                describe('given a two-letter name', () => {
                    beforeEach(async () => {
                        await user.clear(nameTextBox);
                        await user.type(nameTextBox, 'ab');
                    });

                    it('displays minlength validation', async () => {
                        await expect(screen.getByRole('alert')).toBeInTheDocument();
                    });

                    describe('and then submitting', () => {
                        beforeEach(async () => {
                            await user.click(screen.getByText('Save'))
                        });

                        it('should not submit given validation issues', async () => {
                            expect(saveProject).not.toHaveBeenCalled()
                        });
                    });

                    describe('shortened to a one-letter name', () => {
                        beforeEach(async () => {
                            await user.type(nameTextBox, 'c');
                        });

                        it('removes the validation alert', async () => {
                            await expect(screen.queryByRole('alert')).not.toBeInTheDocument();
                        });
                    });
                });
            });

            describe('the description', () => {
                beforeEach(async () => {
                    await user.clear(descriptionTextBox);
                    await user.type(descriptionTextBox, updatedProject.description);
                });

                it('updates the description', async () => {
                    expect(descriptionTextBox).toHaveValue(updatedProject.description);
                });
            });

            describe('the budget', () => {
                beforeEach(async () => {
                    await user.clear(budgetTextBox);
                    await user.type(budgetTextBox, updatedProject.budget.toString());
                });

                it('updates the budget', async () => {
                    expect(budgetTextBox).toHaveValue(updatedProject.budget);
                });

                describe('given zero', () => {
                    beforeEach(async () => {
                        await user.type(budgetTextBox, '0');
                    });

                    it('displays the not 0 validation', () => {
                        expect(screen.getByRole('alert')).toBeInTheDocument();
                    });

                    describe('then corrected', () => {
                        beforeEach(async () => {
                            await user.type(budgetTextBox, '1');
                        });

                        it('removes the validation alert', () => {
                            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
                        });
                    });
                });
            });
        });
    });

});

jest.mock('../state/projectActions')
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn()
}))

let project;
let updatedProject;
let handleCancel;
let nameTextBox;
let descriptionTextBox;
let budgetTextBox;
saveProject.mockImplementation(p => p)
handleCancel = jest.fn();

function arrangeProject() {
    return new Project({
        id: 1,
        name: 'Mission Impossible',
        description: 'This is really difficult',
        budget: 100,
    });
}

function arrangeUpdatedProject() {
    return new Project({
        name: 'Ghost Protocol',
        description:
            'Blamed for a terrorist attack on the Kremlin, Ethan Hunt (Tom Cruise) and the entire IMF agency...',
    });
}

function renderProjectForm() {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ProjectForm project={project} onCancel={handleCancel}/>
            </MemoryRouter>
        </Provider>
    );

    nameTextBox = screen.getByRole('textbox', {
        name: /project name/i,
    });
    descriptionTextBox = screen.getByRole('textbox', {
        name: /project description/i,
    });
    budgetTextBox = screen.getByRole('spinbutton', {
        name: /project budget/i,
    });
}