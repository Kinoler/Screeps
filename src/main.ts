import { CreepType } from "Creep.Types";
import { Task } from "Flow.Task";
import { ErrorMapper } from "utils/ErrorMapper";
import { LoopExecutor } from "./Loop.Executor"

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    ResetData: boolean
    IsDebugLoggingEnabled: boolean;
    StorageOfCPU: {[id: string] : number[]}
    tasks: Task[]
  }

  interface CreepMemory {
    role: CreepType;
    room: string;
    working: boolean;
    building: boolean;
    upgrading: boolean;
    level: number;
    cost: number;
    currentTaskId: string
  }

  interface SpawnMemory {
    creepToRenew: string[];
  }

  interface RoomMemory {
    isInit: boolean;
    sourceInited: {[id: string]: boolean}
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  Memory.IsDebugLoggingEnabled = true;
  var loopExecutor = new LoopExecutor();
  loopExecutor.Execute();
});
