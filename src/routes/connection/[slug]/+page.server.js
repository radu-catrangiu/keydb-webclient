import { fail } from '@sveltejs/kit';
import { getConnection } from '$lib/server/database.js'
import { parseRedisInfo } from '$lib/utils.js';

/**
 * @typedef RedisInfoEntry
 * @property {string} key
 * @property {string} value
 */

export async function load({ params }) {
    const slug = params.slug;

    let connectionDetails;

    try {
        connectionDetails = await getConnection(slug);
    } catch (error) {
        return fail(404, {
            error,
        });
    }

    let info;
    try {
        info = await connectionDetails.redisClient?.info();
    } catch (error) {
        return fail(500, {
            error,
        });
    }

    const connectionInfo = parseRedisInfo(info);

    return {
        slug,
        connectionInfo,
    }
}
