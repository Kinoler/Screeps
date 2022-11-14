import {Logging} from "./Logging.Helper";
import { CreepEnum, CreepType } from "./Creep.Types"
import { ceil, forEach } from "lodash";
import { SourceController } from "Room.Controller.Source";

export class RoomController {
    RoomName: string;
    Room: Room;

    constructor(roomName: string) {
        this.RoomName = roomName;
        this.Room = Game.rooms[roomName];
    }

    Init()
    {
        for (var source of this.Room.find(FIND_SOURCES)) {
            var controller = new SourceController(source);
            controller.Init();
        }
    }
}
