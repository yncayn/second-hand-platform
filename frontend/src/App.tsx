import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {

  useEffect(() => {

    socket.emit("joinRoom", 1);

    socket.on("joinedRoom", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("joinedRoom");
    };

  }, []);

  return <h1>Socket Test</h1>;
}

export default App;