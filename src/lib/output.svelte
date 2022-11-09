<script lang="ts">
    /* === IMPORTS ============================ */
	import UnitAbbr from "$lib/unitAbbr.svelte";

    /* === PROPS ============================== */
    export let label: string;
    export let value: number;
    export let units: "RPM"| "IPM" | "in" | "SFPM" | "IPR";
    export let position: "top-left" | "top-right" | "bottom-left" | "bottom-right" = "top-left";
    export let highlighted = false;
    export let error = false;
</script>


<output
    class="output"
    class:highlighted
    class:error
    name="result"
    for="">
    <span class="label">{label}</span>
    <span class="value">
        <span>{error ? "error" : value}</span>
        <UnitAbbr {units} {position}/>
    </span>
</output>


<style lang="scss">
    .output {
        display: flex;
        flex-direction: column;
        gap: var(--padRem-4xs);

        .value {
            display: flex;
            flex-flow: row nowrap;
            align-items: baseline;
            gap: var(--pad-3xs);

            color: var(--clr-900);
            font-family: "ClashDisplay", sans-serif;
            font-size: var(--font-2xl);
            font-weight: 600;
            line-height: 1em;

            :global(.unitAbbr) {
                font-weight: 600;
            }
        }

        &.highlighted {
            .label {
                color: var(--clr-200);
            }

            .value {
                color: var(--clr-0);
                
                :global(.unitAbbr) {
                    --_clr: var(--clr-200);
                    --_clr-hover: var(--clr-100);
                }
            }
        }

        &.error {
            .value {
                & > span {
                    // error text
                    text-transform: uppercase;
                }

                :global(.unitAbbr) {
                    // hide unitAbbr
                    display: none;
                }
            }

            &.highlighted .label {
                color: var(--clr-0);
            }
        }
    }
</style>