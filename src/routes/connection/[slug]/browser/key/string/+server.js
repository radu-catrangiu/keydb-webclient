import { handleMultiResponse, runCommand } from '$lib/server/commandRunner';
import { getQuery, getSlug } from '$lib/server/paramsHelper';
import { json } from '@sveltejs/kit';


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event) {
    const slug = await getSlug(event);
    const query = await getQuery(event);

    const { db, key, value } = query;

    const command = `SET ${key} ${value}`;
    try {
        const getCommandResponse = await runCommand(slug, Number(db), command);
        handleMultiResponse(getCommandResponse);
    } catch (error) {
        console.log(error);
    }

    return json({
        status: 0
    });
}
