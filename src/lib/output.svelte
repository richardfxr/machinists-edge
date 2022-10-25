<script lang="ts">
    /* === PROPS ============================== */
    export let label:string;
    export let value:number;
    export let units:string;
    export let highlighted = false;
    export let error = false;
</script>


<output
    class="output"
    class:highlighted={highlighted}
    class:error={error}
    name="result"
    for="">
    <span class="label">{label}</span>
    <span class="value" data-units={units}>{value}</span>
</output>


<style lang="scss">
    .output {
        display: flex;
        flex-direction: column;
        gap: var(--padRem-4xs);

        .value {
            color: var(--clr-900);
            font-family: "ClashDisplay", sans-serif;
            font-size: var(--font-xl);
            font-weight: 600;
            line-height: 1em;

            &::after {
                content: attr(data-units);
                color: var(--clr-800);
                font-family: "GeneralSans", sans-serif;
                font-size: var(--font-sm);
                font-weight: 600;
                line-height: 1em;

                padding-left: 0.2em;
            }
        }

        &.highlighted {
            .label {
                color: var(--clr-300);
            }

            .value {
                color: var(--clr-0);
                
                &::after {
                    color: var(--clr-300);
                }
            }
        }
    }
</style>