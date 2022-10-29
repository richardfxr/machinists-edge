<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolIllus from "$lib/toolIllus.svelte";
    import Output from "$lib/output.svelte";
	import NumInput from "$lib/numInput.svelte";
	import RangeInput from "$lib/rangeInput.svelte";
	import RadioInput from "$lib/radioInput.svelte";
	import RadioTable from "$lib/radioTable.svelte";
	import ScrollContainer from "$lib/scrollContainer.svelte";

    /* === VARAIBLES ========================== */
    let cutterDiameter = { value: 0.5, error: false };
    let numFlutes = { value: 2, error: false };
    let opType = "drill";
    let material = "aluminum";
    let customToolSpeed = { value: 100, error: false };
    let customCuttingFeed = { value: 0.001, error: false };

    interface materialData {
        [key: string]: any;
        drill: number;
        mill: number;
        feed: number[];
    }
    let aluminum: materialData = {
        drill: 300,
        mill: 600,
        feed: [0.002, 0.002, 0.005, 0.006, 0.007],
    };
    let brass: materialData = {
        drill: 120,
        mill: 175,
        feed: [0.001, 0.002, 0.002, 0.004, 0.005],
    };
    let delrin: materialData = {
        drill: 150,
        mill: 400,
        feed: [0.002, 0.002, 0.005, 0.006, 0.007],
    };
    let steel: materialData = {
        drill: 90,
        mill: 70,
        feed: [0.0005, 0.0005, 0.001, 0.002, 0.003],
    };

    /* === REACTIVE DECLARATIONS ============== */
    $: error = cutterDiameter.error || numFlutes.error || customToolSpeed.error || customCuttingFeed.error
    $: halfEngagement = cutterDiameter.value / 2;
    $: quaterEngagement = cutterDiameter.value / 4;
    $: cutterDiameterIndex = cutterDiameter.value < 0.125 ? 0 :
                             cutterDiameter.value < 0.25 ? 1 :
                             cutterDiameter.value < 0.5 ? 2 :
                             cutterDiameter.value < 1 ? 3 : 4;

    $: toolSpeed = material === "aluminum" ? aluminum[opType] :
                   material === "brass" ? brass[opType] :
                   material === "delrin" ? delrin[opType] :
                   material === "steel" ? steel[opType] : customToolSpeed.value;

    $: cuttingFeed = material === "aluminum" ? aluminum.feed[cutterDiameterIndex] :
                     material === "brass" ? brass.feed[cutterDiameterIndex] :
                     material === "delrin" ? delrin.feed[cutterDiameterIndex] :
                     material === "steel" ? steel.feed[cutterDiameterIndex] : customCuttingFeed.value;

    $: spindleSpeed = Math.round(toolSpeed / (Math.PI / 12 * cutterDiameter.value));
    $: feedRate = Math.round(spindleSpeed * cuttingFeed * numFlutes.value * 10) / 10;

    /* === FUNCTIONS ========================== */
    function changeCustomMaterial(
        name: "toolSpeed" | "cuttingFeed",
        detail: { error: boolean, value: number }
    ) {
        material = "custom";

        // set values
        if (name === "toolSpeed") 
            customToolSpeed = detail;
        else
            customCuttingFeed = detail;
    }
</script>


<h1>Feed Rate Calculator</h1>

<form action="" class="feedCalc" class:error on:submit|preventDefault>
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

        <div class="flutesAndOp">
            <RangeInput
                label="number of flutes"
                name="numFlutes"
                initValue={numFlutes.value}
                min={1}
                max={9}
                step={1}
                selfContained
                on:update={e => numFlutes = e.detail}/>

            <RadioInput
                label="operation type"
                name="opType"
                options={[
                    { name: "drill", value: "drill" },
                    { name: "mill", value: "mill" },
                ]}
                selfContained
                bind:value={opType}/>
        </div>

        <RadioTable
            label="material presets"
            name="materialSelect"
            options={[
                { name: "Aluminum", value: "aluminum", col1: aluminum[opType], col2: aluminum.feed[cutterDiameterIndex] },
                { name: "Brass", value: "brass", col1: brass[opType], col2: brass.feed[cutterDiameterIndex] },
                { name: "Delrin", value: "delrin", col1: delrin[opType], col2: delrin.feed[cutterDiameterIndex] },
                { name: "Steel", value: "steel", col1: steel[opType], col2: steel.feed[cutterDiameterIndex] },
                { name: "Custom (change with following inputs)", value: "custom", col1: customToolSpeed.value, col2: customCuttingFeed.value, hidden: true },
            ]}
            tableHeadings={["material", "tool speed", "cutting feeds"]}
            selfContained
            bind:value={material}/>

        <div class="toolAndFeed">
            <NumInput
                label="tool speed"
                name="toolSpeed"
                displayedValue={toolSpeed}
                units="SFPM"
                type="drivenNumber"
                step={1}
                selfContained
                on:update={e => changeCustomMaterial("toolSpeed", e.detail)}/>
            
            <NumInput
                label="cutting feed"
                name="cuttingFeed"
                displayedValue={cuttingFeed}
                units="IPR"
                type="drivenNumber"
                allowZero
                selfContained
                on:update={e => changeCustomMaterial("cuttingFeed", e.detail)}/>
        </div>
    </div>

    <div class="alwaysVisible">
        <ScrollContainer contains="results">
            <Output
                label="spindle speed"
                value={spindleSpeed}
                units="RPM"
                position="top-right"
                highlighted
                {error} />
            
            <Output
                label="feed rate"
                value={feedRate}
                units="IPM"
                position="top-left"
                highlighted
                {error} />
        </ScrollContainer>
    </div>

    <div class="results">
        <div class="results__inner">
            <ToolIllus
                scaleX={cutterDiameter.value * 2}
                flutes={numFlutes.value}
                {spindleSpeed}
                {feedRate} />
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
                position: relative;
                z-index: 1;

                &::before {
                    content: "";
                    position: absolute;
                    right: 0;
                    bottom: calc(-0.5 * var(--border-width));
                    left: 0;
                    z-index: -1;

                    border-bottom: var(--border) var(--clr-300);
                }

                :global(#halfEngagement::before), :global( #quaterEngagement::before) {
                    content: "";
                    position: absolute;
                    top: var(--pad-sm);
                    bottom: var(--pad-sm);
                    left: calc(-0.5 * var(--border-width));
                    z-index: -1;

                    border-left: var(--border) var(--clr-300);
                }
            }

            .flutesAndOp {
                display: grid;
                grid-template-columns: 1fr 1fr;
                z-index: 1;

                border-bottom: var(--border) var(--clr-300);

                :global(#opType::before) {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: calc(-0.5 * var(--border-width));
                    z-index: -1;

                    border-left: var(--border) var(--clr-300);
                }
            }

            .toolAndFeed {
                display: grid;
                grid-template-columns: 1fr 1fr;
                position: relative;
                z-index: 1;

                &::before {
                    content: "";
                    position: absolute;
                    top: calc(-0.5 * var(--border-width));
                    right: 0;
                    left: 0;
                    z-index: -1;

                    border-top: var(--border) var(--clr-300);
                }

                :global(#cuttingFeed::before) {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: calc(-0.5 * var(--border-width));
                    z-index: -1;

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

            :global(.scrollContainer) {
                position: sticky;
                top: 0;
                left: 0;
                z-index: 1;
                width: var(--_results-width);
                min-height: var(--_alwaysVisible-height);

                padding: var(--pad-3xs) var(--pad-lg);
                background-color: var(--clr-900);

                overflow-y: hidden;

                &::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: -1;

                    background-color: var(--clr-error-800);

                    transform: translateY(-100%);
                    transition: transform 0.1s cubic-bezier(0,.76,.77,1);
                }
            }

            :global(.scrollContainer__inner) {
                display: inline-flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-between;
                gap: var(--pad-lg);
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

        &.error {
            :global(.alwaysVisible .scrollContainer::before) {
                transform: translateY(0%);
            }
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-tablet) {
        .feedCalc {
            // internal variables
            --_results-width: 380px;

            .inputs {
                .cutterDiameter {
                    grid-template-columns: 1fr 1fr;

                    :global(#cutterDiameter) {
                        grid-column: 1 / 3;
                        
                        &::before {
                            content: "";
                            position: absolute;
                            right: var(--pad-xl);
                            bottom: calc(-0.5 * var(--border-width));
                            left: var(--pad-xl);
                            z-index: -1;

                            border-bottom: var(--border) var(--clr-300);
                        }
                    }

                    :global(#halfEngagement::before) {
                        display: none;
                    }
                }

                .flutesAndOp {
                    grid-template-columns: 1fr;

                    :global(#numFlutes::before) {
                        content: "";
                        position: absolute;
                        right: 0;
                        bottom: calc(-0.5 * var(--border-width));
                        left: 0;
                        z-index: -1;

                        border-bottom: var(--border) var(--clr-300);
                    }

                    :global(#opType::before) {
                        display: none;
                    }
                }
            }
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

                .cutterDiameter {
                    grid-template-columns: 1fr;

                    :global(#cutterDiameter) {
                        grid-column: unset;
                    }

                    :global(#halfEngagement::before) {
                        display: block;
                        top: unset;
                        right: var(--pad-xl);
                        bottom: calc(-0.5 * var(--border-width));
                        left: var(--pad-xl);

                        border-left: none;
                        border-bottom: var(--border) var(--clr-300);
                    }

                    :global(#quaterEngagement::before) {
                        display: none;
                    }
                }

                .toolAndFeed {
                    grid-template-columns: 1fr;

                    :global(#cuttingFeed::before) {
                        display: none;
                    }

                    :global(#toolSpeed::before) {
                        content: "";
                        position: absolute;
                        right: 0;
                        bottom: calc(-0.5 * var(--border-width));
                        left: 0;
                        z-index: -1;

                        border-bottom: var(--border) var(--clr-300);
                    }
                }
            }

            .alwaysVisible {
                order: 1;
                position: sticky;
                left: unset;
                bottom: unset;
                width: 100%;

                :global(.scrollContainer) {
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