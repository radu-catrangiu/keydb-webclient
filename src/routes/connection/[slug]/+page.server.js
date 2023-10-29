import { getConnection } from '$lib/server/database.js'
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
    try {
        await getConnection(params.slug);
    } catch (error) {
        throw redirect(300, "/")
    }

    return {
        slug: params.slug
    }
}