import './App.css';
import { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, Card, Form } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:5000/api/data';
const REFRESH_INTERVAL_MS = 5000;

function RoomNameForm({ roomId, onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    await onSubmit(trimmedName, roomId);
    setName('');
  };

  return (
    <Form className="room-name-form" onSubmit={handleSubmit}>
      <Form.Control
        type="text"
        placeholder="Insert name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button className="room-name-form__button" variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function RoomCard({ room, onNameSubmit }) {
  const displayName = room.nome ? room.nome : 'Nome non impostato';
  const hasName = Boolean(room.nome);

  return (
    <Card className="room-card">
      <Card.Body>
        <Card.Title>{displayName}</Card.Title>
        <Card.Text className="room-card__temperature">
          {room.temp}
          &deg;C
        </Card.Text>
        {hasName ? (
          <div className="room-card__status">
            <div>Status:</div>
            <Badge pill variant="success">
              OK
            </Badge>
          </div>
        ) : (
          <RoomNameForm roomId={room.stanza} onSubmit={onNameSubmit} />
        )}
      </Card.Body>
    </Card>
  );
}

function App() {
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const sortedRooms = useMemo(
    () => [...rooms].sort((left, right) => Number(left.stanza) - Number(right.stanza)),
    [rooms]
  );

  const fetchData = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Unable to load room data');
      }

      const data = await response.json();
      setRooms(data);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Impossibile caricare le rilevazioni.');
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = window.setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  const sendName = async (name, roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/setname/${roomId}/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error('Unable to update room name');
      }

      await fetchData();
    } catch (error) {
      console.error(error);
      setErrorMessage('Impossibile aggiornare il nome della stanza.');
    }
  };

  return (
    <div className="App">
      {errorMessage ? <div className="app-error">{errorMessage}</div> : null}
      <div className="room-grid">
        {sortedRooms.map((room) => (
          <RoomCard key={room.stanza} room={room} onNameSubmit={sendName} />
        ))}
      </div>
    </div>
  );
}

export default App;
