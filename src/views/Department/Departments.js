import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Nav, Tab, Collapse, Form, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import './Department.css';
import PermissionChecker from './../../context/PermissionChecker';

const Department = (hasPermission) => {
    const [activeTab, setActiveTab] = useState('departments');
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState('');
    const [openCreateDepartment, setOpenCreateDepartment] = useState(true);
    const [roles, setRoles] = useState([]);
    const [newRoles, setNewRoles] = useState('');
    const [openCreateRole, setOpenCreateRole] = useState(false);
    const [project, setProject] = useState([]);
    const [newProject, setNewProject] = useState('');
    const [openProject, setOpenProject] = useState(false);
    const [ticketType, setTicketTypes] = useState([]);
    const [newTicketType, setNewTicketType] = useState('')
    const [openTicketType, setOpenTicketType] = useState(false);

    // Fetch departments from the API when the component mounts 
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/DepartmentClasses');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    // Fetch roles from the API when the component mounts 
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/Roles');
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    // Fetch projects from the API when the component mounts 
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/ProjectType');
                setProject(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    // Fetch ticket types from the API when the component mounts 
    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/TicketTypes');
                setTicketTypes(response.data);
            } catch (error) {
                console.error('Error fetching ticket types:', error);
            }
        };

        fetchTicketTypes();
    }, []); // Empty dependency array ensures this effect runs only once on mount 

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        if (newDepartment.trim() !== '') {
            try {
                // Send a POST request to create a new department 
                const response = await axios.post('https://localhost:7217/api/DepartmentClasses', {
                    departmentName: newDepartment,
                });

                // Update the state with the new department from the server response 
                setDepartments([...departments, response.data]);
                setNewDepartment('');
            } catch (error) {
                console.error('Error creating department:', error);
            }
        }
    };
    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (newRoles.trim() !== '') {
            try {
                // Send a POST request to create a new department 
                const response = await axios.post('https://localhost:7217/api/Roles', {
                    roleName: newRoles,
                });

                // Update the state with the new department from the server response 
                setRoles([...roles, response.data]);
                setNewRoles('');
            } catch (error) {
                console.error('Error creating Role:', error);
            }
        }
    };
    const handleCreateProjectType = async (e) => {
        e.preventDefault();
        if (newProject.trim() !== '') {
            try {
                // Send a POST request to create a new department 
                const response = await axios.post('https://localhost:7217/api/ProjectType', {
                    name: newProject,
                });

                // Update the state with the new department from the server response 
                setProject([...project, response.data]);
                setNewProject('');
            } catch (error) {
                console.error('Error creating Project Name:', error);
            }
        }
    };
    const handleCreateTicketType = async (e) => {
        e.preventDefault();
        if (newTicketType.trim() !== '') {
            try {
                // Send a POST request to create a new department 
                const response = await axios.post('https://localhost:7217/api/TicketTypes', {
                    ticketType: newTicketType,
                });

                // Update the state with the new department from the server response 
                setTicketTypes([...ticketType, response.data]);
                setNewTicketType('');
            } catch (error) {
                console.error('Error creating Ticket Type:', error);
            }
        }
    };

    return (
        <Container>
            <Row>
                {/* Department List */}
                <Col md={12}>
                    <h4>Categories</h4>
                    <Nav justify variant="tabs" defaultActiveKey="departments">
                        <Nav.Item>
                            <Nav.Link eventKey="departments" onClick={() => setActiveTab('departments')}>Departments</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="roles" onClick={() => setActiveTab('roles')}>Roles</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="ticketType" onClick={() => setActiveTab('ticketType')}>Ticket Types</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="project" onClick={() => setActiveTab('project')}>Projects</Nav.Link>
                        </Nav.Item>
                    </Nav>


                    <Container>
                        {/* Department List */}
                        {
                            activeTab === 'departments' &&
                            <Row>
                                <Col md={6}>
                                    <h4>Departments</h4>
                                    <ListGroup>
                                        <ul className="responsive-table">
                                            <li className="table-header mt-3">
                                                <div className="col col-1">SNo.</div>
                                                <div className="col col-2">Department</div>
                                            </li>
                                            {departments.map((dept) => (
                                                <ListGroup.Item key={dept.id}>
                                                    <li className="table-row mt-1">
                                                        <div className="col col-1" data-label="SNo.">{dept.id}</div>
                                                        <div className="col col-2" data-label="Department">{dept.departmentName}</div>
                                                    </li>
                                                </ListGroup.Item>
                                            ))}
                                        </ul>
                                    </ListGroup>
                                </Col>

                                {/* Create Department Form */}
                                <Col md={6} className="position-relative">
                                    {hasPermission(3, "canAddOnly") &&
                                        <Button
                                            onClick={() => setOpenCreateDepartment(!openCreateDepartment)}
                                            aria-controls="create-department-collapse"
                                            aria-expanded={openCreateDepartment}
                                            className="mb-3 position-absolute top-0 end-0"

                                        >
                                            Create
                                        </Button>
                                    }
                                    {
                                        openCreateDepartment && (
                                            <Collapse in={openCreateDepartment}>
                                                <div id="create-department-collapse">
                                                    <div className="mt-3"> {/* Add margin top to create space below the button */}
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="text-header">Create Department</div>
                                                            </div>
                                                            <div className="card-body">
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
                                                                    <Button type="submit" className="btn">
                                                                        Submit
                                                                    </Button>
                                                                </Form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Collapse>
                                        )
                                    }
                                </Col>
                            </Row>
                        }

                        {/* Container for Roles */}
                        {
                            activeTab === 'roles' &&
                            <Row>
                                <Col md={6}>
                                    <h4>Roles</h4>
                                    <ListGroup>
                                        <ul className="responsive-table">
                                            <li className="table-header mt-3">
                                                <div className="col col-1">SNo.</div>
                                                <div className="col col-2">Roles</div>
                                            </li>
                                            {roles.map((role) => (
                                                <ListGroup.Item key={role.roleId}>
                                                    <li className="table-row mt-1">
                                                        <div className="col col-1" data-label="SNo.">{role.roleId}</div>
                                                        <div className="col col-2" data-label="Roles">{role.roleName}</div>
                                                    </li>
                                                </ListGroup.Item>
                                            ))}
                                        </ul>
                                    </ListGroup>
                                </Col>
                                {/* Create Role Form */}
                                <Col md={6} className="position-relative">
                                {hasPermission(3, "canAddOnly") &&
                                        <Button
                                            onClick={() => setOpenCreateRole(!openCreateRole)}
                                            aria-controls="create-role-collapse"
                                            aria-expanded={openCreateRole}
                                            className="mb-3 position-absolute top-0 end-0"

                                        >
                                            Create
                                        </Button>
                                    }
                                {
                                    openCreateRole && (
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
                                    )}
                            </Col>
                            </Row>
                        }
                    {
                        activeTab === 'project' &&

                        <Row>
                            {/* Project List */}
                            <Col md={6}>
                                <h4>Projects</h4>
                                <ListGroup>
                                    <ul className="responsive-table">
                                        <li className="table-header mt-3">
                                            <div className="col col-1">SNo.</div>
                                            <div className="col col-2">Projects</div>
                                        </li>
                                        {project.map((project) => (
                                            <ListGroup.Item key={project.id}>
                                                <li className="table-row mt-1">
                                                    <div className="col col-1" data-label="SNo.">{project.id}</div>
                                                    <div className="col col-2" data-label="Project">{project.name}</div>
                                                </li>
                                            </ListGroup.Item>
                                        ))}
                                    </ul>
                                </ListGroup>
                            </Col>

                            {/* Create Department Form */}
                            <Col md={6} className="position-relative">
                                <Button
                                    onClick={() => setOpenProject(!openProject)}
                                    aria-controls="create-project-collapse"
                                    aria-expanded={openProject}
                                    className="mb-3 position-absolute top-0 end-0"

                                >
                                    Create
                                </Button>
                                {
                                    openProject && (
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
                                    )}
                            </Col>
                        </Row>
                    }
                    {
                        activeTab === 'ticketType' &&

                        <Row>
                            {/*TicketType List */}
                            <Col md={6}>
                                <h4>Ticket</h4>
                                <ListGroup>
                                    <ul className="responsive-table">
                                        <li className="table-header mt-3">
                                            <div className="col col-1">SNo.</div>
                                            <div className="col col-2">TicketType</div>

                                        </li>
                                        {ticketType.map((ticket) => (
                                            <ListGroup.Item key={ticket.id}>
                                                <li className="table-row mt-1">
                                                    <div className="col col-1" data-label="SNo.">{ticket.id}</div>
                                                    <div className="col col-2" data-label="TicketType">{ticket.ticketType}</div>
                                                </li>
                                            </ListGroup.Item>
                                        ))}
                                    </ul>
                                </ListGroup>
                            </Col>

                            {/* Create TicketType Form */}
                            <Col md={6} className="position-relative">
                                <Button
                                    onClick={() => setOpenTicketType(!openTicketType)}
                                    aria-controls="create-TicketType-collapse"
                                    aria-expanded={openTicketType}
                                    className="mb-3 position-absolute top-0 end-0"

                                >
                                    Create
                                </Button>
                                {
                                    openTicketType && (
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
                                    )}
                            </Col>
                        </Row>
                    }
                </Container>
                <Tab.Content>
                    <Tab.Pane eventKey="departments">
                        <Table responsive hover bordered striped>

                        </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey="roles">
                        <Table responsive hover bordered striped>

                        </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey="ticketType">
                        <Table responsive hover bordered striped>

                        </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey="project">
                        <Table responsive hover bordered striped>
                            {/* Render project data here */}

                        </Table>
                    </Tab.Pane>
                </Tab.Content>


            </Col>



        </Row>
        </Container >
    );
};

export default Department;