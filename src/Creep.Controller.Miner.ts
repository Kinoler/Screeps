import { CreepController } from "Creep.Controller";
import { MineTask, MovementRequestTask, TaskPool, TaskStatus } from "Flow.Task";

export class MinerController extends CreepController {
    Run(creep: Creep): void {
        var currentTask = TaskPool.GetTaskById(creep.memory.currentTaskId)
        if (currentTask) {
            currentTask.Execute();
            return;
        }

        var nextTasksCondidate = TaskPool.SearchTasks(MineTask.TaskName) as MineTask[];
        var nextTask = nextTasksCondidate
            .map(el => { return {el: el, distance: creep.pos.getRangeTo(el.MinePosition)}})
            .sort((a, b) => a.distance - b.distance)
            .shift();
        if (nextTask) {
            TaskPool.TakeTask(nextTask.el.Id, creep);
            nextTask.el.Execute();
        }
    }

    override MoveTo(creep: Creep, roomPosition: RoomPosition, isHighLigth?: boolean): CreepMoveReturnCode | -2 | -5 | -7 | 1 {
        var task = new MovementRequestTask(creep.id, roomPosition);
        var currentTask = TaskPool.GetTaskById(creep.memory.currentTaskId)
        if (currentTask) {
            TaskPool.CreateTask(task)
            TaskPool.SetBlocker(currentTask, task)
        }

        return 1;
    }
}
