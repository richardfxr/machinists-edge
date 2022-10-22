<script>
    /* === PROPS ============================== */
    export let scaleX = 1;
    export let scaleY = 1;
    export let zIndex = 1;
</script>


<svg
    id="bit--center"
    class="illustration"
    style="--zIndex: {zIndex};"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81 920">
    <rect class="fill-100" transform="scale({scaleX}, {scaleY})" x="19" width="43" height="920"/>
    <line class="stroke default" vector-effect="non-scaling-stroke" transform="scale({scaleX}, {scaleY})" x1="19" x2="19" y2="920"/>
    <line class="stroke default" vector-effect="non-scaling-stroke" transform="scale({scaleX}, {scaleY})" x1="62" x2="62" y2="920"/>
</svg>


<style lang="scss">
    #bit--center {
        position: absolute;
        top: 0;
        z-index: var(--zIndex);
    }
</style>