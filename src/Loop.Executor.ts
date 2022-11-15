import { CreepType } from "Creep.Types";
import { RoomController } from "Controllers/Controller.Room";
import { SpawnController } from "./Controllers/Controller.Spawn"
import { TaskHandler } from "Handlers/Handler.Task";
import { Logging } from "Logging.Helper";
import { TickHandler } from "Handlers/Handler.Tick";

export class LoopExecutor {
    static Execute() {
        this.GlobalInit()
        this.TryResetData()
        TaskHandler.Init()

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

    static GlobalInit()
    {
        TickHandler.Execute(10, () => {
            this.ClearCreepsMemory()
        })
    }

    static ClearCreepsMemory() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                Logging.LogDebug(`Clearing non-existing creep memory: ${name}`);
            }
        }
    }

    static TryResetData()
    {
        if (Memory.ResetData === undefined) {
            Memory.ResetData = false
        }
        if (Memory.ResetData) {
            Memory.ResetData = false
            LoopExecutor.ResetData()
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
