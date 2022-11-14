import { MinerController } from "Creep.Controller.Miner";
import { BuilderController } from "./Creep.Controller.Builder"
import { HarvesterController } from "./Creep.Controller.Harvester"
import { UpgraderController } from "./Creep.Controller.Upgrader"

export enum CreepEnum {
    BUILDER = "builder",
    HARVESTER = "harvester",
    UPGRADER = "upgrader",
    MINER = "miner",
    PULLER = "puller",
}

export class CreepType {
    type: string;

    constructor(name: string) {
        this.type = name;
    }


    static GetController(type: string) {
        switch (type) {
            case CreepEnum.BUILDER:
                return new BuilderController();
            case CreepEnum.HARVESTER:
                return new HarvesterController();
            case CreepEnum.UPGRADER:
                return new UpgraderController();
            case CreepEnum.MINER:
                return new MinerController();
            case CreepEnum.PULLER:
                return new MinerController();
            default:
                break;
        }

        return null;
    }
}
