<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolIllus from "$lib/toolIllus.svelte";
    import Output from "$lib/output.svelte";
	import NumInput from "$lib/numInput.svelte";
	import RangeInput from "$lib/rangeInput.svelte";
	import RadioInput from "$lib/radioInput.svelte";
	import RadioTable from "$lib/radioTable.svelte";

    /* === VARAIBLES ========================== */
    let error = false;
    let cutterDiameter = { value: 0.5, error: false };
    let numFlutes = { value: 2, error: false };

    let opType = "drill";
    let material = "aluminum";
    let customToolSpeed = 100;
    let customCuttingFeed = 0.001;

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
    $: spindleSpeed = 4278;
    $: feedRate = 17;
    $: halfEngagement = cutterDiameter.value / 2;
    $: quaterEngagement = cutterDiameter.value / 4;
    $: cutterDiameterIndex = cutterDiameter.value < 0.125 ? 0 :
                             cutterDiameter.value < 0.25 ? 1 :
                             cutterDiameter.value < 0.5 ? 2 :
                             cutterDiameter.value < 1 ? 3 : 4;

    interface materialSpeeds {
        [key: string]: any;
        aluminum: number;
        brass: number;
        delrin: number;
        steel: number;
    }
    $: toolSpeeds = {
        aluminum: aluminum[opType],
        brass: brass[opType],
        delrin: delrin[opType],
        steel: steel[opType],
    } as materialSpeeds;
    $: cuttingFeeds = {
        aluminum: aluminum.feed[cutterDiameterIndex],
        brass: brass.feed[cutterDiameterIndex],
        delrin: delrin.feed[cutterDiameterIndex],
        steel: steel.feed[cutterDiameterIndex],
    } as materialSpeeds;

    /* === FUNCTIONS ========================== */
    function changeCustomMaterial(
        name: "toolSpeed" | "cuttingFeed",
        e: { error: boolean, value: number }
    ) {
        // reset error
        error = false;
        // change material to custom
        material = "custom";

        if (e.error) {
            error = true;
            return;
        }

        // set values
        if (name === "toolSpeed") 
            customToolSpeed = e.value;
        else
            customCuttingFeed = e.value;
    }
</script>


<h1>Feed Rate Calculator</h1>

<form action="" class="feedCalc" on:submit|preventDefault>
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
                { name: "Aluminum", value: "aluminum", col1: toolSpeeds["aluminum"], col2: cuttingFeeds["aluminum"] },
                { name: "Brass", value: "brass", col1: toolSpeeds["brass"], col2: cuttingFeeds["brass"] },
                { name: "Delrin", value: "delrin", col1: toolSpeeds["delrin"], col2: cuttingFeeds["delrin"] },
                { name: "Steel", value: "steel", col1: toolSpeeds["steel"], col2: cuttingFeeds["steel"] },
                { name: "Custom (change with following inputs)", value: "custom", col1: customToolSpeed, col2: customCuttingFeed, hidden: true },
            ]}
            tableHeadings={["material", "tool speed", "cutting feeds"]}
            selfContained
            bind:value={material}/>

        <div class="toolAndFeed">
            <NumInput
                label="tool speed"
                name="toolSpeed"
                displayedValue={material === "custom" ? customToolSpeed : toolSpeeds[material]}
                units="SFPM"
                type="drivenNumber"
                selfContained
                on:update={e => changeCustomMaterial("toolSpeed", e.detail)}/>
            
            <NumInput
                label="cutting feed"
                name="cuttingFeed"
                displayedValue={material === "custom" ? customCuttingFeed : cuttingFeeds[material]}
                units="IPR"
                type="drivenNumber"
                selfContained
                on:update={e => changeCustomMaterial("cuttingFeed", e.detail)}/>
        </div>
    </div>

    <div class="alwaysVisible">
        <div class="alwaysVisible__inner">
            <Output
                label="spindle speed"
                value={spindleSpeed}
                units="RPM"
                position="bottom-right"
                highlighted />
            <Output
                label="feed rate"
                value={feedRate}
                units="IPM"
                position="bottom-left"
                highlighted />
        </div>
    </div>

    <div class="results">
        <div class="results__inner">
            <ToolIllus scaleX={cutterDiameter.value * 2} flutes={numFlutes.value} />
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