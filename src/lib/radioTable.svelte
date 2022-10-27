<script lang="ts">
    /* === IMPORTS ============================ */
	import ScrollContainer from "./scrollContainer.svelte";

    /* === PROPS ============================== */
    export let label:string;
    export let name:string;
    export let options:{ "name": string, "value": string, "col1": number, "col2": number }[];
    export let value = options[0].value;
    export let tableHeadings:[string, string, string];
    export let selfContained = false;
</script>



<ScrollContainer {selfContained}>  
    <table
        class="radioTable"
        aria-labelledby="{name}__label">
        <caption class="label">{label}</caption>

        <thead>
            <tr>
                {#each tableHeadings as tableHeading}
                    <th scope="col" class="label">{tableHeading}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each options as option}
                <tr>
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
                        <label for="{option.value}">{option.col1}</label>
                    </td>
                    <td class="additional">
                        <label for="{option.value}">{option.col2}</label>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</ScrollContainer>


<style lang="scss">
    :global(.scrollContainer__inner) {
        padding: 0 var(--pad-xl);
    }

    .radioTable {
        display: table;
        position: relative;
        table-layout: fixed;
        width: 100%;

        border-collapse: collapse;

        caption {
            padding: var(--pad-sm) 0 var(--pad-4xs) 0;
        }

        thead {
            tr {
                padding: var(--pad-sm) 0;
                border-bottom: var(--border) var(--clr-300);
            }

            th {
                padding: var(--pad-md) calc(var(--pad-xl) / 2) var(--pad-sm) calc(var(--pad-xl) / 2);
                
                &:nth-child(1) {
                    width: 40%;
                    padding-left: 0;
                }

                &:nth-child(2) {
                    width: 30%;
                }

                &:nth-child(3) {
                    width: 30%;
                    padding-right: 0;
                }
            }
            
            
        }
    }
</style>