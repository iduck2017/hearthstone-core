
export class AnimeUtil {
    private static _current: number = 0
    public static get current() { 
        return AnimeUtil._current; 
    }

    public static add(value: number) { 
        AnimeUtil._current += value;
    }

    public static reset() { 
        AnimeUtil._current = 0; 
    }

    public static async pause(time: number = 10) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    private constructor() {}
}