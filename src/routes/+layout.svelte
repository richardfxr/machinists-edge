<script lang="ts">
    /* === IMPORTS ============================ */
    import type { LayoutData } from './$types';
    import { cubicInOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';
    import Header from "$lib/header.svelte";
    import Footer from "$lib/footer.svelte";
    import { colorTheme, motionPref } from "../store/store";

    /* === PROPS ============================== */
    export let data: LayoutData;

    /* === VARIABLES ========================== */
    const pageTransDuration = 250;
    const pageTransMaxY = 50;

    /* === TYPES ============================== */
    interface animationOptions {
        animation: Function;
        duration: number;
        y: number;
    }

    /* === FUNCTIONS ========================== */
    function flyOut(node: HTMLElement, options: animationOptions) {
		return {
			duration: options.duration,
			css: (t: number) => {
                const eased = cubicInOut(t);
				const easedInv = 1 - eased;

				return `
					transform: translateY(${easedInv * options.y}px);
                    opacity: ${eased * 1};
					`
			}
		};
	}

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

<!-- main page with page transition -->
{#key data.url.href}
    <main
        id="main"
        class:motionReduced={$motionPref === "reduced"}
        style="
            --pageTransDuration: {pageTransDuration}ms;
            --pageTransMaxY: {pageTransMaxY}px;
        "
        in:fade={{ duration: 0, delay: pageTransDuration}}
        out:animate={{ animation: flyOut, y: pageTransMaxY, duration: pageTransDuration }}>
        <slot></slot>
    </main>
{/key}

<Footer />


<style lang="scss">    
    #main {
        width: 100%;
        max-width: var(--max-width);

        padding: 0 var(--pad-hrz);
        margin: auto;

        :global(.page) {
            animation: moveUp calc(0.25s + var(--pageTransDuration)) cubic-bezier(0,.39,.15,1) 1;
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes moveUp {
        from { transform: translateY(var(--pageTransMaxY)); opacity: 0; }
        50% { transform: translateY(var(--pageTransMaxY)); opacity: 0; }
        to { transform: translateY(0px); opacity: 1; }
    }

    @keyframes fade {
        from { opacity: 0; }
        50% { opacity: 0; }
        to { opacity: 1; }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-smtablet) {
        #main {
            padding: 0;
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        #main {
            padding: 0 var(--pad-hrz);
        }
    }

    @media only screen and (max-width: $breakpoint-smmobile) {
        #main {
            padding: 0;
        }
    }

    /* === A11Y =============================== */
    .motionReduced#main {
        :global(.page) {
            animation-name: fade;
        }
    }
</style>