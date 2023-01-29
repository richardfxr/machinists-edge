<script lang="ts">
    /* === IMPORTS ============================ */
	import Indicator from "./indicator.svelte";
    import ScrollContainer from "./scrollContainer.svelte";
	import UnitAbbr from "./unitAbbr.svelte";

    /* === PROPS ============================== */
    export let label: string;
    export let name: string;
    export let options: {
        name: string,
        value: string,
        col1: number,
        col2: number,
        hidden?: boolean
    }[];
    export let value = options[0].value;
    export let change = false;
    export let tableHeadings: [string, string, string];
    export let selfContained = false;
</script>



<ScrollContainer {selfContained} contains="radioTable">  
    <table
        class="table radioTable"
        class:change
        aria-labelledby="{name}__label">
        <caption>
            <div class="sticky">
                <span class="label">{label}</span>
                <Indicator type="change" shown={change} />
            </div>
        </caption>

        <thead>
            <tr>
                {#each tableHeadings as tableHeading}
                    <th scope="col" class="label">{tableHeading}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each options as option}
                <tr
                    class:selected={option.value === value}
                    class:visuallyHidden={option.hidden}>
                    <th scope="row" class="name">
                        <label>
                            <input
                                id="{option.value}"
                                class="visuallyHidden"
                                type="radio"
                                bind:group={value}
                                {name}
                                value={option.value}/>
                            <span>{option.name}</span>
                        </label>
                    </th>
                    <td class="additional">
                        <label for="{option.value}">
                            {option.col1}
                            <UnitAbbr units="SFPM" />
                        </label>
                    </td>
                    <td class="additional">
                        <label for="{option.value}">
                            {option.col2}
                            <UnitAbbr units="IPR" />
                        </label>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</ScrollContainer>


<style lang="scss">
    :global {
        .radioTable__container .scrollContainer__inner {
            padding: 0 var(--input-pad-hrz) var(--input-pad-vrt) var(--input-pad-hrz);
        }
        
        .radioTable__container {
            &:hover, &:focus {
                caption .label {
                    color: var(--clr-900);
                }
            }
        }
    }

    .radioTable.table {
        // internal variables
        --_indicator-size: 0.8rem;

        thead {
            th {                
                &:nth-child(1) {
                    width: 40%;
                    padding-left: calc(var(--_indicator-size) + var(--pad-sm));
                }

                &:nth-child(2) {
                    width: 30%;
                }

                &:nth-child(3) {
                    width: 30%;
                    padding-right: 0;
                    margin-right: var(--pad-xl);
                }
            }
        }

        tbody {
            tr {
                font-size: var(--font-2xl);

                &.selected {
                    border-color: var(--clr-900);

                    th label {
                        color: var(--clr-900);

                        &::before {
                            background-color: var(--clr-900);
                            border-color: var(--clr-900);
                        }
                    }

                    td {
                        color: var(--clr-900);
                    }

                    &:hover {
                        border-color: var(--clr-1000);

                        th label {
                            color: var(--clr-1000);

                            &::before {
                                background-color: var(--clr-1000);
                                border-color: var(--clr-1000);
                            }
                        }

                        td {
                            color: var(--clr-1000);
                        }
                    }
                }

                &:hover {
                    // prevent bottom-border from highlighting on hover
                    border-color: var(--clr-300);

                    th label {
                        color: var(--clr-900);

                        &::before {
                            border-color: var(--clr-900);
                        }
                    }

                    td {
                        color: var(--clr-900);
                    }
                }
            }

            th {
                padding: 0;

                label {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: var(--pad-sm);

                    color: var(--clr-800);
                    font-size: var(--font-2xl);
                    font-weight: 600;
                    line-height: 1em;

                    padding: var(--pad-md) calc(var(--_pad-col) / 2) var(--pad-md) 0;

                    transition: color var(--trans-fast),
                                border var(--trans-fast);

                    &::before {
                        content: "";
                        width: var(--_indicator-size);
                        height: var(--_indicator-size);

                        background-color: var(--clr-100);
                        border: var(--border) var(--clr-800);
                        border-radius: var(--border-radius-round);

                        transition: border var(--trans-fast),
                                    background-color var(--trans-fast);
                    }
                }
            }

            td {
                font-family: "ClashDisplay", sans-serif;
                font-weight: 400;

                padding: 0;

                label {
                    display: block;
                    white-space: nowrap;
                    cursor: pointer;
                    width: 100%;
                    padding: var(--pad-md) calc(var(--_pad-col) / 2) var(--pad-md) calc(var(--_pad-col) / 2);
                }
            }
        }
    }
</style>