export namespace Utils {
    export async function sleep(ms: number = 100) {
        return new Promise(resolve => setTimeout(() => {
            console.log('sleep', ms);
            resolve(undefined);
        }, ms));
    }
}