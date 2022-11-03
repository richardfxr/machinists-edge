<script lang="ts">
    /* === IMPORTS ============================ */
    import { createEventDispatcher } from 'svelte';
    import { slide } from 'svelte/transition';
    import Save from "$lib/SVGs/save.svelte";
    import Eject from "$lib/SVGs/eject.svelte";
	import DeleteSave from "$lib/SVGs/deleteSave.svelte";
    import type { feedRateSave } from "../store/store";

    /* === PROPS ============================== */
    export let saves: feedRateSave[];
    export let type: "feedRate";

    /* === EVENTS ============================= */
    const dispatch = createEventDispatcher();

    function loadSave(index: number) {
        dispatch('load', {
            index,
        });
    }

    function deleteSave(index: number) {
        dispatch('delete', {
            index,
        });
    }
</script>


<div class="saves">
    <h2><Save /> saves</h2>

    <ul>
        {#if type === "feedRate"}
            {#each saves as save, i}
                <li transition:slide|local>
                    <h3>{save.name}</h3>
                    <p class="details">
                        <span class="highlighted">
                            {save.spindleSpeed} RPM. {save.feedRate} IPM
                        </span>
                        {save.cutterDiameter}in {save.numFlutes}FL: {save.opType} {save.material}
                    </p>
                    <div class="actions">
                        <button
                            type="button"
                            on:click={() => loadSave(i)}>
                            <Eject />
                            <span>load</span>
                        </button>
                        <button
                            type="button"
                            on:click={() => deleteSave(i)}>
                            <DeleteSave />
                            <span>delete</span>
                        </button>
                    </div>
                </li>
            {/each}
        {/if}
    </ul>
</div>


<style lang="scss">
    .saves {
        h2 {
            display: inline-flex;
            align-items: center;
            gap: var(--pad-sm);

            margin-bottom: var(--pad-2xl);

            :global(.icon) {
                display: inline-block;
                height: var(--font-xl);
                fill: var(--clr-800);   
            }
        }

        ul {
            li {
                display: grid;
                gap: var(--pad-sm);

                h3 {
                    font-size: var(--font-lg);
                    line-height: 1em;
                    font-weight: 600;
                }

                .details {
                    font-size: var(--font-sm);
                    line-height: 1em;
                    font-weight: 400;

                    .highlighted {
                        display: inline-block;

                        color: var(--clr-0);
                        font-weight: 500;
                        padding: var(--pad-5xs) var(--pad-3xs);
                        background-color: var(--clr-800);
                    }
                }

                .actions {
                    button {
                        color: var(--_color);
                        font-size: var(--font-lg);
                        font-weight: 500;
                        line-height: 1em;
                    }
                }
            }
        }
    }
</style>