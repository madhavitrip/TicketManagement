import React from 'react';
import {  Button, Form } from 'react-bootstrap'; // Import Collapse
import PropTypes from 'prop-types'; // Import PropTypes


const Roles = ({ roles, handleEdit, handleEditSubmitRole, newRoles, setNewRoles, editItem, searchQuery }) => {

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-7 mx-auto bg-white rounded shadow">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr className="table-header mt-3">
                                    <th scope="col" className="col-3">S.No</th>
                                    <th scope="col" className="col-6">Roles</th>
                                    <th scope="col" className="col-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles
                                    .filter((role) => role.roleName?.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((role) => (
                                        <tr key={role.roleId} className="table-row mt-1">

                                            <td className="col col-3" data-label="SNo.">{role.roleId}</td>
                                            <td className="col col-6" data-label="Roles">{role.roleName}</td>
                                            <td className="col col-3" data-label="Actions">
                                                {editItem && editItem.roleId === role.roleId ? (
                                                    <Form onSubmit={(e) => handleEditSubmitRole(e, role.roleId, newRoles)}>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            value={newRoles || role.roleName}
                                                            onChange={(e) => setNewRoles(e.target.value)}
                                                        />
                                                        <Button type="submit" variant="success" size="sm">
                                                            Save
                                                        </Button>
                                                    </Form>
                                                ) : (
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(role)}>
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>


                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    );
};
Roles.propTypes = { // Define prop types
    roles: PropTypes.array.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleEditSubmitRole: PropTypes.func.isRequired,
    newRoles: PropTypes.string.isRequired,
    setNewRoles: PropTypes.func.isRequired,
    searchQuery: PropTypes.func.isRequired,
    editItem: PropTypes.object,
};
export default Roles;

