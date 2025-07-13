
export class TimeUtil {
    public static async sleep(ms: number = 100) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private constructor() {}
}