import { CreepController } from "Creep.Controller";
import { MineTask, MovementRequestTask, TaskPool, TaskStatus } from "Flow.Task";

export class PullerController extends CreepController {
    Run(creep: Creep): void {
        var currentTask = TaskPool.GetTaskById(creep.memory.currentTaskId)
        if (currentTask) {
            currentTask.Execute();
            return;
        }

        var nextTasksCondidate = TaskPool.SearchTasks(MineTask.TaskName) as MovementRequestTask[];
        var nextTask = nextTasksCondidate
            .map(el => { return {el: el, distance: creep.pos.getRangeTo(el.GetCreatorCreep()?.pos!)}})
            .sort((a, b) => a.distance - b.distance)
            .shift();
        if (nextTask) {
            TaskPool.TakeTask(nextTask.el.Id, creep);
            nextTask.el.Execute();
        }
    }
}
