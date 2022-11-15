import { CreepController } from "Controllers/Controller.Creep";
import { MineTask, MovementRequestTask, Task, TaskPool, TaskStatus } from "Handler.Task";

export class MinerController extends CreepController {
    Run(creep: Creep): void {
        var currentTask = TaskPool.GetTaskById(creep.memory.currentTaskId)
        if (currentTask) {
            Task.Execute(currentTask);
            return;
        }

        var nextTasksCondidate = TaskPool.SearchTasks(MineTask.TaskName) as MineTask[];
        var nextTask = nextTasksCondidate
            .map(el => { return {el: el, distance: creep.pos.getRangeTo(el.MinePosition)}})
            .sort((a, b) => a.distance - b.distance)
            .shift();
        if (nextTask) {
            TaskPool.TakeTask(nextTask.el.Id, creep);
            Task.Execute(nextTask.el);
        }
    }
}
