<script lang="ts">
    /* === IMPORTS ============================ */
    import { createEventDispatcher } from 'svelte';
    
    /* === PROPS ============================== */
    export let label:string;
    export let name:string;
    export let initValue:number | string;
    export let units:string;
    export let step = 0.001;
    export let type:"allowFractions" | "readonly";
    export let displayedValue = 1;

    /* === VARAIBLES ========================== */
    let value = initValue;
    let error = false;

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
        // reset error
        error = false;

        dispatch('update', {
            error: error,
			value: value
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
            console.log("value is number");
        } else {
            if (!isNaN(parseFloat(value)) && isOnlyNum(value)) {
                // set parsed value as trueValue if string is a valid number
                trueValue = parseFloat(value);
                console.log("value is string that is valid number");
            } else if (value.split("/").length === 2) {
                // calculate fraction
                let values = value.split("/");
                let fraction = parseFloat(values[0]) / parseFloat(values[1]);

                if (typeof fraction == 'number' && isOnlyNum(values[0]) && isOnlyNum(values[1])) {
                    // set fraction as trueValue if fraction is valid number
                    trueValue = fraction;
                    console.log("value is valid fraction:", values);
                } else {
                    error = true;
                    console.log("value is invalid fraction:", values)
                }
            } else {
                error = true;
                console.log("value is invalid")
            }
        }

        console.log("trueValue:", trueValue)

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
    id={name}>
    <label for={name + "__input"}>
        <span class="label">{label}</span>
        <span class="visuallyHidden">(in {units})</span>
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
                bind:value
                on:input={dispatchValue}
                type="number"
                {step}>
        {/if}

        <span class="units">{units}</span>
    </div>
</div>


<style lang="scss">
    .numInput {
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

            .units {
                color: var(--clr-800);
                font-size: var(--font-sm);
                font-weight: 400;
                line-height: 1em;

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
                label .label, .main .units, .main input {
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
            label .label, .main .units {
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