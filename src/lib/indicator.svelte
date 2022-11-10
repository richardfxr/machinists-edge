<script lang="ts">
    /* === PROPS ============================== */
    export let type: "change" | "error";
    export let shown = false;
    export let positionAbsolute = false;
</script>


{#if type === "change"}
    <span
        class="indicator change"
        class:shown aria-hidden={!shown}
        class:absolute={positionAbsolute}>
            new
        </span>
{:else}
    <span
        class="indicator error"
        class:shown aria-hidden={!shown}
        class:absolute={positionAbsolute}>
            error
        </span>
{/if}


<style lang="scss">
    .indicator {
        pointer-events: none;
        display: block;
        position: relative;
        z-index: 2;

        color: var(--clr-0);
        font-weight: 500;
        line-height: 1em;

        padding: 0 var(--pad-3xs) var(--pad-5xs) var(--pad-3xs);

        opacity: 0;
        transition: opacity var(--trans-fast);

        &.shown {
            pointer-events: auto;
            opacity: 1;
        }

        &.absolute {
            position: absolute;
            z-index: 1;
            top: 0;
            right: 0;
        }

        &.change {
            border-radius: var(--border-radius-round);
            background-color: var(--clr-800);
        }

        &.error {
            background-color: var(--clr-error-800);
        }
    }
</style>