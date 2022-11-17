<script lang="ts">
    /* === IMPORTS ============================ */
    import { page } from '$app/stores';
    import Logo from "./SVGs/logo.svelte";
</script>


<header id="header">
    <div id="header__inner">
        <Logo animate />
        <nav>
            <ul>
                <li>
                    <a
                    href="/"
                    class:active={$page.url.pathname === "/"}
                    aria-current={$page.url.pathname === "/"}>
                    Feed rate
                    </a>
                </li>
                <li>
                    <a
                    href="/tool-length"
                    class:active={$page.url.pathname === "/tool-length"}
                    aria-current={$page.url.pathname === "/tool-length"}>
                    Tool length
                    </a>
                </li>
                <li>
                    <a
                    href="/g-code"
                    class:active={$page.url.pathname === "/g-code"}
                    aria-current={$page.url.pathname === "/g-code"}>
                    G-code
                    </a>
                </li>
                <li>
                    <a
                    href="/tap-and-clearance"
                    class:active={$page.url.pathname === "/tap-and-clearance"}
                    aria-current={$page.url.pathname === "/tap-and-clearance"}>
                    Tap & clearance
                    </a>
                </li>
                <li>
                    <a
                    href="/settings"
                    class:active={$page.url.pathname === "/settings"}
                    aria-current={$page.url.pathname === "/settings"}>
                    Settings
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</header>


<style lang="scss">
    #header {
        // internal variables
        --_pad-vrt: var(--pad-xl);
        --_pad-hrz: var(--pad-hrz);
        --_logo-width: calc(60px * var(--scalor-main));
        --_nav-dot-size: calc(4px * var(--scalor-main));

        max-width: var(--max-width);

        padding: 0 var(--_pad-hrz);
        margin: auto;

        overflow-x: auto;
        overflow-y: hidden;

        &__inner {
            display: flex;
            flex-flow: row nowrap;
            align-items: stretch;
            gap: var(--pad-xl);
            min-width: 100%;
            width: max-content;

            border-bottom: var(--border) var(--clr-300);

            animation: moveDown 0.25s cubic-bezier(.06,.35,.49,1) 1;
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
                    margin-bottom: calc(-1 * var(--border-width));

                    a {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        position: relative;
                        height: 100%;

                        font-size: var(--font-md);
                        font-weight: 500;
                        white-space: nowrap;

                        padding: 0 var(--pad-xl);
                        border-bottom: var(--border) transparent;
                        margin-bottom: calc(-1 * var(--border-width));

                        transition: color var(--trans-fast),
                                    border-color var(--trans-fast);
                        animation: fade 0.35s ease-in 1;

                        &:hover, &:focus {
                            color: var(--clr-900);
                        }

                        &::before, &::after {
                            content: "";
                            display: block;
                            position: absolute;
                            bottom: var(--_nav-dot-size);
                            width: var(--_nav-dot-size);
                            height: var(--_nav-dot-size);

                            background-color: transparent;

                            transition: background-color var(--trans-fast);
                        }

                        &::before {
                            left: 0;
                        }

                        &::after {
                            right: 0;
                        }

                        &.active {
                            color: var(--clr-900);
                            border-color: var(--clr-900);

                            &:hover, &:focus {
                                color: var(--clr-1000);
                                border-color: var(--clr-1000);

                                &::before, &::after {
                                background-color: var(--clr-1000);
                            }
                            }

                            &::before, &::after {
                                background-color: var(--clr-900);
                            }
                        }
                    }
                }
            }
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes moveDown {
        from { transform: translateY(-50%); }
        to { transform: translateY(0%); }
    }

    @keyframes fade {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-smdtablet) {
        #header {
            // internal variables
            --_pad-hrz: var(--pad-xl);
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        #header {
            // internal variables
            --_pad-hrz: var(--pad-hrz);
        }
    }
</style>