import React from 'react';
import { ListGroup, Button, Form, Collapse } from 'react-bootstrap'; // Import Collapse
import PropTypes from 'prop-types'; // Import PropTypes

const Tickettype = ({ ticketType, handleEdit, handleEditSubmitTicketType, newTicketType, setNewTicketType, editItem, searchQuery }) => {

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-7 mx-auto bg-white rounded shadow">
                    <div className="table-responsive">
                        <table className="table table-fixed">
                            <thead>
                                <tr className="table-header mt-3">
                                    <th scope="col" className="col-3">S.No</th>
                                    <th scope="col" className="col-6">Ticket Type</th>
                                    <th scope="col" className="col-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticketType
                                    .filter((ticket) =>
                                        ticket.ticketType?.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((ticket) => (
                                        <tr key={ticket.id} className="table-row mt-1">

                                            <td className="col col-3" data-label="SNo.">{ticket.id}</td>
                                            <td className="col col-6" data-label="TicketType">{ticket.ticketType}</td>
                                            <td className="col col-3" data-label="Actions">
                                                {editItem && editItem.id === ticket.id ? (
                                                    <Form onSubmit={(e) => handleEditSubmitTicketType(e, ticket.id, newTicketType)}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            value={newTicketType || ticket.ticketType}
                                                            onChange={(e) => setNewTicketType(e.target.value)}
                                                        />
                                                        <Button type="submit" variant="success" size="sm">
                                                            Save
                                                        </Button>
                                                    </Form>
                                                ) : (
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(ticket)}>
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </Button>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};
Tickettype.propTypes = { // Define prop types
    ticketType: PropTypes.array.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleEditSubmitTicketType: PropTypes.func.isRequired,
    newTicketType: PropTypes.string.isRequired,
    setNewTicketType: PropTypes.func.isRequired,
    searchQuery: PropTypes.func.isRequired,
    editItem: PropTypes.object,
};
export default Tickettype;