import { BuilderController } from "./Controller.Creep.Builder";
import { HarvesterController } from "./Controller.Creep.Harvester";
import { MinerController } from "./Controller.Creep.Miner";
import { PullerController } from "./Controller.Creep.Puller";
import { UpgraderController } from "./Controller.Creep.Upgrader";
import { RoomController } from "./Controller.Room";
import { SourceController } from "./Controller.Source";

export class Controller {
    static GetController(controllerName: string) {
        switch (controllerName) {
            case BuilderController.name:
                return new BuilderController();
            case HarvesterController.name:
                return new HarvesterController();
            case UpgraderController.name:
                return new UpgraderController();
            case MinerController.name:
                return new MinerController();
            case PullerController.name:
                return new PullerController();
            case SourceController.name:
                return new SourceController();
            case RoomController.name:
                return new RoomController();
            default:
                break;
        }

        return null;
    }
}
