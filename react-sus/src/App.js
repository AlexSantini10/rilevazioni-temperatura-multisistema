import './App.css';
import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Button, Form, Badge} from 'react-bootstrap';

function App() {

  const [res, setRes] = useState([]);

  const fetchData = async () => {

    //console.log('fetched');

    fetch('http://localhost:5000/api/data', {
      method:'GET'
    })
    .then(resT => resT = resT.json())
    .then(resT => {
      setRes(resT);

      //console.log(resT);
    })
    .catch((e) => {
      console.log(e);
    })
  }

  useEffect(() => {
    fetchData();
  }, [res]);

  const sendName = (nome, id) => {
    fetch('http://localhost:5000/api/data/setname/' + id + '/' + nome, {
      method:'GET'
    })
  }

  const isTheNameToInsert = (name, id) => {
    if (name === '')
      return (
        <div>
          <Form style={{marginTop:'50px'}}>
            <Form.Control id={id} type="text" placeholder="Insert name" />
            <Button onClick={() => {
              let actName = document.getElementById(id).value;

              sendName(actName, id);
            }} variant="primary" type="submit" style={{marginTop:'10px'}}>
              Submit
            </Button>
          </Form>
        </div>
      )
    else return (
      <div style={{marginTop:'50px'}}>
        <div>Status: </div>
        <Badge pill variant="success" >
         OK
        </Badge>
      </div>
    );
  }

  return (
    <div className="App">
      
      {
        res.map((elem, index) => (
          
          <Card key={index} style={{ width: '250px', height:'250px', float:'left', margin:'5px'}}>
            <Card.Body>
              <Card.Title>{elem.nome === '' ? 'Nome non impostato' : elem.nome}</Card.Title>
              <Card.Title>
                {elem.temp}°C
              </Card.Title>
              {
                
                isTheNameToInsert(elem.nome, elem.stanza)

              }
            </Card.Body>
          </Card>
          
        ))
      }

    </div>
  );
}

export default App;
