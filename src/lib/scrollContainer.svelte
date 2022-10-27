<script lang="ts">
    /* === PROPS ============================== */
    export let selfContained = false;
</script>


<div
    class="scrollContainer"
    class:input__container={selfContained}>
    <div class="scrollContainer__inner">
        <slot></slot>
    </div>
</div>


<style lang="scss">
    .scrollContainer {
        width: 100%;
        overflow-y: auto;
    }
</style>