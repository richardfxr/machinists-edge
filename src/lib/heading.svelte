<script lang="ts">
    /* === IMPORTS ============================ */
    import { motionPref } from "../store/store";
</script>


<div class="heading__container">
    <h1
        class="heading"
        class:motionReduced={$motionPref === "reduced"}>
        <slot></slot>
    </h1>
</div>



<style lang="scss">
    .heading {
        animation: moveDown calc(0.2s + var(--pageTransDuration)) cubic-bezier(0,.39,.15,1) 1;

        &__container {
            margin: var(--pad-5xl) 0;
            overflow: hidden;
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes moveDown {
        from { transform: translateY(-100%); }
        50% { transform: translateY(-100%); }
        to { transform: translateY(0%); }
    }

    @keyframes fade {
        from { opacity: 0; }
        50% { opacity: 0; }
        to { opacity: 1; }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-smtablet) {
        .heading__container {
            margin: var(--pad-5xl) var(--pad-hrz);
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .heading__container {
            margin: var(--pad-5xl) 0;
        }
    }

    @media only screen and (max-width: $breakpoint-smmobile) {
        .heading__container {
            margin: var(--pad-5xl) var(--pad-hrz);
        }
    }

    /* === A11Y =============================== */
    .motionReduced.heading {
        animation-name: fade;
    }
</style>