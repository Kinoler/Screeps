export class CPUHandler {
    private static TempResult: {[id: string] : number}

    static StartTrack(name: string) {
        CPUHandler.TempResult[name] = Game.cpu.getUsed();
    }

    static StopTrack(name: string) {
        var passedTime = Game.cpu.getUsed() - CPUHandler.TempResult[name]
        Memory.StorageOfCPU[name].push(passedTime);
    }

    static GetTrack(name: string) {
        if (Memory.StorageOfCPU[name] && Memory.StorageOfCPU[name].length > 0) {
            return Memory.StorageOfCPU[name].sort()[0]
        }

        return 0;
    }
}
