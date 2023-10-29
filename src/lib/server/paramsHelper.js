import { error } from "@sveltejs/kit";

/**
 * @param {import("@sveltejs/kit").RequestEvent<Partial<Record<string, string>>, string | null>} event
 * @returns {Promise<string>}
 */
export async function getSlug(event) {
    const { slug } = event.params;
    if (typeof slug !== 'string') {
        throw error(400, {
            message: "[Error] Missing slug",
        });
    }
    return slug;
}

/**
 * 
 * @param {import("@sveltejs/kit").RequestEvent<Partial<Record<string, string>>, string | null>} event
 * @returns {Promise<any>}
 */
export async function getBody(event) {
    let body = {};
    
    try {
        body = await event.request.json();
    } catch (err) {
        console.error(err);
        throw error(400, {
            message: "[Error] Missing body",
        });
    }

    return body;
}

/**
 * 
 * @param {import("@sveltejs/kit").RequestEvent<Partial<Record<string, string>>, string | null>} event 
 * @returns {Promise<any>}
 */
export async function getQuery(event) {
    const searchParams = event.url.searchParams;
    const query = Object.fromEntries(searchParams.entries());
    return query;
}
