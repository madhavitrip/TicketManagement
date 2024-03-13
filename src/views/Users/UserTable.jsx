import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import $ from 'jquery';
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faPenToSquare, faTrash} from '@fortawesome/free-solid-svg-icons'
import PermissionChecker from "./../../context/PermissionChecker";
import {useSecurity} from './../../context/Security';

const UserTable = ({ users, hasPermission }) => {
  const {encrypt}= useSecurity();
  const tableRef= useRef(null)
    useEffect(() =>{
      $(tableRef.current).DataTable();
    }, [])
  return (
    <div className="table-responsive">
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile Number</th>
          <th>Department</th>
          <th>Designation</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.userId}>
            <td>{user.userId}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.mobileNo}</td>
            <td>{user.departmentName}</td>
            <td>{user.roleName}</td>
            <td className="d-flex gap-3 text-primary">
            <div className="d-flex gap-3 text-primary justify-content-center">
                  {hasPermission(1, 'canViewOnly') && <Link to={`Views/${user.userId}`}><FontAwesomeIcon icon={faEye} className="text-success"/></Link> }
                  {hasPermission(1, 'canUpdateOnly') && <Link to={`/Users/EditUser/${encrypt(user.userId)}`}><FontAwesomeIcon icon={faPenToSquare} className="text-primary"/> </Link>}
                  {hasPermission(1, 'canDeleteOnly') && <FontAwesomeIcon icon={faTrash} className="text-danger"/>}
                </div>
  
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    </div>
    
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobileNo: PropTypes.string.isRequired,
      departmentName: PropTypes.string.isRequired,
      roleName: PropTypes.string.isRequired,
    })
  ).isRequired,
  hasPermission: PropTypes.func.isRequired,
};

export default UserTable;
