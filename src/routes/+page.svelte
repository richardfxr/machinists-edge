<script lang="ts">
    /* === IMPORTS ============================ */
    import ToolIllus from "$lib/toolIllus.svelte";

    /* === VARAIBLES ========================== */
    let scaleX = 1;
    let flutes = 2;
</script>


<h1>Feed Rate Calculator</h1>

<form action="" class="feedCalc">
    <div class="inputs">

    </div>

    <div class="alwaysVisible">
        <div class="alwaysVisible__inner">

        </div>
    </div>

    <div class="results">
        <div class="results__inner">
            <ToolIllus {scaleX} {flutes} />
        </div>
    </div>
</form>


<style lang="scss">
    .feedCalc {
        // internal variables
        --_results-width: 450px;
        --_alwaysVisible-height: 80px;

        display: grid;
        grid-template-columns: var(--_results-width) auto;
        grid-template-areas: "results inputs";
        align-items: start;
        position: relative;

        border: var(--border) var(--clr-300);
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
</style>