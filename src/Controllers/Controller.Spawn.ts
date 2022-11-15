import {Logging} from "../Logging.Helper";
import { CreepEnum, CreepType } from "../Creep.Types"
import { ceil, forEach, object } from "lodash";

export class SpawnController {
    SpawnName: string;
    Spawn: StructureSpawn;
    CurrentEnergy: number;
    MaxEnergy: number;
    CreepsToRenew: string[];

    constructor(spawnName: string) {
        this.SpawnName = spawnName;
        this.Spawn = Game.spawns[spawnName];
        this.CurrentEnergy = this.Spawn.store.getUsedCapacity(RESOURCE_ENERGY);
        this.MaxEnergy = this.Spawn.store.getCapacity(RESOURCE_ENERGY);
        if (!this.Spawn.memory.creepToRenew) {
            this.Spawn.memory.creepToRenew = [];
        }
        this.CreepsToRenew = this.Spawn.memory.creepToRenew;
    }

    IsMainSpawn() {
        return true;
    }

    GetCreepsByType(type: string){
        return _.filter(Game.creeps, (creep) => creep.memory.role.type == type);
    }

    EnergyIsFull() {
        return this.CurrentEnergy == this.MaxEnergy;
    }

    SpawnCreep(type: CreepType, body: BodyPartConstant[]) {
        var newName = type.type + Game.time;
        var result = this.Spawn.spawnCreep(body, newName, { memory: {
            role: type,
            room: this.Spawn.room.name,
            building: false,
            upgrading: false,
            working: false,
            level: body.length,
            cost: 300,
            currentTaskId: ""
        }});
        Logging.LogDebug('The Spawn "' + this.SpawnName + '" spawning new ' + type.type + ': ' + newName + ' with result: ' + result);
    }

    UpToDateCreepsMemory() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                //delete Memory.creeps[name];
                Logging.LogDebug('Clearing non-existing creep memory:' + name);
            }
        }
    }

    ShowSpawnText() {
        if (this.Spawn.spawning) {
            var spawningCreep = Game.creeps[this.Spawn.spawning.name];
            this.Spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                this.Spawn.pos.x + 1,
                this.Spawn.pos.y,
                { align: 'left', opacity: 0.8 });
        }
    }

    CreateCreepBody(type: string) {
        switch (type) {
            case CreepEnum.BUILDER:
                return [WORK, CARRY, MOVE];
            case CreepEnum.HARVESTER:
                return [WORK, CARRY, MOVE];
            case CreepEnum.UPGRADER:
                return [WORK, CARRY, MOVE];
            case CreepEnum.MINER:
                return [WORK, WORK, WORK];
            case CreepEnum.PULLER:
                return [MOVE, MOVE, MOVE];

            default:
                break;
        }
        return [];
    }

    RenewCreeps() {
        if(this.CreepsToRenew.length > 0){
            var code = 1;
            var index = 0;
            while (code != OK && index < this.CreepsToRenew.length) {
                var creepNameToRenew = this.CreepsToRenew[index++];
                var creep = Game.creeps[creepNameToRenew];
                if (creep) {
                    var requiredEnergy = ceil(creep.memory.cost/2.5/creep.body.length)
                    if (requiredEnergy > this.CurrentEnergy) {
                        continue;
                    }

                    code = this.Spawn.renewCreep(creep);
                    if (code == ERR_NOT_IN_RANGE) {
                        delete this.CreepsToRenew[index--];
                    }
                    if (code == ERR_NOT_ENOUGH_ENERGY) {
                        continue;
                    }
                }
                else {
                    delete this.CreepsToRenew[index--];
                }
            }
            return code == OK;
        }
        return false;
    }

    GetCreepTargetPrecentageByType(type:string) {
        switch (type) {
            case CreepEnum.BUILDER:
                return 0.25;
            case CreepEnum.HARVESTER:
                return 0.5;
            case CreepEnum.UPGRADER:
                return 0.25;

            default:
                break;
        }
        return 0;
    }

    GetCreepTargetPrecentage() {
        var creepPrecentageByType: {[id: string]: number} = {};
        Object.values(CreepEnum).forEach(el => {
            creepPrecentageByType[el] = this.GetCreepTargetPrecentageByType(el);
        })

        return creepPrecentageByType
    }

    DetermineWhichCreepTypeShouldBeCreated(){
        var creepCountByType: {[id: string]: number} = {};
        Object.values(CreepEnum).forEach(el => {
            creepCountByType[el] = this.GetCreepsByType(el).length;
        })

        var entireCount = Object.keys(Game.creeps).length;
        var creepTargetPrecentage = this.GetCreepTargetPrecentage();

        var resultType = Object.keys(creepCountByType).map(el => {
            return {
                key: el,
                value: creepCountByType[el]/entireCount - creepTargetPrecentage[el]
            };
        }).sort((a,b) => a.value - b.value);
        return new CreepType(resultType[0].key);
    }

    Init() {
        this.UpToDateCreepsMemory();

        if (this.Spawn.spawning){
            return;
        }
        var create = [CreepEnum.MINER, CreepEnum.PULLER]
        for (const key in Game.creeps) {
            const creep = Game.creeps[key];
            if (creep) {
                create = create.filter(el => el != creep.memory.role.type)
            }
        }

        if (create.length > 0) {
            var creepType = new CreepType(create[0]);
            if (creepType && this.EnergyIsFull()) {
                var body = this.CreateCreepBody(creepType.type);
                this.SpawnCreep(creepType, body);
            }
        }


        this.ShowSpawnText();
        return;
/*
        if (this.RenewCreeps()) {
            return;
        }

        if (this.IsMainSpawn() && this.EnergyIsFull()) {
            var creepType = this.DetermineWhichCreepTypeShouldBeCreated();
            if (creepType) {
                var body = this.CreateCreepBody(creepType.type);
                this.SpawnCreep(creepType, body);
            }
        }

        */
    }
}
