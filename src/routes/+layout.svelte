<script lang="ts">
    /* === IMPORTS ============================ */
    import { colorTheme } from "../store/store";
    import Header from "$lib/header.svelte";
    import Footer from "$lib/footer.svelte";
</script>


<svelte:head>
    <meta name="theme-color" content={$colorTheme === "light" ? "#fdf6ef" : "#0d0d0d"} />
</svelte:head>


<Header />

<main id="main">
    <slot></slot>
</main>

<Footer />


<style lang="scss">
    #main {
        max-width: var(--max-width);

        padding: 0 var(--pad-hrz);
        margin: auto;
    }
</style>