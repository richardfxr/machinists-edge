<script>
    /* === IMPORTS ============================ */
    import ToolHolder from "$lib/SVGs/toolHolder.svelte";
    import BitTop from "$lib/SVGs/bit-top.svelte";
    import BitBoundingLines from "$lib/SVGs/bit-boundingLines.svelte";
    import FluteFront from "$lib/SVGs/flute-front.svelte";
    import FluteBack from "$lib/SVGs/flute-back.svelte";
    import FluteCenter from "$lib/SVGs/bit-center.svelte";

    /* === VARAIBLES ========================== */
    let scaleX = 1;
    let flutes = 2;
</script>


<form action="" class="feedCalc">
    <div class="inputs">

    </div>

    <div class="alwaysVisible">
        <div class="alwaysVisible__inner">

        </div>
    </div>

    <div class="results">
        <div class="results__inner">
            <div class="tool__illustration">
                <ToolHolder />
                <div class="bit" style="--scaleX: {scaleX}; --flutes: {flutes};">
                    <BitTop {scaleX} />
                    <div class="bit__bottom">
                        <div class="flutes">
                            <div class="flutes__inner">
                                {#each Array(flutes) as _, i}
                                    <FluteBack
                                        {scaleX}
                                        position={i === 0 ? "relative" : "absolute"}
                                        zIndex={2 * i}
                                        index={0}
                                        offsetY={(50 / flutes) * -i} />
                                    <FluteFront
                                        {scaleX}
                                        position={i === 0 ? "relative" : "absolute"}
                                        zIndex={2 * i + 100}
                                        index={1}
                                        offsetY={(50 / flutes) * -i} />
                                    <FluteBack
                                        {scaleX}
                                        position={i === 0 ? "relative" : "absolute"}
                                        zIndex={2 * i + 1}
                                        index={2}
                                        offsetY={(50 / flutes) * -i} />
                                    <FluteFront
                                        {scaleX}
                                        position={i === 0 ? "relative" : "absolute"}
                                        zIndex={2 * i + 101}
                                        index={3}
                                        offsetY={(50 / flutes) * -i} />
                                {/each}
                                <FluteCenter {scaleX} zIndex={99} />
                            </div>
                        </div>
                        <BitBoundingLines {scaleX} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>


<style lang="scss">
    .feedCalc {
        // internal variables
        --_results-width: 450px;
        --_alwaysVisible-height: 80px;

        --diameter: 0.5;

        display: grid;
        grid-template-columns: var(--_results-width) auto;
        grid-template-areas: "results inputs";
        align-items: start;
        position: relative;

        border: var(--border) var(--clr-300);
        margin-top: 100px;
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
                position: sticky;
                top: 0;
                left: 0;
                z-index: 100;
                width: var(--_results-width);
                height: var(--_alwaysVisible-height);

                background-color: var(--clr-900);
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

            .tool__illustration {
                // internal varaibles
                --_shoulder-height: 20px;
                --_flute-height: 240px;

                display: flex;
                flex-direction: column;
                position: relative;

                padding: 0 24%;

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
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-mobile) {
        .feedCalc {
            display: flex;
            flex-direction: column-reverse;

            .inputs {
                grid-area: unset;
                width: 100%; 
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

    /* === ANIMATIONS ========================= */
    @keyframes moveUp {
        from { transform: translateY(0%); }
        to { transform: translateY(calc(-50% / var(--flutes))); }
    }
</style>