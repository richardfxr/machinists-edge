<script lang="ts">
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
    <tool-tip class="toolTip {position}" role="tooltip">{fullName}</tool-tip>
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

            .toolTip {
                opacity: 1;
            }
        }

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
    }
</style>