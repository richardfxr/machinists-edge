<script lang="ts">
    /* === PROPS ============================== */
    export let position: "top-left" | "top-right" | "bottom-left" | "bottom-right" = "top-left";
</script>


<tool-tip class="toolTip {position}" role="tooltip">
    <slot></slot>
</tool-tip>


<style lang="scss">
    .toolTip {
        pointer-events: none;
        user-select: none;
        position: absolute;
        z-index: 1;
        inline-size: max-content;

        color: var(--clr-900);
        font-weight: 400;

        padding: var(--pad-3xs) var(--pad-xs);
        background-color: var(--clr-200);

        opacity: 0;
        transition: opacity var(--trans-fast);

        &.top-left {
            right: 0;
            bottom: 120%;
        }

        &.top-right {
            left: 0;
            bottom: 120%;
        }

        &.bottom-left {
            right: 0;
            top: 120%;
        }

        &.bottom-right {
            left: 0;
            top: 120%;
        }
    }
</style>