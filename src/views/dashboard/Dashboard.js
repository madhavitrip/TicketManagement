import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap'
import DashboardTable from './DashboardTable';
import { useUser } from './../../context/UserContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useUser();
  const [counts, setCounts] = useState({
    active: 0,
    pending: 0,
    selfassigned: 0,
    completed: 0
  });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountsAndTickets = async () => {
      try {
        // Fetch counts
        const countsResponse = await fetch(`https://localhost:7217/api/Ticket/status-count?email=${user.email}`);
        const countsData = await countsResponse.json();
        setCounts({
          active: countsData.activeCount,
          pending: countsData.pendingCount,
          selfassigned: countsData.selfassignedCount,
          completed: countsData.completedCount
        });

        // Fetch tickets
        const ticketsResponse = await fetch(`https://localhost:7217/api/Ticket/ByUser?email=${user.email}`);
        const ticketsData = await ticketsResponse.json();
        setTickets(ticketsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchCountsAndTickets();
  }, [user]);

  return ( 
    <div> 
      <Container> 
        <Row className='row-cols-1 row-cols-md-2 row-cols-lg-4'> 
          <Col > 
            <div className="card" > 
              <div className="card-inner"> 
                <div className="card-front"> 
                  <p>Active</p> 
                </div> 
                <div className="card-back"> 
                  <p>{counts.active}</p> 
                </div> 
              </div> 
            </div> 
          </Col> 
          <Col  > 
          <div className="card"> 
              <div className="card-inner"> 
                <div className="card-front"> 
                  <p>Pending</p> 
                </div> 
                <div className="card-back"> 
                  <p>{counts.pending}</p> 
                </div> 
              </div> 
            </div> 
          </Col> 
          <Col > 
          <div className="card"> 
              <div className="card-inner"> 
                <div className="card-front"> 
                  <p>Self-Assigned</p> 
                </div> 
                <div className="card-back"> 
                  <p>{counts.selfassigned}</p> 
                </div> 
              </div> 
            </div> 
            
          </Col> 
          <Col > 
          <div className="card"> 
              <div className="card-inner"> 
                <div className="card-front"> 
                  <p>Completed</p> 
                </div> 
                <div className="card-back"> 
                  <p>{counts.completed}</p> 
                </div> 
              </div> 
            </div> 
          </Col> 
 
        </Row> 
      </Container> 
 
      {loading ? ( 
        <div className="text-center"> 
          <Spinner animation="border" role="status"> 
            <span className='visually-hidden'>loading..</span> 
          </Spinner> 
        </div> 
      ) : ( 
 
        <DashboardTable tickets={tickets} /> 
      ) 
      } 
    </div> 
  );
};

export default Dashboard;