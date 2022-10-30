<script lang="ts">
	import ToolTip from "./toolTip.svelte";

    /* === PROPS ============================== */
    export let units: "RPM"| "IPM" | "in" | "SFPM" | "IPR";
    export let position: "top-left" | "top-right" | "bottom-left" | "bottom-right" = "top-left";

    /* === VARAIBLES ========================== */
    let fullName: string;

    switch (units) {
        case "RPM":
            fullName = "revolutions/minute";
            break;
        case "IPM":
            fullName = "inches/minute";
            break;
        case "in":
            fullName = "inches";
            break;
        case "SFPM":
            fullName = "surface feet/minute";
            break;
        case "IPR":
            fullName = "inches/revolution";
            break;
        default:
            fullName = "units";
    }

</script>


<abbr class="unitAbbr">
    {units}
    <ToolTip {position}>{fullName}</ToolTip>
</abbr>


<style lang="scss">
    .unitAbbr {
        // internal variables
        --_clr: var(--clr-800);
        --_clr-hover: var(--clr-900);

        position: relative;
        color: var(--_clr);
        font-family: "GeneralSans", sans-serif;
        font-size: var(--font-sm);
        font-weight: 400;
        line-height: 1em;

        transition: color var(--trans-fast);

        &:hover, &:focus-visible, &:active {
            color: var(--_clr-hover);

            :global(.toolTip) {
                opacity: 1;
            }
        }
    }
</style>