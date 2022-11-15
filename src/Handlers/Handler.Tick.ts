export class TickHandler {
    static Execute(tick: number, func: () => void)
    {
        if (Game.time % tick == 0) {
            func()
        }
    }
}
