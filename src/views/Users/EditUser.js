import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {useSecurity} from './../../context/Security';

const EditUser = () => {
    const [message, setMessage] = useState(null);
    const { userId } = useParams();
    const {decrypt} = useSecurity();
    const decryptid = decrypt(userId)
    const [formData, setFormData] = useState({

        firstName: '',
        lastName: '',
        email: '',
        password: '',
        //confirmPassword: '',
        mobileNo: '',
        departmentName: '',
        role: '',
        address: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        axios.get(`https://localhost:7217/api/Users/${decryptid}`)
            .then(res => {
                setFormData(res.data);
                console.log(res.data)
            })
            .catch(err => {
                console.log(err);
                setMessage('Error updating user. Please try again.');
            });
    }, [decryptid]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? e.target.files : value,
        }));
    };

    function handleUserSubmit(event) {
        event.preventDefault();
        // const currentDate = new Date().toISOString().split('T')[0];
        // if (formData.dueDate < currentDate) {
        //     setMessage('Due Date must be greater than or equal to the current date.');
        //     return;
        // }

        axios.put(`https://localhost:7217/api/Users/${decryptid}`, formData)
            .then(res => {
                console.log(res);
                setMessage('User updated successfully!');
            })
            .catch(err => {
                console.log(err);
                setMessage('Error updating user. Please try again.');
            });
    }

    return (
        <div className="container mt-5">
            <h4>Edit User</h4>

            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {message}
                </div>
            )}

            <form onSubmit={handleUserSubmit}>
                {/* Username */}
                <div className="row mb-3">
                    <label htmlFor="firstName" className="col-sm-1 col-form-label text-start">
                        FirstName:
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
                            value={formData.firstName}
                        />
                    </div>

                    {/* Lastname */}
                    <label htmlFor="lastName" className="col-sm-1 col-form-label text-end">
                        LastName:
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
                            value={formData.lastName}
                        />
                    </div>

                    {/* Mobile Number */}
                    <label htmlFor="mobileNo" className="col-sm-1 col-form-label text-start">
                        MobileNo:
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
                            value={formData.mobileNo}
                        />
                    </div>

                </div>

                {/* Address */}
                <div className="row mb-3">
                    <label htmlFor="address" className="col-sm-1 col-form-label text-end">
                        Address:
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
                            value={formData.address}
                        />
                    </div>

                    {/* Date of Birth */}
                    <label htmlFor="dateOfBirth" className="col-sm-1 col-form-label text-end">
                        DOB:
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
                            value={formData.dateOfBirth}
                        />
                    </div>
                    {/* Email */}
                    <label htmlFor="email" className="col-sm-1 col-form-label text-end">
                        Email:
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
                            value={formData.email}
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
                            value={formData.password}
                        />
                    </div> */}

                    {/* Department */}


                    <label htmlFor="departmentName" className="col-sm-1 col-form-label text-start">
                        Department:
                    </label>
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className="form-control"
                            id="departmentName"
                            name="departmentName"
                            placeholder="Enter department"
                            required
                            onChange={handleInputChange}
                            value={formData.departmentName}
                        />
                    </div>
                    {/* Designation */}
                    <label htmlFor="role" className="col-sm-1 col-form-label text-start">
                        Designation:
                    </label>
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className="form-control"
                            id="role"
                            name="role"
                            placeholder="Enter designation"
                            required
                            onChange={handleInputChange}
                            value={formData.role}
                        />
                    </div>



                    {/* </div> */}
                </div>

                <div className="row mb-3">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-9 text-end">
                        <button type="submit" className="btn btn-primary">
                            Update User
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
