import { handleMultiResponse, runCommand } from '$lib/server/commandRunner';
import { getQuery, getSlug } from '$lib/server/paramsHelper';
import { json } from '@sveltejs/kit';

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

    const response = await runCommand(slug, db, command)

    const result = handleMultiResponse(response);

    const [newCursor, list] = result;

    return json({
        finish: newCursor === "0",
        newCursor,
        list
    });
}