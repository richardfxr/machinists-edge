<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolHolder from "$lib/SVGs/toolHolder.svelte";
    import BitTop from "$lib/SVGs/bit-top.svelte";
    import BitBoundingLines from "$lib/SVGs/bit-boundingLines.svelte";
    import FluteFront from "$lib/SVGs/flute-front.svelte";
    import FluteBack from "$lib/SVGs/flute-back.svelte";
    import FluteCenter from "$lib/SVGs/bit-center.svelte";

    /* === PROPS ============================== */
    export let scaleX: number;
    export let flutes: number;  

    /* === FUNCTIONS ========================== */
    function clamp(input: number, min: number, max: number): number {
        return Math.min(Math.max(input, min), max);
    }

    /* === REACTIVE DECLARATIONS ============== */
    $: displayedFlutes = clamp(flutes, 1, 5);
    $: displayedScaleX = clamp(scaleX, 0.2, 1);
</script>


<tool-illus class="tool__illus">
    <ToolHolder />
    <div class="bit" style="--scaleX: {displayedScaleX}; --flutes: {displayedFlutes};">
        <BitTop scaleX={displayedScaleX} />
        <div class="bit__bottom">
            <div class="flutes">
                <div class="flutes__inner">
                    {#each Array(6) as _, i}
                        <FluteBack
                            scaleX={displayedScaleX}
                            position={i === 0 ? "relative" : "absolute"}
                            zIndex={3 * i}
                            index={0}
                            offsetY={(100 / 3 / displayedFlutes) * -i} />
                        <FluteFront
                            scaleX={displayedScaleX}
                            position={i === 0 ? "relative" : "absolute"}
                            zIndex={3 * i + 100}
                            index={1}
                            offsetY={(100 / 3 / displayedFlutes) * -i} />
                        <FluteBack
                            scaleX={displayedScaleX}
                            position={i === 0 ? "relative" : "absolute"}
                            zIndex={3 * i + 1}
                            index={2}
                            offsetY={(100 / 3 / displayedFlutes) * -i} />
                        <FluteFront
                            scaleX={displayedScaleX}
                            position={i === 0 ? "relative" : "absolute"}
                            zIndex={3 * i + 101}
                            index={3}
                            offsetY={(100 / 3 / displayedFlutes) * -i} />
                        <FluteBack
                            scaleX={displayedScaleX}
                            position={i === 0 ? "relative" : "absolute"}
                            zIndex={3 * i + 2}
                            index={4}
                            offsetY={(100 / 3 / displayedFlutes) * -i} />
                        <FluteFront
                            scaleX={displayedScaleX}
                            position={i === 0 ? "relative" : "absolute"}
                            zIndex={3 * i + 102}
                            index={5}
                            offsetY={(100 / 3 / displayedFlutes) * -i} />
                    {/each}
                    <FluteCenter scaleX={displayedScaleX} zIndex={99} />
                </div>
            </div>
            <BitBoundingLines scaleX={displayedScaleX} />
        </div>
    </div>
</tool-illus>


<style lang="scss">
    .tool__illus {
        // internal varaibles
        --_width: 180px;
        --_shoulder-height: 20px;
        --_flute-height: 240px;

        display: flex;
        flex-direction: column;
        position: relative;

        padding: 0 calc(50% - var(--_width) / 2);

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
            width: 100%;

            padding: 0 32%;

            // transform: translateX(calc(50% - (var(--scaleX) / 2) * 100%));

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
                    animation: moveUp 2s linear infinite;
                }
            }
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes moveUp {
        from { transform: translateY(0%); }
        to { transform: translateY(calc(-100% / 3)); }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-tablet) {
        .tool__illus {
            // internal variables
            --_width: 160px;
        }
    }

    @media only screen and (max-width: $breakpoint-smdtablet) {
        .tool__illus {
            // internal variables
            --_width: 140px;
        }
    }
</style>