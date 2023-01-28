<script lang="ts">
    /* === IMPORTS ============================ */
	import Indicator from './indicator.svelte';

    /* === PROPS ============================== */
    export let label: string;
    export let name: string;
    export let value: number;
    export let change = false;
    export let error = false;
    export let min = 0;
    export let max = 10;
    export let step = 1;
    export let selfContained = false;

    /* === REACTIVE DECLARATIONS ============== */
    $: numValue = value;
    // run checkNumError() when numValue changes
    $: numValue && checkNumError();

    /* === FUNCTIONS ========================== */
    /**
     * error checker for numInput
     * 
     * updates value if numValue is between min & max and is on a valid step
     * sets error to true otherwise
     */
    function checkNumError() {
        // reset error
        error = false;

        if (numValue < min || numValue > max || (numValue - min) % step !== 0) {
            // set error if value is not within range or a multiple of step
            error = true
        } else {
            value = numValue;
        }
    }
</script>


<div
    class="rangeInput"
    class:error
    class:input__container={selfContained}
    id={name}>
    <label for={name + "__input"}>
        <span class="label">{label}</span>
        <Indicator type="change" shown={change && !error} positionAbsolute />
        <Indicator type="error" shown={error} />
    </label>

    <div class="main">
        <input
            id={name + "__input"}
            {name}
            bind:value
            type="range"
            {min}
            {max}
            {step}>

        <div class="numInput">
            <label for={name + "__numInput"} class="visuallyHidden">
                {label}
            </label>
            <input
                id={name + "__numInput"}
                {name}
                bind:value={numValue}
                type="number"
                {min}
                {max}
                {step}>
            <button
                class="decrementer"
                aria-label="decrement value"
                disabled={value <= min || error}
                on:click={() => numValue = numValue - step}
                type="button">
                -
            </button>
            <button
                class="incrementer"
                aria-label="increment value"
                disabled={value >= max || error}
                on:click={() => numValue = numValue + step}
                type="button">
                +
            </button>
        </div>
    </div>
</div>


<style lang="scss">
    .rangeInput {
        // internal variables
        --_range-thumb-size: 1.8rem;
        --_button-size: 2rem;

        display: flex;
        flex-direction: column;
        gap: var(--pad-2xs);
        position: relative;
        z-index: 1;

        padding: var(--input-pad-vrt) var(--input-pad-hrz);

        label {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            position: relative;

            font-size: var(--font-sm);
            line-height: 1em;
        }

        .main {
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            column-gap: var(--pad-2xl);
            row-gap: var(--padRem-3xs);

            input[type="range"] {
                flex-grow: 1;
                min-width: 50%;

                margin: calc(0.65 * var(--_range-thumb-size)) 0;

                &:hover, &:focus {
                    &::-webkit-slider-thumb {
                        border-color: var(--clr-1000);
                    }

                    &::-moz-range-thumb {
                        border-color: var(--clr-1000);
                    }
                }

                &::-webkit-slider-thumb {
                    cursor: pointer;
                    width: var(--_range-thumb-size);
                    height: var(--_range-thumb-size);

                    background-color: var(--clr-100);
                    border: solid var(--border-xthick) var(--clr-900);
                    border-radius: var(--border-radius-round);
                    margin-top: calc(-0.5 * var(--_range-thumb-size));

                    transition: border var(--trans-fast);
                }

                &::-moz-range-thumb {
                    cursor: pointer;
                    width: calc(var(--_range-thumb-size) / 1.7);
                    height: calc(var(--_range-thumb-size) / 1.7);

                    background-color: var(--clr-100);
                    border: solid var(--border-xthick) var(--clr-900);
                    border-radius: var(--border-radius-round);

                    transition: border var(--trans-fast);
                }

                &::-webkit-slider-runnable-track {
                    cursor: pointer;
                    width: 100%;
                    height: var(--border-width);
                    background-color: var(--clr-800);
                }

                &::-moz-range-track {
                    cursor: pointer;
                    width: 100%;
                    height: var(--border-width);
                    background-color: var(--clr-800);
                }
            }

            .numInput {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;

                input[type="number"] {
                    order: 1;
                    width: 3rem;
                    color: var(--clr-900);
                    font-size: var(--font-2xl);
                    font-weight: 600;
                    line-height: 1em;
                    text-align: center;

                    border: none;

                    transition: color var(--trans-fast);
                }

                button {
                    color: var(--clr-800);
                    font-size: var(--font-sm);
                    line-height: 1em;
                    width: var(--_button-size);
                    height: var(--_button-size);

                    padding: 0;
                    border: var(--border) var(--clr-300);

                    transition: color var(--trans-fast),
                                border var(--trans-fast);

                    &:hover, &:focus {
                        color: var(--clr-1000);
                        border-color: var(--clr-800);
                    }

                    &:disabled {
                        cursor: not-allowed;
                        color: var(--clr-700);
                        border-color: var(--clr-250);
                    }
                }

                .decrementer {
                    order: 0;
                }

                .incrementer {
                    order: 2;
                }

                &:hover, &:focus-within {
                    input[type="number"] {
                        color: var(--clr-1000);
                    }
                }
            }
        }

        &:hover, &:focus-within {
            label .label {
                color: var(--clr-900);
            }
        }

        &.error {
            .main .numInput input[type="number"] {
                color: var(--clr-error-900);
            }
        }
    }
</style>