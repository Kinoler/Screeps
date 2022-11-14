export class Logging {
    static intance: Logging = new Logging()
    static LogDebug(message: string) {
        if (Memory.IsDebugLoggingEnabled) {
            console.log(`DEBUG: ${message}`);
        }
    }
};
