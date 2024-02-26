import axios from "axios";
import React, { useState,useEffect } from 'react';
import './AddUser.css';
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const apiUrl1= process.env.REACT_APP_API_DEPARTMENTS
const apiUrl2=process.env.REACT_APP_API_ROLES
const onClickViewUser = () => {
  window.location.href = './AllUsers';
}

const AddUser = () => {
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [departments,setDepartments]=useState([]);
  const [Roles,setRoles]=useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    autoGenPass: true,
    mobileNo: '',
    departmentName: '',
    roleName: '',
    address: '',
    dateOfBirth: '',
    profilePicturePath: null,
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get('https://localhost:7217/api/DepartmentClasses');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }

    fetchDepartments();
  }, []);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get('https://localhost:7217/api/Roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching Roles:', error);
      }
    }

    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files : value,
    }));
  };

  function handleUserSubmit(event) {
    event.preventDefault();
    setLoading(true);
    console.log(formData);

    // Validate Date of Birth
    const currentDate = new Date().toISOString().split('T')[0];
    if (formData.dateOfBirth > currentDate) {
      setMessage('Date of Birth must be smaller than the current date.');
      return;
    }

    axios.post('https://localhost:7217/api/Users', formData)
      .then(res => {
        console.log(res)
        setMessage('User added successfully!');
        setLoading(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          autoGenPass: true,
          mobileNo: '',
          departmentName: '',
          roleName: '',
          address: '',
          dateOfBirth: '',
          profilePicturePath: null,
        });
     
      navigate(`/Users/AddPermissions/${res.data.userId}`);
    })
      .catch(err => {
        console.log(err);
        setMessage('Error adding User. Please try again.');
        setLoading(false);
      });
  }
  return (
    <div className=" au container mt-2">
      <div className='text-start mb-12 d-flex justify-content-between'>
        <h4>Add User</h4>
        <button type="button" className="btn btn-primary mb-3 " onClick={onClickViewUser}>
          View Users
        </button>
      </div>

      {message && (
        <div className= {`alert ${message.includes('successfully')? 'alert-success' : 'alert-danger'}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleUserSubmit}>
        {/* Username */}
        <div className="row mb-3">
          <label htmlFor="firstName" className="col-sm-1 col-form-label text-start">
            FirstName<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              placeholder="Enter FirstName"
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Lastname */}
          <label htmlFor="lastName" className="col-sm-1 col-form-label text-end">
            LastName<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              placeholder="Enter lastName"
              required
              onChange={handleInputChange}
            />
          </div>

           {/* Mobile Number */}
           <label htmlFor="mobileNo" className="col-sm-1 col-form-label text-start">
            MobileNo<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="mobileNo"
              name="mobileNo"
              placeholder="Enter Mobile No."
              required
              onChange={handleInputChange}
            />
          </div>

        </div>

        {/* Address */}
        <div className="row mb-3">
          <label htmlFor="address" className="col-sm-1 col-form-label text-end">
            Address<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="address"
              className="form-control"
              id="address"
              name="address"
              placeholder="Enter Address"
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Date of Birth */}
          <label htmlFor="dateOfBirth" className="col-sm-1 col-form-label text-end">
          DOB<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="date"
              className="form-control"
              id="dateOfBirth"
              name="dateOfBirth"
              placeholder="Enter Date Of Birth"
              required
              onChange={handleInputChange}
            />
          </div>
            {/* Email */}
          <label htmlFor="email" className="col-sm-1 col-form-label text-end">
          Email<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter email"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Password */}
        <div className="row mb-3">
          {/* <label htmlFor="password" className="col-sm-1 col-form-label text-start">
            Password:
          </label>
          <div className="col-sm-3">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter password"
              required
              onChange={handleInputChange}
            />
          </div> */}

          {/* Department */}
        
          
          <label htmlFor="departmentName" className="col-sm-1 col-form-label text-start">
            Department<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
          <select
              className="form-select"
              id="departmentName"
              name="departmentName"
             
              required
              onChange={handleInputChange}
            >
              <option value="">Select department</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.departmentName}>{dep.departmentName}</option>
              ))}
            </select>
          </div>
          {/* Designation */}
          <label htmlFor="roleName" className="col-sm-1 col-form-label text-start">
            Designation<span className="text-danger">  * </span>
          </label>
          <div className="col-sm-3">
          <select
              className="form-select"
              id="roleName"
              name="roleName"
             
              required
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              {Roles.map(role => (
                <option key={role.roleId} value={role.roleName}>{role.roleName}</option>
              ))}
            </select>
          </div>

          {/* Confirm Password
          <label htmlFor="confirmPassword" className="col-sm-3 col-form-label text-end">
            Confirm Password:
          </label>
          <div className="col-sm-3">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              required
              onChange={handleInputChange}
            /> */}
          {/* </div> */}
        </div>

        <div className="row mb-3">
          <div className="col-sm-3"></div>
          <div className="col-sm-9 text-end">
            <button type="submit" className="btn btn-primary"disabled={loading}>
              {loading? <><Spinner animation="border" size='sm'/>Adding User...</>:" Add User"}
              
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
