import { json } from '@sveltejs/kit';
import { TYPE } from '$lib/cli'
import { getParams } from '$lib/server/helper';
import { runCommand } from '$lib/server/commandRunner';

/**
 * @param {[Error]} selectResult
 * @param {[Error, string | null]} commandResult
 */
function parseResonse(selectResult, commandResult) {
    const [selectError] = selectResult;
    if (selectError !== null) {
        return {
            type: TYPE.ERROR,
            value: selectError.message,
        }
    }

    const [commandError, commandResponse] = commandResult;
    if (commandError !== null) {
        return {
            type: TYPE.ERROR,
            value: commandError.message,
        }
    }

    const value = commandResponse === null ? "(nil)" : commandResponse;

    return {
        type: TYPE.RESPONSE,
        value,
    }
}

/**
 * @typedef CliApiBody
 * @property {string} command
 * @property {number} [db]
 */

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event) {
    const {
        slug,
        body,
    } = await getParams(event);

    const {
        db = 0,
        command,
    } = body;

    const {
        selectResult,
        commandResult,
    } = await runCommand(slug, db, command);

    return json(parseResonse(selectResult, commandResult)); 
}