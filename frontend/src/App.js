import './App.css';
import { useState, useEffect, useContext } from "react";
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const [isloading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState();
  const [areaData, setAreaData] = useState();
  const [severityData, setSeverity] = useState();
  const [eventtype, setEventType] = useState();
  const [startdateData, setStartDate] = useState();
  const [error, setError] = useState('');
  const [areaSearch, setAreaSearch] = useState('');

  const getEventData = async () => {
    //here we will set an empty string for the data error
    // setError({ ...error, data: "" });
    try {
      const response = await axios(
        `https://api.open511.gov.bc.ca/events`)
      if (response.status == 200) {
        if (response.data && response.data.events) {
          saveEvents(response.data.events);
        }
        return await setEventData(response.data);
      }
      setEventData();
    } catch (error) {
      setError({ error: error });
      console.log(error);
    } finally {
      setIsLoading(true);
    }
  };

  const saveEvents = async (events) => {
    const saveres = axios({
      method: 'post',
      url: 'http://localhost:3001/saveEvents',
      data: JSON.stringify(events),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  };
  const getFilteredEvents = async () => {
    var params = new URLSearchParams();
    if (areaSearch)
      params.append("area_id", areaSearch);
    if (severityData)
      params.append("severity", severityData);
    if (eventtype)
      params.append("event_type", eventtype);
    if (startdateData)
      params.append("created", startdateData);

    try {
      const response = await axios.get(
        `https://api.open511.gov.bc.ca/events`, { params }
      )
      if (response.status == 200) {
        console.log("response.data", response.data)
        return await setEventData(response.data);
      }
      setEventData();
    } catch (error) {
      setError({ error: error });
      console.log(error);
    } finally {
      setIsLoading(true);
    }
  };
  const handleSubmit = async () => {
    getFilteredEvents();
  };

  const getAreaData = async () => {
    try {
      const response = await axios(
        `https://api.open511.gov.bc.ca/areas`)
      if (response.status == 200) {
        return await setAreaData(response.data);
      }
      setAreaData();
    } catch (error) {
      setAreaData();
    } finally {
    }
  };

  const handleAreaData = (e) => {
    e.preventDefault();
    let val = e.target.value;
    console.log(val)
    setAreaSearch(val);
  }

  const handleEventType = (e) => {
    e.preventDefault();
    let val = e.target.value;
    setEventType(val);
  }

  useEffect(() => {
    getAreaData();
    getEventData();
  }, [])

  return (
    <div className="App">

      <header className="App-header"> Events App </header>
      <Container>
        <form>
          <Row className="mt-3 mb-3">
            <Col lg={3}>
              <label className="form-label" htmlFor="areaFilter">Area</label>
              <select name="areaFilter" id="areaFilter" className="form-select" onChange={handleAreaData}>
                <option value="">All</option>
                {areaData ? areaData.areas.map((data, aIndex) => {
                  return (
                    <option key={aIndex} value={data['id']}>{data['name']}</option>
                  );
                }) : (null)}
              </select>
            </Col>
            <Col lg={3}>
              <label className="form-label" htmlFor="severity">Severity</label>
              <input type="text" id="severity" className='form-control' onChange={e => setSeverity(e.target.value)}></input>
            </Col>
            <Col lg={3}>
              <label className="form-label" htmlFor="eventType">Event Type</label>
              <select name="eventType" id="eventType" className="form-select" onChange={handleEventType}>
                <option value="">All</option>
                <option value="CONSTRUCTION">CONSTRUCTION</option>
                <option value="INCIDENT">INCIDENT</option>
                <option value="SPECIAL_EVENT">SPECIAL_EVENT</option>
                <option value="WEATHER_CONDITION">WEATHER_CONDITION</option>
              </select>
            </Col>
            <Col lg={3}>
              <label className="form-label" htmlFor="startDate">Start Date</label>
              <input type="text" id="startDate" className='form-control' onChange={e => setStartDate(e.target.value)}></input>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={{ span: 1, offset: 11 }}>
              <button type="button" id="sendbtn" className="btn btn-primary" data-testid="sendbtn" onClick={(e) => handleSubmit(e)}>Filter</button>
            </Col>
          </Row>
        </form>

        <Row>
          <div className="mt-9">
            {isloading ? (<Table striped bordered hover responsive>
              <thead>
                <tr>
                  <td>Event</td>
                  <td>Sub Event(s)</td>
                  <td>Status</td>
                  <td>Date</td>
                  <td>Road Name</td>
                  <td>Distance</td>
                  <td>Severity</td>
                </tr>
              </thead>
              <tbody>
                {eventData.events.map((data, dIndex) => {
                  return (
                    <tr key={dIndex}>
                      <td>{data['headline']}</td>
                      <td>{data['event_subtypes'] ? data['event_subtypes'].join(",") : ''}</td>
                      <td>{data['status']}</td>
                      <td>{data['schedule'] && data['schedule']['intervals'] ? data['schedule']['intervals'].map((data) => { return data }).join(",") : ''}</td>
                      <td>{data['roads'].map((data) => { return data['name'] }).join(",")}</td>
                      <td>{data['+linear_reference_km']}</td>
                      <td>{data['severity']}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>) : (
              null
            )}

          </div>
        </Row>
      </Container>
    </div >
  );
}

export default App;
