export class AnimeService {
    private static _current: number = 0
    public static get current() { 
        return AnimeService._current; 
    }

    public static add(value: number) { 
        AnimeService._current += value;
    }

    public static clear() { 
        AnimeService._current = 0; 
    }

    private constructor() {}
}