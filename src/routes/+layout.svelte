<script lang="ts">
    /* === IMPORTS ============================ */
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { colorTheme } from "../store/store";
    import Header from "$lib/header.svelte";
    import Footer from "$lib/footer.svelte";
    import { motionPref } from "../store/store";

    /* === TYPES ============================== */
    interface animationOptions {
        animation: Function;
        duration: number;
        y?: number;
        delay?: number;
    }

    /* === FUNCTIONS ========================== */
    function animate(node: HTMLElement, options: animationOptions) {
        if ($motionPref === "reduced")
            return fade(node, { duration: 200 });
        else
            return options.animation(node, options);
    }
</script>


<svelte:head>
    <meta name="theme-color" content={$colorTheme === "light" ? "#fdf6ef" : "#0d0d0d"} />
</svelte:head>


<Header />

<!-- page transition -->
<div class="pageTransition__container">
    {#key $page.url.pathname}
        <main
            id="main"
            in:animate={{ animation: fade, duration: 300, delay: 1000 }}
            out:animate={{ animation: fade, duration: 300 }}>
            <slot></slot>
        </main>
    {/key}
</div>

<Footer />


<style lang="scss">
    .pageTransition__container {
        // wrapper grid to prevent scrollbar from appearing during page transitions
        display: grid;
        grid-template: 1fr / 1fr;
    }
    
    #main {
        // forces #main into wrapper grid to prevent scrollbar
        grid-row: 1;
        grid-column: 1;
        width: 100%;
        max-width: var(--max-width);

        padding: 0 var(--pad-hrz);
        margin: auto;
    }
</style>