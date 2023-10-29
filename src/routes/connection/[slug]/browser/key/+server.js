import { handleMultiResponse, runCommand } from '$lib/server/commandRunner';
import { getQuery, getSlug } from '$lib/server/paramsHelper';
import { error, json } from '@sveltejs/kit';

/**
 * @typedef KeyDataResponse
 * @property {boolean} exists
 * @property {string} type
 * @property {any} value
 * @property {number} ttl
 * @property {number} size
 */

/**
 * @param {string} type 
 * @param {string} key 
 * @returns {string | null}
 */
function computeGetCommand(type, key) {
    switch (type) {
        case "string":
            return `get ${key}`;
        case "list":
            return `lrange ${key} 0 -1`;
        case "hash":
            return `hgetall ${key}`;
        case "set": 
            return `smembers ${key}`
        case "zset":
            return `zrange ${key} 0 -1 WITHSCORES`
    }

    return null
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event) {
    const slug = await getSlug(event);
    const query = await getQuery(event);

    const { db, key } = query;

    // Get key type
    const typeCommandResponse = await runCommand(slug, db, `TYPE ${key}`);
    const keyType = handleMultiResponse(typeCommandResponse);

    if (keyType === "none") {
        return json({
            exists: false,
            type: keyType,
            ttl: -2,
            size: 0,
            value: null,
        });
    }

    const command = computeGetCommand(keyType, key);
    if (!command) {
        throw error(400, {
            message: "[Error] Invalid key type: " + keyType,
        })
    }

    // Get key
    const getCommandResponse = await runCommand(slug, db, command);
    const value = handleMultiResponse(getCommandResponse);

    // Get Expire Time
    const expireTimeCommandResponse = await runCommand(slug, db, `TTL ${key}`)
    const ttl = handleMultiResponse(expireTimeCommandResponse);

    // Get size
    const sizeCommandResponse = await runCommand(slug, db, `MEMORY USAGE ${key}`);
    const size = handleMultiResponse(sizeCommandResponse);

    return json({
        exists: true,
        type: keyType,
        ttl,
        size,
        value,
    });
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function PUT(event) {
    const slug = await getSlug(event);
    const query = await getQuery(event);

    const { action } = query;

    if (action === "UPDATE_TTL") {
        const { db, key, ttl } = query;
        const command = ttl < 0 ? `PERSIST ${key}` : `EXPIRE ${key} ${ttl}`;
        const getCommandResponse = await runCommand(slug, db, command);
        const result = handleMultiResponse(getCommandResponse);

        return json({
            action,
            result,
        });
    }

    return json({});
}
