import React from 'react';
import { Button, Form, Collapse } from 'react-bootstrap'; // Import Collapse
import PropTypes from 'prop-types';

const CreateProjectForm = ({ newProject, setNewProject, handleCreateProjectType, openProject }) => {
    return (
        <Collapse in={openProject}>
            <div id="create-Project-collapse">
                <div className="mt-3"> {/* Add margin top to create space below the button */}
                    <div className="card">
                        <div className="card-header">
                            <div className="text-header">Create Project</div>
                        </div>
                        <div className="card-body">
                            <Form onSubmit={handleCreateProjectType}>
                                <div className="form-group">
                                    <label htmlFor="project">Enter New Project:</label>
                                    <input
                                        required=""
                                        className="form-control"
                                        name="project"
                                        id="project"
                                        type="text"
                                        value={newProject}
                                        onChange={(e) => setNewProject(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="btn">
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Collapse>

    );
};
CreateProjectForm.propTypes = { // Define prop types
    newProject: PropTypes.string.isRequired,
    setNewProject: PropTypes.func.isRequired,
    handleCreateProjectType: PropTypes.func.isRequired,
    openProject: PropTypes.bool.isRequired,
  };
  
  export default CreateProjectForm;