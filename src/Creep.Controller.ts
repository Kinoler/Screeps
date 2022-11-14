import { MineTask } from "Flow.Task";

export abstract class CreepController {
    abstract Run(creep: Creep): void

    MoveTo(creep: Creep, roomPosition: RoomPosition, isHighLigth = false): CreepMoveReturnCode | -2 | -5 | -7 | 1 {
        return creep.moveTo(roomPosition, isHighLigth ? { visualizePathStyle: { stroke: '#ffaa00' } } : undefined)
    }
}
