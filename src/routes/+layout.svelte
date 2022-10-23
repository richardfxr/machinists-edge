<script lang="ts">
    /* === IMPORTS ============================ */
    import Header from "$lib/header.svelte";
</script>


<Header />

<main id="main">
    <slot></slot>
</main>


<style lang="scss">
    #main {
        max-width: var(--max-width);

        padding: 0 var(--pad-hrz);
        margin: auto;
    }
</style>