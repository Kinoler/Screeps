import { CreepType } from "Creep.Types";
import { TaskPool } from "Flow.Task";
import { RoomController } from "Room.Controller";
import { SpawnController } from "./Spawn.Controller"

export class LoopExecutor {
    Execute() {
        TaskPool.Init()
        for (var roomName in Game.rooms) {
            var controller = new RoomController(roomName);
            controller.Init();
        }

        for (var spawnName in Game.spawns) {
            var spawnController = new SpawnController(spawnName);
            spawnController.Init();
        }

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            var creepController = CreepType.GetController(creep.memory.role.type);
            creepController?.Run(creep);
        }
    }
}
