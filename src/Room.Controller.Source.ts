import { Logging } from "./Logging.Helper";
import { CreepEnum, CreepType } from "./Creep.Types"
import { ceil, forEach } from "lodash";
import { Extensions } from "utils/Extensions";
import { MineTask, TaskPool } from "Flow.Task";

export class SourceController {
    Source: Source;

    constructor(source: Source) {
        this.Source = source;
    }

    FirstInit()
    {
        for (const position of Extensions.GetPositionsByCircle(this.Source.pos)) {
            var terrain = position.lookFor(LOOK_TERRAIN)[0]
            if (terrain == "plain") {
                var task = new MineTask(this.Source.id, position)
                TaskPool.CreateTask(task)
            }
        }
    }

    Init()
    {
        if (!this.Source.room.memory.sourceInited) {
            this.Source.room.memory.sourceInited = {}
        }
        if (!this.Source.room.memory.sourceInited[this.Source.id]) {
            this.FirstInit()
            this.Source.room.memory.sourceInited[this.Source.id] = true
        }
    }
}
