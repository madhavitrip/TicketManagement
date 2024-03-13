import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import './EditTicket.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperclip, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './../../context/UserContext';
import ReactQuill from 'react-quill';  // Import ReactQuill 
import 'react-quill/dist/quill.snow.css';  // Import Quill styles 
import { useSecurity } from './../../context/Security';


const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons 
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values 
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript 
  [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent 
  [{ 'direction': 'rtl' }],                         // text direction 

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown 
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme 
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean'],                                        // remove formatting button 


];

const EditTicket = () => {
  const { user } = useUser();
  const { ticketId } = useParams();
  const {decrypt} = useSecurity();
  const decryptid = decrypt(ticketId);
  const [formData, setFormData] = useState({
    ticketId: '',
    email: '',
    priority: '',
    title: '',
    department: '',
    ticketType: '',
    status: '',
    projectType: '',
    dueDate: '',
    description: '',
    assigneeEmail: '',
    userAssigneeEmail: '',
    userTicketType: '',
    userStatus: '',
    userPriority: '',
    userComment: '',
  });
  const [showUserComment, setShowUserComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState(null);
  const [oldDetails, setOldDetails] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isImageAttachment, setIsImageAttachment] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [hovered, setHovered] = useState(false);



  useEffect(() => {
    async function fetchTicketDetails() {
      try {
        const [ticketResponse, commentsResponse, assigneesResponse, ticketTypesResponse] = await Promise.all([
          axios.get(`https://localhost:7217/api/Ticket/${decryptid}`),
          axios.get(`https://localhost:7217/api/TicketFlow/CommentsByTicketId/${decryptid}`).catch(() => ({ data: [] })),
          axios.get('https://localhost:7217/api/Users'),
          axios.get('https://localhost:7217/api/TicketTypes'),
        ]);
        setFormData(ticketResponse.data);
        setOldDetails(ticketResponse.data);
        setComments(commentsResponse.data);
        setAssignees(assigneesResponse.data);
        setTicketTypes(ticketTypesResponse.data);
      } catch (error) {
        console.error('Error fetching Ticket, Comments, Assignees, and Ticket Types:', error);
        console.log('Error details:', error.response); // Log the entire error object 
        console.log('Status code:', error.response.status);
        setMessage('Error fetching ticket, comments, assignees, and ticket types. Please try again.');
      }
    }

    fetchTicketDetails();
    setCurrentDateTime(new Date().toLocaleString());
  }, [decryptid]);

  // Function to sort comments by timestamp in descending order (newest first)  
  const sortCommentsByTimestampDesc = () => {
    const sortedComments = [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setComments(sortedComments);
  };

  // Function to sort comments by timestamp in ascending order

  const sortCommentsByTimestampAsc = () => {
    const sortedComments = [...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setComments(sortedComments);
  };


  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  }
  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const markAsCompleted = async () => {
    try {
      // Send a request to update the ticket status to "Completed" 
      const response = await axios.put(`https://localhost:7217/api/Ticket/MarkCompleted/${decryptid}`, {
        status: 'Completed',
      });

      console.log('Response:', response);

      // Check if the update was successful 
      if (response.status === 200 || response.status === 204) {
        // Update local state to reflect the new status 
        setFormData((prevData) => ({
          ...prevData,
          status: 'Completed',
        }));
        setMessage('Ticket marked as completed successfully!');
      } else {
        setMessage('Error marking ticket as completed. Please try again.');
      }
    } catch (error) {
      console.error('Error marking ticket as completed:', error);
      setMessage('Error marking ticket as completed.');
    }
  };



  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files : value,
    }));
  };

  const handleToggleUserComment = () => {
    // Check if there are any comments
    if (comments.length > 0) {
      const lastComment = comments[comments.length - 1];
      // Set the initial state of the form fields with the data from the last comment
      setFormData({
        ...formData,
        userAssigneeEmail: lastComment.newAssigneeEmail,
        userTicketType: lastComment.newTicketType,
        userStatus: lastComment.newStatus,
        userPriority: lastComment.newPriority,
      });
    }
    setShowUserComment(!showUserComment);
  };


  const handleUserCommentChange = (value) => {
    setNewComment(value);
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();

    // Check if the current user is the creator, assignee, or reassignee 
    const isCreator = user.email === formData.email;
    const isAssignee = user.email === formData.assigneeEmail;
    const isReassignee = user.email === formData.userAssigneeEmail;

    if (!isCreator && !isAssignee && !isReassignee) {
      setMessage('You are not authorized to comment on this ticket.');
      return;
    }

    try {
      const params = {
        firstName: user.firstName,
        prev: formData.assigneeEmail,
        pre: formData.status,
        newp: formData.userPriority,
        pret: formData.ticketType,
        newa: formData.userAssigneeEmail,
        newt: formData.userTicketType,
        news: formData.userStatus,
        prep: formData.priority,
        ticketid: formData.ticketId,
        timestamp: new Date().toISOString(),
        comment: newComment,
      };

      const url = `https://localhost:7217/api/TicketFlow?${new URLSearchParams(params).toString()}`;

      let bodyFormData = new FormData();

      if (attachedFile) {
        // Append the file to the FormData 
        bodyFormData.append('attachments', attachedFile, attachedFile.name);
      }

      // Log FormData and file details to the console 
      console.log('FormData:', bodyFormData);
      console.log('File uploaded:', attachedFile);

      const response = await axios.post(url, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);

      setComments([...comments, response.data]);
      setNewComment('');
      setMessage('Comment submitted successfully!');
      // Update old details after successful comment submission 
      setOldDetails(formData);
    } catch (error) {
      console.error('Error submitting comment:', error);
      console.log('Error details:', error.response); // Log the entire error object 
      console.log('Status code:', error.response.status);
      setMessage('Error submitting comment. Please try again.');
    }
  };


  const handleShowAttachmentModal = () => {
    if (
      formData.attachments.toLowerCase().endsWith('.png') ||
      formData.attachments.toLowerCase().endsWith('.jpg') ||
      formData.attachments.toLowerCase().endsWith('.jpeg') ||
      formData.attachments.toLowerCase().endsWith('.gif') ||
      formData.attachments.toLowerCase().endsWith('.bmp')
    ) {
      setIsImageAttachment(true);

      // Show the modal 
      setShowAttachmentModal(true);
    } else {
      window.open(`https://localhost:7217/${formData.attachments.replace('wwwroot/', '')}`, '_blank');
    }
  };


  const handleCloseAttachmentModal = () => {
    setShowAttachmentModal(false);
  };

  return (
    <div className="container mt-3">
      <div className='d-flex justify-content-between '>
        <h4>Ticket Section</h4>
        {user.email === formData.email && (
          <Button onClick={markAsCompleted} disabled={formData.status === 'Completed'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {hovered ? <FontAwesomeIcon icon={faCheck} /> : ' '}
            {formData.status === 'Completed' ? 'Completed' : 'Mark as Completed'}

          </Button>
        )}
      </div>
      <Row>
        <Col>
          <label htmlFor="email" className="col-form-label text-end">
            CreatorID:
          </label>
          <div className="">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              required
              disabled
            />
          </div>
        </Col>
        <Col>
          <label htmlFor="title" className="col-form-label text-end">
            Title:
          </label>
          <div className="">
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              required
              onChange={handleInputChange}
              disabled
            />
          </div>
        </Col>
        <Col>
          <label htmlFor="department" className="col-form-label text-end">
            Department:
          </label>
          <div className="">
            <input
              type="text"
              className="form-control"
              id="department"
              name="department"
              value={formData.department}
              required
              disabled
            />
          </div>
        </Col>
        <Col>
          <label htmlFor="projectType" className="col-form-label text-end">
            Project Type:
          </label>
          <div className=""
          >
            <input
              type="text"
              className="form-control"
              id="projectType"
              name="projectType"
              value={formData.projectType}
              required
              onChange={handleInputChange}
              disabled
            />
          </div>
        </Col>
        <Col>
          <label htmlFor="dueDate" className="col-form-label text-end">
            Due Date:
          </label>
          <div className="">
            <input
              type="text"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
              required
              onChange={handleInputChange}
              disabled
            />
          </div>
        </Col>


        {/* Attachment Modal */}
        <Modal show={showAttachmentModal} onHide={handleCloseAttachmentModal}>
          <Modal.Header closeButton>
            <Modal.Title>Attachment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Check if formData.attachment is defined before processing */}

            {isImageAttachment && (<img src={`https://localhost:7217/${formData.attachments.replace('wwwroot/', '')}`} alt="Attachment" className="img-fluid" />)}


          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAttachmentModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </Row>

      <h5 className="mt-3 d-flex align-items-center justify-content-between">
        <div>
          Discussion Forum
          <Button className="ms-2 btn-sm" onClick={sortCommentsByTimestampDesc}>
            Sort by Newest
          </Button>
          <Button className="ms-2 btn-sm" onClick={sortCommentsByTimestampAsc}>
            Sort by Oldest
          </Button>
        </div>
        <div>
          <Button onClick={toggleCollapse}>
            {collapsed ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-angle-up"></i>}
          </Button>
        </div>

      </h5>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message}
        </div>
      )}

      <Row>
        <Col md={collapsed ? 12 : 9}>
          {/* main data  */}
          <Row>
            <Col md={7}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <label htmlFor="description" className="col-form-label text-end">
                  Description:
                </label>
                <FontAwesomeIcon icon={faCommentDots} className="me-2" onClick={handleToggleUserComment} />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  required
                  onChange={handleInputChange}
                  rows="6"
                  disabled
                />

                {/* Show Attachment Button */}
                {formData.attachments && (
                  <Col>
                    <Button className="mt-3" onClick={handleShowAttachmentModal}>
                      <FontAwesomeIcon icon={faPaperclip} className="me-2" />
                      Show Attachment
                    </Button>
                  </Col>
                )}

              </div>
            </Col>
            <Col md={5}>
              <h5 className="mb-3">Ticket Information</h5>
              <Form>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4}>
                    Assignee:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Select value={formData.assigneeEmail} onChange={handleInputChange} name="assigneeEmail" disabled>
                      <option value="">Select Assignee</option>
                      {assignees.map((assignee) => (
                        <option key={assignee.id} value={assignee.email}>
                          {assignee.email}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4}>
                    Ticket Type:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Select value={formData.ticketType} onChange={handleInputChange} name="ticketType" disabled>
                      <option value="">Select Ticket Type</option>
                      {ticketTypes.map((type) => (
                        <option key={type.id} value={type.ticketType}>
                          {type.ticketType}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4}>
                    Status:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Select value={formData.status} onChange={handleInputChange} name="status" disabled>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Unassigned">Unassigned</option>
                      <option value="Completed">Completed</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4}>
                    Priority:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Select value={formData.priority} onChange={handleInputChange} name="priority" disabled>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Form>
            </Col>
          </Row>

          {/* my commente */}

          {showUserComment && (
            <Row>
              <Col md={7}>
                <div className="mt-3">
                  <label htmlFor="userComment" className="col-form-label text-end">
                    Your Comment:
                  </label>
                  <div className="mb-3">
                    {/* Use ReactQuill only for the user's comment */}
                    <ReactQuill
                      value={newComment}
                      onChange={handleUserCommentChange}
                      modules={{ toolbar: toolbarOptions }}
                    />
                  </div>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="attachedFile">Attach File</Form.Label>
                  <Form.Control
                    type="file"
                    id="attachedFile"
                    name="attachedFile"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Row className="mt-3">
                  <Form>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Assignee:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select value={formData.userAssigneeEmail} onChange={handleInputChange} name="userAssigneeEmail">
                          <option value="">Select Assignee Email</option>
                          {assignees.map((assignee) => (
                            <option key={assignee.id} value={assignee.email}>
                              {assignee.email}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Ticket Type:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select value={formData.userTicketType} onChange={handleInputChange} name="userTicketType">
                          <option value="">Select Ticket Type</option>
                          {ticketTypes.map((type) => (
                            <option key={type.id} value={type.ticketType}>
                              {type.ticketType}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Status:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select value={formData.userStatus} onChange={handleInputChange} name="userStatus">
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Unassigned">Unassigned</option>
                          <option value="Completed">Completed</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Priority:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select value={formData.userPriority} onChange={handleInputChange} name="userPriority">
                          <option value="">Select Priority</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>
                  </Form>
                </Row>
                <Button className="mt-3" onClick={handleUserSubmit}>
                  Submit Your Comment
                </Button>
              </Col>
            </Row>
          )}

          {/* comments   */}
          {comments.map((comment, index) => (
            <>
              <Row key={index} className='border p-2 align-items-center'>
                <Col md={7}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <label htmlFor="description" className="col-form-label text-end">
                      <p>Comment by {comment.firstName} at {new Date(comment.timestamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                    </label>
                  </div>
                  <div className="mb-3">
                    <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
                    {/* Use dangerouslySetInnerHTML to render HTML tags */}
                    {comment.attachments && (
                      <div>
                        <strong></strong>
                        <a href={`https://localhost:7217/${comment.attachments.replace('wwwroot/', '')}`} target="_blank" rel="noopener noreferrer">
                          {'View Attachment'}
                        </a>
                      </div>
                    )}
                  </div>



                </Col>
                <Col md={5}>
                  <Form>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Assignee:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select name="assigneeEmail" disabled>
                          <option value="">{comment.newAssigneeEmail}</option>

                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Ticket Type:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select name="ticketType" disabled>
                          <option value="">{comment.newTicketType}</option>

                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Status:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select name="status" disabled>
                          <option value="">{comment.newStatus}</option>

                        </Form.Select>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={4}>
                        Priority:
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Select name="priority" disabled>
                          <option value="">{comment.newPriority}</option>

                        </Form.Select>
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </>
          ))}



        </Col>
        {!collapsed && (
          <Col md={3} className="border-start border-end border-2">
            {/* Progress Tracker */}
            <div>
              <h5 className="mb-3">Progress Tracker</h5>
              <ul className="list-group">
                {comments.map((comment, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{new Date(comment.timestamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</strong>
                    <br />
                    {comment.newAssigneeEmail && (
                      <span>
                        Assigned to: {comment.newAssigneeEmail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default EditTicket;
