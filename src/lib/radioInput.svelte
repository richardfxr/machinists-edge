<script lang="ts">
    /* === PROPS ============================== */
    export let label:string;
    export let name:string;
    export let options:{ "name": string, "value": string }[];
    export let value = options[0].value;
    export let selfContained = false;
</script>


<div
    id={name}
    class="radioInput"
    class:input__container={selfContained}
    role="radiogroup"
    aria-labelledby="{name}__label">

    <p id="{name}__label" class="label">{label}</p>

    <div class="radioInput__inner">
        {#each options as option}
            <label>
                <input
                    class="visuallyHidden"
                    type="radio"
                    bind:group={value}
                    {name}
                    value={option.value} />
                <span>{option.name}</span>
            </label>
        {/each}
    </div>
</div>


<style lang="scss">
    .radioInput {
        display: flex;
        flex-direction: column;
        gap: var(--pad-4xs);
        position: relative;
        z-index: 1;

        padding: var(--pad-sm) var(--pad-xl);

        &__inner {
            display: flex;
            flex-flow: row nowrap;
            gap: var(--pad-lg);
        }

        label span {
            display: block;
            color: var(--clr-800);
            font-size: var(--font-xl);
            font-weight: 600;
            line-height: 1em;

            padding-top: var(--pad-xs);
            padding-bottom: var(--pad-3xs);
            border-bottom: var(--border) transparent;

            transition: color var(--trans-fast),
                        border var(--trans-fast);
        }

        input {
            &:checked ~ span {
                color: var(--clr-900);
                border-color: var(--clr-900);
            }
        }

        &:hover, &:focus {
            label span {
                color: var(--clr-850);
            }

            input:checked ~ span {
                color: var(--clr-1000);
                border-color: var(--clr-1000);
            }
        }
    }
</style>