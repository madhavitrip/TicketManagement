import React, { useState, useEffect } from "react";
import UserTable from "./UserTable";
import { Container, Button, Modal } from "react-bootstrap";
import PermissionChecker from "./../../context/PermissionChecker";
import AddUser from "./AddUser";

const apiUrl = process.env.REACT_APP_API_USERS;
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const OnClickAddUser = () => {
    handleShow();
  }

  useEffect(() => {
    // Fetch user data from the API
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        // Map properties to match UserTable expectations
        const mappedUsers = data.map((user) => ({
          userId: user.userId,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          mobileNo: user.mobileNo,
          departmentName: user.departmentName,
          roleName: user.roleName,
        }));

        setUsers(mappedUsers);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <PermissionChecker>
      {({ hasPermission }) => (
        <Container className="userform border border-3 p-4 my-3">
          <div className="d-flex justify-content-between m-3">
            <h3>Users</h3>
            {hasPermission(1, "canAddOnly") && (
              <>
                <Button
                  type='button'
                  to="AddUser/"
                  className="btn"
                  onClick={OnClickAddUser}
                >
                  Add User
                </Button>
                <Modal show={showModal} onHide={handleClose} className='space-y-6 ' dialogClassName="modal-lg">
                  <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <AddUser />
                  </Modal.Body>
                  <Modal.Footer>
                    {/* <Button variant="secondary" onClick={handleClose}> 
            Close 
          </Button> 
          <Button variant="primary" onClick={handleClose}> 
            Save Changes 
          </Button> */}
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </div>
          <hr />
          <UserTable users={users} hasPermission={hasPermission} />
        </Container>
      )}
    </PermissionChecker>
  );
};

export default AllUsers;
