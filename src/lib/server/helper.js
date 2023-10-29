import { error } from "@sveltejs/kit";

/**
 * @param {import("@sveltejs/kit").RequestEvent<Partial<Record<string, string>>, string | null>} event
 */
export async function getParams(event) {
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