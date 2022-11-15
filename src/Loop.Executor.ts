import { CreepType } from "Creep.Types";
import { TaskPool } from "Flow.Task";
import { RoomController } from "Controllers/Controller.Room";
import { SpawnController } from "./Controllers/Controller.Spawn"

export class LoopExecutor {
    Execute() {
        if (Memory.ResetData === undefined) {
            Memory.ResetData = false
        }
        if (Memory.ResetData) {
            Memory.ResetData = false
            LoopExecutor.ResetData()
        }

        TaskPool.Init()
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName]
            RoomController.Init(room);
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

    static ResetData() {
        Memory.tasks = []
        for (const roomId in Memory.rooms) {
            var room = Memory.rooms[roomId]
            room.isInit = false
            room.sourceInited = {}
        }

        for (const roomId in Memory.creeps) {
            var creep = Memory.creeps[roomId]
            creep.currentTaskId = ""
        }
    }
}
