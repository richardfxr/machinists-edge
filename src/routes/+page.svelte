<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolIllus from "$lib/toolIllus.svelte";
    import Output from "$lib/output.svelte";
	import NumInput from "$lib/numInput.svelte";

    /* === VARAIBLES ========================== */
    let flutes = 2;

    let cutterDiameter = { value: 0.5, error: false };

    /* === REACTIVE DECLARATIONS ============== */
    $: spindleSpeed = 4278;
    $: feedRate = 17;
    $: halfEngagement = cutterDiameter.value / 2;
    $: quaterEngagement = cutterDiameter.value / 4;
</script>


<h1>Feed Rate Calculator</h1>

<form action="" class="feedCalc">
    <div class="inputs">
        <div
            class="cutterDiameter input__container"
            class:error={cutterDiameter.error}>
            <NumInput
                label="cutter diameter"
                name="cutterDiameter"
                initValue={cutterDiameter.value}
                units="in"
                type="allowFractions"
                on:update={e => cutterDiameter = e.detail}/>

            <NumInput
                label="1/2 engagement"
                name="halfEngagement"
                initValue={halfEngagement}
                units="in"
                type="readonly"
                displayedValue={halfEngagement}/>

            <NumInput
                label="1/4 engagement"
                name="quaterEngagement"
                initValue={quaterEngagement}
                units="in"
                type="readonly"
                displayedValue={quaterEngagement}/>
        </div>
    </div>

    <div class="alwaysVisible">
        <div class="alwaysVisible__inner">
            <Output label="spindle speed" value={spindleSpeed} units="rpm" highlighted />
            <Output label="feed rate" value={feedRate} units="in/min" highlighted />
        </div>
    </div>

    <div class="results">
        <div class="results__inner">
            <ToolIllus scaleX={cutterDiameter.value * 2} {flutes} />
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
            height: 100%;
            
            border-left: var(--border) var(--clr-300);

            .cutterDiameter {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;

                border-bottom: var(--border) var(--clr-300);

                :global(#halfEngagement::before), :global( #quaterEngagement::before) {
                    content: "";
                    position: absolute;
                    top: var(--pad-sm);
                    bottom: var(--pad-sm);
                    left: calc(0.5 * var(--border-width));

                    border-left: var(--border) var(--clr-300);
                }
            }
        }

        .alwaysVisible {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 100;

            &__inner {
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                gap: var(--pad-lg);
                position: sticky;
                top: 0;
                left: 0;
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

            margin-top: var(--_alwaysVisible-height);
            overflow-y: auto;

            &__inner {
                padding-bottom: var(--pad-5xl);
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
                order: 1;
                position: sticky;
                left: unset;
                bottom: unset;
                width: 100%;

                &__inner {
                    position: relative;
                    width: 100%;
                }
            }

            .results {
                grid-area: unset;
                position: relative;
                top: 0;
                width: 100%;
                max-height: unset;

                margin-top: 0;
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