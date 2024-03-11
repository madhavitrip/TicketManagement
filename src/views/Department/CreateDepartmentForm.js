// CreateDepartmentForm.js
import React from 'react';
import { Button, Form, Collapse } from 'react-bootstrap'; // Import Collapse
import PropTypes from 'prop-types'; // Import PropTypes
import './Department.css';

const CreateDepartmentForm = ({ newDepartment, setNewDepartment, handleCreateDepartment, openCreateDepartment}) => {
  return (
    <Collapse in={openCreateDepartment}>
      <div id="create-department-collapse">
        <div className="mt-3">
          <div className="glassmorphism-card">
            <div className="card-header">
              <div className="text-header fw-bold fs-3" style={{color:'#5856d6'}}>Create Department</div>
            </div>
            <div className="card-body ">
              <Form onSubmit={handleCreateDepartment}>
                <div className="form-group">
                  <label htmlFor="department">Enter New Department:</label>
                  <input
                    required=""
                    className="form-control"
                    name="department"
                    id="department"
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                  />
                </div>
                <Button type="submit" className="btn">Submit</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Collapse>
  );
};

CreateDepartmentForm.propTypes = { // Define prop types
  newDepartment: PropTypes.string.isRequired,
  setNewDepartment: PropTypes.func.isRequired,
  handleCreateDepartment: PropTypes.func.isRequired,
  openCreateDepartment: PropTypes.bool.isRequired,
};

export default CreateDepartmentForm;
