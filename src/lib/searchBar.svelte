<script lang="ts">
    /* === IMPORTS ============================ */
    import Search from "$lib/SVGs/search.svelte";

    /* === PROPS ============================== */
    export let label: string;
    export let placeholder: string;
    export let value: string;
    export let sticky: boolean = false;

    /* === BINDINGS =========================== */
    let searchInput: HTMLElement;
</script>


<form
    class="searchBar input__container"
    class:sticky
    on:submit|preventDefault={() => searchInput.blur()}>
    <label for="search__input">
        <Search />
        <span class="visuallyHidden">
            {label}
        </span>
    </label>

    <input
        bind:this={searchInput}
        type="search"
        {placeholder}
        id="search__input"
        bind:value
        autocomplete="off">
</form>


<style lang="scss">
    .searchBar {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: var(--pad-sm);
        position: relative;

        padding: 0 var(--input-pad-hrz);
        border: var(--border) var(--clr-300);
        outline-offset: calc(-1 * var(--border-width));
        background-color: var(--clr-100);

        label {
            :global(.icon) {
                display: block;
                fill: var(--clr-800);

                width: var(--font-xl);

                transition: fill var(--trans-fast);
            }
        }

        input {
            width: 100%;
            color: var(--clr-900);
            font-size: var(--font-2xl);
            font-weight: 600;
            line-height: 1em;

            padding: var(--pad-md) 0;

            transition: color var(--trans-fast);

            &::placeholder {
                color: var(--clr-700);

                transition: color var(--trans-fast);
            }
        }

        &.sticky {
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        &:hover, &:focus-within {
            label {
                :global(.icon) {
                    fill: var(--clr-900);
                }
            }

            input {
                color: var(--clr-1000);

                &::placeholder {
                    color: var(--clr-800);
                }
            }
        }
    }
</style>