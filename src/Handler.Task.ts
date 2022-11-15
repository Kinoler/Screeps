import { TaskStatus } from "Tasks/Enums/TaskStatus";
import { Task } from "Tasks/Task";

export class TaskHandler {
    static Init() {
        if (!Memory.tasks) {
            Memory.tasks = [];
        }
    }

    static get tasks(): Task[] {
        return Memory.tasks;
    }

    static SearchTasks(taskName: string){
        return this.tasks.filter(task => task.Status == TaskStatus.Open && task.TaskName == taskName);
    }

    static GetTaskById(id: string): Task | undefined {
        var task = this.tasks.find(task => task && task.Id == id);
        return task;
    }

    static TakeTask(taskId: string, worker: Creep) {
        var task = this.GetTaskById(taskId)
        if (task) {
            task?.Worker.push(worker.id);
            worker.memory.currentTaskId = taskId;
            task.Status = TaskStatus.InProgress;
        }
    }

    static CreateTask(task: Task){
        this.tasks.push(task);
    }

    static SetBlocker(task: Task, bloker: Task) {
        task.Status = TaskStatus.Blocked;
        task.BlockedBy = bloker.Id;
        bloker.Block.push(task.Id);
    }

    static RemoveBlocker(task: Task){
        task.Status = TaskStatus.InProgress;
        task.BlockedBy = "";
    }

    static CompleteTask(completedTask: Task) {
        if (completedTask.Block.length > 0) {
            for (const id of completedTask.Block) {
                var blokedTask = this.GetTaskById(id)
                if (blokedTask)
                    this.RemoveBlocker(blokedTask)
            }
        }
        var creep = Task.GetFirstWorkerCreep(completedTask);
        if (creep) {
            creep.memory.currentTaskId = ""
        }
        Memory.tasks = Memory.tasks.filter(task => task.Id != completedTask.Id)
    }
}
