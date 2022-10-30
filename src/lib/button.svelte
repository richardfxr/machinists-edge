<script lang="ts">
    /* === PROPS ============================== */
    export let type: "text" | "text--uppercase" = "text";
</script>


<button class="button {type}" on:click>
    <slot></slot>
</button>


<style lang="scss">
    .button {
        color: var(--clr-800);
        font-size: var(--font-lg);
        font-weight: 500;
        line-height: 1em;

        padding: var(--pad-2xs) var(--pad-lg);
        border: var(--border) var(--clr-300);

        transition: color var(--trans-fast),
                    border-color var(--trans-fast);
        
        &:hover, &:focus-visible {
            color: var(--clr-900);
            border-color: var(--clr-800);
        }

        &.text--uppercase {
            font-weight: 600;
            text-transform: uppercase;

            padding: var(--pad-xs) var(--pad-xl);
        }
    }
</style>