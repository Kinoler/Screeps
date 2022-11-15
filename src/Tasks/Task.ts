import { Guid } from "guid-typescript";
import { TaskHandler } from "Handler.Task";
import { TaskExecutionType } from "./Enums/TaskExecutionType";
import { TaskStatus } from "./Enums/TaskStatus";
import { MineTask } from "./Task.Mine";
import { MovementRequestTask } from "./Task.MovementRequest";

export abstract class Task {
    Id: string;
    Creator: Id<_HasId>;
    Worker: Id<_HasId>[];
    TaskName: string;
    Data: any;
    ExecutionType: TaskExecutionType;
    Status: TaskStatus;

    BlockedBy: string;
    Block: string[];

    constructor(creator: Id<_HasId>) {
        this.Id = Guid.create().toString();
        this.BlockedBy = "";
        this.Block = [];
        this.Creator = creator;
        this.Worker = [];
        this.TaskName = ""
        this.ExecutionType = TaskExecutionType.Once;
        this.Status = TaskStatus.Open;
    }

    static GetFirstWorkerCreep(task: Task): Creep | null {
        if (task.Worker.length > 0) {
            var creepId = task.Worker[0] as Id<Creep>
            return Game.getObjectById<Creep>(creepId);
        }

        return null
    }

    static GetCreatorCreep(task: Task): Creep | null {
        return Game.getObjectById<Creep>(task.Creator as Id<Creep>);
    }

    static GetCreator<T extends _HasId>(task: Task): T | null {
        return Game.getObjectById<T>(task.Creator as Id<T>);
    }

    static Execute(task: Task)
    {
        if (task.Status == TaskStatus.Blocked) {
            return;
        }

        var newTaskStatus = Task.ExecuteSwitch(task);
        if (newTaskStatus == TaskStatus.Completed) {
            TaskHandler.CompleteTask(task)
        }

        task.Status = newTaskStatus
    }

    private static ExecuteSwitch(task: Task): TaskStatus
    {
        switch (task.TaskName) {
            case MovementRequestTask.TaskName:
                return MovementRequestTask.ExecuteTask(task as MovementRequestTask)
            case MineTask.TaskName:
                return MineTask.ExecuteTask(task as MineTask)
            default:
                return TaskStatus.Open
        }
    }
}
