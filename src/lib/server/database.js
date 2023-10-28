import { getFlatPromise } from '../utils'
import { randomUUID } from 'crypto'
import { Redis } from 'ioredis'

const db = new Map();

/**
 * @typedef ConnectionDetails
 * @property {string} [slug]
 * @property {string} label
 * @property {string} host
 * @property {number} port
 * @property {string} [username]
 * @property {string} [password]
 * @property {Redis} [redisClient]
 */

/**
 * 
 * @param {string} slug 
 * @returns {Promise<ConnectionDetails>}
 */
export async function getConnection(slug) {
    const connectionDetails = db.get(slug);

    if (!connectionDetails) {
        throw new Error(`Connection ${slug} doesn't exist.`);
    }

    return connectionDetails;
}


/**
 * 
 * @returns {Promise<ConnectionDetails[]>}
 */
export async function getConnections() {
    const connections = [...db.values()];

    const filtered = connections.map((c) => ({
        slug: c.slug,
        label: c.label,
        host: c.host,
        port: c.port,
        username: c.username,
    }));

    return filtered;
}

/**
 * 
 * @param {ConnectionDetails} details 
 */
function validateDetails(details) {
    const {
        label,
        host,
        port,
    } = details;

    if (!label || label.length < 3) {
        throw new Error("[ConnectionDetails] The `label` must be at least 3 characters.");
    }

    if (!host || host.length < 3) {
        throw new Error("[ConnectionDetails] The `host` must be at least 3 characters.");
    }

    if (!port) {
        throw new Error("[ConnectionDetails] The `port` is required.");
    }
}

/**
 * 
 * @param {ConnectionDetails} details 
 * @returns {Promise<Redis>}
 */
async function getRedisConnection(details) {
    const {
        host,
        port,
        username,
        password
    } = details;

    /**
     * @type {import('ioredis').RedisOptions}
     */
    const redisOptions = {
        host,
        port,
    };

    if (username && username.length > 0) {
        redisOptions.username = username;
    }

    if (password && password.length > 0) {
        redisOptions.password = password;
    }

    const client = new Redis(details);

    const {
        promise,
        resolve,
        reject,
    } = getFlatPromise();

    client.on("connect", () => {
        resolve(client);
    })

    client.on("error", (err) => {
        reject(err);
    });

    return promise;
}

/**
 * 
 * @param {ConnectionDetails} details 
 * @throws {Error}
 */
export async function createConnection(details) {
    validateDetails(details);

    const slug = randomUUID();
    const {
        label,
        host,
        port,
        username,
        password
    } = details;

    /**
     * @type {ConnectionDetails}
     */
    const newConnection = {
        label,
        slug,
        host,
        port,
        username,
        password,
    };

    newConnection.redisClient = await getRedisConnection(newConnection);

    db.set(slug, newConnection)
}

