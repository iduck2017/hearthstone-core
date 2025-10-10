
export class TimeUtil {
    public static async sleep(ms: number = 10) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    private constructor() {}
}