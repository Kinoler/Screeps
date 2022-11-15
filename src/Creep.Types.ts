import { MinerController } from "Controllers/Controller.Creep.Miner";
import { PullerController } from "Controllers/Controller.Creep.Puller";
import { BuilderController } from "./Controllers/Controller.Creep.Builder"
import { HarvesterController } from "./Controllers/Controller.Creep.Harvester"
import { UpgraderController } from "./Controllers/Controller.Creep.Upgrader"

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
                return new PullerController();
            default:
                break;
        }

        return null;
    }
}
