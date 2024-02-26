import axios from "axios";
import React, { useState,useEffect } from 'react';
import { useUser } from './../../context/UserContext';
import {  Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const onClickViewTicket = () => {
  window.location.href = '/Tickets';
}

const AddTicket = () => {
  const navigate= useNavigate();
  const { user } = useUser();
  const [loading,setLoading]= useState(false)
  const[ticketType,setTicketType]=useState([]);
  const[Assignee,setAssignee]=useState([]);
 
  const initialFormData = {
    ticketId: '0',
    email: user.email,
    priority: 'low',
    title: '',
    department: '',
    ticketType: '',
    status: 'Active',
    projectType: '',
    dueDate: '',
    description: '',
    assigneeEmail:'',
  };


  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(null);


  useEffect(() => {
    async function fetchAssignee() {
      try {
        const response = await axios.get('https://localhost:7217/api/Users');
        setAssignee(response.data);
      } catch (error) {
        console.error('Error fetching Assignee:', error);
      }
    }

    fetchAssignee();
  }, []);

  useEffect(() => {
    async function fetchTickettype() {
      try {
        const response = await axios.get('https://localhost:7217/api/TicketTypes');
        setTicketType(response.data);
      } catch (error) {
        console.error('Error fetching Ticket Type:', error);
      }
    }

    fetchTickettype();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files : value,
    }));
    
    // dept value
    if (name === 'assigneeEmail') {
      const selectedAssignee = Assignee.find(assignee => assignee.email === value);   
      if (selectedAssignee) {   
        setFormData(prevData => ({
          ...prevData,
          department: selectedAssignee.departmentName,
        }));
      } else {
        console.log('Assignee not found.');
      }
    }
  };

  async function handleUserSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (formData.dueDate < currentDate) {
      setMessage('Due Date must be greater than or equal to the current date.');
      return;
    }
  
    try {
      const res = await axios.post('https://localhost:7217/api/Ticket', formData);
      console.log(res);
      setMessage('Ticket added successfully!');
      setLoading(false);
      setFormData({
        ticketId: '0',
        email: 'user.email',
        priority: 'low',
        title: '',
        department: '',
        ticketType: '',
        status: 'Active',
        projectType: '',
        dueDate: '',
        description: '',
        assigneeEmail: '',
      });
      navigate(`/Tickets/AddTicket/${res.data.userId}`);
    } catch (err) {
      console.error(err);
      setMessage('Error adding ticket. Please try again.');
      setLoading(false);
    }
  }
  

  return (
    <div className="container mt-5">
      <div className='d-flex justify-content-between'>
        <h4>Add Ticket</h4>

        <button type="button" className="btn btn-primary mb-3 " onClick={onClickViewTicket}>
          View Tickets
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleUserSubmit}>
        {/* ticketId */}
        <div className="row mb-3">
          <label htmlFor="ticketId" className="col-sm-3 col-form-label text-end">
            Ticket ID:
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="ticketId"
              name="ticketId"
              placeholder="Ticket ID"
              required
              onChange={handleInputChange}
              disabled
              value='0'
            />
          </div>

          {/* priority */}
          <label htmlFor="priority" className="col-sm-3 col-form-label text-end">
          Priority<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <select
              className="form-select"
              id="priority"
              name="priority"
              placeholder="Select priority"
              required
              onChange={handleInputChange}
            >
              <option defaultValue>Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* title */}
        <div className="row mb-3">
          <label htmlFor="title" className="col-sm-3 col-form-label text-end">
           Title<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              placeholder="Enter title"
              required
              onChange={handleInputChange}
            />
          </div>
          {/* department */}
          <label htmlFor="department" className="col-sm-3 col-form-label text-end">
           Department<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
          <input
              className="form-control"
              id="department"
              name="department"
              value={formData.department}
              required
              onChange={handleInputChange}
              disabled
            > 
            </input>
          </div>
        </div>

        {/* Ticket Type */}
        <div className="row mb-3">
          <label htmlFor="ticketType" className="col-sm-3 col-form-label text-end">
          Ticket Type<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
          <select
              className="form-select"
              id="ticketType"
              name="ticketType"
             
              required
              onChange={handleInputChange}
            >
              <option value="">Select Ticket Type</option>
              {ticketType.map(TT => (
                <option key={TT.id} value={TT.ticketType}>{TT.ticketType}</option>
              ))}
            </select>
          </div>
          {/* status */}
          <label htmlFor="status" className="col-sm-3 col-form-label text-end">
          Status<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <select
              className="form-select"
              id="status"
              name="status"
              
              required
              onChange={handleInputChange}
            >
               <option defaultValue>Select Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Unassigned">Unassigned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Creator ID */}
        <div className="row mb-3">
          <label htmlFor="email" className="col-sm-3 col-form-label text-end">
           Creator<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your Email"
              required
              value={user.email}
              onChange={handleInputChange}
              disabled
            />
          </div>

          {/* Assigned To */}
          <label htmlFor="assigneeEmail" className="col-sm-3 col-form-label text-end">
           Assignee Email<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
          <select
              className="form-select"
              id="assigneeEmail"
              name="assigneeEmail"
              
              required
              onChange={handleInputChange}
            >
              <option selected key="self" value={user.email}>Self Assigned</option>
              {Assignee.map(Setas => (
                <option key={Setas.id} value={Setas.email}>{Setas.email}</option>
              ))}
            </select>
            
          </div>
        </div>
        {/* Project Type */}
        <div className="row mb-3">
          <label htmlFor="projectType" className="col-sm-3 col-form-label text-end">
           Project Type<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="projectType"
              name="projectType"
              placeholder="Enter Project Type"
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Due Date */}
          <label htmlFor="dueDate" className="col-sm-3 col-form-label text-end">
           Due Date<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              placeholder="Select Due Date"
              required
              onChange={handleInputChange}
            />
          </div>

        </div>

        {/* description */}
        <div className="row mb-3">
          <label htmlFor="description" className="col-sm-3 col-form-label text-end">
           Description<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-9">
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder="Enter description"
              rows="4"
              required
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        {/* Attachments */}
        <div className="row mb-3">
          <label htmlFor="attachments" className="col-sm-3 col-form-label text-end">
            Attachments:
          </label>
          <div className="col-sm-9">
            <input
              type="file"
              className="form-control"
              id="attachments"
              name="attachments"
              multiple
              onChange={handleInputChange}
            />

          </div>


        </div>

        <div className="row mb-3">
          <div className="col-sm-3"></div>
          <div className="col-sm-9 text-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading? <><Spinner animation="border" size='sm' /> Adding Ticket...</>:"Add Ticket"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTicket;
