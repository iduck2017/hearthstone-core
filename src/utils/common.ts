export class CommonUtil {
    public static async sleep(time?: number) {
        time = time ?? 10
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
