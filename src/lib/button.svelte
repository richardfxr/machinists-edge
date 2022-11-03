<script lang="ts">
    /* === PROPS ============================== */
    export let type: "text" | "text--uppercase" | "icon--md" | "icon--lg" = "text";
</script>


<button class="button {type}" on:click>
    <slot></slot>
</button>


<style lang="scss">
    .button {
        // internal variable
        --_color: var(--clr-800);

        color: var(--_color);
        font-size: var(--font-lg);
        font-weight: 500;
        line-height: 1em;

        padding: var(--pad-2xs) var(--pad-lg);
        border: var(--border) var(--clr-300);

        transition: color var(--trans-fast),
                    border-color var(--trans-fast);
        
        &:hover, &:focus-visible {
            --_color: var(--clr-900);
        }

        &:disabled {
            cursor: not-allowed;
            --_color: var(--clr-700);
        }

        &.text--uppercase {
            font-weight: 600;
            text-transform: uppercase;

            padding: var(--pad-xs) var(--pad-xl);
        }

        &.icon--md, &.icon--lg {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            
            color: var(--_color);
            line-height: 1em;

            padding: var(--pad-xs) 0;

            transition: color var(--trans-fast);            

            :global(.icon) {
                display: block;
                width: var(--_button-icon-size);
                fill: var(--_color);

                transition: fill var(--trans-fast);
            }

            span {
                display: block;
                white-space: nowrap;
            }
        }

        &.icon--md {
            gap: var(--pad-xs);
            font-size: var(--font-lg);
            font-weight: 500;
        }
    }
</style>