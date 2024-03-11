import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilGroup,
  // cilUserPlus,
  cilPlus,
  cilPeople,
  cilHamburgerMenu,
  cilHandshake,
  // cilCalculator,
  // cilChartPie,
  // cilCursor,
  // cilDescription,
  // cilNotes,
  // cilPencil,
  // cilPuzzle,
  // cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  // UserLeftNavList
  {
    component: CNavGroup,
    name: 'Tickets',
    // to: '/users/all-users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Ticket',
        to: '/Tickets/AddTicket',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'All Tickets',
        to: '/Tickets',
        icon: <CIcon icon={cilHamburgerMenu} customClassName="nav-icon" />,
      },
    ],
  },
  // Priority
  {
        component:CNavItem,
        name: 'Archive',
        to: '/Archive',
        icon: <CIcon icon={cilHandshake} customClassName="nav-icon" />,
  },

  // Status
  {
    component:CNavItem,
    name: 'Notification',
    to: '/Notification/notify',
    icon: <CIcon icon={cilHandshake} customClassName="nav-icon" />,
},
  
  // Roles
  {
    component: CNavGroup,
    name: 'User Roles',
    // to: '/users/all-users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add User',
        to: '/Users/AddUser',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'All Users',
        to: '/Users/AllUsers',
        icon: <CIcon icon={cilHamburgerMenu} customClassName="nav-icon" />,
      },
    ],
  },
  //Priority

  // Clients
  {
    component: CNavItem,
    name: 'Department',
    to: '/Department/Departments',
    icon: <CIcon icon={cilHandshake} customClassName="nav-icon" />,
    
  },
]

export default _nav
