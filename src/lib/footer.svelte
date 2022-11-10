<script lang="ts">
    /* === IMPORTS ============================ */
    import { colorTheme, hasColorTheme, motionPref, hasMotionPref } from "../store/store";
    import IconRadioInput from "./iconRadioInput.svelte";
    import Logo from "./SVGs/logo.svelte";

    /* === FUNCTIONS ========================== */
    /**
     * scrolls to top of window
    */
    function scrollToTop() {
        window.scrollTo(0, 0);
    }
</script>


<footer id="footer">
    <button
        class="button text--uppercase outlined"
        type="button"
        on:click={scrollToTop}>
        Back to top
    </button>

    <div class="quickSettings">
        <IconRadioInput
            label="theme"
            name="theme"
            bind:value={$colorTheme}
            options={[
                { name: "light theme", icon: "theme-light", value: "light" },
                { name: "dark theme", icon: "theme-dark", value: "dark" },
            ]}
            position="top-right"
            selfContained
            on:change={() => hasColorTheme.set(true)} />

        <IconRadioInput
            label="motion"
            name="motion"
            bind:value={$motionPref}
            options={[
                { name: "full motion", icon: "motion-full", value: "full" },
                { name: "reduced motion", icon: "motion-low", value: "reduced" },
            ]}
            position="top-left"
            selfContained
            on:change={() => hasMotionPref.set(true)} />
    </div>

    <div class="siteMap">
        <h2 id="siteMap__label">site map</h2>
        <ul aria-labelledby="siteMap__label">
            <li><a href="#">Feed Rate Calculator</a></li>
            <li><a href="#">Tool Length Calculator</a></li>
            <li><a href="#">G-code Chart</a></li>
            <li><a href="#">Tap & Clearance Chart</a></li>
            <li><a href="#">Settings</a></li>
        </ul>
    </div>

    <div class="info">
        <p class="text--sm"><a href="https://github.com/richardfxr/machinists-edge" target="_blank" rel="noopener noreferrer">Source code available on GitHub.</a></p>
        <p class="text--sm">Copyright © 2022 <a href="https://www.richardfxr.com/" target="_blank" rel="noopener noreferrer">Xiangrui Fu</a>. All rights reserved.</p>
        <div class="badge">
            <div class="logoAndName">
                <Logo />
                <p class="name">Machinist's<br> Edge</p>
            </div>
            <p class="version">v0.1.1 alpha</p>
        </div>
    </div>
</footer>


<style lang="scss">
    #footer {
        // internal variables
        --_pad-hrz: var(--pad-hrz);
        --_logo-width: calc(60px * var(--scalor-main));

        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto auto auto;
        grid-template-areas:
            "backToTop backToTop"
            "siteMap quickSettings"
            "siteMap info";
        gap: var(--pad-xl);
        max-width: var(--max-width);

        padding: var(--pad-7xl) var(--_pad-hrz) var(--pad-4xl) var(--_pad-hrz);
        margin: auto;

        :global(.button) {
            grid-area: backToTop;
            justify-self: center;
        }

        .quickSettings {
            grid-area: quickSettings;
            justify-self: end;
            align-self: start;
            display: flex;
            flex-flow: row wrap;

            border: var(--border) var(--clr-300);

            :global(#motion::before) {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                left: calc(-0.5 * var(--border-width));
                z-index: -1;

                border-left: var(--border) var(--clr-300);
            }
        }

        .siteMap {
            grid-area: siteMap;
            justify-self: start;
            align-self: end;
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            gap: var(--pad-md);

            h2 {
                color: var(--clr-0);
                font-size: var(--font-sm);
                font-weight: 500;
                line-height: 1em;

                padding: var(--pad-4xs) var(--pad-2xs);
                background-color: var(--clr-800);
            }

            ul {
                margin-bottom: calc(-1 * var(--pad-3xs));

                li a {
                    display: block;

                    color: var(--clr-800);
                    font-family: "ClashDisplay", sans-serif;
                    font-size: var(--font-md);
                    font-weight: 400;
                    line-height: 1em;
                    text-transform: uppercase;

                    padding: var(--pad-3xs) 0;

                    transition: color var(--trans-fast);

                    &:hover, &:focus {
                        color: var(--clr-900);
                    }
                }
            }
        }

        .info {
            grid-area: info;
            justify-self: end;
            align-self: end;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: var(--pad-xs);

            & > p {
                line-height: 1em;
                text-align: end;
            }

            .badge {
                display: flex;
                flex-flow: row-reverse wrap;

                border: var(--border) var(--clr-300);
                margin-top: var(--pad-3xs);

                .logoAndName, .version {
                    padding: var(--pad-2xs) var(--pad-md);
                }

                .name, .version {
                    color: var(--clr-800);
                    font-family: "ClashDisplay", sans-serif;
                    font-size: 1.2rem;
                    
                    line-height: 1em;
                    text-transform: uppercase;
                }

                .logoAndName {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    gap: var(--pad-sm);

                    border-left: var(--border) var(--clr-300);

                    :global(.logo) {
                        height: 2rem;
                    }

                    .name {
                        font-weight: 600;
                        // alignment compensation
                        margin-top: 0.04rem;
                    }
                }

                .version {
                    text-align: end;
                    font-weight: 400;
                    width: min-content;
                }
            }
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-smdtablet) {
        #footer {
            // internal variables
            --_pad-hrz: var(--pad-xl);
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        #footer {
            // internal variables
            --_pad-hrz: var(--pad-hrz);

            grid-template-columns: auto;
            grid-template-rows: auto auto auto auto;
            grid-template-areas:
                "backToTop"
                "quickSettings"
                "siteMap"
                "info";
            gap: var(--pad-3xl);

            .quickSettings {
                justify-self: center;
            }

            .info {
                justify-self: start;
                align-items: flex-start;

                & > p {
                    text-align: start;
                }

                .badge {
                    flex-flow: column nowrap;

                    .logoAndName {
                        border-left: none;
                        border-bottom: var(--border) var(--clr-300);
                    }

                    .version {
                        width: unset;
                        text-align: start;
                    }
                }
            }            
        }
    }
</style>