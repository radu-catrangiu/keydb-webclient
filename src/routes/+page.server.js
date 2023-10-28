import { fail } from '@sveltejs/kit';
import { getConnections, createConnection } from "$lib/server/database"

/**
 * @typedef ConnectionsPageResponse
 * @property {import("$lib/server/database").ConnectionDetails[]} connections
 */

/**
 * 
 * @returns {Promise<ConnectionsPageResponse>}
 */
export async function load() {
    const connections = await getConnections();
    return {
        connections
    }
}

/**
 * 
 * @param {FormData} data 
 * @returns {import("$lib/server/database").ConnectionDetails}
 */
function getConnectionDetailsFromFormData(data) {
    const {
        host,
        port,
        label,
        username,
        password,
    } = Object.fromEntries(data);

    /**
     * @type {import("$lib/server/database").ConnectionDetails}
     */
    const connectionDetails = {
        host: String(host),
        port: Number(port),
        label: String(label),
    }

    if (username) {
        connectionDetails.username = String(username);
    }

    if (password) {
        connectionDetails.password = String(password)
    }

    return connectionDetails;
}

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const connectionDetails = getConnectionDetailsFromFormData(data);
        try {
            await createConnection(connectionDetails);
        } catch (error) {
            return fail(422, {
                error,
            })
        }
    }
}