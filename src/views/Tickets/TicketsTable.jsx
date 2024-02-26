import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Ticket.css';
import PermissionChecker from './../../context/PermissionChecker';

const TicketsTable = ({ tickets, hasPermission }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    $(tableRef.current).DataTable();
  }, []);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setModalShow(true);
  };
  return (

    <div className='mt-6 table-responsive '>
      <Table striped bordered hover="sm">
        <Table striped bordered hover ref={tableRef} className='table-primary ' >
          <thead>
            <tr>
              <th>S.No</th>
              <th>TicketID</th>
              {/* <th>CreatorEmail</th> */}
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>TicketType</th>
              <th>DueDate</th>
              <th>Department</th>
              <th>ProjectType</th>
              {/* <th>AssignedTo</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket.ticketId}>
                <td>{index + 1}</td>
                <td>{ticket.ticketId}</td>
                {/* <td>{ticket.email}</td> */}
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.ticketType}</td>
                <td>{new Date(ticket.dueDate).toLocaleString()}</td>
                <td>{ticket.department}</td>
                <td>{ticket.projectType}</td>
                {/* <td>{ticket.assigneeEmail}</td> */}
                <td>
                  <div className="d-flex gap-3 text-primary justify-content-center">
                    {hasPermission(2, 'canViewOnly') &&
                      <FontAwesomeIcon icon={faEye} className="text-success" />
                    }
                    {hasPermission(2, 'canUpdateOnly') && <Link to={`EditTicket/${ticket.ticketId}`}>
                      <FontAwesomeIcon icon={faPenToSquare} className="text-primary" />
                    </Link>}
                    {hasPermission(2, 'canDeleteOnly') && <FontAwesomeIcon icon={faTrash} className="text-danger" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Table>

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
      ticketId:
        PropTypes.number.isRequired,
      // email: PropTypes.string.isRequired, 
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      ticketType: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      projectType: PropTypes.string.isRequired,
      // assigneeEmail: PropTypes.string.isRequired, 
    })
  ).isRequired,
  hasPermission: PropTypes.func.isRequired,
};

export default TicketsTable;