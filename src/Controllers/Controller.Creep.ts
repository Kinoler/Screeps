import { MineTask } from "Flow.Task";

export abstract class CreepController {
    abstract Run(creep: Creep): void
}
