<script lang="ts">
    /* === IMPORTS ============================ */
    import Logo from "./SVGs/logo.svelte";
</script>


<header id="header">
    <div id="header__inner">
        <Logo />
        <nav>
            <ul>
                <li><a href="#">Feed Rate</a></li>
                <li><a href="#">Tool length</a></li>
                <li><a href="#">Settings</a></li>
            </ul>
        </nav>
    </div>
</header>


<style lang="scss">
    #header {
        // internal variables
        --_pad-vrt: var(--pad-md);
        --_pad-hrz: var(--pad-hrz);
        --_logo-width: calc(60px * var(--scalor-main));

        max-width: var(--max-width);

        padding: 0 var(--_pad-hrz);
        margin: auto;

        overflow-x: auto;

        &__inner {
            display: flex;
            flex-flow: row nowrap;
            align-items: stretch;
            gap: var(--pad-md);
            min-width: 100%;
            width: max-content;

            border-bottom: var(--border) var(--clr-300);
        }

        :global(.logo) {
            flex-shrink: 0;
            width: var(--_logo-width);
            padding: var(--_pad-vrt) 0;
        }

        nav {
            margin-left: auto;

            ul{
                display: flex;
                flex-flow: row nowrap;
                align-items: stretch;
                height: 100%;

                li {
                    a {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        height: 100%;

                        font-size: var(--font-md);
                        font-weight: 500;
                        white-space: nowrap;
                        padding: 0 var(--pad-md);
                    }
                }
            }
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-smdtablet) {
        #header {
            // internal variables
            --_pad-hrz: var(--pad-md);
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        #header {
            // internal variables
            --_pad-hrz: var(--pad-hrz);
        }
    }
</style>