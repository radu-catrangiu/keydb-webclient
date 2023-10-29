
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
 * @property {string | null} selectedKey
 * @property {string[]} keysList
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
    }
    url.searchParams.set("db", String(currentDbIndex));
    url.searchParams.set("pattern", currentPattern);
    history.replaceState(history.state, "", url);
}

/**
 * @param {URL} currentUrl 
 * @param {string} pattern 
 * @param {string} cursor 
 * @param {number} count 
 * @returns 
 */
export async function listKeysFromAPI(currentUrl, pattern, cursor, count) {
    const u = new URL(currentUrl);

    u.pathname = u.pathname + "/list";
    u.searchParams.set("pattern", pattern);
    u.searchParams.set("cursor", cursor);
    u.searchParams.set("count", String(count));
    const url = u.pathname + u.search;

    const response = await fetch(url, {
        method: "GET",
    });

    const result = await response.json();

    return result;
}
