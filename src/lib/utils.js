export function getFlatPromise() {
    /**
     * @type {(value: any) => void}
     */
    let resolve;

    /**
     * @type {(reason?: any) => void}
     */
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    })

    return {
        promise,
        // @ts-ignore
        resolve,
        // @ts-ignore
        reject,
    }
}

/**
 * @param {String | undefined} info 
 * @returns {import("../routes/connection/[slug]/info/+page.server").RedisInfoEntry[]}
 */
export function parseRedisInfo(info) {
    /**
     * @type {import("../routes/connection/[slug]/info/+page.server").RedisInfoEntry[]}
     */
    const redisInfo = [];

    if (!info) {
        return redisInfo;
    }

    const lines = info.split("\r\n");

    for (const line of lines) {
        const [key, value] = line.split(":");
        if (key && value) {
            redisInfo.push({ key, value });
        }
    }

    return redisInfo;
}

/**
 * @param {number} ms
 */
export async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}