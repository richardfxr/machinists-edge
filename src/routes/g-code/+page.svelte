<script lang="ts">
    /* === IMPORTS ============================ */
    import { writable } from 'svelte/store';
    import {flip} from 'svelte/animate';
    import { slide, fade } from 'svelte/transition';
    import Heading from "$lib/heading.svelte";
    import ScrollContainer from "$lib/scrollContainer.svelte";
    import SearchBar from '$lib/searchBar.svelte';
    import { motionPref } from "../../store/store";

    /* === VARAIBLES ========================== */
    interface code {
        "code": string,
        "desc": string
    };

    const gCodes: code[] = [
        {"code": "G00", "desc": "Rapid repositioning"},
        {"code": "G01", "desc": "Linear interpolation"},
        {"code": "G02", "desc": "Clockwise circular/helical interpolation"},
        {"code": "G03", "desc": "Counterclockwise circular/helical interpolation"},
        {"code": "G04", "desc": "Dwell"},
        {"code": "G10", "desc": "Coordinate system origin setting"},
        {"code": "G12", "desc": "Clockwise circular pocket"},
        {"code": "G13", "desc": "Counterclockwise circular pocket"},
        {"code": "G15", "desc": "Switch to Cartesian coordinates"},
        {"code": "G16", "desc": "Switch to polar coordinates"},
        {"code": "G17", "desc": "XY plane selection"},
        {"code": "G18", "desc": "ZX plane selection"},
        {"code": "G19", "desc": "YZ plane selection"},
        {"code": "G20", "desc": "Programming in inches"},
        {"code": "G21", "desc": "Programming in millimeters"},
        {"code": "G28", "desc": "Return to home position (machine zero)"},
        {"code": "G28.1", "desc": "Reference axes"},
        {"code": "G30", "desc": "Return to secondary home position (machine zero)"},
        {"code": "G31", "desc": "Straight probe"},
        {"code": "G40", "desc": "Cancel cutter radius compensation"},
        {"code": "G41", "desc": "Start cutter radius compensation left"},
        {"code": "G42", "desc": "Start cutter radius compensation right"},
        {"code": "G43", "desc": "Apply tool length offset"},
        {"code": "G49", "desc": "Cancel tool length offset"},
        {"code": "G50", "desc": "Reset all scale factors to 1.0"},
        {"code": "G51", "desc": "Set axis data input scale factors"},
        {"code": "G52", "desc": "Temporary coordinate system offsets"},
        {"code": "G53", "desc": "Move in absolute machine coordinate system"},
        {"code": "G54", "desc": "Use fixture offset 1"},
        {"code": "G55", "desc": "Use fixture offset 2"},
        {"code": "G56", "desc": "Use fixture offset 3"},
        {"code": "G57", "desc": "Use fixture offset 4"},
        {"code": "G58", "desc": "Use fixture offset 5"},
        {"code": "G59", "desc": "Use fixture offset 6/use general fixture number"},
        {"code": "G61", "desc": "Exact stop mode"},
        {"code": "G64", "desc": "Constant velocity mode"},
        {"code": "G68", "desc": "Rotate coordinate system"},
        {"code": "G69", "desc": "Turn off coordinate system rotation"},
        {"code": "G73", "desc": "Canned cycle - peck drilling (high-speed)"},
        {"code": "G80", "desc": "Cancel canned cycle"},
        {"code": "G81", "desc": "Canned cycle - drilling"},
        {"code": "G82", "desc": "Canned cycle - drilling with dwell"},
        {"code": "G83", "desc": "Canned cycle - peck drilling (full retraction)"},
        {"code": "G85", "desc": "Canned cycle - boring (no dwell, feed out)"},
        {"code": "G86", "desc": "Canned cycle - boring (spindle stop, rapid out)"},
        {"code": "G88", "desc": "Canned cycle - boring (spindle stop, manual out)"},
        {"code": "G89", "desc": "Canned cycle - boring (dwell, feed out)"},
        {"code": "G90", "desc": "Absolute distance mode"},
        {"code": "G91", "desc": "Incremental distance mode"},
        {"code": "G92", "desc": "Offset coordinates and set parameters"},
        {"code": "G92.x", "desc": "Cancel G92 etc."},
        {"code": "G93", "desc": "Inverse time feed mode"},
        {"code": "G94", "desc": "Feed per minute mode"},
        {"code": "G95", "desc": "Feed per revolution mode"},
        {"code": "G98", "desc": "Initial level return after canned cycle"},
        {"code": "G99", "desc": "R-point level return after canned cycle"},
    ];

    const mCodes: code[] = [
        {"code": "M00", "desc": "Program stop"},
        {"code": "M01", "desc": "Optional program stop"},
        {"code": "M02", "desc": "Program end"},
        {"code": "M03", "desc": "Rotate spindle clockwise"},
        {"code": "M04", "desc": "Rotate spindle counterclockwise"},
        {"code": "M05", "desc": "Stop spindle"},
        {"code": "M06", "desc": "Tool change (by two macros)"},
        {"code": "M07", "desc": "Coolant on (mist)"},
        {"code": "M08", "desc": "Coolant on (flood)"},
        {"code": "M09", "desc": "Coolant off"},
        {"code": "M30", "desc": "Program end and rewind"},
        {"code": "M47", "desc": "Repeat program from first line"},
        {"code": "M48", "desc": "Enable speed and feed override"},
        {"code": "M49", "desc": "Disable speed and feed override"},
        {"code": "M98", "desc": "Call subroutine"},
        {"code": "M99", "desc": "Return from subroutine/repeat"},
        {"code": "M871", "desc": "Tapping cycle 1"},
        {"code": "M872", "desc": "Tapping cycle 2"},
        {"code": "M873", "desc": "Tapping cycle 3"},
        {"code": "M9981", "desc": "Move to tool change position"},
    ];

    const searchTerm = writable("");

    let filteredGCodes: code[] = gCodes;
    let filteredMCodes: code[] = mCodes;

    /* === REACTIVE DECLARATIONS ============== */
    // call searchCodes() every time $searchTerm changes
    $: ($searchTerm || $searchTerm === "") && searchCodes($searchTerm);

    /* === FUNCTIONS ========================== */
    function animate(node: HTMLElement, options: { animation: Function, duration: number, delay?: number }) {
        if ($motionPref === "reduced")
            return fade(node, { duration: 200 });
        else
            return options.animation(node, options);
    }

    function searchCodes(searchTerm: string) {
        filteredGCodes = gCodes.filter(gCode => {
            const codeMatch = gCode.code.toLowerCase().includes(searchTerm.toLowerCase());
            const descMatch = gCode.desc.toLowerCase().includes(searchTerm.toLowerCase());
            return codeMatch || descMatch;
        });

        filteredMCodes = mCodes.filter(mCode => {
            const codeMatch = mCode.code.toLowerCase().includes(searchTerm.toLowerCase());
            const descMatch = mCode.desc.toLowerCase().includes(searchTerm.toLowerCase());
            return codeMatch || descMatch;
        });
    }
</script>


<svelte:head>
    <title>G- & M-code Charts | Machinist's Edge</title>
    <meta
        name="description"
        content="A list of common G- and M-codes for reference."
    />
</svelte:head>


<Heading>G- & M-code Charts</Heading>

<div class="page gCode">
    <SearchBar
        label="search codes"
        placeholder="Search codes"
        bind:value={$searchTerm}
        sticky />

    <ScrollContainer contains="gCodeTable">
        <table class="table">
            <caption class="label">G-codes</caption>

            {#if $searchTerm !== "" && filteredGCodes.length === 0}
                <p class="noResult" in:animate={{ animation: slide, duration: 200, delay: 150 }}>
                    <span>no results</span>
                </p>
            {:else}
                <thead transition:animate={{ animation: slide, duration: 300 }}>
                    <tr>
                        <th scope="col" class="label">code</th>
                        <th scope="col" class="label">description</th>
                    </tr>
                </thead>
                <tbody transition:animate={{ animation: slide, duration: 300 }}>
                    {#each filteredGCodes as {code, desc} (code)}
                        <tr
                            transition:animate|local={{ animation: fade, duration: 200 }}>
                            <th scope="row" class="code">{code}</th>
                            <td class="desc">{desc}</td>
                        </tr>
                    {/each}
                </tbody>
            {/if}
        </table>
    </ScrollContainer>

    <ScrollContainer contains="mCodeTable">
        <table class="table">
            <caption class="label">M-codes</caption>

            {#if $searchTerm !== "" && filteredMCodes.length === 0}
                <p class="noResult" in:animate={{ animation: slide, duration: 200, delay: 150 }}>
                    <span>no results</span>
                </p>
            {:else}
                <thead transition:animate={{ animation: slide, duration: 300 }}>
                    <tr>
                        <th scope="col" class="label">code</th>
                        <th scope="col" class="label">description</th>
                    </tr>
                </thead>
                <tbody transition:animate={{ animation: slide, duration: 300 }}>
                    {#each filteredMCodes as {code, desc} (code)}
                        <tr
                            transition:animate={{ animation: fade, duration: 200 }}>
                            <th scope="row" class="code">{code}</th>
                            <td class="desc">{desc}</td>
                        </tr>
                    {/each}
                </tbody>
            {/if}
        </table>
    </ScrollContainer>
</div>


<style lang="scss">
    :global {
        .gCodeTable__container,
        .mCodeTable__container {
            border-right: var(--border) var(--clr-300);
            border-bottom: var(--border) var(--clr-300);
            border-left: var(--border) var(--clr-300);
        }

        .gCodeTable__container .scrollContainer__inner,
        .mCodeTable__container .scrollContainer__inner {
            padding: 0 var(--input-pad-hrz) var(--input-pad-hrz) var(--input-pad-hrz);
        }
    }

    .gCode {
        position: relative;

        .table {
            .noResult {
                display: flex;
                align-items: flex-start;

                color: var(--clr-0);
                font-weight: 500;
                text-transform: uppercase;
                margin-top: var(--pad-md);

                span {
                    display: block;
                    padding: 0 var(--pad-2xs);
                    background-color: var(--clr-900);
                }
            }

            thead {
                th {
                    &:nth-child(1) {
                        // ensure all tables have uniform sizing for code column
                        width: 15%;
                    }
                }
            }
        }
    }
</style>