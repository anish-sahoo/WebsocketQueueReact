import "./App.css";
import { useState } from "react";

interface Person {
  id: number;
  name: string;
  time: number;
}

function App() {
  const [list, setList] = useState<Person[]>([
    { id: 1, name: "test", time: 0 },
    { id: 2, name: "test2", time: 0 },
  ]);

  return (
    <>
      <div>
        <label>user_name:</label>
        <input name="login"></input>
        <label>password</label>
        <input name="password"></input>
      </div>
      <div>
        {list.map((item, index: number) => (
          <div key={index}>
            <p>
              {item.name}
              {` Time in queue - ${item.time}`}
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
