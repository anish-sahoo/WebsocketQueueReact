import "./App.css";
import { useState, useEffect } from "react";

interface Person {
  id: number;
  name: string;
  time: number;
}

function App() {
  const [list, setList] = useState<Person[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now() + 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);


  const handleQueueJoin = () => {
    setList([...list, {id: list.length, name: 'name', time: new Date().getTime()}]);
  }

  return (
    <>
      <div>
        <label>user_name:</label>
        <input name="login"></input>
        <label>password</label>
        <input name="password"></input>
      </div>
      <div>
        <h1>Join Queue</h1>
        <label>name:</label>
        <input name="name"></input>
        <button onClick={handleQueueJoin}>Join</button>
      </div>
      <div>
        {list.map((item, index: number) => (
          <div key={index}>
            <p>
              {item.name}
              {` Time in queue - ${Math.floor((currentTime - item.time) / 60000)} minutes and ${Math.floor(((currentTime - item.time) % 60000) / 1000)} seconds`}
            </p>
            <button
              onClick={() => setList(list.filter((it) => it.id != item.id))}
            >
              Resolved
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
