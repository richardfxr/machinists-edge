<script lang="ts">
    /* === IMPORTS ============================ */
    import { createEventDispatcher } from 'svelte';
	import UnitAbbr from './unitAbbr.svelte';
    
    /* === PROPS ============================== */
    export let label: string;
    export let name: string;
    export let initValue: number | string = 1;
    export let displayedValue = 1;
    export let units: "RPM"| "IPM" | "in" | "SFPM" | "IPR";
    export let step = 0.001;
    export let type: "allowFractions" | "readonly" | "drivenNumber";
    export let allowZero = false;
    export let selfContained = false;

    /* === VARAIBLES ========================== */
    let value = initValue;
    let error = false;

    /* === REACTIVE DECLARATIONS ============== */

    /* === FUNCTIONS ========================== */
    /**
     * tests if a string contains only digits and a decimal point (optional)
     */
    function isOnlyNum(testString:string) {
        return /^(\d+\.?\d*|\.\d+)$/.test(testString);
    }

    /* === EVENTS ============================= */
    const dispatch = createEventDispatcher();

    /**
     * dispatcher for type="number" input
     */
    function dispatchValue() {
        let trueValue = displayedValue;
        // reset error
        error = false;

        if (displayedValue == null) {
            trueValue = 1;
            error = true;
        } else if (allowZero && trueValue < 0) {
            // disallow negative values
            trueValue = 1;
            error = true;
        } else if (!allowZero && trueValue <= 0) {
            // disallow zero
            trueValue = 1;
            error = true;
        }

        dispatch('update', {
            error: error,
			value: trueValue
		});
    }

    /**
     * dispatcher for type="text" input. Evaluates string if it is valid number or fraction
     */
    function dispatchValueFrac() {
        let trueValue = initValue;
        // reset error
        error = false;

        if (typeof value == 'number') {
            // set value as trueValue if it is a number
            trueValue = value;
        } else {
            if (!isNaN(parseFloat(value)) && isOnlyNum(value)) {
                // set parsed value as trueValue if string is a valid number
                trueValue = parseFloat(value);
            } else if (value.split("/").length === 2) {
                // calculate fraction
                let values = value.split("/");
                let fraction = parseFloat(values[0]) / parseFloat(values[1]);

                if (typeof fraction == 'number' && isOnlyNum(values[0]) && isOnlyNum(values[1])) {
                    // set fraction as trueValue if fraction is valid number
                    trueValue = fraction;
                } else {
                    error = true;
                }
            } else {
                error = true;
            }
        }

        if (!allowZero && trueValue === 0) {
            // disallow zero
            error = true;
            trueValue = 1;
        }

        dispatch('update', {
            error: error,
			value: trueValue
		});
    }

</script>


<div
    class="numInput"
    class:readonly={type === "readonly"}
    class:error={error}
    class:input__container={selfContained}
    id={name}>
    <label for={name + "__input"}>
        <span class="label">{label}</span>
        <span class="error">error</span>
    </label>

    <div class="main">
        {#if type === "allowFractions"}
            <input
                id={name + "__input"}
                class:error={error}
                {name}
                bind:value
                on:input={dispatchValueFrac}
                type="text">
        {:else if type === "readonly"}
            <input
                id={name + "__input"}
                class:error={error}
                {name}
                bind:value={displayedValue}
                type="number"
                readonly
                step="any">
        {:else}
            <input
                id={name + "__input"}
                class:error={error}
                {name}
                bind:value={displayedValue}
                on:input={dispatchValue}
                type="number"
                min={allowZero ? "-0.001" : "0"}
                {step}>
        {/if}

        <UnitAbbr {units} position="top-left" />
    </div>
</div>


<style lang="scss">
    .numInput {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: var(--pad-4xs);
        position: relative;
        z-index: 1;

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
            flex-direction: row nowrap;
            align-items: baseline;
            gap: var(--pad-3xs);

            input {
                width: 100%;
                color: var(--clr-900);
                font-size: var(--font-xl);
                font-weight: 600;
                line-height: 1em;

                border: none;

                transition: color var(--trans-fast);
            }
        }

        &.readonly {
            .main input {
                color: var(--clr-800);
                font-family: "ClashDisplay", sans-serif;
                font-weight: 400;

                margin-top: 0.1em;
            }

            &:hover, &:focus-within {
                label .label, .main, .main input {
                    color: var(--clr-800);
                }
            }
        }

        &.error {
            label .error {
                opacity: 1;
            }

            .main input {
                color: var(--clr-error-900);
            }
        }

        &:hover, &:focus-within {
            label .label, .main {
                color: var(--clr-900);
            }

            .main input {
                color: var(--clr-1000);
            }

            &.error .main input {
                color: var(--clr-error-1000);
            }
        }
    }
</style>