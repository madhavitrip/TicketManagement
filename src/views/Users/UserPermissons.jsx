import React, { useEffect, useState } from 'react'; 
import { Container, Row, Col, Card, Table, Form, Button,Alert } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import axios from 'axios'; 
import { useParams } from 'react-router-dom'; 
 
const PermissionPage = () => { 
  const { userId } = useParams(); 
  const parsedUserID = parseInt(userId, 10); 
  const [permissions, setPermissions] = useState([]); 
  const [modules, setModules] = useState([]); 
  const [successMessage, setSuccessMessage] = useState('');
 
  useEffect(() => { 
    // Fetch user's existing permissions 
    const fetchUserPermissions = async () => { 
      try { 
        const response = await axios.get(`https://localhost:7217/api/Permission/ByUserId/${userId}`); 
        setPermissions(response.data); 
      } catch (error) { 
        console.error('Error fetching user permissions:', error); 
      } 
    }; 
 
    fetchUserPermissions(); 
  }, [userId]); 
 
  useEffect(() => { 
    // Fetch all modules 
    const fetchModules = async () => { 
      try { 
        const response = await axios.get('https://localhost:7217/api/Modules'); 
        setModules(response.data); 
      } catch (error) { 
        console.error('Error fetching modules:', error); 
      } 
    }; 
 
    fetchModules(); 
  }, []); 
 
  const handlePermissionChange = (moduleName, permissionType, isChecked) => { 
    const updatedPermissions = [...permissions]; 
    const moduleIndex = updatedPermissions.findIndex((module) => module.name === moduleName); 
 
    if (moduleIndex !== -1) { 
      const module = updatedPermissions[moduleIndex]; 
      module[permissionType] = isChecked; 
      updatedPermissions[moduleIndex] = module; 
    } else { 
      updatedPermissions.push({ 
        name: moduleName, 
        candelete: false, 
        canview: false, 
        canadd: false, 
        canupdate: false, 
        [permissionType]: isChecked, 
      }); 
    } 
 
    setPermissions(updatedPermissions); 
  }; 
 
  const handleAddPermission = () => { 
 
      // Transform permissions to the desired format 
      const transformedPermissions = permissions.map(({ name, canview, canadd, canupdate, candelete }) => ({ 
        userId:parsedUserID, 
        id: modules.find((mod) => mod.name === name)?.id, // Assuming there is a module ID associated with each name 
        canAddOnly: canadd, 
        canDeleteOnly: candelete, 
        canUpdateOnly: canupdate, 
        canViewOnly: canview, 
      })); 
    // Send the updated permissions to your API 
    axios.post('https://localhost:7217/api/Permission', transformedPermissions) 
      .then(response => { 
        // Handle success, e.g., show a success message 
        console.log('Permissions added successfully:', response.data); 
        setSuccessMessage('Permissions added successfully');
      }) 
      .catch(error => { 
        // Handle error, e.g., show an error message 
        console.error('Error adding permissions:', error); 
      }); 
  }; 
 
  return ( 
    <Container> 
      <Row className="justify-content-center mt-5"> 
        <Col md={8}> 
          <Card> 
            <Card.Header as="h5" className="text-center">Module Permissions</Card.Header> 
            <Card.Body> 
              <Form> 
                <Table bordered> 
                  <thead> 
                    <tr> 
                      <th>Module Name</th> 
                      <th>Can View</th> 
                      <th>Can Add</th> 
                      <th>Can Update</th> 
                      <th>Can Delete</th> 
                    </tr> 
                  </thead> 
                  <tbody> 
                    {modules.length > 0 && modules.map((mod) => ( 
                      <tr key={mod.id}> 
                        <td>{mod.name}</td> 
                        <td> 
                          <Form.Check 
                            type="switch" 
                            id={`${mod.name}-canview-switch`} 
                            label="" 
                            onChange={(e) => handlePermissionChange(mod.name, 'canview', e.target.checked)} 
                            checked={permissions.some((p) => p.name === mod.name && p.canview)}
                          /> 
                        </td> 
                        <td> 
                          <Form.Check 
                            type="switch" 
                            id={`${mod.name}-canadd-switch`} 
                            label="" 
                            onChange={(e) => handlePermissionChange(mod.name, 'canadd', e.target.checked)} 
                            checked={permissions.some((p) => p.name === mod.name && p.canadd)} 
                          /> 
                        </td> 
                        <td> 
                          <Form.Check 
                            type="switch" 
                            id={`${mod.name}-canupdate-switch`} 
                            label="" 
                            onChange={(e) => handlePermissionChange(mod.name, 'canupdate', e.target.checked)} 
                            checked={permissions.some((p) => p.name === mod.name && p.canupdate)} 
                          /> 
                        </td> 
                        <td> 
                          <Form.Check 
                            type="switch" 
                            id={`${mod.name}-candelete-switch`} 
                            label="" 
                            onChange={(e) => handlePermissionChange(mod.name, 'candelete', e.target.checked)} 
                            checked={permissions.some((p) => p.name === mod.name && p.candelete)} 
                          /> 
                        </td> 
                      </tr> 
                    ))} 
                  </tbody> 
                </Table> 
              </Form> 
            </Card.Body> 
          </Card> 
        </Col> 
      </Row> 
  
      <Row className="justify-content-center mt-3"> 
        <Col md={8}> 
          <Card className="mt-3"> 
            <Card.Body> 
              <div className="permissions-summary"> 
                <h5 className="text-center mb-4">Permissions Summary</h5> 
                <ul className="list-unstyled"> 
                  {permissions.map((module, index) => ( 
                    <li key={index}> 
                      <strong>{module.name}</strong>: {Object.entries(module).filter(([key, value]) => value && key !== 'name').map(([key]) => key).join(', ')} 
                    </li> 
                  ))} 
                </ul> 
                <Button variant="primary" onClick={handleAddPermission}> 
                  Add Permission 
                </Button> 
                {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
              </div> 
            </Card.Body> 
          </Card> 
        </Col> 
      </Row> 
    </Container> 
  ); 
   
}; 
 
export default PermissionPage;