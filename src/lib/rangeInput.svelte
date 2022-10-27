<script lang="ts">
    /* === IMPORTS ============================ */
    import { createEventDispatcher } from 'svelte';

    /* === PROPS ============================== */
    export let label:string;
    export let name:string;
    export let initValue:number;
    export let min = 0;
    export let max = 10;
    export let step = 1;
    export let selfContained = false;

    /* === VARAIBLES ========================== */
    let value = initValue;
    let error = false;

    /* === FUNCTIONS ========================== */
    function updateValue(type:"decrement" | "increment") {
        if (type === "decrement" && value > min)
            value = value - step;
        else if (type === "increment" && value < max)
            value = value + step;

        dispatchValue();
    }

    /* === EVENTS ============================= */
    const dispatch = createEventDispatcher();

    /**
     * dispatcher that valids value
     */
    function dispatchValue() {
        let trueValue = initValue;
        // reset error
        error = false;

        if (value < min || value > max || (value - min) % step !== 0) {
            // set error if value is not within range or a multiple of step
            error = true
        } else {
            trueValue = value;
        }

        dispatch('update', {
            error: error,
			value: value
		});
    }
</script>


<div
    class="rangeInput"
    class:error={error}
    class:input__container={selfContained}
    id={name}>
    <label for={name + "__input"}>
        <span class="label">{label}</span>
        <span class="error">error</span>
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
                bind:value
                on:input={dispatchValue}
                type="number"
                {min}
                {max}
                {step}>
            <button
                class="decrementer"
                aria-label="decrement value"
                disabled={value <= min || error}
                on:click={() => updateValue("decrement")}
                type="button">
                -
            </button>
            <button
                class="incrementer"
                aria-label="increment value"
                disabled={value >= max || error}
                on:click={() => updateValue("increment")}
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
        justify-content: space-between;
        position: relative;

        padding: var(--pad-sm) var(--pad-xl);

        label {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            font-size: var(--font-sm);
            line-height: 1em;

            .error {
                display: block;
                color: var(--clr-0);
                font-weight: 500;

                padding: 0 var(--pad-3xs);
                background-color: var(--clr-error-800);

                opacity: 0;
                transition: opacity var(--trans-fast);
            }
        }

        .main {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: var(--pad-2xl);

            input[type="range"] {
                width: 100%;

                &::-webkit-slider-thumb {
                    cursor: pointer;
                    width: var(--_range-thumb-size);
                    height: var(--_range-thumb-size);

                    background-color: var(--clr-100);
                    border: solid var(--border-xthick) var(--clr-900);
                    border-radius: var(--border-radius-round);
                    margin-top: calc(-0.5 * var(--_range-thumb-size));
                }

                &::-moz-range-thumb {
                    cursor: pointer;
                    width: calc(var(--_range-thumb-size) / 1.7);
                    height: calc(var(--_range-thumb-size) / 1.7);

                    background-color: var(--clr-100);
                    border: solid var(--border-xthick) var(--clr-900);
                    border-radius: var(--border-radius-round);
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
                    font-size: var(--font-xl);
                    font-weight: 600;
                    line-height: 1em;
                    text-align: center;

                    border: none;

                    transition: color var(--trans-fast);
                }

                .decrementer, .incrementer {
                    color: var(--clr-800);
                    font-size: var(--font-sm);
                    line-height: 1em;
                    width: var(--_button-size);
                    height: var(--_button-size);

                    padding: 0;
                    border: var(--border) var(--clr-300);
                }

                .decrementer {
                    order: 0;
                }

                .incrementer {
                    order: 2;
                }
            }
        }

        &.error {
            label .error {
                opacity: 1;
            }

            .main .numInput input[type="number"] {
                color: var(--clr-error-900);
            }
        }
    }
</style>