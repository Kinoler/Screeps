import { CreepType } from "Creep.Types";
import { Guid } from "guid-typescript";

export enum TaskExecutionType {
    Once,
    Infinity
}

export enum TaskStatus{
    Open,
    Blocked,
    InProgress,
    Completed,
    Closed,
}

export abstract class Task {
    Id: string;
    Creator: string;
    Worker: string[];
    TaskName: string;
    Data: any;
    ExecutionType: TaskExecutionType;
    Status: TaskStatus;

    BlockedBy: string;
    Block: string[];

    constructor(creator: string) {
        this.Id = Guid.create().toString();
        this.BlockedBy = "";
        this.Block = [];
        this.Creator = creator;
        this.Worker = [];
        this.TaskName = ""
        this.ExecutionType = TaskExecutionType.Once;
        this.Status = TaskStatus.Open;
    }

    GetFirstWorkerCreep(): Creep | null {
        if (this.Worker.length > 0) {
            var creepId = this.Worker[0]
            return Game.creeps[creepId]
        }

        return null
    }

    GetCreatorCreep(): Creep | null {
        return Game.creeps[this.Creator]
    }

    Execute()
    {
        if (this.Status == TaskStatus.Blocked) {
            return;
        }

        var newTaskStatus = this.ExecuteTask();
        if (newTaskStatus == TaskStatus.Completed) {
            TaskPool.CompleteTask(this)
        }

        this.Status = newTaskStatus
    }

    protected abstract ExecuteTask(): TaskStatus;
}

export class MovementRequestTask extends Task {
    static TaskName: string = typeof(MovementRequestTask).name;
    Target: RoomPosition;

    constructor(creator: string, target: RoomPosition) {
        super(creator)
        this.TaskName = MovementRequestTask.TaskName;
        this.Target = target;
    }

    ExecuteTask(): TaskStatus {
        var workerCreep = this.GetFirstWorkerCreep();
        var creatorCreep = this.GetCreatorCreep();

        if (workerCreep && creatorCreep) {
            if (creatorCreep.pos == this.Target) {
                return TaskStatus.Completed;
            }
            if (workerCreep.pull(creatorCreep) == ERR_NOT_IN_RANGE) {
                workerCreep.moveTo(creatorCreep);
            } else {
                creatorCreep.move(workerCreep);
                if(workerCreep.pos.isNearTo(this.Target)) {
                    workerCreep.move(workerCreep.pos.getDirectionTo(creatorCreep));
                } else {
                    workerCreep.moveTo(this.Target);
                }
            }
        }

        return TaskStatus.InProgress;
    }
}

export class MineTask extends Task {
    static TaskName: string = typeof(MineTask).name;
    MinePosition: RoomPosition;

    constructor(creator: string, minePosition: RoomPosition) {
        super(creator)
        this.TaskName = MineTask.TaskName;
        this.MinePosition = minePosition;
    }

    ExecuteTask(): TaskStatus
    {
        var creep = this.GetFirstWorkerCreep();
        if (creep) {
            if (creep.pos == this.MinePosition)
            {
                var source = creep.room.find(FIND_SOURCES, {filter: source => source.id == this.Id}).shift()
                if (source)
                {
                    var result = creep.harvest(source)
                    if (result != 0)
                    {
                        console.log(`Error in task. Name = ${this.TaskName}. Task result = ${result}`);
                    }
                }
            }
            else
            {
                var creepController = CreepType.GetController(creep.memory.role.type);
                creepController?.MoveTo(creep, this.MinePosition);
            }
        }

        return TaskStatus.InProgress;
    }
}

export class TaskPool {
    private static Instance: TaskPool

    TaskContainer: Task[];

    constructor(tasks: Task[]) {
        this.TaskContainer = tasks;
    }

    static Init() {
        if (!Memory.tasks) {
            Memory.tasks = [];
        }

        TaskPool.Instance = new TaskPool(Memory.tasks);
    }

    static SearchTasks(taskName: string){
        return TaskPool.Instance.TaskContainer.filter(task => task.TaskName == taskName);
    }

    static GetTaskById(id: string) {
        return TaskPool.Instance.TaskContainer.find(task => task.Id == id);
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
        TaskPool.Instance.TaskContainer.push(task);
    }

    static SetBlocker(task: Task, bloker: Task){
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
        var index = Memory.tasks.findIndex(task => task.Id == completedTask.Id)
        delete  Memory.tasks[index]
    }

}
