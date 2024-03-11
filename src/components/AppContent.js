import React, { lazy, Suspense } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { CContainer } from '@coreui/react'; 
import PermissionDecorator from './../context/PermissionDecorator'; 
//  import AccessDeniedPage from './../../src/views/pages/page403/AccessDenied'; 
import { Spinner } from 'react-bootstrap'; 
 
 
const AllUsers = lazy(() => import('./../views/Users/AllUsers')); 
const Dashboard = lazy(() => import('./../views/dashboard/Dashboard')); 
const AddUser = lazy(() => import('./../views/Users/AddUser')); 
const EditUser = lazy(() => import('./../views/Users/EditUser')); 
const ViewUser = lazy(() => import('./../views/Users/Views')); 
const Permission = lazy(() => import('./../views/Users/UserPermissons')); 
const AddTicket = lazy(() => import('./../views/Tickets/AddTicket')); 
const EditTicket = lazy(() => import('./../views/Tickets/EditTicket')) 
const ViewAllTickets = lazy(() => import('./../views/Tickets/ViewAllTickets')) 
const Archive = lazy(() => import('./../views/ArchivingTicket/Archive')) 
const Department = lazy(() => import('./../views/Department/Departments')) 
 
 
const AppContent = () => { 
  return ( 
    <CContainer className="px-4" lg> 
      <Suspense fallback={<div className="h-100 w-100 d-flex align-items-center justify-content-center"> 
        <Spinner color="primary" variant="grow" /> 
      </div>}> 
        <Routes> 
          {/* <Route path="/" name="Home" element={<Dashboard />} /> */} 
          <Route path="/dashboard" name="Dashboard" element={<Dashboard />} /> 
          <Route path="/Archive" name="Archive" element={<Archive />} />
          <Route path="*" element={<Navigate to="/dashboard" />} /> 
          <Route path="/Users/AllUsers" name="All Users" element={<PermissionDecorator moduleId={1} permissionType="canViewOnly" element={<AllUsers />} />} /> 
          <Route path="/Users/AddUser" name="Add User" element={<PermissionDecorator moduleId={1} permissionType="canAddOnly" element={<AddUser />} />} /> 
          <Route path="/Users/Views" name="View User" element={<PermissionDecorator moduleId={1} permissionType="canViewOnly" element={<ViewUser />} />} /> 
          <Route path="/Users/EditUser/:userId" name="Edit User" element={<PermissionDecorator moduleId={1} permissionType="canUpdateOnly" element={<EditUser />} />} /> 
          <Route path="/Users/AddPermissions/:userId" name="Add Permissions" element={<PermissionDecorator moduleId={1} permissionType="canAddOnly" element={<Permission />} />} /> 
          <Route path= "/Tickets/AddTicket" name= 'Add Ticket' element={<PermissionDecorator moduleId={2} permissionType="canAddOnly" element={<AddTicket/>}/>} /> 
          <Route path= "/Tickets" name= "View All Tickets" element={<PermissionDecorator moduleId={2} permissionType="canViewOnly" element={<ViewAllTickets/>}/>} /> 
          <Route path= "/Tickets/EditTicket/:ticketId" name= "Edit Ticket" element={<PermissionDecorator moduleId={2} permissionType="canUpdateOnly" element={<EditTicket/>}/>} /> 
          <Route path= "/Department/Departments" name= "Department" element={<PermissionDecorator moduleId={3} permissionType="canViewOnly" element={<Department/>}/>} />
          <Route path= "/Department/Departments" name= "Department" element={<PermissionDecorator moduleId={3} permissionType="canAddOnly" element={<Department/>}/>} /> 
             

       
          {/* <Route path="/403" name="Access Denied" element={<AccessDeniedPage />} /> */} 
        </Routes> 
      </Suspense> 
    </CContainer> 
  ); 
}; 
 
export default React.memo(AppContent);