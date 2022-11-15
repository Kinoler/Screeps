import { CreepController } from "Controllers/Controller.Creep";
import { MineTask, MovementRequestTask, Task, TaskPool, TaskStatus } from "Flow.Task";

export class PullerController extends CreepController {
    Run(creep: Creep): void {
        var currentTask = TaskPool.GetTaskById(creep.memory.currentTaskId)
        if (currentTask) {
            Task.Execute(currentTask);
            return;
        }

        var nextTasksCondidate = TaskPool.SearchTasks(MovementRequestTask.TaskName) as MovementRequestTask[];
        var nextTask = nextTasksCondidate
            .map(el => { return {el: el, distance: creep.pos.getRangeTo(Task.GetCreatorCreep(el)?.pos!)}})
            .sort((a, b) => a.distance - b.distance)
            .shift();
        if (nextTask) {
            TaskPool.TakeTask(nextTask.el.Id, creep);
            Task.Execute(nextTask.el);
        }
    }
}
