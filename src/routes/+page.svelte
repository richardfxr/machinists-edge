<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolIllus from "$lib/toolIllus.svelte";
    import Output from "$lib/output.svelte";
	import NumInput from "$lib/numInput.svelte";
	import RangeInput from "$lib/rangeInput.svelte";
	import RadioInput from "$lib/radioInput.svelte";
	import RadioTable from "$lib/radioTable.svelte";
	import ScrollContainer from "$lib/scrollContainer.svelte";
	import SaveLoader from "$lib/saveLoader.svelte";
    import { motionPref, feedRateSaves, loadedFeedRateSave, feedRateSaveCount } from "../store/store";
    import type { feedRateSave } from "../store/store";
	import Saves from "$lib/saves.svelte";
	import Heading from "$lib/heading.svelte";

    /* === BINDINGS =========================== */
    let calculator: any;

    /* === VARAIBLES ========================== */
    let cutterDiameter = { value: 0.5, error: false };
    let numFlutes = { value: 2, error: false };
    let opType: "drill" | "mill" = "drill";
    let material: "aluminum" | "brass" | "delrin" | "steel" | "custom" = "aluminum";
    let toolSpeed = { value: 1, error: false };
    let cuttingFeed = { value: 0.001, error: false };

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
    $: error = cutterDiameter.error || numFlutes.error || toolSpeed.error || cuttingFeed.error
    $: halfEngagement = cutterDiameter.value / 2;
    $: quaterEngagement = cutterDiameter.value / 4;
    $: cutterDiameterIndex = cutterDiameter.value < 0.125 ? 0 :
                             cutterDiameter.value < 0.25 ? 1 :
                             cutterDiameter.value < 0.5 ? 2 :
                             cutterDiameter.value < 1 ? 3 : 4;

    $: {
        switch (material) {
            case "aluminum":
                toolSpeed = { value: aluminum[opType], error: false };
                cuttingFeed = { value: aluminum.feed[cutterDiameterIndex], error: false };
                break;
            
            case "brass":
                toolSpeed = { value: brass[opType], error: false };
                cuttingFeed = { value: brass.feed[cutterDiameterIndex], error: false };
                break;

            case "delrin":
                toolSpeed = { value: delrin[opType], error: false };
                cuttingFeed = { value: delrin.feed[cutterDiameterIndex], error: false };
                break;

            case "steel":
                toolSpeed = { value: steel[opType], error: false };
                cuttingFeed = { value: steel.feed[cutterDiameterIndex], error: false };
                break;
        }
    };

    // call loadSave() every time $loadedFeedRateSave changes
    $: $loadedFeedRateSave !== -1 && loadSave();
    $: loadedSave = $loadedFeedRateSave !== -1 ? $feedRateSaves[$loadedFeedRateSave] : null;
    $: cutterDiameterHasChange = loadedSave ? loadedSave.cutterDiameter !== cutterDiameter.value : false;
    $: numFlutesHasChange = loadedSave ? loadedSave.numFlutes !== numFlutes.value : false;
    $: opTypeHasChange = loadedSave ? loadedSave.opType !== opType : false;
    $: materialHasChange = loadedSave ? loadedSave.material !== material : false;
    $: toolSpeedHasChange = loadedSave ? loadedSave.toolSpeed !== toolSpeed.value : false;
    $: cuttingFeedHasChange = loadedSave ? loadedSave.cuttingFeed !== cuttingFeed.value : false;
    $: hasChanges = cutterDiameterHasChange ||
                    numFlutesHasChange ||
                    opTypeHasChange ||
                    materialHasChange ||
                    toolSpeedHasChange ||
                    cuttingFeedHasChange;

    /* === FUNCTIONS ========================== */

    /* checks if index is valid for feedRateSaves array */
    function isValid(index: number) {
        return index >= 0 && index <= $feedRateSaves.length - 1;
    }

    function createSave(name: string) {
        // determine save count
        let saveCount;
        loadedSave ? saveCount = loadedSave.saveCount : saveCount = $feedRateSaveCount;

        // create save of interface feedRateSave
        let save: feedRateSave = {
            name,
            spindleSpeed: Math.round(toolSpeed.value / (Math.PI / 12 * cutterDiameter.value)),
            feedRate: Math.round(toolSpeed.value / (Math.PI / 12 * cutterDiameter.value) * cuttingFeed.value * numFlutes.value * 10) / 10,
            cutterDiameter: cutterDiameter.value,
            numFlutes: numFlutes.value,
            opType,
            material,
            toolSpeed: toolSpeed.value,
            cuttingFeed: cuttingFeed.value,
            saveCount,
        };

        return save;
    }

    function createNewSave(detail: {name: string}) {
        // do not save if there is an error
        if (error) return;

        const newSave = createSave(detail.name);

        // add new save to feedRateSaves array, load it, and increment save count
        feedRateSaves.update(oldSaves => [...oldSaves, newSave]);
        loadedFeedRateSave.set($feedRateSaves.indexOf(newSave));
        feedRateSaveCount.update(count => count + 1);

        console.log("saved:", $feedRateSaves);
    }

    function updateSave(detail: {name: string}) {
        // do not save if there is an error
        if (error) return;

        const updatedSave = createSave(detail.name);

        // update feedRateSaves array with updated save
        if (isValid($loadedFeedRateSave)) $feedRateSaves[$loadedFeedRateSave] = updatedSave;

        console.log("updated:", $feedRateSaves);
    }

    function loadSave() {
        // check index is valid
        if (!isValid($loadedFeedRateSave)) return;

        loadedFeedRateSave.set($loadedFeedRateSave);

        const loadingSave = $feedRateSaves[$loadedFeedRateSave];

        console.log("loadingSave:" + JSON.stringify(loadingSave));

        // update all values
        cutterDiameter = { value: loadingSave.cutterDiameter, error: false };
        numFlutes = { value: loadingSave.numFlutes, error: false };
        opType = loadingSave.opType;
        material = loadingSave.material;
        toolSpeed = { value: loadingSave.toolSpeed, error: false };
        cuttingFeed = { value: loadingSave.cuttingFeed, error: false };
    }

    function deleteSave(index: number) {
        // check index is valid
        if (!isValid(index)) return;

        const saveToBeDeleted = $feedRateSaves[index];
        // remove save from feedRateSaves array
        feedRateSaves.update(saves => saves.filter(save => save !== saveToBeDeleted));

        // eject save if it was loaded
        if (index === $loadedFeedRateSave) loadedFeedRateSave.set(-1);        
    }
</script>


<svelte:head>
    <meta name="keywords" content="calculator, feed rate, machinist"/>
</svelte:head>


<Heading>Feed Rate Calculator</Heading>

<form
    class="feedCalc"
    class:motionRedcued={$motionPref === "reduced"}
    class:error
    tabindex="-1"
    bind:this={calculator}
    on:submit|preventDefault>
    <div class="inputs">
        <div
            class="cutterDiameter input__container"
            class:error={cutterDiameter.error}>
            <NumInput
                label="cutter diameter"
                name="cutterDiameter"
                bind:value={cutterDiameter.value}
                change={cutterDiameterHasChange}
                bind:error={cutterDiameter.error}
                units="in"
                type="allowFractions"
                on:update={e => cutterDiameter = e.detail}/>

            <NumInput
                label="1/2 engagement"
                name="halfEngagement"
                value={halfEngagement}
                units="in"
                type="readonly" />

            <NumInput
                label="1/4 engagement"
                name="quaterEngagement"
                value={quaterEngagement}
                units="in"
                type="readonly" />
        </div>

        <div class="flutesAndOp">
            <RangeInput
                label="number of flutes"
                name="numFlutes"
                bind:value={numFlutes.value}
                change={numFlutesHasChange}
                bind:error={numFlutes.error}
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
                change={opTypeHasChange}
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
                { name: "Custom (change with following inputs)", value: "custom", col1: toolSpeed.value, col2: cuttingFeed.value, hidden: true },
            ]}
            change={materialHasChange}
            tableHeadings={["material", "tool speed", "cutting feeds"]}
            selfContained
            bind:value={material}/>

        <div class="toolAndFeed">
            <NumInput
                label="tool speed"
                name="toolSpeed"
                bind:value={toolSpeed.value}
                change={toolSpeedHasChange}
                bind:error={toolSpeed.error}
                units="SFPM"
                type="number"
                step={1}
                selfContained
                on:input={() => material = "custom"}/>
            
            <NumInput
                label="cutting feed"
                name="cuttingFeed"
                bind:value={cuttingFeed.value}
                change={cuttingFeedHasChange}
                bind:error={cuttingFeed.error}
                units="IPR"
                type="number"
                allowZero
                selfContained
                on:input={() => material = "custom"}/>
        </div>
    </div>

    <div class="alwaysVisible">
        <ScrollContainer contains="results">
            <Output
                label="spindle speed"
                value={Math.round(toolSpeed.value / (Math.PI / 12 * cutterDiameter.value))}
                units="RPM"
                position="top-right"
                highlighted
                {error} />
            
            <Output
                label="feed rate"
                value={Math.round(toolSpeed.value / (Math.PI / 12 * cutterDiameter.value) * cuttingFeed.value * numFlutes.value * 10) / 10}
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
                spindleSpeed={Math.round(toolSpeed.value / (Math.PI / 12 * cutterDiameter.value))}
                feedRate={Math.round(toolSpeed.value / (Math.PI / 12 * cutterDiameter.value) * cuttingFeed.value * numFlutes.value * 10) / 10} />
        </div>
    </div>
</form>

<SaveLoader
    loadedSaveName={loadedSave ? loadedSave.name : null}
    hasChanges={hasChanges}
    error={error}
    currentSaveCount={loadedSave ? loadedSave.saveCount : $feedRateSaveCount}
    on:save={e => createNewSave(e.detail)}
    on:update={e => updateSave(e.detail)}
    on:eject={() => loadedFeedRateSave.set(-1)}
    on:delete={() => deleteSave($loadedFeedRateSave)} />

<Saves
    saves={$feedRateSaves}
    type="feedRate"
    loadedIndex={$loadedFeedRateSave}
    on:load={e => {
        loadedFeedRateSave.set(e.detail.index)
        // scroll calculator into view and focus on it
        let scrollBehavior;
        $motionPref === "reduced" ? scrollBehavior = "auto" : scrollBehavior = "smooth";
        calculator.scrollIntoView({ behavior: "auto" });
        calculator.focus({ preventScroll: true });
    }}
    on:eject={() => loadedFeedRateSave.set(-1)}
    on:delete={e => deleteSave(e.detail.index)} />


<style lang="scss">
    .feedCalc {
        // internal variables
        --_results-width: 450px;
        --_alwaysVisible-height: calc(var(--font-2xl) + var(--font-md) + var(--padRem-4xs) + 2 * var(--pad-2xs));

        display: grid;
        grid-template-columns: var(--_results-width) auto;
        grid-template-areas: "results inputs";
        align-items: start;
        position: relative;

        border: var(--border) var(--clr-300);
        
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
            z-index: 1000;

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

    .motionRedcued.feedCalc {
        .alwaysVisible {
            :global(.scrollContainer::before) {
                transform: none;
                opacity: 0;

                transition: opacity var(--trans-fast);
            }
        }

        &.error .alwaysVisible {
            :global(.scrollContainer::before) {
                transform: none;
                opacity: 1;
            }
        }
    }
</style>