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

/**
 * @param {string} str 
 * @returns {boolean}
 */
export function isJsonString(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Function that takes an object or string and returns html
 * @param {string} jsonString 
 * @returns {string}
 */
export function syntaxHighlight(jsonString) {
    try {
        const json = JSON.parse(jsonString);
        jsonString = JSON.stringify(json, undefined, 4);
    } catch (e) {
        // JSON is invalid, use original string
        return jsonString;
    }
    
    jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return jsonString.replace(
        /("(\\u[a-f0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            // @ts-ignore
            return `<span class="json-${cls}">${match}</span>`;
        }
    );
}

/**
 * 
 * @param {number} bytes 
 * @returns 
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}