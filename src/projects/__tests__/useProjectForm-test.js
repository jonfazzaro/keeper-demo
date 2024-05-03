import {act, renderHook} from '@testing-library/react';
import {Project} from '../Project';
import {saveProject} from '../state/projectActions'
import {useProjectForm} from '../useProjectForm';
import {handleRequest} from "msw";

describe('useProjectForm', () => {
    let subject;

    beforeEach(() => {
        saveProject.mockClear()
        project = arrangeProject();
        updatedProject = arrangeUpdatedProject();
    });

    describe('given a project', () => {

        beforeEach(() => {
            subject = renderProjectForm()
        });

        it('loads it into the form', () => {
            expect(subject.current.project.id).toEqual(1)
        });

        describe('when editing', () => {
            describe('the name', () => {
                beforeEach(async () => {
                    await changeName('Ghost Protocol');
                });

                it('updates the name', async () => {
                    expect(subject.current.project.name).toEqual(updatedProject.name);
                });

                describe('and submitting', () => {
                    beforeEach(async () => {
                        await submitForm();
                    });

                    it('should submit when saved', async () => {
                        expect(saveProject).toHaveBeenCalled()
                    });
                });

                describe('given a blank name', () => {
                    beforeEach(async () => {
                        await changeName('');
                    });

                    it('displays required validation', () => {
                        expect(subject.current.errors.name).toMatch(/name is required$/i)
                    });
                });

                describe('given a two-letter name', () => {
                    beforeEach(async () => {
                        await changeName('');
                        await changeName('ab');
                    });

                    it('displays minlength validation', async () => {
                        expect(subject.current.errors.name).toEqual("Name needs to be at least 3 characters.")
                    });

                    describe('and then submitting', () => {
                        beforeEach(async () => {
                            await submitForm();
                        });

                        it('should not submit given validation issues', async () => {
                            expect(saveProject).not.toHaveBeenCalled()
                        });
                    });

                    describe('shortened to a one-letter name', () => {
                        beforeEach(async () => {
                            await changeName('c');
                        });

                        it('still shows the validation alert', async () => {
                            expect(subject.current.errors.name).toEqual("Name needs to be at least 3 characters.")
                        });
                    });
                });

            });

            describe('the status', () => {
                beforeEach(async () => {
                    await act(() => {
                        subject.current.changeActiveStatus(false)
                    });
                });

                it('updates the status', async () => {
                    expect(subject.current.project.isActive).toEqual(false)
                });

            });

            describe('the description', () => {
                beforeEach(async () => {
                    await changeDescription('')
                    await changeDescription(updatedProject.description)
                });

                it('updates the description', async () => {
                    expect(subject.current.project.description).toEqual(updatedProject.description);
                });
            });

            describe('the budget', () => {
                beforeEach(async () => {
                    await changeBudget('')
                    await changeBudget(updatedProject.budget.toString())
                });

                it('updates the budget', async () => {
                    expect(subject.current.project.budget).toEqual(updatedProject.budget);
                });

                describe('given zero', () => {
                    beforeEach(async () => {
                        await changeBudget('0')
                    });

                    it('displays the not 0 validation', () => {
                        expect(subject.current.errors.budget).toEqual("Budget must be more than $0.")
                    });

                    describe('then corrected', () => {
                        beforeEach(async () => {
                            await changeBudget('0')
                        });

                        it('does not change the validation alert', () => {
                            expect(subject.current.errors.budget).toEqual("Budget must be more than $0.")
                        });
                    });
                });
            });
        });
    });

    async function changeBudget(value) {
        await act(() => {
            subject.current.changeBudget(value)
        });
    }

    async function changeName(value) {
        await act(() => {
            subject.current.changeName(value);
        });
    }

    async function changeDescription(value) {
        await act(() => {
            subject.current.changeDescription(value);
        });
    }

    async function submitForm() {
        await act(() => {
            subject.current.handleSubmit({
                preventDefault: () => {
                }
            })
        });
    }

});


jest.mock('../state/projectActions')

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn()
}))

let project;
let updatedProject;
saveProject.mockImplementation(p => p)

function arrangeProject() {
    return new Project({
        id: 1,
        name: 'Mission Impossible',
        description: 'This is really difficult',
        budget: 100,
        isActive: true
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
    const {result} = renderHook(() => useProjectForm(project));
    return result
}
