import { TaskHandler } from "Handlers/Handler.Task";
import { TaskStatus } from "./Enums/TaskStatus";
import { Task } from "./Task";
import { MovementRequestTask } from "./Task.MovementRequest";

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
                TaskHandler.CreateTask(movementRequestTask)
                TaskHandler.SetBlocker(task, movementRequestTask)
                return TaskStatus.Blocked
            }
        }

        return TaskStatus.InProgress;
    }
}
