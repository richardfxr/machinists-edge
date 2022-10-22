<form action="" class="feedCalc">
    <div class="inputs">

    </div>

    <div class="alwaysVisible">
        <div class="alwaysVisible__inner">

        </div>
    </div>

    <div class="results">
        <div class="results__inner">

        </div>
    </div>
</form>


<style lang="scss">
    .feedCalc {
        // internal variables
        --_results-width: 400px;
        --_alwaysVisible-height: 80px;

        display: grid;
        grid-template-columns: var(--_results-width) auto;
        grid-template-areas: "results inputs";
        align-items: start;
        position: relative;

        margin-top: 100px;
        margin-bottom: 100px;
        
        .inputs {
            grid-area: inputs;
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: 300vh;

            background-color: salmon;
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

                background-color: red;
            }
        }

        .results {
            grid-area: results;
            position: sticky;
            top: var(--_alwaysVisible-height);
            max-height: calc(100vh - var(--_alwaysVisible-height));

            margin-top: var(--_alwaysVisible-height);
            background-color: aquamarine;
            overflow-y: auto;

            &__inner {
                height: 600px;
                background-color: aqua;
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
</style>