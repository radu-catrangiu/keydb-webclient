import { error } from "@sveltejs/kit";
import { getConnection } from "./database";

/**
 * @typedef RunCommandResult
 * @property {[Error | null, any]} selectResult
 * @property {[Error | null, any]} commandResult
 */

/**
 * @param {string} slug
 * @param {number} db
 * @param {string} command
 * @returns {Promise<RunCommandResult>}
 */
export async function runCommand(slug, db, command) {
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
 * @param {RunCommandResult} runCommandResult
 */
export function handleMultiResponse(runCommandResult) {
    if (runCommandResult.selectResult[0] !== null) {
        const err = runCommandResult.selectResult[0];
        throw error(500, err);
    }

    if (runCommandResult.commandResult[0] !== null) {
        const err = runCommandResult.commandResult[0];
        throw error(500, err);
    }

    return runCommandResult.commandResult[1];
}
