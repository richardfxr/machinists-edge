<script lang="ts">
    /* === IMPORTS ============================ */
    import { motionPref } from "../../store/store";

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
    id="flute--back"
    class="illustration flute"
    class:motionRedcued={$motionPref === "reduced"}
    style="
        --position: {position};
        --zIndex: {zIndex};
        --top: {position === "relative" ? 0 : index * (100 / fluteArrayLength / 2)}%;
        --offsetY: {offsetY}%;"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.5 230">
    <path class="fill-100" transform="scale({scaleX}, {scaleY})" d="M.75,0C.75,75,62.25,155,62.25,230h18.5C80.75,155,19.25,75,19.25,0"/>
    <path class="stroke default" vector-effect="non-scaling-stroke" transform="scale({scaleX}, {scaleY})" d="M.75,0C.75,75,62.25,155,62.25,230"/>
    <path class="stroke default" vector-effect="non-scaling-stroke" transform="scale({scaleX}, {scaleY})" d="M19.25,0c0,75,61.5,155,61.5,230"/>
</svg>


<style lang="scss">
    #flute--back {
        position: var(--position);
        top: var(--top);
        right: 0;
        left: 0;
        z-index: var(--zIndex);

        transform: translateX(calc(50% - var(--scaleX) / 2 * 100%)) translateY(var(--offsetY));
        transition: transform var(--trans-fast);
    }

    /* === A11Y =============================== */
    .motionRedcued#flute--back {
        transition: none;
    }
</style>