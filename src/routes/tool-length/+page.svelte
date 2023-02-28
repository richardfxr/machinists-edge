<script lang="ts">
    /* === IMPORTS ============================ */
    import { writable, derived } from 'svelte/store';
    import type { Writable } from 'svelte/store';
    import { motionPref, toolLengthSaves, loadedToolLengthSave, toolLengthSaveCount } from '../../store/store';
    import type { ToolSection, EndMillType, toolLengthSave } from '../../store/store';

    import Heading from "$lib/heading.svelte";
    import NumInput from "$lib/numInput.svelte";
    import ToolLengthIllus from '$lib/toolLengthIllus.svelte';
    import RadioInput from "$lib/radioInput.svelte";
    import Indicator from '$lib/indicator.svelte';
    import SaveLoader from "$lib/saveLoader.svelte";
	import Saves from "$lib/saves.svelte";

    /* === BINDINGS =========================== */
    let calculator: HTMLElement;

    /* === WRITABLE STORES ==================== */
    const highlighted: Writable<ToolSection> = writable("none");
    const focused: Writable<ToolSection> = writable("none");
    const hasFocused = writable(false);
    const savedBaseToFluteLength = writable(0);
    const savedShoulderLength = writable(0);
    const savedBodyLength = writable(0);

    const overallLength = writable({
        value: 3.583,
        error: false,
        hasChanged: false
    });

    const endMillType: Writable<{ value: EndMillType, hasChanged: boolean }> = writable({
        value: "flat",
        hasChanged: false
    });

    const baseToFluteLength = writable({
        value: 2.583,
        error: false,
        hasChanged: false
    });

    const fluteLength = writable({
        value: 1.000,
        error: false,
        hasChanged: false
    });

    const baseToShoulderLength = writable({
        value: 2.135,
        error: false,
        hasChanged: false
    });

    const shoulderLength = writable({
        value: 1.448,
        error: false,
        hasChanged: false
    });

    const holderLength = writable({
        value: 1.794,
        error: false,
        hasChanged: false
    });

    const bodyLength = writable({
        value: 1.789,
        error: false,
        hasChanged: false
    });

    const cutterDiameter = writable({
        value: 0.375,
        error: false,
        hasChanged: false
    });

    const shoulderDiameter = writable({
        value: 0.5,
        error: false,
        hasChanged: false
    });

    const manualFluteLength = writable({
        isTrue: false,
        hasChanged: false
    });
    const manualShoulderLegnth = writable({
        isTrue: false,
        hasChanged: false
    });
    const manualBodyLength = writable({
        isTrue: false,
        hasChanged: false
    });

    /* === DERIVED STORES ===================== */
    const loadedSave = derived(
        [loadedToolLengthSave, toolLengthSaves],
        ([$loadedToolLengthSave, $toolLengthSaves]) => $loadedToolLengthSave !== -1 ? $toolLengthSaves[$loadedToolLengthSave] : null
    );

    const error = derived(
        [
            overallLength,
            baseToFluteLength,
            fluteLength,
            baseToShoulderLength,
            shoulderLength,
            holderLength,
            bodyLength,
            cutterDiameter,
            shoulderDiameter
        ], ([
            $overallLength,
            $baseToFluteLength,
            $fluteLength,
            $baseToShoulderLength,
            $shoulderLength,
            $holderLength,
            $bodyLength,
            $cutterDiameter,
            $shoulderDiameter
        ]) => {
            return $overallLength.error ||
                   $baseToFluteLength.error ||
                   $fluteLength.error ||
                   $baseToShoulderLength.error ||
                   $shoulderLength.error ||
                   $holderLength.error ||
                   $bodyLength.error ||
                   $cutterDiameter.error ||
                   $shoulderDiameter.error;
        }
    );

    const highlightedError = derived(
        [
            highlighted,
            hasFocused,
            focused,
            overallLength,
            baseToFluteLength,
            fluteLength,
            baseToShoulderLength,
            shoulderLength,
            holderLength,
            bodyLength,
            cutterDiameter,
            shoulderDiameter
        ],
        ([$highlighted, $hasFocused, $focused]) => {
            const toolSection = $hasFocused ? $focused : $highlighted;
            switch (toolSection) {
                case ("all"):
                    return $overallLength.error;
                case ("baseToFlute"):
                    return $baseToFluteLength.error;
                case ("flute"):
                    return $fluteLength.error;
                case ("baseToShoulder"):
                    return $baseToShoulderLength.error;
                case ("shoulder"):
                    return $shoulderLength.error;
                case ("holder"):
                    return $holderLength.error;
                case ("body"):
                    return $bodyLength.error;
                default:
                    return false;
            }
        }
    );

    /* === REACTIVE DECLARATIONS ============== */
    // call loadSave() every time $loadedFeedRateSave changes
    $: $loadedToolLengthSave !== -1 && loadSave();

    // change tracking for saves
    $: $loadedSave && $loadedSave.overallLength !== $overallLength.value ?
        $overallLength.hasChanged = true :
        $overallLength.hasChanged = false;

    $: $loadedSave && $loadedSave.endMillType !== $endMillType.value ?
        $endMillType.hasChanged = true :
        $endMillType.hasChanged = false;

    $: $loadedSave && $savedBaseToFluteLength !== $baseToFluteLength.value ?
        $baseToFluteLength.hasChanged = true :
        $baseToFluteLength.hasChanged = false;

    $: $loadedSave && $loadedSave.fluteLength !== $fluteLength.value ?
        $fluteLength.hasChanged = true :
        $fluteLength.hasChanged = false;

    $: $loadedSave && $loadedSave.baseToShoulderLength !== $baseToShoulderLength.value ?
        $baseToShoulderLength.hasChanged = true :
        $baseToShoulderLength.hasChanged = false;

    $: $loadedSave && $savedShoulderLength !== $shoulderLength.value ?
        $shoulderLength.hasChanged = true :
        $shoulderLength.hasChanged = false;

    $: $loadedSave && $loadedSave.holderLength !== $holderLength.value ?
        $holderLength.hasChanged = true :
        $holderLength.hasChanged = false;

    $: $loadedSave && $savedBodyLength !== $bodyLength.value ?
        $bodyLength.hasChanged = true :
        $bodyLength.hasChanged = false;
    
    $: $loadedSave && $loadedSave.cutterDiameter !== $cutterDiameter.value ?
        $cutterDiameter.hasChanged = true :
        $cutterDiameter.hasChanged = false;

    $: $loadedSave && $loadedSave.shoulderDiameter !== $shoulderDiameter.value ?
        $shoulderDiameter.hasChanged = true :
        $shoulderDiameter.hasChanged = false;

    $: $loadedSave && $loadedSave.manualFluteLength !== $manualFluteLength.isTrue ?
        $manualFluteLength.hasChanged = true :
        $manualFluteLength.hasChanged = false;

    $: $loadedSave && $loadedSave.manualShoulderLegnth !== $manualShoulderLegnth.isTrue ?
        $manualShoulderLegnth.hasChanged = true :
        $manualShoulderLegnth.hasChanged = false;

    $: $loadedSave && $loadedSave.manualBodyLength !== $manualBodyLength.isTrue ?
        $manualBodyLength.hasChanged = true :
        $manualBodyLength.hasChanged = false;

    $: hasChanged = $overallLength.hasChanged ||
                    $endMillType.hasChanged ||
                    $baseToFluteLength.hasChanged ||
                    $fluteLength.hasChanged ||
                    $baseToFluteLength.hasChanged ||
                    $shoulderLength.hasChanged ||
                    $holderLength.hasChanged ||
                    $bodyLength.hasChanged ||
                    $cutterDiameter.hasChanged ||
                    $shoulderDiameter.hasChanged ||
                    $manualFluteLength.hasChanged ||
                    $manualShoulderLegnth.hasChanged ||
                    $manualBodyLength.hasChanged;

    /* === FUNCTIONS ========================== */
    /* error checking for all lengths */
    function validateAll() {
        if ($overallLength.error) return;

        if (
            $baseToFluteLength.value > $overallLength.value ||
            $baseToFluteLength.value < 0
        ) {
            $baseToFluteLength.error = true;
        } else {
            $baseToFluteLength.error = false;
        }

        if (
            $fluteLength.value > $overallLength.value ||
            $fluteLength.value < 0
        ) {
            $fluteLength.error = true;
        } else {
            $fluteLength.error = false;
        }

        if (
            $baseToShoulderLength.value > $baseToFluteLength.value ||
            $baseToShoulderLength.value > $overallLength.value ||
            $baseToShoulderLength.value <= 0
        ) {
            $baseToShoulderLength.error = true;
        } else {
            $baseToShoulderLength.error = false;
        }

        if (
            $shoulderLength.value < $fluteLength.value ||
            $shoulderLength.value > $overallLength.value ||
            $shoulderLength.value <= 0
        ) {
            $shoulderLength.error = true;
        } else {
            $shoulderLength.error = false;
        }

        if (
            $holderLength.value > $baseToShoulderLength.value ||
            $holderLength.value > $baseToFluteLength.value ||
            $holderLength.value > $overallLength.value ||
            $holderLength.value <= 0
        ) {
            $holderLength.error = true;
        } else {
            $holderLength.error = false;
        }

        if (
            $bodyLength.value < $shoulderLength.value ||
            $bodyLength.value < $fluteLength.value ||
            $bodyLength.value > $overallLength.value ||
            $bodyLength.value <= 0
        ) {
            $bodyLength.error = true;
        } else {
            $bodyLength.error = false;
        }
    }

    /* returns the number of decimal places in a number */
    function percisionOf(x: number): number {
        if (Number.isInteger(x) || x === null) return 0;

        const stringX = x.toString();

        if (stringX.includes('.')) {
            return stringX.split('.')[1].length;
        } else {
            return 0;
        }
    }

    /* subtracts b from a while rounding to the appropriate percision to avoid
     * floating point number calculation inaccuracies
    */
    function subtract(a: number, b: number):number {
        const percision = Math.max(percisionOf(a), percisionOf(b));

        return parseFloat((a - b).toFixed(percision));
    }

    /* returns the length of the specified toolSection */
    function calculate(toolSection: ToolSection): number {
        switch (toolSection) {
            case ("all"):
                return $overallLength.value;
            case ("baseToFlute"):
                return subtract($overallLength.value, $fluteLength.value);
            case ("flute"):
                return subtract($overallLength.value, $baseToFluteLength.value);
            case ("baseToShoulder"):
                return subtract($overallLength.value, $shoulderLength.value);
            case ("shoulder"):
                return subtract($overallLength.value, $baseToShoulderLength.value);
            case ("holder"):
                return subtract($overallLength.value, $bodyLength.value);
            case ("body"):
                return subtract($overallLength.value, $holderLength.value);
            default:
                return 0;
        }
    }

    /* checks if index is valid for feedRateSaves array */
    function isValid(index: number) {
        return index >= 0 && index <= $toolLengthSaves.length - 1;
    }

    function createSave(name: string): toolLengthSave {
        // determine save count
        let saveCount;
        $loadedSave ? saveCount = $loadedSave.saveCount : saveCount = $toolLengthSaveCount;

        // create save of interface toolLengthSave
        let save: toolLengthSave = {
            name,
            overallLength: $overallLength.value,
            endMillType: $endMillType.value,
            fluteLength: $fluteLength.value,
            baseToShoulderLength: $baseToShoulderLength.value,
            holderLength: $holderLength.value,
            cutterDiameter: $cutterDiameter.value,
            shoulderDiameter: $shoulderDiameter.value,
            manualFluteLength: $manualFluteLength.isTrue,
            manualShoulderLegnth: $manualShoulderLegnth.isTrue,
            manualBodyLength: $manualBodyLength.isTrue,
            saveCount,
        }

        // update internal saved variables
        $savedBaseToFluteLength = $baseToFluteLength.value;
        $savedShoulderLength = $shoulderLength.value;
        $savedBodyLength = $bodyLength.value;

        return save;
    }

    function createNewSave(detail: {name: string}) {
        // do not save if there is an error
        if ($error) return;

        const newSave = createSave(detail.name);

        // add new save to feedRateSaves array, load it, and increment save count
        toolLengthSaves.update(oldSaves => [...oldSaves, newSave]);
        loadedToolLengthSave.set($toolLengthSaves.indexOf(newSave));
        toolLengthSaveCount.update(count => count + 1);
    }

    function updateSave(detail: {name: string}) {
        // do not save if there is an error
        if ($error) return;

        const updatedSave = createSave(detail.name);

        // update feedRateSaves array with updated save
        if (isValid($loadedToolLengthSave)) $toolLengthSaves[$loadedToolLengthSave] = updatedSave;
    }

    function loadSave() {
        // check index is valid
        if (!isValid($loadedToolLengthSave)) return;

        const loadingSave = $toolLengthSaves[$loadedToolLengthSave];

        // update all values
        $overallLength = { value: loadingSave.overallLength, error: false, hasChanged: false };
        $endMillType = { value: loadingSave.endMillType, hasChanged: false };
        $fluteLength = { value: loadingSave.fluteLength, error: false, hasChanged: false };
        $baseToShoulderLength = { value: loadingSave.baseToShoulderLength, error: false, hasChanged: false };
        $holderLength = { value: loadingSave.holderLength, error: false, hasChanged: false };
        $cutterDiameter = { value: loadingSave.cutterDiameter, error: false, hasChanged: false };
        $shoulderDiameter = { value: loadingSave.shoulderDiameter, error: false, hasChanged: false };
        $manualFluteLength = { isTrue: loadingSave.manualFluteLength, hasChanged: false };
        $manualShoulderLegnth = { isTrue: loadingSave.manualShoulderLegnth, hasChanged: false };
        $manualBodyLength = { isTrue: loadingSave.manualBodyLength, hasChanged: false };

        // update realted values
        $baseToFluteLength = { value: calculate("baseToFlute"), error: false, hasChanged: false };
        $shoulderLength = { value: calculate("shoulder"), error: false, hasChanged: false };
        $bodyLength = { value: calculate("body"), error: false, hasChanged: false };
        $savedBaseToFluteLength = calculate("baseToFlute");
        $savedShoulderLength = calculate("shoulder");
        $savedBodyLength = calculate("body");

        validateAll();
    }

    function deleteSave(index: number) {
        // check index is valid
        if (!isValid(index)) return;

        const saveToBeDeleted = $toolLengthSaves[index];
        // remove save from feedRateSaves array
        toolLengthSaves.update(saves => saves.filter(save => save !== saveToBeDeleted));

        // eject save if it was loaded
        if (index === $loadedToolLengthSave) loadedToolLengthSave.set(-1);
    }
</script>


<svelte:head>
    <title>Tool Length Calculator | Machinist's Edge</title>
    <meta
        name="description"
        content="Tool body and flute length calculator for measuring CNC milling tools."
    />
</svelte:head>


<Heading>Tool Length Calculator</Heading>

<div class="page">
    <form
        class="toolLength"
        tabindex="-1"
        bind:this={calculator}
        on:submit|preventDefault>
        <div class="inputs">
            <div class="twoInputs" id="overallAndType">
                <NumInput
                    label="overall length"
                    name="overallLength"
                    bind:value={$overallLength.value}
                    change={$overallLength.hasChanged}
                    bind:error={$overallLength.error}
                    units="in"
                    type="number"
                    step={0.1}
                    selfContained
                    on:input={() => {
                        // recalculate all lengths
                        $manualFluteLength.isTrue ? 
                            $baseToFluteLength.value = calculate("baseToFlute") :
                            $fluteLength.value = calculate("flute");
                        $manualShoulderLegnth.isTrue ?
                            $baseToShoulderLength.value = calculate("baseToShoulder"):
                            $shoulderLength.value = calculate("shoulder");
                        $manualBodyLength.isTrue ?
                            $holderLength.value = calculate("holder") :
                            $bodyLength.value = calculate("body");
                        
                        validateAll();
                    }}
                    on:pointerenter={() => $highlighted = "all"}
                    on:pointerleave={() => $highlighted = "none"}
                    on:focus={() => {
                        $hasFocused = true;
                        $focused = "all";
                    }}
                    on:blur={() => $hasFocused = false} />

                <RadioInput
                    label="end mill type"
                    name="endMillType"
                    options={[
                        { name: "flat", value: "flat" },
                        { name: "ball", value: "ball" },
                        { name: "bull-nose", value: "bull-nose" },
                    ]}
                    change={$endMillType.hasChanged}
                    selfContained
                    bind:value={$endMillType.value}/>
            </div>
            
            <div
                class="pairedInputs input__container"
                class:error={$baseToFluteLength.error || $fluteLength.error}>
                <NumInput
                    label="base-to-flute length"
                    name="baseToFluteLength"
                    bind:value={$baseToFluteLength.value}
                    change={$baseToFluteLength.hasChanged}
                    bind:error={$baseToFluteLength.error}
                    externalErrorChecking
                    units="in"
                    type="number"
                    step={0.1}
                    allowZero
                    on:input={() => {
                        $fluteLength.value = calculate("flute");
                        $manualFluteLength.isTrue = false;
                        validateAll();
                    }}
                    on:pointerenter={() => $highlighted = "baseToFlute"}
                    on:pointerleave={() => $highlighted = "none"}
                    on:focus={() => {
                        $hasFocused = true;
                        $focused = "baseToFlute";
                    }}
                    on:blur={() => $hasFocused = false} />

                <NumInput
                    label="flute length"
                    name="fluteLength"
                    bind:value={$fluteLength.value}
                    change={$fluteLength.hasChanged}
                    bind:error={$fluteLength.error}
                    externalErrorChecking
                    units="in"
                    type="number"
                    step={0.1}
                    allowZero
                    on:input={() => {
                        $baseToFluteLength.value = calculate("baseToFlute");
                        $manualFluteLength.isTrue = true;
                        validateAll();
                    }}
                    on:pointerenter={() => $highlighted = "flute"}
                    on:pointerleave={() => $highlighted = "none"}
                    on:focus={() => {
                        $hasFocused = true;
                        $focused = "flute";
                    }}
                    on:blur={() => $hasFocused = false} />
            </div>

            <div
                class="pairedInputs input__container"
                class:error={$baseToShoulderLength.error || $shoulderLength.error}>
                <NumInput
                    label="base-to-shoulder length"
                    name="baseToShoulderLength"
                    bind:value={$baseToShoulderLength.value}
                    change={$baseToShoulderLength.hasChanged}
                    bind:error={$baseToShoulderLength.error}
                    externalErrorChecking
                    units="in"
                    type="number"
                    step={0.1}
                    allowZero
                    on:input={() => {
                        $shoulderLength.value = calculate("shoulder");
                        $manualShoulderLegnth.isTrue = false;
                        validateAll();
                    }}
                    on:pointerenter={() => $highlighted = "baseToShoulder"}
                    on:pointerleave={() => $highlighted = "none"}
                    on:focus={() => {
                        $hasFocused = true;
                        $focused = "baseToShoulder";
                    }}
                    on:blur={() => $hasFocused = false} />

                <NumInput
                    label="shoulder length"
                    name="shoulderLength"
                    bind:value={$shoulderLength.value}
                    change={$shoulderLength.hasChanged}
                    bind:error={$shoulderLength.error}
                    externalErrorChecking
                    units="in"
                    type="number"
                    step={0.1}
                    allowZero
                    on:input={() => {
                        $baseToShoulderLength.value = calculate("baseToShoulder");
                        $manualShoulderLegnth.isTrue = true;
                        validateAll();
                    }}
                    on:pointerenter={() => $highlighted = "shoulder"}
                    on:pointerleave={() => $highlighted = "none"}
                    on:focus={() => {
                        $hasFocused = true;
                        $focused = "shoulder";
                    }}
                    on:blur={() => $hasFocused = false} />
            </div>

            <div
                class="pairedInputs input__container"
                class:error={$holderLength.error || $bodyLength.error}>
                <NumInput
                    label="holder length"
                    name="holderLength"
                    bind:value={$holderLength.value}
                    change={$holderLength.hasChanged}
                    bind:error={$holderLength.error}
                    externalErrorChecking
                    units="in"
                    type="number"
                    step={0.1}
                    allowZero
                    on:input={() => {
                        $bodyLength.value = calculate("body");
                        $manualBodyLength.isTrue = false;
                        validateAll();
                    }}
                    on:pointerenter={() => $highlighted = "holder"}
                    on:pointerleave={() => $highlighted = "none"}
                    on:focus={() => {
                        $hasFocused = true;
                        $focused = "holder";
                    }}
                    on:blur={() => $hasFocused = false} />

                <NumInput
                    label="body length"
                    name="bodyLength"
                    bind:value={$bodyLength.value}
                    change={$bodyLength.hasChanged}
                    bind:error={$bodyLength.error}
                    externalErrorChecking
                    units="in"
                    type="number"
                    step={0.1}
                    allowZero
                    on:input={() => {
                        $holderLength.value = calculate("holder");
                        $manualBodyLength.isTrue = true;
                        validateAll();
                    }}
                    on:pointerenter={() => $highlighted = "body"}
                    on:pointerleave={() => $highlighted = "none"}
                    on:focus={() => {
                        $hasFocused = true;
                        $focused = "body";
                    }}
                    on:blur={() => $hasFocused = false} />
            </div>

            <div class="twoInputs">
                <NumInput
                    label="cutter diameter"
                    name="cutterDiameter"
                    bind:value={$cutterDiameter.value}
                    change={$cutterDiameter.hasChanged}
                    bind:error={$cutterDiameter.error}
                    units="in"
                    type="allowFractions"
                    selfContained/>

                <NumInput
                    label="shoulder diameter"
                    name="shoulderDiameter"
                    bind:value={$shoulderDiameter.value}
                    change={$shoulderDiameter.hasChanged}
                    bind:error={$shoulderDiameter.error}
                    units="in"
                    type="allowFractions"
                    selfContained/>
            </div>
        </div>

        <div class="illus--wrapper">
            <div class="indicator--wrapper">
                <Indicator type="error" shown={$error} positionAbsolute />
            </div>
            <ToolLengthIllus
                highlighted={$hasFocused ? $focused : $highlighted}
                highlightedError={$highlightedError}
                overallLength={$overallLength.value}
                holderLength={$holderLength.value}
                 />
        </div>
    </form>

    <SaveLoader
        loadedSaveName={$loadedSave ? $loadedSave.name : null}
        hasChanges={hasChanged}
        error={$error}
        currentSaveCount={$loadedSave ? $loadedSave.saveCount : $toolLengthSaveCount}
        on:save={e => createNewSave(e.detail)}
        on:update={e => updateSave(e.detail)}
        on:eject={() => loadedToolLengthSave.set(-1)}
        on:delete={() => deleteSave($loadedToolLengthSave)} />

    <Saves
        toolLengthSaves={$toolLengthSaves}
        loadedIndex={$loadedToolLengthSave}
        on:load={e => {
            loadedToolLengthSave.set(e.detail.index)
            // scroll calculator into view and focus on it
            let scrollBehavior;
            $motionPref === "reduced" ? scrollBehavior = "auto" : scrollBehavior = "smooth";
            calculator.scrollIntoView({ behavior: "auto" });
            calculator.focus({ preventScroll: true });
        }}
        on:eject={() => loadedToolLengthSave.set(-1)}
        on:delete={e => deleteSave(e.detail.index)} />
</div>


<style lang="scss">
    .toolLength {
        // internal variables
        --_illus-width: 450px;

        display: grid;
        // minmax(0, 1fr) to prevent width blowout
        grid-template-columns: var(--_illus-width) minmax(0, 1fr);
        grid-template-areas: "illustration inputs";
        align-items: start;
        position: relative;

        border: var(--border) var(--clr-300);
        border-bottom: none;

        .inputs {
            .twoInputs, .pairedInputs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                z-index: 1;

                border-bottom: var(--border) var(--clr-300);                
            }

            .twoInputs {
                :global(.input__container:last-child::before) {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: calc(-0.5 * var(--border-width));
                    z-index: -1;

                    border-left: var(--border) var(--clr-300);
                }
            }

            .pairedInputs {
                :global(.numInput:last-child::before) {
                    content: "";
                    position: absolute;
                    top: var(--pad-lg);
                    bottom: var(--pad-lg);
                    left: calc(-0.5 * var(--border-width));
                    z-index: -1;

                    border-left: var(--border) var(--clr-300);
                }
            }
        }

        .illus--wrapper {
            grid-area: illustration;
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-end;
            position: relative;
            height: 100%;

            background-color: var(--clr-100);
            border-right: var(--border) var(--clr-300);

            .indicator--wrapper {
                display: flex;
                flex-flow: column nowrap;
                align-items: flex-end;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;

                :global(.indicator) {
                    position: sticky;
                    top: var(--input-pad-vrt);
                    margin-top: var(--input-pad-vrt);
                    margin-right: var(--input-pad-hrz);
                    margin-bottom: 180px;
                }
            }
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-tablet) {
        .toolLength {
            // internal variables
            --_illus-width: 380px;

            .illus--wrapper .indicator--wrapper {
                :global(.indicator) {
                    margin-bottom: 160px;
                }
            }
        }
    }

    @media only screen and (max-width: $breakpoint-smtablet) {
        .toolLength {
            // internal variables
            --_illus-width: 310px;

            .inputs {
                .twoInputs, .pairedInputs {
                    grid-template-columns: 1fr;
                }

                .twoInputs {
                    :global(.input__container:last-child::before) {
                        content: "";
                        position: absolute;
                        top: calc(-0.5 * var(--border-width));
                        right: 0;
                        left: 0;
                        z-index: -1;

                        border-top: var(--border) var(--clr-300);
                        border-left: none;
                    }
                }

                .pairedInputs {
                    :global(.numInput:last-child::before) {
                        content: "";
                        position: absolute;
                        top: calc(-0.5 * var(--border-width));
                        right: var(--pad-xl);
                        bottom: unset;
                        left: var(--pad-xl);
                        z-index: -1;

                        border-top: var(--border) var(--clr-300);
                        border-left: none;
                    }
                }
            }

            .illus--wrapper .indicator--wrapper {
                :global(.indicator) {
                    margin-bottom: 140px;
                }
            }
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .toolLength {
            grid-template-columns: 1fr;
            grid-template-areas:
                "illustration"
                "inputs";

            .illus--wrapper {
                flex-flow: column nowrap;
                justify-content: flex-start;
                position: sticky;
                top: 0;
                z-index: 1000;
                height: unset;

                border-right: none;
                margin-bottom: calc(1.5 * var(--border-width));
                outline: var(--border) var(--clr-300);

                .indicator--wrapper {
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: flex-end;
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;

                    :global(.indicator) {
                        position: relative;
                        top: var(--input-pad-vrt);
                        margin-top: 0;
                        margin-right: var(--input-pad-hrz);
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
</style>