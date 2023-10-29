import { runCommand } from '$lib/server/commandRunner';
import { getQuery, getSlug } from '$lib/server/paramsHelper';
import { json } from '@sveltejs/kit';
import { error } from 'console';

/**
 * @typedef RawListQueryParams
 * @property {string} db
 * @property {string} pattern
 * @property {string} cursor
 * @property {number} [count]
 */

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event) {
    const slug = await getSlug(event);
    /**
     * @type {RawListQueryParams}
     */
    const query = await getQuery(event);

    const db = Number(query.db);
    const pattern = query.pattern;

    const command = `SCAN ${query.cursor || 0} MATCH ${pattern} COUNT ${query.count || 10}`

    const result = await runCommand(slug, db, command)

    if (result.selectResult[0] !== null) {
        const err = result.selectResult[0];
        throw error(err.message);
    }

    if (result.commandResult[0] !== null) {
        const err = result.commandResult[0];
        throw error(err.message);
    }

    const [newCursor, list] = result.commandResult[1];


    return json({
        finish: newCursor === "0",
        newCursor,
        list
    });
}