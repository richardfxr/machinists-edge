<script lang="ts">
    /* === IMPORTS ============================ */
	import Indicator from './indicator.svelte';
    import UnitAbbr from './unitAbbr.svelte';
    
    /* === PROPS ============================== */
    export let label: string;
    export let name: string;
    export let value: number;
    export let error = false;
    export let externalErrorChecking = false;
    export let change = false;
    export let units: "RPM"| "IPM" | "in" | "SFPM" | "IPR";
    export let step = 0.001;
    export let type: "allowFractions" | "readonly" | "number";
    export let allowZero = false;
    export let selfContained = false;

    /* === REACTIVE DECLARATIONS ============== */
    $: fracValue = value as number | string;
    // run checkFracError() when fracValue changes for allowFractions numInput
    $: type === "allowFractions" && fracValue !== undefined && checkFracError();
    // run checkNumError() when value changes for number numInput
    $: type === "number" && value !== undefined && checkNumError();

    /* === FUNCTIONS ========================== */
    /**
     * tests if a string contains only digits and a decimal point (optional)
     */
    function isOnlyNum(testString:string) {
        return /^(\d+\.?\d*|\.\d+)$/.test(testString);
    }

    /**
     * error checker for allowFractions type numInput
     * 
     * updates value if fracValue can be evaluated into a valid number
     * sets error to true otherwise
     */
    function checkFracError() {
        // reset error
        error = false;

        if (typeof fracValue == 'number') {
            // set value as fracValue if it is a number
            value = fracValue;
        } else {
            if (!isNaN(parseFloat(fracValue)) && isOnlyNum(fracValue)) {
                // set parsed value as value if string is a valid number
                value = parseFloat(fracValue);
            } else if (fracValue.split("/").length === 2) {
                // calculate fraction
                let values = fracValue.split("/");
                let fraction = parseFloat(values[0]) / parseFloat(values[1]);

                if (typeof fraction == 'number' && isOnlyNum(values[0]) && isOnlyNum(values[1])) {
                    // set fraction as value if fraction is valid number
                    value = fraction;
                } else {
                    error = true;
                }
            } else {
                error = true;
            }
        }

        if (!allowZero && value === 0) {
            // disallow zero
            error = true;
            value = 1;
        }
    }

    /**
     * error checker for number type numInput
     * 
     * sets error to true and resets value to 1 if value is not
     * a valid number
     */
     function checkNumError() {
        // reset error
        if (!externalErrorChecking) error = false;

        if (value === null) {
            error = true;
        } else if (allowZero && value < 0) {
            // disallow negative values
            error = true;
        } else if (!allowZero && value <= 0) {
            // disallow zero
            error = true;
        }
    }
</script>


<div
    class="numInput"
    class:readonly={type === "readonly"}
    class:change={change && !error}
    class:error
    class:input__container={selfContained}
    id={name}
    on:pointerenter
    on:pointerleave>
    <label for={name + "__input"}>
        <span class="label">{label}</span>
        {#if type !== "readonly"}
            <div class="indicators">
                <Indicator type="change" shown={change && !error} positionAbsolute />
                <Indicator type="error" shown={error} />
            </div>
        {/if}
    </label>

    <div class="main">
        {#if type === "allowFractions"}
            <input
                id={name + "__input"}
                class:error
                {name}
                bind:value={fracValue}
                type="text"
                autocomplete="off"
                on:input>
        {:else if type === "readonly"}
            <input
                id={name + "__input"}
                class:error
                {name}
                bind:value
                type="number"
                readonly
                step="any">
        {:else}
            <input
                id={name + "__input"}
                class:error
                {name}
                bind:value
                type="number"
                min={allowZero ? "-0.001" : "0"}
                {step}
                on:input
                on:focus
                on:blur>
        {/if}

        <UnitAbbr {units} position="top-left" />
    </div>
</div>


<style lang="scss">
    .numInput {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: var(--input-gap);
        position: relative;
        z-index: 1;

        padding: var(--input-pad-vrt) var(--input-pad-hrz);

        label {
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: space-between;
            gap: var(--pad-xs);
            position: relative;

            font-size: var(--font-sm);
            line-height: 1em;
            word-break: break-all; // prevent overflow at larger rem sizes

            .indicators {
                position: relative;
            }            
        }

        .main {
            display: flex;
            flex-flow: row nowrap;
            align-items: baseline;
            gap: var(--pad-3xs);

            input {
                width: 100%;
                color: var(--clr-900);
                font-size: var(--font-2xl);
                font-weight: 600;
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
                label .label, .main, .main input {
                    color: var(--clr-800);
                }
            }
        }

        &.error {
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