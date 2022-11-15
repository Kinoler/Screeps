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
            TaskPool.CompleteTask(task)
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

export class MovementRequestTask extends Task {
    static TaskName: string = "MovementRequestTask";
    Target: RoomPosition;

    constructor(creator: Id<_HasId>, target: RoomPosition) {
        super(creator)
        this.TaskName = MovementRequestTask.TaskName;
        this.Target = target;
    }

    static ExecuteTask(task: MovementRequestTask): TaskStatus {
        var workerCreep = Task.GetFirstWorkerCreep(task);
        var creatorCreep = Task.GetCreatorCreep(task);

        if (workerCreep && creatorCreep) {

            if (creatorCreep.pos.x == task.Target.x && creatorCreep.pos.y == task.Target.y) {
                return TaskStatus.Completed;
            }
            if (workerCreep.pull(creatorCreep) == ERR_NOT_IN_RANGE) {
                console.log("Puller to creatorCreep")
                workerCreep.moveTo(creatorCreep);
            } else {
                creatorCreep.move(workerCreep);
                console.log(`Puller coord = ${workerCreep.pos}`)
                console.log(`Target coord = ${task.Target as RoomPosition}`)
                console.log(`Puller equals Target = ${workerCreep.pos.isEqualTo(task.Target as RoomPosition)}`)
                if(workerCreep.pos.x == task.Target.x && workerCreep.pos.y == task.Target.y) {
                    console.log("Puller isNearTo Target")
                    workerCreep.move(workerCreep.pos.getDirectionTo(creatorCreep));
                } else {
                    console.log("Puller to target " + JSON.stringify(task.Target))
                    var path = PathFinder.search(workerCreep.pos, task.Target)
                    workerCreep.move(workerCreep.pos.getDirectionTo(path.path[0]));
                }
            }
        }

        return TaskStatus.InProgress;
    }
}

export class MineTask extends Task {
    static TaskName: string = "MineTask";
    MinePosition: RoomPosition;

    constructor(creator: Id<_HasId>, minePosition: RoomPosition) {
        super(creator)
        this.TaskName = MineTask.TaskName;
        this.MinePosition = minePosition;
    }

    static ExecuteTask(task: MineTask): TaskStatus
    {
        var creep = Task.GetFirstWorkerCreep(task);
        console.log("execute MineTask by " + creep)
        if (creep) {
            if (creep.pos.x == task.MinePosition.x && creep.pos.y == task.MinePosition.y)
            {
                var source = Task.GetCreator<Source>(task)
                if (source)
                {
                    var result = creep.harvest(source)
                    if (result != 0)
                        console.log(`Error in task. Name = ${task.TaskName}. Task result = ${result}`);
                }
                else
                {
                    console.log(`Error in task. Name = ${task.TaskName}. Source does not found`);
                }
            }
            else
            {
                var movementRequestTask = new MovementRequestTask(creep.id, task.MinePosition);
                TaskPool.CreateTask(movementRequestTask)
                TaskPool.SetBlocker(task, movementRequestTask)
                return TaskStatus.Blocked
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
        return TaskPool.Instance.TaskContainer.filter(task => task.Status == TaskStatus.Open && task.TaskName == taskName);
    }

    static GetTaskById(id: string): Task | undefined {
        var task = TaskPool.Instance.TaskContainer.find(task => task && task.Id == id);
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
        TaskPool.Instance.TaskContainer.push(task);
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
