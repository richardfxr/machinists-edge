<script lang="ts">
    /* === IMPORTS ============================ */
    import { createEventDispatcher, tick, onMount } from 'svelte';
    import NewSave from "$lib/SVGs/newSave.svelte";
    import Save from "$lib/SVGs/save.svelte";
	import Eject from "$lib/SVGs/eject.svelte";
	import DeleteSave from "$lib/SVGs/deleteSave.svelte";

    /* === PROPS ============================== */
    export let loadedSave: string | null = null;
    export let hasChanges = false;
    export let loadedIndex = 1;
    export let nextIndex = 1;

    /* === BINDINGS =========================== */
    let dialog: any;
    let floppyDisk: any;

    /* === VARAIBLES ========================== */
    let newSave = false;
    let isSaving = false;
    console.log("hasChanges:", hasChanges);

    /* === REACTIVE DECLARATIONS ============== */
    $: isOpen = loadedSave !== null;
    $: loadedSave === null ? closeDialog() : showDialog();
    $: saveTitle = loadedSave === null ? "" : loadedSave;
    $: canSave = hasChanges || saveTitle !== loadedSave;

    /* === FUNCTIONS ========================== */
    function showDialog() {
        // return if dialog binding does not exist or if show() is not supported
        if (!dialog || typeof dialog.show !== "function") return;

        console.log("called showDialog()");
        dialog.show();
        isOpen = true;
    }

    function closeDialog() {
        // return if dialog binding does not exist or if close() is not supported
        if (!dialog || typeof dialog.close !== "function") return;

        dialog.close();
        newSave = false;
        isOpen = false;
    }

    const animationsComplete = (element: HTMLElement) =>
        Promise.allSettled(
            element.getAnimations().map(animation => 
            animation.finished))
    
    /* === EVENTS ============================= */
    const dispatch = createEventDispatcher();

    async function save() {
        // dispatch appropriate event
        if (newSave) {
            dispatch('save', {
                name: saveTitle,
            });
        } else {
            dispatch('update', {
                name: saveTitle
            });
        }
        
        newSave = false;
        canSave = false;
        // trigger save animation
        isSaving = true;

        await tick();
        await animationsComplete(floppyDisk);

        isSaving = false;
    }

    /* === LIFECYCLE FUNCS ==================== */
    onMount(() => {
		if (isOpen) {
            // show dialog without shifting focus
            dialog.setAttribute("open", true);
        };
	});
</script>


<div
    class="saveLoader"
    class:open={isOpen}
    class:saving={isSaving}>
    <h2 class="label">loaded save</h2>

    <div
        class="closedButtons"
        aria-hidden={isOpen}>
        <button
            id="newSaveButton"
            class="iconWithText"
            tabindex={isOpen ? -1 : 0}
            type="button"
            on:click={() => {
                newSave = true;
                canSave = true;
                showDialog();
            }}>
            <NewSave />
            <span>new save</span>
        </button>
        <a
            href="#"
            class="iconWithText"
            tabindex={isOpen ? -1 : 0}
            type="button">
            <Eject />
            <span>load save</span>
        </a>
    </div>

    <dialog
        class="saveDialog"
        bind:this={dialog}
        aria-hidden={!isOpen}>
        <form 
            method="dialog">
            <article class="loader">
                <div class="floppyDisk__container">
                    <div class="floppyDisk" bind:this={floppyDisk}>
                        <label for="savedTitle">
                            <div class="circle" role="presentation"></div>
                            <span class="label">save title</span>
                            <span
                                id="saved"
                                class:hidden={canSave}
                                aria-hidden={canSave}>
                                saved
                            </span>
                        </label>
                        <input
                            id="savedTitle"
                            tabindex={isOpen ? 0 : -1}
                            placeholder={newSave ? "save #" + nextIndex : "save #" + loadedIndex}
                            autocomplete="off"
                            type="text"
                            bind:value={saveTitle} />
                    </div>
                </div>
            </article>
            <footer class="actions">
                <button
                    id="save"
                    class="iconWithText"
                    value="confirm"
                    tabindex={isOpen ? 0 : -1}
                    disabled={!canSave}
                    on:click|preventDefault={save}>
                    <Save />
                    <span>save</span>
                </button>
                <button
                    class="iconWithText"
                    value="cancel"
                    tabindex={isOpen ? 0 : -1}
                    on:click|preventDefault={() => dispatch('eject')}>
                    <Eject />
                    <span>eject</span>
                </button>
                <button
                    class="iconWithText"
                    tabindex={isOpen ? 0 : -1}
                    on:click|preventDefault={() => dispatch('delete')}>
                    <DeleteSave />
                    <span>delete</span>
                </button>
            </footer>
        </form>
    </dialog>
</div>



<style lang="scss">
    .saveLoader {
        // internal variables
        --_pad-hrz: var(--pad-xl);
        --_pad-vrt: var(--pad-md);
        --_button-icon-size: var(--font-xl);
        --_loader-height: var(--pad-3xs);
        --_loader-seam-thickness: 3px;
        --_loader-offset: calc(-1 * var(--pad-3xs) - var(--pad-xs) - (var(--_button-icon-size) / 2));
        --_disk-width: 50%;
        --_disk-offset: 100px;
        --_disk-animation-duration: 0.3s;
        --_disk-pad-hrz: var(--pad-md);
        --_disk-circle-size: 500px;
        --_label-border-radius: 12px;
        --_gap: var(--pad-lg);

        position: relative;

        &.open {
            .closedButtons {
                opacity: 0;
                transition: opacity var(--trans-fast);
            }
        }

        &.saving {
            .saveDialog form .floppyDisk {
                animation: saveNudge 0.3s cubic-bezier(.42,0,.58,1) 1;

                label #saved {
                    transition: opacity var(--trans-fast);
                }
            }
        }

        h2 {
            padding:
                var(--_pad-vrt)
                var(--_pad-hrz)
                0
                var(--_pad-hrz);
            border-left: var(--border) var(--clr-300);
            border-right: var(--border) var(--clr-300);
        }

        .closedButtons {
            display: flex;
            flex-flow: row wrap;
            row-gap: 0;
            column-gap: var(--pad-2xl);
            position: absolute;
            top: calc(var(--_pad-vrt) + var(--font-sm));
            left: calc(var(--_disk-width) + var(--pad-lg));

            opacity: 1;

            transition: opacity var(--trans-fast) var(--trans-duration-fast);
        }

        .saveDialog {
            display: grid;
            position: relative;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            border: none;
            color: var(--clr-800);
            
            padding: 0;
            margin: 0;
            background-color: transparent;

            &:not([open]) {
                pointer-events: none;
                
                form {
                    .loader::after {
                        border-color: var(--clr-300);
                    }

                    .floppyDisk {
                        transform: translateY(0px);
                        opacity: 0;

                        // eject transitions
                        transition: transform var(--_disk-animation-duration) cubic-bezier(.38,0,.72,.68),
                                    opacity var(--_disk-animation-duration) cubic-bezier(.27,0,1,.71);
                    }

                    .actions > .iconWithText {
                        opacity: 0;
                        transition: opacity var(--trans-fast);
                    }
                }
            }

            form {
                display: flex;
                flex-flow: column-reverse nowrap;

                .loader {
                    // loader bar at top of floppy disk that is always visible
                    position: relative;
                    z-index: 200;
                    width: var(--_disk-width);

                    padding: 0 calc(var(--_pad-hrz) + var(--pad-md));

                    // shift .loader up so it is centered with .actions
                    margin-top: var(--_loader-offset);

                    &::before {
                        // outline
                        content: "";
                        position: absolute;
                        top: calc(-1 * var(--_loader-height));
                        right: var(--_pad-hrz);
                        left: var(--_pad-hrz);
                        z-index: 1;
                        height: calc(2 * var(--_loader-height));

                        border: var(--border) var(--clr-300);
                        border-radius: var(--border-radius-round);
                    }

                    &::after {
                        // seam
                        content: "";
                        position: absolute;
                        top: calc(-0.5 * var(--_loader-seam-thickness));
                        right: calc(var(--_pad-hrz) + var(--pad-2xs));
                        left: calc(var(--_pad-hrz) + var(--pad-2xs));
                        z-index: 2;

                        border-top: solid var(--_loader-seam-thickness) var(--clr-900);

                        transition: border-color var(--_disk-animation-duration) ease;
                    }
                }

                .floppyDisk {
                    position: relative;
                    z-index: 2;

                    border: var(--border) var(--clr-700);
                    border-top: none;
                    background: linear-gradient(var(--clr-floppy-1), var(--clr-floppy-2));

                    transform: translateY(calc(-1 * var(--_disk-offset)));
                    opacity: 1;

                    transition: transform var(--_disk-animation-duration) cubic-bezier(.21,.4,.58,1),
                                opacity var(--_disk-animation-duration) cubic-bezier(0,.23,.17,1);

                    &__container {
                        overflow: hidden;
                    }

                    label {
                        display: flex;
                        flex-flow: row wrap;
                        align-items: baseline;
                        justify-content: space-between;
                        gap: var(--pad-2xs);

                        padding:
                            calc(var(--_disk-offset) + var(--pad-2xs))
                            var(--pad-2xs)
                            var(--pad-2xs)
                            var(--_disk-pad-hrz);
                        border: var(--border) var(--clr-300);
                        border-top: none;
                        border-bottom-right-radius: var(--_label-border-radius);
                        border-bottom-left-radius: var(--_label-border-radius);
                        margin: 0 var(--_disk-pad-hrz);

                        .circle {
                            // floppy disk circle visible only during transitions
                            position: absolute;
                            top: calc(-0.82 * var(--_disk-circle-size));
                            left: calc((100% - var(--_disk-circle-size)) / 2);
                            width: var(--_disk-circle-size);
                            height: var(--_disk-circle-size);

                            border: var(--border) var(--clr-300);
                            border-radius: var(--border-radius-round);

                            &::before, &::after {
                                content: "";
                                position: absolute;
                                top: var(--_offset);
                                right: var(--_offset);
                                bottom: var(--_offset);
                                left: var(--_offset);
                            }

                            &::before {
                                // clr-700 border
                                --_offset: 1.5%;
                                
                                border: var(--border) var(--clr-700);
                                border-radius: var(--border-radius-round);
                            }

                            &::after {
                                // clr-700 circle
                                --_offset: 4%;
                                
                                border-radius: var(--border-radius-round);
                                background-color: var(--clr-700);
                            }
                        }

                        .label, #saved {
                            display: block;

                            color: var(--clr-800);
                            font-size: var(--font-sm);
                            font-weight: 400;
                            line-height: 1em;
                        }

                        #saved {
                            color: var(--clr-0);
                            font-weight: 500;
                            padding: var(--pad-4xs) var(--pad-2xs);
                            border-radius: var(--border-radius-round);
                            background-color: var(--clr-800);
                            
                            opacity: 1;
                            transition: opacity 0s linear 0.15s;

                            &.hidden {
                                opacity: 0;
                            }
                        }
                    }
                    
                    input {
                        width: 100%;
                        color: var(--clr-900);
                        font-size: var(--font-xl);
                        font-weight: 600;
                        line-height: 1em;
                        
                        padding:
                            var(--pad-2xs)
                            var(--_disk-pad-hrz)
                            var(--pad-2xl)
                            var(--_disk-pad-hrz);
                        border: none;

                        &::placeholder {
                            color: var(--clr-700);
                        }
                    }
                }

                .actions {
                    display: flex;
                    flex-flow: row wrap;
                    row-gap: 0;
                    column-gap: var(--pad-2xl);

                    padding:
                        0
                        var(--_pad-hrz)
                        var(--pad-3xs)
                        calc(var(--_disk-width) + var(--_gap));
                    border: var(--border) var(--clr-300);
                    border-top: none;

                    opacity: 1;

                    transition: opacity var(--trans-fast);

                    #save {
                        --_color: var(--clr-900);

                        &:hover, &:focus {
                            --_color: var(--clr-1000);
                        }

                        &:disabled {
                            --_color: var(--clr-700);
                        }
                    }
                }
            }
        }
    }

    /* === BREAKPOINTS ======================== */
    @media only screen and (max-width: $breakpoint-smdesktop) {
        .saveLoader {
            // internal variables
            --_disk-offset: 90px;
            --_disk-circle-size: 450px;
        }
    }

    @media only screen and (max-width: $breakpoint-tablet) {
        .saveLoader {
            // internal variables
            --_disk-width: 55%;
            --_disk-offset: 80px;
            --_disk-circle-size: 400px;
        }
    }

    @media only screen and (max-width: $breakpoint-smdtablet) {
        .saveLoader {
            // internal variables
            --_disk-width: 70%;
            --_disk-offset: 90px;
            --_disk-circle-size: 450px;

            h2 {
                border: none;
            }

            .closedButtons {
                top: calc(var(--_pad-vrt) + var(--font-sm) + var(--pad-xs));
                right: var(--_pad-hrz);
                left: var(--_pad-hrz);
            }

            .saveDialog form {
                .loader {
                    transform: translateY(calc(-1 * var(--pad-2xl)));
                }

                .actions {
                    padding:
                        var(--pad-xs)
                        var(--_pad-hrz)
                        var(--pad-3xl)
                        var(--_pad-hrz);
                    border-right: none;
                    border-left: none;
                }
            } 
        }
    }

    @media only screen and (max-width: $breakpoint-mobile) {
        .saveLoader {
            // internal variables
            --_disk-width: 100%;
            --_disk-offset: 50px;
            --_disk-circle-size: 250px;

            h2 {
                border-left: var(--border) var(--clr-300);
                border-right: var(--border) var(--clr-300);
            }

            .closedButtons {
                top: calc(var(--_pad-vrt) + var(--font-sm) + var(--pad-xs));
                right: var(--_pad-hrz);
                left: var(--_pad-hrz);
            }

            .saveDialog form {
                .loader {
                    padding: 0 calc(var(--_pad-hrz) + var(--pad-2xs));
                    transform: translateY(calc(-1 * var(--pad-2xl)));

                    &::before {
                        right: calc(var(--_pad-hrz) - var(--pad-2xs));
                        left: calc(var(--_pad-hrz) - var(--pad-2xs));
                    }

                    &::after {
                        right: var(--_pad-hrz);
                        left: var(--_pad-hrz);
                    }
                }

                .actions {
                    padding:
                        var(--pad-xs)
                        var(--_pad-hrz)
                        var(--pad-3xl)
                        var(--_pad-hrz);
                    border-right: var(--border) var(--clr-300);
                    border-left: var(--border) var(--clr-300);
                }
            }
        }
    }

    /* === ANIMATIONS ========================= */
    @keyframes saveNudge {
        from { transform: translateY(calc(-1 * var(--_disk-offset))); }
        50% { transform: translateY(calc(-1 * var(--_disk-offset) - 2 * var(--pad-2xs) - var(--font-sm))); }
        to { transform: translateY(calc(-1 * var(--_disk-offset))); }
    }
</style>