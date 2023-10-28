import { redirect } from '@sveltejs/kit';
 
export function load({ request }) {
  throw redirect(302, `${request.url}/info`);
}
