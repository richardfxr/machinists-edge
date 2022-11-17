<script lang="ts">

</script>


<div class="heading__container">
    <h1 class="heading">
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

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-smdtablet) {
        .heading__container {
            margin: var(--pad-5xl) var(--pad-xl);
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .heading__container {
            margin: var(--pad-5xl) 0;
        }
    }
</style>