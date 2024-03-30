import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import UserItem from "./components/UserItem";

const socket = io("http://10.152.208.69:3000"); // Replace with your server address

interface Person {
  id: number;
  name: string;
  time: number;
}

const App: React.FC = () => {
  const [list, setList] = useState<Person[]>([]);
  const [text, setText] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now() + 1000);

  useEffect(() => {
    socket.on("initialData", (initialData) => {
      setList(initialData);
    });
  
    return () => {
      socket.off("initialData");
    };
  }, []);
  

  useEffect(() => {
    socket.on("queueUpdated", (updatedPersons: Person[]) => {
      setList(updatedPersons);
    });

    return () => {
      socket.off("queueUpdated");
    };
  }, []);

  socket.on("queueUpdated", (updatedQueue) => {
    setList(updatedQueue);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleQueueJoin = (userName: string) => {
    if(!list.find((person) => person.name === userName)) {
    const newPerson: Person = {
      id: list.length, // Assuming id is sequential on the client-side
      name: userName,
      time: Date.now(),
    };
    socket.emit("joinQueue", newPerson);
  }
  };

  const handleQueueResolve = (id: number) => {
    socket.emit("resolveQueue", id);
  };

  return (
    <div className="w-screen min-h-screen bg-slate-400 flex justify-center text-lg">
      <div className="flex-coltext-white items-center p-4 m-2">
        {/* <div className="flex justify-center">
        <label className="mx-2 py-2 ">Username:</label>
        <input name="login" className="text-black mx-2 py-2 px-4 rounded"></input>
        <label className="mx-2 py-2">Password</label>
        <input name="password" className="text-black mx-2 py-2 px-4 rounded"></input>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
      </div> */}
        <div className="flex flex-row">
          <p className="my-auto text-2xl">Name:</p>
          <input
            name="Enter Name"
            className="py-2 mx-2 w-full"
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></input>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleQueueJoin(text)}
          >
            Join Queue
          </button>
        </div>
        <div className="flex flex-col items-center py-4 md:px-8">
          {list.map((item: Person, index: number) => (
            <div key={index}>
              <UserItem
                user={{
                  name: item.name,
                  id: item.id,
                  queueDuration: `${Math.floor((currentTime - item.time) / 60000)} minutes and ${Math.floor(((currentTime - item.time) % 60000) / 1000)} seconds`,
                }}
                resolve={() => handleQueueResolve(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

App.defaultProps = {
  list: [],
};

export default App;
