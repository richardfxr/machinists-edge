<script lang="ts">
    /* === PROPS ============================== */
    export let scaleX = 1;
    export let scaleY = 1;
    export let position = "relative";
    export let zIndex = 1;
    export let fluteArrayLength = 1;
    export let index = 0;
    export let offsetY = 0;
</script>


<svg
    id="flute--front"
    class="illustration flute"
    style="
        --position: {position};
        --zIndex: {zIndex};
        --top: {position === "relative" ? 0 : index * (100 / fluteArrayLength / 2)}%;
        --offsetY: {offsetY}%;"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.5 230">
    <path class="fill-100" transform="scale({scaleX}, {scaleY})" d="M19.25,230C19.25,155,80.75,75,80.75,0h-18.5C62.25,75,.75,155,.75,230"/>
    <path class="stroke default" vector-effect="non-scaling-stroke" transform="scale({scaleX}, {scaleY})" d="M80.75,0C80.75,75,.75,155,.75,230"/>
    <path class="stroke default" vector-effect="non-scaling-stroke" transform="scale({scaleX}, {scaleY})" d="M62.25,0C62.25,75,.75,155,.75,230"/>
    <path class="stroke default" vector-effect="non-scaling-stroke" transform="scale({scaleX}, {scaleY})" d="M80.75,0c0,75-61.5,155-61.5,230"/>
</svg>


<style lang="scss">
    #flute--front {
        position: var(--position);
        top: var(--top);
        right: 0;
        left: 0;
        z-index: var(--zIndex);

        transform: translateX(calc(50% - var(--scaleX) / 2 * 100%)) translateY(var(--offsetY));
        transition: transform var(--trans-fast);
    }
</style>