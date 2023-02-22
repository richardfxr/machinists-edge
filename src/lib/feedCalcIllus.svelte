<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolHolder from "$lib/SVGs/toolHolder.svelte";
    import BitTop from "$lib/SVGs/bit-top.svelte";
    import BitBoundingLines from "$lib/SVGs/bit-boundingLines.svelte";
    import FluteFront from "$lib/SVGs/flute-front.svelte";
    import FluteBack from "$lib/SVGs/flute-back.svelte";
    import FluteCenter from "$lib/SVGs/bit-center.svelte";
    import { motionPref } from "../store/store";

    /* === PROPS ============================== */
    export let scaleX: number;
    export let flutes: number;
    export let spindleSpeed: number;
    export let feedRate: number;

    /* === VARAIBLES ========================== */
    const fluteArrayLength = 3;
    const feedMarkNum = 20;

    /* === FUNCTIONS ========================== */
    function clamp(input: number, min: number, max: number): number {
        return Math.min(Math.max(input, min), max);
    }

    /* === REACTIVE DECLARATIONS ============== */
    $: displayedFlutes = clamp(flutes, 1, 5);
    $: displayedScaleX = clamp(scaleX, 0.2, 1);
    $: displayedSpindleSpeed = clamp((5000 - spindleSpeed) / 1500, 0.1, 5);
    $: displayedFeedRate = clamp((50 - feedRate) / 13, 0.8, 10);
</script>


<tool-illus
    class="feedCalcIllus"
    class:motionRedcued={$motionPref === "reduced"}
    style="
        --spindleSpeed: {displayedSpindleSpeed}s;
        --feedRate: {displayedFeedRate}s;
        --fluteArrayLength: {fluteArrayLength};
        --feedMarkNum: {feedMarkNum};
    ">
    <ToolHolder />
    <div class="bit" style="--scaleX: {displayedScaleX}; --flutes: {displayedFlutes};">
        <BitTop scaleX={displayedScaleX} />
        <div class="bit__bottom">
            <div class="flutes">
                <div class="flutes__inner">
                    {#each Array(6) as _, i}
                        {#each Array(fluteArrayLength) as _, i2}
                            <FluteBack
                                scaleX={displayedScaleX}
                                position={i === 0 ? "relative" : "absolute"}
                                zIndex={fluteArrayLength * i + 2 * i2}
                                {fluteArrayLength}
                                index={0 + 2 * i2}
                                offsetY={(200 / displayedFlutes) * -i} />
                            <FluteFront
                                scaleX={displayedScaleX}
                                position={i === 0 ? "relative" : "absolute"}
                                zIndex={fluteArrayLength * i + 100 + 2 * i2}
                                {fluteArrayLength}
                                index={1 + 2 * i2}
                                offsetY={(200 / displayedFlutes) * -i} />
                        {/each}
                    {/each}
                    <FluteCenter scaleX={displayedScaleX} zIndex={99} />
                </div>
            </div>
            <BitBoundingLines scaleX={displayedScaleX} />
        </div>
    </div>

    <div class="feedMarks">
        {#each Array(feedMarkNum) as _}
            <div class="mark"></div>
        {/each}
    </div>
</tool-illus>


<style lang="scss">
    .feedCalcIllus {
        // internal varaibles
        --_width: 180px;
        --_shoulder-height: 20px;
        --_flute-height: 240px;
        --_feedMark-height: 40px;

        display: flex;
        flex-direction: column;
        position: relative;

        padding: 0 calc(50% - var(--_width) / 2) calc(var(--_feedMark-height) * 0.6) calc(50% - var(--_width) / 2);

        overflow: hidden;

        &::before {
            // gradient overlay for tool illustration
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 2;

            opacity: 0.05;
            background: linear-gradient(var(--clr-900), var(--clr-100) 90%);
        }

        .bit {
            position: relative;
            z-index: 2;
            width: 100%;

            padding: 0 32%;

            :global(.illustration) {
                transform: translateX(calc(50% - (var(--scaleX) / 2) * 100%));
            }

            &__bottom {
                position: relative;
            }

            .flutes {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;

                overflow: hidden;

                &__inner {
                    position: relative;
                    animation: moveUp var(--spindleSpeed) linear infinite;
                }
            }
        }

        .feedMarks {
            display: grid;
            grid-template-columns: repeat(var(--feedMarkNum), auto);
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 1;
            width: 200%;
            height: var(--_feedMark-height);

            animation: moveRight var(--feedRate) linear infinite;

            .mark {
                border-right: var(--border) var(--clr-300);
            }
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes moveUp {
        from { transform: translateY(0%); }
        to { transform: translateY(calc(-100% / var(--fluteArrayLength))); }
    }

    @keyframes moveRight {
        from { transform: translateX(0%); }
        to { transform: translateX(50%); }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-tablet) {
        .feedCalcIllus {
            // internal variables
            --_width: 160px;
        }
    }

    @media only screen and (max-width: $breakpoint-smtablet) {
        .feedCalcIllus {
            // internal variables
            --_width: 140px;
        }
    }

    /* === A11Y =============================== */
    .motionRedcued.feedCalcIllus {
        .bit .flutes__inner {
            animation: none;
        }

        .feedMarks {
            animation: none;
        }
    }
</style>