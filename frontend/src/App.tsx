import KanbanColumn from "./components/column"
import type{ Column, Task } from "./types/types"

function App() {
  const Cols: Column[] = [
    {id: "todo", title: "To Do"},
    {id: "doing", title: "In Progress"},
    {id: "done", title: "Completed"},
  ];
  const tasks: Task[]=[
    {id:"1", columnId: "todo", content: "Complete maths assignment"},
    {id:"2", columnId: "done", content: "Science assignment", priority:"high"},
  ];
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="items-center mb-30 mt-10 flex flex-col">
        <p className="font-bold text-5xl">Kanban Board</p>
        <p>by Anwesh Rawat</p>
      </div>
      <div className="flex gap-20">
        {Cols.map((col)=>(
          <KanbanColumn key={col.id} column={col} tasks={tasks.filter(t=> t.columnId === col.id)} />
        ))}
      </div>
    </div>
  )
}

export default App
