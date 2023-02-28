<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolHolderBaseVrt from '$lib/SVGs/toolHolder-base-vrt.svelte';
    import ToolHolderMainVrt from '$lib/SVGs/toolHolder-main-vrt.svelte';
    import BitShoulderVrt from '$lib/SVGs/bit-shoulder-vrt.svelte';
    import BitShaftVrt from '$lib/SVGs/bit-shaft-vrt.svelte';
    import BitFluteVrt from '$lib/SVGs/bit-flute-vrt.svelte';
    import BitTipVrt from '$lib/SVGs/bit-tip-vrt.svelte';
    import HolderAndBitHrz from '$lib/SVGs/holderAndBit-hrz.svelte';
    import { motionPref } from "../store/store";
    import type { ToolSection } from "../store/store";

    /* === PROPS ============================== */
    export let highlighted: ToolSection;
    export let highlightedError = false;
    export let overallLength: number;
    export let holderLength: number;

    /* === FUNCTIONS ========================== */
    function clamp(input: number, min: number, max: number): number {
        return Math.min(Math.max(input, min), max);
    }

    /* === REACTIVE DECLARATIONS ============== */
    // height of illustration as a coefficient of --_width
    $: height = 1.7 + (clamp(overallLength, 3 , 4) - 3);
    // percentage of overallLength that is taken up by the holder
    $: holderPercentage = clamp(holderLength / overallLength, 0.31, 0.41);
    // toolHolderMain translateY as a coefficient of --_width
    $: toolHolderMainTrans = 2 * (0.41 - holderPercentage);
    // BitFluteVrt height as a coefficient of --_width
    $: fluteHeight = (0.44 + toolHolderMainTrans) * height;
</script>


<tool-illus
    class="toolLengthIllus"
    class:highlightedError
    class:motionRedcued={$motionPref === "reduced"}
    style="
        --_toolHolderMainTrans: {toolHolderMainTrans};
        --_fluteHeight: {fluteHeight};
    ">
    <HolderAndBitHrz />
    
    <div
        id="BitTip"
        class="illusContainer"
        class:active={
            highlighted === "all" ||
            highlighted === "flute" ||
            highlighted === "shoulder" ||
            highlighted === "body"
        }>
        <BitTipVrt />
    </div>

    <div
        id="BitFlute"
        class="illusContainer"
        class:active={
            highlighted === "all" ||
            highlighted === "flute" ||
            highlighted === "shoulder" ||
            highlighted === "body"
        }>
        <BitFluteVrt />
    </div>

    <div
        id="BitShaft"
        class="illusContainer"
        class:active={
            highlighted === "all" ||
            highlighted === "shoulder" ||
            highlighted === "baseToFlute" ||
            highlighted === "body"
        }>
        <BitShaftVrt />
    </div>

    <div
        id="BitShoulder"
        class="illusContainer"
        class:active={
            highlighted === "all" ||
            highlighted === "baseToFlute" ||
            highlighted === "baseToShoulder" ||
            highlighted === "body"
        }>
        <BitShoulderVrt />
    </div>

    <div
        id="ToolHolderMain"
        class="illusContainer"
        class:active={
            highlighted === "all" ||
            highlighted === "baseToFlute" ||
            highlighted === "baseToShoulder" ||
            highlighted === "holder"
        }>
        <ToolHolderMainVrt />
    </div>

    <div
        id="ToolHolderBase"
        class="illusContainer"
        class:active={
            highlighted === "all" ||
            highlighted === "baseToFlute" ||
            highlighted === "baseToShoulder" ||
            highlighted === "holder"
        }>
        <ToolHolderBaseVrt />
    </div>
</tool-illus>


<style lang="scss">
    .toolLengthIllus {
        // internal variables
        --_width: 180px;
        --_indicator-size: 5px;

        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-end;
        position: sticky;
        bottom: 0;
        height: calc(2.9 * var(--_width));

        border-bottom: var(--border) var(--clr-300);

        &::before {
            // gradient overlay
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 2;

            opacity: 0.05;
            background: linear-gradient(var(--clr-100), var(--clr-900) 90%);
        }

        &.highlightedError .illusContainer {
            &::before {
                background-color: var(--clr-error-200);
            }

            &::after {
                background-color: var(--clr-error-800);
            }
        }

        .illusContainer {
            display: flex;
            justify-content: center;
            width: 100%;
            position: relative;

            transition: height var(--trans-fast),
                        transform var(--trans-fast);

            &::before {
                // background
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;

                opacity: 0;
                background-color: var(--clr-200);

                transition: opacity var(--trans-fast),
                            background-color var(--trans-fast);
            }

            &::after {
                // indicator line
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                width: var(--_indicator-size);

                opacity: 0;
                background-color: var(--clr-900);

                transition: opacity var(--trans-fast),
                            background-color var(--trans-fast);
            }

            &.active {
                &::before, &::after {
                    opacity: 1;
                }
            }

            &#BitTip {
                transform: translateY(calc(var(--_toolHolderMainTrans, 0) * var(--_width)));
                z-index: 10;
            }

            &#BitFlute {
                align-items: flex-end;
                height: calc(var(--_fluteHeight, 1.2) * var(--_width));
                z-index: 5;

                transform: translateY(calc(var(--_toolHolderMainTrans, 0) * var(--_width)));

                overflow: hidden;
            }

            &#BitShaft {
                transform: translateY(calc(var(--_toolHolderMainTrans, 0) * var(--_width)));
                z-index: 6;
            }

            &#BitShoulder {
                transform: translateY(calc(var(--_toolHolderMainTrans, 0) * var(--_width)));
                z-index: 7;
            }

            &#ToolHolderMain {
                transform: translateY(calc(var(--_toolHolderMainTrans, 0) * var(--_width)));
                z-index: 8;
            }

            &#ToolHolderBase {
                z-index: 9;
            }
        }

        :global(.illustration.horizontal) {
            display: none;
        }

        :global(.illustration.vertical) {
            display: block;
            width: var(--_width);
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-tablet) {
        .toolLengthIllus {
            // internal variables
            --_width: 160px;
            --_indicator-size: 5px;
        }
    }

    @media only screen and (max-width: $breakpoint-smtablet) {
        .toolLengthIllus {
            // internal variables
            --_width: 140px;
            --_indicator-size: 4px;
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .toolLengthIllus {
            // internal variables
            --_width: min(320px, 90%);
            --_indicator-size: 4px;

            width: var(--_width);
            height: unset;

            border-bottom: none;

            &::before {
                // change direction of gradient background
                background: linear-gradient(90deg, var(--clr-900), var(--clr-100) 90%);
            }

            .illusContainer {
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                width: unset;

                &::after {
                    // indicator line
                    top: unset;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    width: unset;
                    height: var(--_indicator-size);
                }

                &#BitTip {
                    display: none;
                }

                &#BitFlute {
                    right: 0;
                    left: 50.5%;
                    right: 0;
                    height: unset;
                    transform: none;
                }

                &#BitShaft {
                    left: 41.5%;
                    width: 9%;
                    transform: none;
                }

                &#BitShoulder {
                    left: 36.2%;
                    width: 5.3%;
                    transform: none;
                }

                &#ToolHolderMain {
                    left: 0;
                    width: 36.2%;
                    transform: none;
                }

                &#ToolHolderBase {
                    display: none;
                }
            }

            :global(.illustration.horizontal) {
                display: block;
                position: relative;
                z-index: 11;
                width: 100%;
                
                padding-top: var(--pad-xl);
                padding-bottom: var(--pad-xl);
            }

            :global(.illustration.vertical) {
                display: none;
            }
        }
    }

    /* === A11Y =============================== */
    .motionRedcued.toolLengthIllus {
        .illusContainer {
            transition: none;
        }
    }
</style>