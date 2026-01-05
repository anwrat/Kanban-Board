export default function Board(){
    return(
        <div className="min-h-screen flex flex-col items-center">
            <div className="items-center mb-30 mt-10 flex flex-col">
                <p className="font-bold text-5xl">Kanban Board</p>
                <p>by Anwesh Rawat</p>
            </div>
            <div className="flex gap-20">
                {/* {Cols.map((col)=>(
                <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={tasks.filter(t=> t.columnId === col.id)}
                addTask={addTask} 
                />
                ))} */}
            </div>
         </div>
    );
}