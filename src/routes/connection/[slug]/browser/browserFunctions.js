
/**
 * @typedef BrowserState
 * @property {object} dbIndex
 * @property {number} dbIndex.new
 * @property {number} dbIndex.current
 * 
 * @property {object} pattern
 * @property {string} pattern.new
 * @property {string} pattern.current
 * 
 * @property {object} scan
 * @property {string} scan.cursor
 * @property {number} scan.batch
 * @property {number} scan.current
 * @property {number} scan.maxKeys
 * 
 * @property {string[]} keysList
 * 
 * @property {string | null} selectedKey
 * @property {import("./key/+server").KeyDataResponse | null} selectedKeyData
 */

/**
 * @param {URL} url 
 * @param {string | null} selectedKey 
 * @param {number} currentDbIndex 
 * @param {string} currentPattern 
 */
export function updateUrl(url, selectedKey, currentDbIndex, currentPattern) {
    if (selectedKey) {
        url.searchParams.set("key", selectedKey);
    } else {
        url.searchParams.delete("key");
    }
    url.searchParams.set("db", String(currentDbIndex));
    url.searchParams.set("pattern", currentPattern);
    history.replaceState(history.state, "", url);
}

/**
 * @param {URL} url 
 */
export function getStateFromUrl(url) {
    let db = Number(url.searchParams.get("db"));
    let pattern = url.searchParams.get("pattern");
    let key = url.searchParams.get("key");

    return {
        db,
        pattern,
        key,
    };
}

/**
 * @param {URL} currentUrl 
 * @param {number} db
 * @param {string} pattern 
 * @param {string} cursor 
 * @param {number} count 
 * @returns 
 */
export async function listKeysFromAPI(currentUrl, db, pattern, cursor, count) {
    const pathname = currentUrl.pathname + "/list";

    const query = new URLSearchParams();
    query.set("db", String(db));
    query.set("pattern", pattern);
    query.set("cursor", cursor);
    query.set("count", String(count));

    const url = pathname + '?' + query.toString();

    const response = await fetch(url, {
        method: "GET",
    });

    const result = await response.json();

    return result;
}

/**
 * @param {URL} currentUrl 
 * @param {number} db
 * @param {string} key 
 * @returns 
 */
export async function getKeyData(currentUrl, db, key) {
    const pathname = currentUrl.pathname + "/key";

    const query = new URLSearchParams();
    query.set("db", String(db));
    query.set("key", key);

    const url = pathname + '?' + query.toString();

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error)
    }

    return null;
}

/**
 * 
 * @param {URL} currentUrl 
 * @param {number} db 
 * @param {string} key 
 * @param {number} ttl 
 * @returns 
 */
export async function updateKeyTTL(currentUrl, db, key, ttl) {
    const pathname = currentUrl.pathname + "/key";

    const query = new URLSearchParams();
    query.set("action", "UPDATE_TTL")
    query.set("db", String(db));
    query.set("key", key);
    query.set("ttl", String(ttl));

    const url = pathname + '?' + query.toString();

    const response = await fetch(url, {
        method: "PUT",
    });

    const result = await response.json();

    return result;
}

/**
 * @param {URL} currentUrl
 * @param {number} db
 * @param {string} type
 * @param {string} key
 * @param {string} value
 */
export async function upsertKey(currentUrl, db, type, key, value) {
    const pathname = currentUrl.pathname + `/key/${type}`;

    const query = new URLSearchParams();
    query.set("db", String(db));
    query.set("key", key);
    query.set("value", value);

    const url = pathname + '?' + query.toString();

    const response = await fetch(url, {
        method: "POST",
    });

    const result = await response.json();

    return result;
}