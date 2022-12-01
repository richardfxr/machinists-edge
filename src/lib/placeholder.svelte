<div class="placeholder">
    <div class="box" role="presentation"></div>
    <p class="highlighted">Page under development</p>
    <p class="text--sm">You can view the progress of this project through its <a href="https://github.com/richardfxr/machinists-edge/commits/main" target="_blank" rel="noreferrer noopener">GitHub commits</a>. You can also find more projects on <a href="https://www.richardfxr.com/" target="_blank" rel="noreferrer noopener">my personal website</a>.</p>
</div>


<style lang="scss">
    .placeholder {
        // internal variables
        --_box-size: 80px;

        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;

        padding: var(--pad-xl) var(--pad-xl) var(--pad-4xl) var(--pad-xl);
        border: var(--border) var(--clr-300);

        .box {
            position: relative;
            width: var(--_box-size);
            height: var(--_box-size);

            margin-bottom: var(--pad-xl);
            border: var(--border) var(--clr-300);

            overflow: hidden;

            &::before, &::after {
                // two borders that form the cross
                content: "";
                position: absolute;
                top: calc(-1 * var(--_box-size));
                right: calc(50% - var(--border-width) / 2);
                bottom: calc(-1 * var(--_box-size));

                border-left: var(--border) var(--clr-300);
            }

            &::before {
                transform: rotate(45deg);
            }

            &::after {
                transform: rotate(-45deg);
            }
        }

        .highlighted {
            color: var(--clr-0);
            font-weight: 500;
            text-transform: uppercase;
            padding: 0 var(--pad-2xs);
            background-color: var(--clr-900);

            transition: background-color var(--trans-fast);
        }

        p.text--sm {
            padding-top: var(--pad-2xs);
        }
    }
</style>