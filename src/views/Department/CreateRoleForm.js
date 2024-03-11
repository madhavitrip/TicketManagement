import React from 'react';
import { Button, Form, Collapse } from 'react-bootstrap'; // Import Collapse
import PropTypes from 'prop-types';

const CreateRoleForm = ({ newRoles, setNewRoles, handleCreateRole, openCreateRole}) => {
    return (
        <Collapse in={openCreateRole}>
        <div id="create-department-collapse">
            <div className="mt-3"> {/* Add margin top to create space below the button */}
                <div className="card">
                    <div className="card-header">
                        <div className="text-header">Create Role</div>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={handleCreateRole}>
                            <div className="form-group">
                                <label htmlFor="role">Enter New Role:</label>
                                <input
                                    required=""
                                    className="form-control"
                                    name="role"
                                    id="role"
                                    type="text"
                                    value={newRoles}
                                    onChange={(e) => setNewRoles(e.target.value)}
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
CreateRoleForm.propTypes = { // Define prop types
    newRoles: PropTypes.string.isRequired,
    setNewRoles: PropTypes.func.isRequired,
    handleCreateRole: PropTypes.func.isRequired,
    openCreateRole: PropTypes.bool.isRequired,
  };
  
  export default CreateRoleForm;