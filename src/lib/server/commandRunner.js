import { error } from "@sveltejs/kit";
import { getConnection } from "./database";

/**
 * @param {string} slug
 * @param {number} db
 * @param {string} command
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