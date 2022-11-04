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
    export let loadedIndex = 0;

    console.log("loadedIndex:", loadedIndex);

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


<div class="saves" id="saves">
    <h2><Save />Saves</h2>

    <ul>
        {#if type === "feedRate"}
            {#each saves as save, i}
                <li
                    class="input__container"
                    class:loaded={loadedIndex === i}
                    aria-current={loadedIndex === i}
                    transition:slide|local>
                    <div class="main">
                        <h3>{save.name}</h3>
                        <p class="details">
                            <span class="highlighted">
                                {save.spindleSpeed} RPM — {save.feedRate} IPM
                            </span>
                            {save.cutterDiameter}in • {save.numFlutes}FL — {save.opType} {save.material}
                        </p>
                    </div>
                    
                    <div class="actions">
                        <button
                            class="button icon--md"
                            type="button"
                            on:click={() => {
                                if (loadedIndex === i)
                                    dispatch('eject');
                                else
                                    loadSave(i)
                            }}>
                            <Eject />
                            <span>{loadedIndex === i ? "eject" : "load"}</span>
                        </button>
                        <button
                            class="button icon--md"
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
                height: var(--font-2xl);
                fill: var(--clr-900);   
            }
        }

        ul {
            display: grid;
            grid-template-columns: 1fr 1fr;

            li {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-between;
                column-gap: var(--pad-sm);
                row-gap: var(--pad-xs);
                position: relative;
                z-index: 1;

                padding: var(--pad-md) var(--pad-xl);
                border: var(--border) var(--clr-300);
                margin: calc(-0.5 * var(--border-width));
                outline-offset: calc(-1 * var(--border-width));

                &::before, &::after {
                    content: "";
                    position: absolute;
                    top: var(--_inset);
                    right: var(--_inset);
                    bottom: var(--_inset);
                    left: var(--_inset);
                    z-index: -1;

                    border: var(--border) var(--_border-clr);

                    opacity: 0;
                    transition: border-color var(--trans-fast),
                                opacity var(--trans-fast);
                }

                &::before {
                    --_inset: var(--pad-3xs);
                    --_border-clr: var(--clr-600);
                }

                &::after {
                    --_inset: calc(2 *var(--pad-3xs));
                    --_border-clr: var(--clr-500);
                }

                &:hover, &:focus-within {
                    .main {
                        h3 {
                            color: var(--clr-1000);
                        }

                        .details .highlighted {
                            background-color: var(--clr-900);
                        }
                    }
                }

                &.loaded {
                    z-index: 499;
                    outline-color: var(--clr-700);

                    &::before, &::after {
                        opacity: 1;
                    }

                    &:hover, &:focus-within {
                        outline-color: var(--clr-900);

                        &::before {
                            --_border-clr: var(--clr-800);
                        }

                        &::after {
                            --_border-clr: var(--clr-700);
                        }
                    }

                    .main {
                        h3 {
                            color: var(--clr-1000);
                        }

                        .details .highlighted {
                            background-color: var(--clr-900);
                        }
                    }
                }

                .main {
                    display: flex;
                    flex-flow: column nowrap;
                    gap: var(--pad-md);

                    padding-bottom: 0.5rem;

                    h3 {
                        grid-area: title;
                        transition: color var(--trans-fast);
                    }

                    .details {
                        grid-area: details;
                        display: inline-flex;
                        flex-flow: row wrap;
                        align-items: baseline;
                        gap: var(--pad-2xs);

                        font-size: var(--font-sm);
                        line-height: 1.3em;
                        font-weight: 400;

                        .highlighted {
                            display: inline-block;

                            color: var(--clr-0);
                            font-weight: 500;
                            padding: 0 var(--pad-2xs);
                            background-color: var(--clr-800);

                            transition: background-color var(--trans-fast);
                        }
                    }
                }

                .actions {
                    grid-area: actions;
                    justify-self: end;

                    display: flex;
                    flex-flow: column nowrap;
                    column-gap: var(--pad-2xl);

                    margin: calc(-1 * var(--pad-2xs)) 0;
                }
            }
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-tablet) {
        .saves {
            ul {
                li {
                    flex-flow: column nowrap;
                    align-items: stretch;

                    .actions {
                        flex-flow: row wrap;
                    }
                }
            }
        }
    }

    @media only screen and (max-width: $breakpoint-smdtablet) {
        .saves {
            h2 {
                padding: 0 var(--pad-xl);
            }

            ul {
                grid-template-columns: 1fr;

                li {
                    flex-flow: row nowrap;
                    border-right: none;
                    border-left: none;
                }
            }
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .saves {
            margin-top: var(--pad-sm);

            h2 {
                padding: 0;
            }

            ul {
                li {
                    flex-flow: column nowrap;
                    border-right: var(--border) var(--clr-300);
                    border-left: var(--border) var(--clr-300);
                }
            }
        }
    }
</style>