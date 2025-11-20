export class Util {
    public static async yield(time?: number) {
        time = time ?? 10
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
