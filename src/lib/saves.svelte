<script lang="ts">
    /* === IMPORTS ============================ */
    import { createEventDispatcher } from 'svelte';
    import { slide, fade } from 'svelte/transition';
    import Save from "$lib/SVGs/save.svelte";
    import Eject from "$lib/SVGs/eject.svelte";
	import DeleteSave from "$lib/SVGs/deleteSave.svelte";
    import { motionPref } from "../store/store";
    import type { feedRateSave, toolLengthSave } from "../store/store";

    /* === PROPS ============================== */
    export let feedRateSaves: feedRateSave[] | null = null;
    export let toolLengthSaves: toolLengthSave[] | null = null;
    export let loadedIndex = 0;

    /* === FUNCTIONS ========================== */
    function animate(node: HTMLElement, options: { animation: Function, duration: number }) {
        if ($motionPref === "reduced")
            return fade(node, { duration: 200 });
        else
            return options.animation(node, options);
    }

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
    
    {
        #if (feedRateSaves === null || feedRateSaves.length === 0) &&
            (toolLengthSaves === null || toolLengthSaves.length === 0)
    }
        <div class="empty" transition:animate|local={{ animation: slide, duration: 300 }}>
            <div class="box" role="presentation"></div>
            <p class="highlighted">No saves found</p>
            <p class="text--sm">Create new saves in the <a href="#saveLoader">loaded save section</a> above.</p>
        </div>
    {:else if feedRateSaves}
        <ul class="feedRateSaves">
            {#each feedRateSaves as save, i}
                <li
                    class="input__container"
                    class:loaded={loadedIndex === i}
                    aria-current={loadedIndex === i}
                    transition:animate|local={{ animation: slide, duration: 300 }} >
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
        </ul>
    {:else if toolLengthSaves}
        <ul class="toolLengthSaves">
            {#each toolLengthSaves as save, i}
                <li
                    class="input__container"
                    class:loaded={loadedIndex === i}
                    aria-current={loadedIndex === i}
                    transition:animate|local={{ animation: slide, duration: 300 }} >
                    <div class="main">
                        <h3>{save.name}</h3>
                        <p class="details">
                            <span class="highlighted">
                                {save.overallLength}in overall
                            </span>
                            {save.fluteLength}in FL • {save.cutterDiameter}in cutter diameter
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
        </ul>
    {/if}
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

        .highlighted {
            color: var(--clr-0);
            font-weight: 500;
            padding: 0 var(--pad-2xs);
            background-color: var(--clr-900);

            transition: background-color var(--trans-fast);
        }

        .empty {
            // internal variables
            --_box-size: 80px;

            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            width: 100%;

            padding: var(--input-pad-hrz) var(--input-pad-hrz) var(--pad-4xl) var(--input-pad-hrz);
            border: var(--border) var(--clr-300);

            .box {
                position: relative;
                width: var(--_box-size);
                height: var(--_box-size);

                margin-bottom: var(--pad-xl);
                border: var(--border) var(--clr-300);

                overflow: hidden;

                &::before, &::after {
                    // two borders that form the cross
                    content: "";
                    position: absolute;
                    top: calc(-1 * var(--_box-size));
                    right: calc(50% - var(--border-width) / 2);
                    bottom: calc(-1 * var(--_box-size));

                    border-left: var(--border) var(--clr-300);
                }

                &::before {
                    transform: rotate(45deg);
                }

                &::after {
                    transform: rotate(-45deg);
                }
            }

            p.text--sm {
                padding-top: var(--pad-2xs);
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

                padding: var(--input-pad-vrt) var(--input-pad-hrz);
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
                    --_inset: var(--pad-4xs);
                    --_border-clr: var(--clr-600);
                }

                &::after {
                    --_inset: calc(2 *var(--pad-4xs));
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
                        }
                    }
                }

                .actions {
                    grid-area: actions;
                    justify-self: end;

                    display: flex;
                    flex-flow: column nowrap;
                    column-gap: var(--pad-2xl);
                    row-gap: var(--padRem-4xs);

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

    @media only screen and (max-width: $breakpoint-smtablet) {
        .saves {
            ul {
                grid-template-columns: 1fr;

                li {
                    flex-flow: row nowrap;

                    // remove border compensation margin on left and right to avoid overflow
                    margin-right: 0;
                    margin-left: 0;
                }
            }
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .saves {
            margin-top: var(--pad-sm);

            ul {
                li {
                    flex-flow: column nowrap;
                }
            }
        }
    }
</style>