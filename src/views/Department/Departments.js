import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button, Form, Table, Tab } from 'react-bootstrap';
import DepartmentList from './DepartmentList';
import CreateDepartmentForm from './CreateDepartmentForm';
import axios from 'axios';
import './Department.css';
import Roles from './Roles';
import CreateRoleForm from './CreateRoleForm';
import Tickettype from './TicketType';
import CreateTicketForm from './CreateTicketForm';
import ProjectType from './ProjectType';
import CreateProjectForm from './CreateProjForm';

const Departments = () => {
    // Define your state variables
    const [openCreateDepartment, setOpenCreateDepartment] = useState(false);
    const [activeTab, setActiveTab] = useState('departments');
    const [departments, setDepartments] = useState([]); // Define departments state
    const [editItem, setEditItem] = useState(null); // Define editItem state
    const [newDepartment, setNewDepartment] = useState(''); // Define newDepartment state
    const [roles, setRoles] = useState([]);
    const [newRoles, setNewRoles] = useState('');
    const [openCreateRole, setOpenCreateRole] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [ticketType, setTicketTypes] = useState([]);
    const [newTicketType, setNewTicketType] = useState('')
    const [openTicketType, setOpenTicketType] = useState(false);
    const [project, setProject] = useState([]);
    const [newProject, setNewProject] = useState('');
    const [openProject, setOpenProject] = useState(false);


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
    }, []);


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    // Define your event handling functions
    const handleEdit = (item) => {
        console.log('Edit item:', item);
        setEditItem(item);
    };

    const handleEditSubmit = async (e, id, updatedValue) => {
        e.preventDefault();
        // Check if there is a change in the department name 
        if (updatedValue !== '' && updatedValue !== null && updatedValue !== undefined) {
            try {
                await axios.put(`https://localhost:7217/api/DepartmentClasses/${id}`, {
                    id: id,
                    departmentName: updatedValue,
                });

                setDepartments((prevDepartments) =>
                    prevDepartments.map((dept) =>
                        dept.id === id ? { ...dept, departmentName: updatedValue } : dept
                    )
                );
            } catch (error) {
                console.error('Error updating item:', error);
            }
        }

        setEditItem(null);
        setNewDepartment('');
    };
    const handleEditSubmitRole = async (e, id, updatedValue) => {
        e.preventDefault();
        try {
            await axios.put(`https://localhost:7217/api/Roles/${id}`, {
                roleId: id,
                role: updatedValue,
            });

            setRoles((prevRoles) =>
                prevRoles.map((role) =>
                    role.roleId === id ? { ...role, role: updatedValue } : role
                )
            );

            setEditItem(null);
            setNewRoles(''); // Reset newRoles state after submitting 
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };
    const handleEditSubmitTicketType = async (e, id, updatedValue) => {
        e.preventDefault();
        try {
            await axios.put(`https://localhost:7217/api/TicketTypes/${id}`, {
                id: id,
                ticketType: updatedValue,
            });

            setTicketTypes((prevTicketTypes) =>
                prevTicketTypes.map((ticket) =>
                    ticket.id === id ? { ...ticket, ticketType: updatedValue } : ticket
                )
            );

            setEditItem(null);
            setNewTicketType(''); // Reset newTicketType state after submitting 
        } catch (error) {
            console.error('Error updating ticket type:', error);
        }
    };

    const handleEditSubmitProject = async (e, id, updatedValue) => {
        e.preventDefault();
        try {
            await axios.put(`https://localhost:7217/api/ProjectType/${id}`, {
                id: id,
                name: updatedValue,
            });

            setProject((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === id ? { ...project, name: updatedValue } : project
                )
            );

            setEditItem(null);
            setNewProject(''); // Reset newProject state after submitting 
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };


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
                    role: newRoles,
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
                    projectTypes: newProject,
                });

                // Update the state with the new department from the server respons

                setProject([...project, response.data]);
                setNewProject('');
            } catch (error) {
                console.error('Error creating Project Name:', error);
            }
        }
    };
    const handleCreateTicketType = async (e, hasPermission) => {
        e.preventDefault();
        if (newTicketType.trim() !== '' && hasPermission(3, "canAddOnly")) {
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

    // Other state variables and functions

    return (
        <Container>
            <Row>
                {/* Department List */}
                <Col md={12}>
                    <div className='row mb-3 justify-content-between display flex'>

                        <h4 className='col-sm-3'>Categories</h4>
                        <Form className='col-sm-3'>
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </Form>


                    </div>
                    <div className="col-md-6">
    

                    <div className="tab-container ">
                        <input type="radio" name="tab" id="tab1" className="tab tab--1" checked={activeTab === 'departments'} onChange={() => setActiveTab('departments')} />
                        <label className="tab_label" htmlFor="tab1">Departments</label>

                        <input type="radio" name="tab" id="tab2" className="tab tab--2" checked={activeTab === 'roles'} onChange={() => setActiveTab('roles')} />
                        <label className="tab_label" htmlFor="tab2">Roles</label>

                        <input type="radio" name="tab" id="tab3" className="tab tab--3" checked={activeTab === 'ticketType'} onChange={() => setActiveTab('ticketType')} />
                        <label className="tab_label" htmlFor="tab3">Ticket Types</label>

                        <input type="radio" name="tab" id="tab4" className="tab tab--4" checked={activeTab === 'project'} onChange={() => setActiveTab('project')} />
                        <label className="tab_label" htmlFor="tab4">Projects</label>

                        <div className="indicator"></div>
                    </div>
                    </div>
                    <Container>
                        {/* Other JSX code */}
                        {activeTab === 'departments' && (
                            <Row>
                                <Col md={6}>

                                    <DepartmentList
                                        departments={departments}
                                        handleEdit={handleEdit}
                                        handleEditSubmit={handleEditSubmit}
                                        newDepartment={newDepartment}
                                        setNewDepartment={setNewDepartment}
                                        editItem={editItem}
                                        searchQuery={searchQuery} // Pass search query as prop
                                    
                                    />
                                </Col>
                                <Col md={6} className="position-relative">
                                    <Button
                                        onClick={() => setOpenCreateDepartment(!openCreateDepartment)}
                                        aria-controls="create-department-collapse"
                                        aria-expanded={openCreateDepartment}
                                        className="mb-3 position-absolute top-0 end-0"
                                    >
                                        Create
                                    </Button>
                                    <CreateDepartmentForm
                                        newDepartment={newDepartment}
                                        setNewDepartment={setNewDepartment}
                                        handleCreateDepartment={handleCreateDepartment}
                                        openCreateDepartment={openCreateDepartment} // Pass openCreateDepartment as a prop
                                    />
                                </Col>
                            </Row>
                        )}
                        {activeTab === 'roles' && (
                            <Row>
                                <Col md={6}>

                                    <Roles
                                        roles={roles}
                                        handleEdit={handleEdit}
                                        handleEditSubmitRole={handleEditSubmitRole}
                                        newRoles={newRoles}
                                        setNewRoles={setNewRoles}
                                        editItem={editItem}

                                        searchQuery={searchQuery}
                                    />
                                </Col>
                                <Col md={6} className="position-relative">
                                    <Button
                                        onClick={() => setOpenCreateRole(!openCreateRole)}
                                        aria-controls="create-role-collapse"
                                        aria-expanded={openCreateRole}
                                        className="mb-3 position-absolute top-0 end-0"
                                    >
                                        Create
                                    </Button>
                                    <CreateRoleForm
                                        newRoles={newRoles}
                                        setNewRoles={setNewRoles}
                                        handleCreateRole={handleCreateRole}
                                        openCreateRole={openCreateRole}
                                    />
                                </Col>
                            </Row>
                        )}
                        {activeTab === 'ticketType' && (
                            <Row>
                                <Col md={6}>

                                    <Tickettype
                                        ticketType={ticketType}
                                        handleEdit={handleEdit}
                                        handleEditSubmitTicketType={handleEditSubmitTicketType}
                                        newTicketType={newTicketType}
                                        setNewTicketType={setNewTicketType}
                                        editItem={editItem}

                                        searchQuery={searchQuery}
                                    />
                                </Col>
                                <Col md={6} className="position-relative">
                                    <Button
                                        onClick={() => setOpenTicketType(!openTicketType)}
                                        aria-controls="create-tickettype-collapse"
                                        aria-expanded={openTicketType}
                                        className="mb-3 position-absolute top-0 end-0"
                                    >
                                        Create
                                    </Button>
                                    <CreateTicketForm
                                        newTicketType={newTicketType}
                                        setNewTicketType={setNewTicketType}
                                        handleCreateTicketType={handleCreateTicketType}
                                        openTicketType={openTicketType}
                                    />
                                </Col>
                            </Row>
                        )}
                        {activeTab === 'project' && (
                            <Row>
                                <Col md={6}>

                                    <ProjectType
                                        project={project}
                                        handleEdit={handleEdit}
                                        handleEditSubmitProject={handleEditSubmitProject}
                                        newProject={newProject}
                                        setNewProject={setNewProject}
                                        editItem={editItem}

                                        searchQuery={searchQuery}
                                    />
                                </Col>
                                <Col md={6} className="position-relative">
                                    <Button
                                        onClick={() => setOpenProject(!openProject)}
                                        aria-controls="create-role-collapse"
                                        aria-expanded={openProject}
                                        className="mb-3 position-absolute top-0 end-0"
                                    >
                                        Create
                                    </Button>
                                    <CreateProjectForm
                                        newProject={newProject}
                                        setNewProject={setNewProject}
                                        handleCreateProjectType={handleCreateProjectType}
                                        openProject={openProject}
                                    />
                                </Col>
                            </Row>
                        )}

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
        </Container>
    );
};

export default Departments;
