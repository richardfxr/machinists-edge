<script lang="ts">

</script>


<div class="heading__container">
    <h1 class="heading">
        <slot></slot>
    </h1>
</div>



<style lang="scss">
    .heading {
        animation: moveDown 0.3s ease-out 1;

        &__container {
            margin: var(--pad-5xl) 0;
            overflow: hidden;
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes moveDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0%); }
    }
</style>