import React from 'react';
import { Button, Form, Collapse } from 'react-bootstrap'; // Import Collapse
import PropTypes from 'prop-types';

const CreateTicketForm = ({ newTicketType, setNewTicketType, handleCreateTicketType, openTicketType }) => {
    return (
        <Collapse in={openTicketType}>
            <div id="create-TicketType-collapse">
                <div className="mt-3"> {/* Add margin top to create space below the button */}
                    <div className="card">
                        <div className="card-header">
                            <div className="text-header">Create TicketType</div>
                        </div>
                        <div className="card-body">
                            <Form onSubmit={handleCreateTicketType}>
                                <div className="form-group">
                                    <label htmlFor="TicketType">Enter New TicketType:</label>
                                    <input
                                        required=""
                                        className="form-control"
                                        name="TicketType"
                                        id="TicketType"
                                        type="text"
                                        value={newTicketType}
                                        onChange={(e) => setNewTicketType(e.target.value)}
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
        CreateTicketForm.propTypes = { // Define prop types
            newTicketType: PropTypes.string.isRequired,
            setNewTicketType: PropTypes.func.isRequired,
            handleCreateTicketType: PropTypes.func.isRequired,
            openTicketType: PropTypes.bool.isRequired,
          };
          
          export default CreateTicketForm;