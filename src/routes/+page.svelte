<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolIllus from "$lib/toolIllus.svelte";
    import Output from "$lib/output.svelte";

    /* === VARAIBLES ========================== */
    let scaleX = 1;
    let flutes = 2;

    /* === REACTIVE DECLARATIONS ============== */
    $: spindleSpeed = 4278;
    $: feedRate = 17;
</script>


<h1>Feed Rate Calculator</h1>

<form action="" class="feedCalc">
    <div class="inputs">

    </div>

    <div class="alwaysVisible">
        <div class="alwaysVisible__inner">
            <Output label="spindle speed" value={spindleSpeed} units="rpm" highlighted />
            <Output label="feed rate" value={feedRate} units="in/min" highlighted />
        </div>
    </div>

    <div class="results">
        <div class="results__inner">
            <ToolIllus {scaleX} {flutes} />
        </div>
    </div>
</form>


<style lang="scss">
    .feedCalc {
        // internal variables
        --_results-width: 450px;
        --_alwaysVisible-height: calc(var(--font-xl) + var(--font-md) + var(--padRem-4xs) + 2 * var(--pad-2xs));

        display: grid;
        grid-template-columns: var(--_results-width) auto;
        grid-template-areas: "results inputs";
        align-items: start;
        position: relative;

        border: var(--border) var(--clr-300);
        margin-bottom: 100px;
        
        .inputs {
            grid-area: inputs;
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: 300vh;

            border-left: var(--border) var(--clr-300);
        }

        .alwaysVisible {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;

            &__inner {
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                gap: var(--pad-lg);
                position: sticky;
                top: 0;
                left: 0;
                z-index: 100;
                width: var(--_results-width);
                min-height: var(--_alwaysVisible-height);

                padding: var(--pad-3xs) var(--pad-lg);
                background-color: var(--clr-900);
            }

            :global(output:nth-child(2)) {
                margin-left: auto;
            }
        }

        .results {
            grid-area: results;
            position: sticky;
            top: var(--_alwaysVisible-height);
            max-height: calc(100vh - var(--_alwaysVisible-height));

            margin-top: var(--_alwaysVisible-height);
            overflow-y: auto;

            &__inner {
                height: 600px;
            }
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-tablet) {
        .feedCalc {
            // internal variables
            --_results-width: 380px;
        }
    }

    @media only screen and (max-width: $breakpoint-smdtablet) {
        .feedCalc {
            // internal variables
            --_results-width: 310px;

            border-right: none;
            border-left: none;
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .feedCalc {
            display: flex;
            flex-direction: column-reverse;

            border: var(--border) var(--clr-300);

            .inputs {
                grid-area: unset;
                width: 100%; 

                border-top: var(--border) var(--clr-300);
                border-left: none;
            }

            .alwaysVisible {
                right: 0;

                &__inner {
                    width: 100%;
                }
            }

            .results {
                grid-area: unset;
                position: relative;
                top: 0;
                width: 100%;
                max-height: unset;
            }
        }
    }

    /* === A11Y =============================== */
    @media (forced-colors: active) {
        .feedCalc {
            .alwaysVisible {
                &__inner {
                    background-color: CanvasText;
                }
            }
        }
    }
</style>