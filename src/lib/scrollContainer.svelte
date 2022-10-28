<script lang="ts">
    /* === PROPS ============================== */
    export let contains: string;
    export let selfContained = false;
</script>


<div
    class="scrollContainer {contains}__container"
    class:input__container={selfContained}>
    <div class="scrollContainer__inner">
        <slot></slot>
    </div>
</div>


<style lang="scss">
    .scrollContainer {
        position: relative;
        width: 100%;
        overflow-y: auto;

        &__inner {
            display: inline-block;
            min-width: 100%;
        }
    }
</style>