<script lang="ts">
    /* === IMPORTS ============================ */
    import { writable, derived } from 'svelte/store';
    import type { Writable } from 'svelte/store';
    import { motionPref, feedRateSaves, loadedFeedRateSave, feedRateSaveCount, type feedRateSave } from "../store/store";

    import FeedCalcIllus from "$lib/feedCalcIllus.svelte";
    import Output from "$lib/output.svelte";
	import NumInput from "$lib/numInput.svelte";
	import RangeInput from "$lib/rangeInput.svelte";
	import RadioInput from "$lib/radioInput.svelte";
	import RadioTable from "$lib/radioTable.svelte";
	import ScrollContainer from "$lib/scrollContainer.svelte";
	import SaveLoader from "$lib/saveLoader.svelte";
	import Saves from "$lib/saves.svelte";
	import Heading from "$lib/heading.svelte";

    /* === BINDINGS =========================== */
    let calculator: any;

    /* === VARAIBLES ========================== */
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

    /* === WRITABLE STORES ==================== */
    const cutterDiameter = writable({
        value: 0.5,
        error: false,
        hasChanged: false
    });

    const numFlutes = writable({
        value: 2,
        error: false,
        hasChanged: false
    });

    const opType: Writable<{ value: "drill" | "mill", hasChanged: boolean }> = writable({
        value: "drill",
        hasChanged: false
    });

    const material: Writable<{ value: "aluminum" | "brass" | "delrin" | "steel" | "custom", hasChanged: boolean }> = writable({
        value: "aluminum",
        hasChanged: false
    });

    const toolSpeed = writable({
        value: 1,
        error: false,
        hasChanged: false
    });
    
    const cuttingFeed = writable({
        value: 0.001,
        error: false,
        hasChanged: false
    });

    /* === DERIVED STORES ===================== */
    const loadedSave = derived(
        [loadedFeedRateSave, feedRateSaves],
        ([$loadedFeedRateSave, $feedRateSaves]) => $loadedFeedRateSave !== -1 ? $feedRateSaves[$loadedFeedRateSave] : null
    );

    const cutterDiameterIndex = derived(
        cutterDiameter,
        $cutterDiameter => {
            switch (true) {
                case ($cutterDiameter.value < 0.125):
                    return 0;
                case ($cutterDiameter.value < 0.25):
                    return 1;
                case ($cutterDiameter.value < 0.5):
                    return 2;
                case ($cutterDiameter.value < 1):
                    return 3;
                default:
                    return 4;
            }
        }
    );

    const spindleSpeed = derived(
        [toolSpeed, cutterDiameter],
        ([$toolSpeed, $cutterDiameter]) => Math.round($toolSpeed.value / (Math.PI / 12 * $cutterDiameter.value))
    );

    const feedRate = derived(
        [spindleSpeed, cuttingFeed, numFlutes],
        ([$spindleSpeed, $cuttingFeed, $numFlutes]) => Math.round($spindleSpeed * $cuttingFeed.value * $numFlutes.value * 10) / 10
    );

    const error = derived(
        [cutterDiameter, numFlutes, toolSpeed, cuttingFeed],
        ([$cutterDiameter, $numFlutes, $toolSpeed, $cuttingFeed]) => {
            return $cutterDiameter.error || $numFlutes.error || $toolSpeed.error || $cuttingFeed.error;
        }
    );
    
    /* === REACTIVE DECLARATIONS ============== */
    // call loadSave() every time $loadedFeedRateSave changes
    $: $loadedFeedRateSave !== -1 && loadSave();

    // switch material toolSpeed and cuttingFeed
    $: {
        switch ($material.value) {
            case "aluminum":
                $toolSpeed.value = aluminum[$opType.value];
                $toolSpeed.error = false;
                $cuttingFeed.value = aluminum.feed[$cutterDiameterIndex];
                $cuttingFeed.error = false;
                console.log("aluminum: " + aluminum[$opType.value] + ", " + aluminum.feed[$cutterDiameterIndex]);
                break;
            
            case "brass":
                $toolSpeed.value = brass[$opType.value];
                $toolSpeed.error = false;
                $cuttingFeed.value = brass.feed[$cutterDiameterIndex];
                $cuttingFeed.error = false;
                console.log("brass: " + brass[$opType.value] + ", " + brass.feed[$cutterDiameterIndex]);
                break;

            case "delrin":
                $toolSpeed.value = delrin[$opType.value];
                $toolSpeed.error = false;
                $cuttingFeed.value = delrin.feed[$cutterDiameterIndex];
                $cuttingFeed.error = false;
                console.log("delrin: " + delrin[$opType.value] + ", " + delrin.feed[$cutterDiameterIndex]);
                break;

            case "steel":
                $toolSpeed.value = steel[$opType.value];
                $toolSpeed.error = false;
                $cuttingFeed.value = steel.feed[$cutterDiameterIndex];
                $cuttingFeed.error = false;
                console.log("steel: " + steel[$opType.value] + ", " + steel.feed[$cutterDiameterIndex]);
                break;
        }
    };

    // change tracking for saves
    $: $loadedSave && $loadedSave.cutterDiameter !== $cutterDiameter.value ?
        $cutterDiameter.hasChanged = true :
        $cutterDiameter.hasChanged = false;

    $: $loadedSave && $loadedSave.numFlutes !== $numFlutes.value ?
        $numFlutes.hasChanged = true :
        $numFlutes.hasChanged = false;

    $: $loadedSave && $loadedSave.opType !== $opType.value ?
        $opType.hasChanged = true :
        $opType.hasChanged = false;

    $: $loadedSave && $loadedSave.material !== $material.value ?
        $material.hasChanged = true :
        $material.hasChanged = false;

    $: $loadedSave && $loadedSave.toolSpeed !== $toolSpeed.value ?
        $toolSpeed.hasChanged = true :
        $toolSpeed.hasChanged = false;
    
    $: $loadedSave && $loadedSave.cuttingFeed !== $cuttingFeed.value ?
        $cuttingFeed.hasChanged = true :
        $cuttingFeed.hasChanged = false;

    $: hasChanged = $cutterDiameter.hasChanged ||
                    $numFlutes.hasChanged ||
                    $opType.hasChanged ||
                    $material.hasChanged ||
                    $toolSpeed.hasChanged ||
                    $cuttingFeed.hasChanged;

    /* === FUNCTIONS ========================== */
    /* checks if index is valid for feedRateSaves array */
    function isValid(index: number) {
        return index >= 0 && index <= $feedRateSaves.length - 1;
    }

    function createSave(name: string) {
        // determine save count
        let saveCount;
        $loadedSave ? saveCount = $loadedSave.saveCount : saveCount = $feedRateSaveCount;

        console.log("saving");

        // create save of interface feedRateSave
        let save: feedRateSave = {
            name,
            spindleSpeed: $spindleSpeed,
            feedRate: $feedRate,
            cutterDiameter: $cutterDiameter.value,
            numFlutes: $numFlutes.value,
            opType: $opType.value,
            material: $material.value,
            toolSpeed: $toolSpeed.value,
            cuttingFeed: $cuttingFeed.value,
            saveCount,
        };

        return save;
    }

    function createNewSave(detail: {name: string}) {
        // do not save if there is an error
        if ($error) return;

        console.log("creating new save");

        const newSave = createSave(detail.name);

        // add new save to feedRateSaves array, load it, and increment save count
        feedRateSaves.update(oldSaves => [...oldSaves, newSave]);
        loadedFeedRateSave.set($feedRateSaves.indexOf(newSave));
        feedRateSaveCount.update(count => count + 1);

        console.log("saved:", $feedRateSaves);
    }

    function updateSave(detail: {name: string}) {
        // do not save if there is an error
        if ($error) return;

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

        console.log("cutterDiameter: {" + $cutterDiameter.value + ", " + $cutterDiameter.error + "}");

        console.log("loadingSave:" + JSON.stringify(loadingSave));

        // update all values
        $cutterDiameter = { value: loadingSave.cutterDiameter, error: false, hasChanged: false };
        $numFlutes = { value: loadingSave.numFlutes, error: false, hasChanged: false };
        $opType = { value: loadingSave.opType, hasChanged: false };
        $material = { value: loadingSave.material, hasChanged: false };
        $toolSpeed = { value: loadingSave.toolSpeed, error: false, hasChanged: false };
        $cuttingFeed = { value: loadingSave.cuttingFeed, error: false, hasChanged: false };
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
    <title>Feed Rate Calculator | Machinist's Edge</title>
    <meta
        name="description"
        content="Calculate spindle speed and feed rate based on cutter diameter, material, and operation type. For milling or drilling aluminum, brass, Delrin, or steel."
    />
</svelte:head>


<Heading>Feed Rate Calculator</Heading>

<div class="page">
    <form
        class="feedCalc"
        class:motionRedcued={$motionPref === "reduced"}
        class:error={$error}
        tabindex="-1"
        bind:this={calculator}
        on:submit|preventDefault>
        <div class="inputs">
            <div
                class="cutterDiameter input__container"
                class:error={$cutterDiameter.error}>
                <NumInput
                    label="cutter diameter"
                    name="cutterDiameter"
                    bind:value={$cutterDiameter.value}
                    change={$cutterDiameter.hasChanged}
                    bind:error={$cutterDiameter.error}
                    units="in"
                    type="allowFractions" />

                <NumInput
                    label="1/2 engagement"
                    name="halfEngagement"
                    value={$cutterDiameter.value / 2}
                    units="in"
                    type="readonly" />

                <NumInput
                    label="1/4 engagement"
                    name="quaterEngagement"
                    value={$cutterDiameter.value / 4}
                    units="in"
                    type="readonly" />
            </div>

            <div class="flutesAndOp">
                <RangeInput
                    label="number of flutes"
                    name="numFlutes"
                    bind:value={$numFlutes.value}
                    change={$numFlutes.hasChanged}
                    bind:error={$numFlutes.error}
                    min={1}
                    max={9}
                    step={1}
                    selfContained
                    on:update={e => $numFlutes = e.detail}/>

                <RadioInput
                    label="operation type"
                    name="opType"
                    options={[
                        { name: "drill", value: "drill" },
                        { name: "mill", value: "mill" },
                    ]}
                    change={$opType.hasChanged}
                    selfContained
                    bind:value={$opType.value}/>
            </div>

            <RadioTable
                label="material presets"
                name="materialSelect"
                options={[
                    { name: "Aluminum", value: "aluminum", col1: aluminum[$opType.value], col2: aluminum.feed[$cutterDiameterIndex] },
                    { name: "Brass", value: "brass", col1: brass[$opType.value], col2: brass.feed[$cutterDiameterIndex] },
                    { name: "Delrin", value: "delrin", col1: delrin[$opType.value], col2: delrin.feed[$cutterDiameterIndex] },
                    { name: "Steel", value: "steel", col1: steel[$opType.value], col2: steel.feed[$cutterDiameterIndex] },
                    { name: "Custom (change with following inputs)", value: "custom", col1: $toolSpeed.value, col2: $cuttingFeed.value, hidden: true },
                ]}
                change={$material.hasChanged}
                tableHeadings={["material", "tool speed", "cutting feeds"]}
                selfContained
                bind:value={$material.value}/>

            <div class="toolAndFeed">
                <NumInput
                    label="tool speed"
                    name="toolSpeed"
                    bind:value={$toolSpeed.value}
                    change={$toolSpeed.hasChanged}
                    bind:error={$toolSpeed.error}
                    units="SFPM"
                    type="number"
                    step={1}
                    selfContained
                    on:input={() => $material.value = "custom"}/>
                
                <NumInput
                    label="cutting feed"
                    name="cuttingFeed"
                    bind:value={$cuttingFeed.value}
                    change={$cuttingFeed.hasChanged}
                    bind:error={$cuttingFeed.error}
                    units="IPR"
                    type="number"
                    allowZero
                    selfContained
                    on:input={() => $material.value = "custom"}/>
            </div>
        </div>

        <div class="alwaysVisible">
            <ScrollContainer contains="results">
                <Output
                    label="spindle speed"
                    value={$spindleSpeed}
                    units="RPM"
                    position="top-right"
                    highlighted
                    error={$error} />
                
                <Output
                    label="feed rate"
                    value={$feedRate}
                    units="IPM"
                    position="top-left"
                    align="end"
                    highlighted
                    error={$error} />
            </ScrollContainer>
        </div>

        <div class="results">
            <div class="results__inner">
                <FeedCalcIllus
                    scaleX={$cutterDiameter.value * 2}
                    flutes={$numFlutes.value}
                    spindleSpeed={$spindleSpeed}
                    feedRate={$feedRate} />
            </div>
        </div>
    </form>

    <SaveLoader
        loadedSaveName={$loadedSave ? $loadedSave.name : null}
        hasChanges={hasChanged}
        error={$error}
        currentSaveCount={$loadedSave ? $loadedSave.saveCount : $feedRateSaveCount}
        on:save={e => createNewSave(e.detail)}
        on:update={e => updateSave(e.detail)}
        on:eject={() => loadedFeedRateSave.set(-1)}
        on:delete={() => deleteSave($loadedFeedRateSave)} />

    <Saves
        feedRateSaves={$feedRateSaves}
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
</div>


<style lang="scss">
    .feedCalc {
        // internal variables
        --_results-width: 450px;
        --_alwaysVisible-height: calc(var(--font-2xl) + var(--font-md) + var(--padRem-4xs) + 2 * var(--pad-2xs));

        display: grid;
        // minmax(0, 1fr) to prevent width blowout
        grid-template-columns: var(--_results-width) minmax(0, 1fr);
        grid-template-areas: "results inputs";
        align-items: start;
        position: relative;

        border: var(--border) var(--clr-300);
        
        .inputs {
            grid-area: inputs;
            max-width: 100%;
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
                    top: var(--pad-lg);
                    bottom: var(--pad-lg);
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
                gap: var(--padRem-lg);
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

    @media only screen and (max-width: $breakpoint-smtablet) {
        .feedCalc {
            // internal variables
            --_results-width: 310px;
        }
    }

    @media only screen and (max-width: $breakpoint-lgmobile) {
        .feedCalc {            
            .inputs {
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
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .feedCalc {
            display: flex;
            flex-direction: column-reverse;

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

                    // add outline to avoid border on left and right side
                    outline: var(--border) var(--clr-900);

                    transition: outline-color var(--trans-fast);
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

            &.error {
                :global(.alwaysVisible .scrollContainer) {
                    // change outline color when error occurs
                    outline-color: var(--clr-error-800);
                }
            }
        }
    }

    @media only screen and (max-width: $breakpoint-smmobile) {
        .feedCalc {
            .alwaysVisible {
                :global(.scrollContainer) {
                    padding-right: var(--pad-hrz);
                    padding-left: var(--pad-hrz);
                }
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