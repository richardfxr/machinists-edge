<script lang="ts">
    /* === IMPORTS ============================ */
    import { motionPref } from "../../store/store";

    /* === PROPS ============================== */
    export let animate = false;
</script>


<svg
    class:animated={animate}
    class="illustration logo"
    class:motionRedcued={$motionPref === "reduced"}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 103 61">
    <polygon class="fill-800" id="e--top" points="46.36 0 54 15 103 15 103 0 46.36 0"/>
    <polygon class="fill-800" id="e--middle" points="58.08 23 65.72 38 95 38 95 23 58.08 23"/>
    <polygon class="fill-800" id="e--bottom" points="69.8 46 77.44 61 103 61 103 46 69.8 46"/>
    <polygon class="fill-100" points="77.44 61 46.36 0 0 0 0 60.99 77.44 61"/>
    <polygon class="fill-800" id="m--right" points="20.55 0 51.63 61 68.46 61 37.38 0 20.55 0"/>
    <polygon class="fill-800" id="m--middle" points="0 0 0 10.33 25.82 61 42.65 61 11.57 0 0 0"/>
    <polygon class="fill-800" id="m--left" points="0 60.99 0 61 16.84 61 0 27.95 0 60.99"/>
</svg>


<style lang="scss">
    .logo.animated {
        #m {
            &--right {
                animation: mRightSwipe 0.2s cubic-bezier(0,.36,.13,1) 1;
            }

            &--middle {
                animation: mMiddleSwipe 0.32s cubic-bezier(.36,.22,.13,1) 1;
            }

            &--left {
                animation: mLeftSwipe 0.38s cubic-bezier(.61,.38,.37,1) 1;
            }
        }

        #e {
            &--top {
                animation: eTopSwipe 0.2s cubic-bezier(0,.36,.13,1) 1;
            }

            &--middle {
                animation: eMiddleSwipe 0.32s cubic-bezier(.36,.22,.13,1) 1;
            }

            &--bottom {
                animation: eBottomSwipe 0.38s cubic-bezier(.61,.38,.37,1) 1;
            }
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes mRightSwipe {
        from { transform: translate(-30%, -100%); }
        to { transform: translate(0%, 0%); }
    }

    @keyframes mMiddleSwipe {
        from { transform: translate(-30%, -100%); }
        15% { transform: translate(-30%, -100%); }
        to { transform: translate(0%, 0%); }
    }

    @keyframes mLeftSwipe {
        from { transform: translate(-30%, -100%); }
        30% { transform: translate(-30%, -100%); }
        to { transform: translate(0%, 0%); }
    }

    @keyframes eTopSwipe {
        from { transform: translateX(-70%); }
        to { transform: translateX(0%); }
    }

    @keyframes eMiddleSwipe {
        from { transform: translateX(-70%); }
        15% { transform: translateX(-70%); }
        to { transform: translateX(0%); }
    }

    @keyframes eBottomSwipe {
        from { transform: translateX(-70%); }
        30% { transform: translateX(-70%); }
        to { transform: translateX(0%); }
    }

    // motion reduced
    @keyframes mRightFade {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes mMiddleFade {
        from { opacity: 0; }
        15% { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes mLeftFade {
        from { opacity: 0; }
        30% { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes eTopFade {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes eMiddleFade {
        from { opacity: 0; }
        15% { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes eBottomFade {
        from { opacity: 0; }
        30% { opacity: 0; }
        to { opacity: 1; }
    }

    /* === A11Y =============================== */
    .motionRedcued.animated.logo {
        #m {
            &--right {
                animation-name: mRightFade;
            }

            &--middle {
                animation-name: mMiddleFade;
            }

            &--left {
                animation-name: mLeftFade;
            }
        }

        #e {
            &--top {
                animation-name: eTopFade;
            }

            &--middle {
                animation-name: eMiddleFade;
            }

            &--bottom {
                animation-name: eBottomFade;
            }
        }
    }
</style>