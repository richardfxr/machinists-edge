/* === IMPORTS ============================ */
import type { LayoutLoad } from './$types';

export const load = (({ url }) => {
    return {
            url,
    };
}) satisfies LayoutLoad;