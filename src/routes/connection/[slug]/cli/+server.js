import { json, error } from '@sveltejs/kit';
import { getConnection } from '$lib/server/database'
import { TYPE } from '$lib/cli'

/**
 * @param {import("@sveltejs/kit").RequestEvent<Partial<Record<string, string>>, string | null>} event
 */
async function getParams(event) {
    const { slug } = event.params;
    let body;
    
    try {
        body = await event.request.json();
    } catch (err) {
        console.error(err);
        throw error(400, {
            message: "[Error] Missing slug",
        });
    }

    if (typeof slug !== 'string') {
        throw error(400, {
            message: "[Error] Missing slug",
        });
    }

    return {
        slug,
        body,
    }
}

/**
 * @param {string} slug
 * @param {number} db
 * @param {string} command
 */
async function runCommand(slug, db, command) {
    let connectionDetails;
    try {
        connectionDetails = await getConnection(slug);
    } catch (err) {
        console.error(err);
        throw error(404, {
            message: "[Error] Connection not found",
        })
    }

    const [cmd, ...args] = command.trim().split(" ");

    const client = connectionDetails.redisClient;

    let results;
    try {
        results = await client?.multi()
            .select(db)
            .call(cmd, ...args)
            .exec();
    } catch (err) {
        // @ts-ignore
        const errors = err.previousErrors;
        if (errors.length === 1 && errors[0].command?.name?.toLowerCase() !== "select") {
            results = [
                [null, null],
                [errors[0], null]
            ];
        } else {
            // @ts-ignore
            results = err.previousErrors.map((/** @type {any} */ e) => ([e, null]))
        }
    }

    // @ts-ignore
    const [
        selectResult,
        commandResult,
    ] = results;

    return {
        selectResult,
        commandResult,
    };
}

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