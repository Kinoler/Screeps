import { Logging } from "../Logging.Helper";
import { CreepEnum, CreepType } from "../Creep.Types"
import { ceil, forEach } from "lodash";
import { Extensions } from "utils/Extensions";
import { MineTask, TaskPool } from "Flow.Task";

export class SourceController {
    static FirstInit(source: Source)
    {
        for (const position of Extensions.GetPositionsByCircle(source.pos)) {
            var terrain = position.lookFor(LOOK_TERRAIN)[0]
            if (terrain == "plain") {
                var task = new MineTask(source.id, position)
                TaskPool.CreateTask(task)
            }
        }
    }

    static Init(source: Source)
    {
        if (!source.room.memory.sourceInited) {
            source.room.memory.sourceInited = {}
        }
        if (!source.room.memory.sourceInited[source.id]) {
            this.FirstInit(source)
            source.room.memory.sourceInited[source.id] = true
        }
    }
}
