
/**
 * @typedef ConnectionDetails
 * @property {string} label
 * @property {string} slug
 */

/**
 * @typedef ConnectionsPageResponse
 * @property {ConnectionDetails[]} connections
 */


/**
 * 
 * @returns {ConnectionsPageResponse}
 */
export function load() {
    /**
     * @type {ConnectionDetails}
     */
    const dummyConnection = {
        label: "dummy-keydb-connection",
        slug: "ea845875-051c-4d4a-b8e6-7711f955b8e4"
    };
    const response = {
        connections: [
            dummyConnection,
        ]
    }

    return response
}