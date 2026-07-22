import Login from "./Login";
import Chat from "./Chat";

function App() {
  const token = localStorage.getItem("accessToken");

  return token ? <Chat /> : <Login />;
}

export default App;