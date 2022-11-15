import {Logging} from "../Logging.Helper";
import { CreepEnum, CreepType } from "../Creep.Types"
import { ceil, forEach } from "lodash";
import { SourceController } from "Controllers/Controller.Source";

export class RoomController {
    static Init(room: Room)
    {
        for (var source of room.find(FIND_SOURCES)) {
            SourceController.Init(source)
        }
    }
}
