export class TowerController {
    Run(creep: Creep) {
        var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
        if (towers.length <= 0) {
            return;
        }
        var tower = towers[0] as StructureTower;
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
	}
}
