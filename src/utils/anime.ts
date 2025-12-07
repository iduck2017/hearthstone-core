export class AnimeUtil {
    private static _current: number = 0
    public static get current() { 
        return AnimeUtil._current; 
    }

    public static add(value: number) { 
        AnimeUtil._current += value;
    }

    public static clear() { 
        AnimeUtil._current = 0; 
    }

    private constructor() {}
}