<script lang="ts">
    /* === IMPORTS ============================ */
    import { createEventDispatcher } from 'svelte';
    import ThemeLight from '$lib/SVGs/theme-light.svelte';
    import ThemeDark from '$lib/SVGs/theme-dark.svelte';
    import MotionFull from '$lib/SVGs/motion-full.svelte';
    import MotionLow from '$lib/SVGs/motion-low.svelte';
	import ToolTip from './toolTip.svelte';

    /* === PROPS ============================== */
    export let label: string;
    export let name: string;
    export let options: { "name": string, "icon": string, "value": string }[];
    export let value = options[0].value;
    export let position: "top-left" | "top-right" | "bottom-left" | "bottom-right" = "top-left";
    export let selfContained = false;
</script>


<div
    id={name}
    class="iconRadioInput"
    class:input__container={selfContained}
    role="radiogroup"
    aria-labelledby="{name}__label">
    <p
        id="{name}__label"
        class="visuallyHidden">
        {label}
    </p>
    <div class="main">
        {#each options as option}
            <label>
                <input
                    class="visuallyHidden"
                    type="radio"
                    bind:group={value}
                    {name}
                    value={option.value}
                    on:change />
                <ToolTip {position}>{option.name}</ToolTip>
                {#if option.icon === "theme-light"}
                    <ThemeLight />
                {:else if option.icon === "theme-dark"}
                    <ThemeDark />
                {:else if option.icon === "motion-full"}
                    <MotionFull />
                {:else if option.icon === "motion-low"}
                    <MotionLow />
                {/if}
            </label>
        {/each}
    </div>
</div>


<style lang="scss">
    .iconRadioInput {
        // internal variables
        --_input-width: 3.5rem;

        position: relative;
        z-index: 1;
        padding: var(--pad-3xs);

        .main {
            display: flex;
            flex-flow: row nowrap;

            label {
                cursor: pointer;
                display: block;
                position: relative;

                &:hover, &:focus-visible {
                    :global {
                        .toolTip {
                            opacity: 1;
                        }
                        
                        .icon {
                            fill: var(--clr-900);
                        }

                        input:checked ~ .icon {
                            background-color: var(--clr-900);
                        }
                    }
                }
            }

            :global {
                .icon {
                    display: block;
                    width: var(--_input-width);
                    fill: var(--clr-800);

                    padding: var(--pad-3xs) var(--pad-2xs);
                    background-color: transparent;

                    transition: fill var(--trans-fast),
                                background-color var(--trans-fast);
                }

                input:checked ~ .icon {
                    fill: var(--clr-0);
                    background-color: var(--clr-800);
                }
            }
        }
    }
</style>