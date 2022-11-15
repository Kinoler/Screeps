import { TaskStatus } from "./Enums/TaskStatus";
import { Task } from "./Task";

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
                workerCreep.moveTo(creatorCreep);
            } else {
                creatorCreep.move(workerCreep);
                if(workerCreep.pos.x == task.Target.x && workerCreep.pos.y == task.Target.y) {
                    workerCreep.move(workerCreep.pos.getDirectionTo(creatorCreep));
                } else {
                    var path = PathFinder.search(workerCreep.pos, task.Target)
                    workerCreep.move(workerCreep.pos.getDirectionTo(path.path[0]));
                }
            }
        }

        return TaskStatus.InProgress;
    }
}
