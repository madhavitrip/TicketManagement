import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import $ from 'jquery';

const TicketsTable = ({ tickets, hasPermission, setTickets }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const tableRef = useRef(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    // Initialize DataTables
    $(tableRef.current).DataTable();
  }, []);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setModalShow(true);
  };

  const handleShowConfirmationModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setSelectedTicket(null);
    setShowConfirmationModal(false);
  };

  const handleArchiveTicket = () => {
    console.log('Archiving ticket:', selectedTicket);
    // Make API call to archive the ticket
    axios.put(`https://localhost:7217/api/Ticket/${selectedTicket.ticketId}/archive`)
      .then(response => {
        console.log('Ticket archived successfully:', response.data);
        // Update tickets state in the parent component by removing the archived ticket
        setTickets(tickets.filter(ticket => ticket.ticketId !== selectedTicket.ticketId));
      })
      .catch(error => {
        console.error('Error archiving ticket:', error);
      });
    handleCloseConfirmationModal();
  };
  
  return (
    <div className='mt-6 table-responsive'>
      <Table striped bordered hover ref={tableRef} className='table-primary'>
        <thead>
          <tr>
            <th>S.No</th>
            <th>TicketID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>TicketType</th>
            <th>DueDate</th>
            <th>Department</th>
            <th>ProjectType</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.ticketId}>
              <td>{index + 1}</td>
              <td>{ticket.ticketId}</td>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.ticketType}</td>
              <td>{new Date(ticket.dueDate).toLocaleString()}</td>
              <td>{ticket.department}</td>
              <td>{ticket.projectType}</td>
              <td>
                <div className="d-flex gap-3 text-primary justify-content-center">
                  {hasPermission(2, 'canViewOnly') &&
                    <FontAwesomeIcon icon={faEye} className="text-success" onClick={() => handleViewTicket(ticket)} />
                  }
                  {hasPermission(2, 'canUpdateOnly') &&
                    <Link to={`EditTicket/${ticket.ticketId}`}>
                      <FontAwesomeIcon icon={faPenToSquare} className="text-primary" />
                    </Link>
                  }
                  {hasPermission(2, 'canDeleteOnly') &&
                    <FontAwesomeIcon
                      icon={faClockRotateLeft}
                      className="text-danger"
                      onClick={() => handleShowConfirmationModal(ticket)}
                    />
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Archive</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to archive ticket {selectedTicket ? selectedTicket.id : ''}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleArchiveTicket}>
            Archive
          </Button>
        </Modal.Footer>
      </Modal>

      {selectedTicket && (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Ticket Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Customize modal body based on your requirements */}
            <p>Title: {selectedTicket.title}</p>
            <p>Description: {selectedTicket.description}</p>
            <p>Creator ID: {selectedTicket.email}</p>
            <p>Assignee ID: {selectedTicket.assigneeEmail}</p>
            <p>Attachments:</p>
            {selectedTicket.attachments && selectedTicket.attachments.length > 0 ? (
              <ul>
                {selectedTicket.attachments.map((attachment, idx) => (
                  <li key={idx}>{attachment}</li>
                ))}
              </ul>
            ) : (
              <p>No attachments</p>
            )}
            {/* ... Display other ticket details ... */}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

TicketsTable.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      ticketId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      ticketType: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      projectType: PropTypes.string.isRequired,
    })
  ).isRequired,
  hasPermission: PropTypes.func.isRequired,
  setTickets: PropTypes.func.isRequired, // Function to update tickets state
};

export default TicketsTable;
