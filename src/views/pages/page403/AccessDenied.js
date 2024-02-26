import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import bg403 from './../../../assets/images/bg403.jpg'; // Import the image

const AccessDeniedPage = () => {
    return (
        <Container fluid>
            <Row className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundImage: `url(https://images.unsplash.com/photo-1597839219216-a773cb2473e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFyayUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D))` }}>
                <Col md="auto" className="d-flex flex-column justify-content-center align-items-center text-center text-white">
                    <h1 style={{ color: 'red', fontSize: '50px', paddingBottom: '10px' }}>
                        <span style={{ paddingBottom: '10px', borderBottom: '1px solid white' }}>Access Denied</span>
                    </h1>
                    <h4 className="text-white mt-2">You don&apos;t have permission to view this page.</h4>
                    <div className="fs-4 mt-2">🚫🚫🚫🚫</div>
                    <Button as={Link} to={'/'} className='btn btn-dark border mt-3 text-light'>Go Back To Home</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AccessDeniedPage;