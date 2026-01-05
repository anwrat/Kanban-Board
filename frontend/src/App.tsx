import { TaskProvider } from "./context/TaskContext";
import Board from "./components/board";

function App() {
  return (
    <TaskProvider>
      <Board />
    </TaskProvider>
  );
}

export default App
