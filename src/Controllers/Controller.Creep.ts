import { MineTask } from "Handler.Task";

export abstract class CreepController {
    abstract Run(creep: Creep): void
}
