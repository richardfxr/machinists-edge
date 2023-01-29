<script lang="ts">
    /* === IMPORTS ============================ */
    import { writable } from 'svelte/store';
    import Heading from "$lib/heading.svelte";
    import ScrollContainer from "$lib/scrollContainer.svelte";

    /* === VARAIBLES ========================== */
    interface code {
        "code": string,
        "desc": string
    };

    const codes: code[] = [
        {"code": "G00", "desc": "Rapid repositioning"},
        {"code": "G01", "desc": "Linear interpolation"},
        {"code": "G02", "desc": "Clockwise circular/helical interpolation"},
        {"code": "G03", "desc": "Counterclockwise circular/helical interpolation"},
        {"code": "G04", "desc": "Dwell"},
        {"code": "G10", "desc": "Coordinate system origin setting"},
        {"code": "G12", "desc": "Clockwise circular pocket"},
        {"code": "G13", "desc": "Counterclockwise circular pocket"},
        {"code": "G15", "desc": "Swtich to Cartesian coordiantes"},
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
        {"code": "G52", "desc": "Temporary coordiante system offsets"},
        {"code": "G53", "desc": "Move in absolute machine coordinate system"},
        {"code": "G54", "desc": "Use fixture offset 1"},
        {"code": "G55", "desc": "Use fixture offset 2"},
        {"code": "G56", "desc": "Use fixture offset 3"},
        {"code": "G57", "desc": "Use fixture offset 4"},
        {"code": "G58", "desc": "Use fixture offset 5"},
        {"code": "G59", "desc": "Use fixture offfset 6/use general fixture number"},
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

    const searchTerm = writable("");

    let filteredCodes: code[] = [];

    /* === FUNCTIONS ========================== */
    function searchCodes(searchTerm: string) {
        
    }
</script>


<svelte:head>
    <title>G-code Chart | Machinist's Edge</title>
    <meta
        name="description"
        content="A list of common G- and M-codes for reference."
    />
</svelte:head>


<Heading>G-code Chart</Heading>

<div class="page gCode">
    <ScrollContainer contains="gCodeTable">
        <table class="table">
            <caption class="label">G-codes</caption>

            {#if $searchTerm !== "" && filteredCodes.length === 0}
                <p>no results</p>
            {:else if $searchTerm === ""}
                <thead>
                    <tr>
                        <th scope="col" class="label">code</th>
                        <th scope="col" class="label">description</th>
                    </tr>
                </thead>
                <tbody>
                    {#each codes as {code, desc}}
                        <tr>
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
        .gCodeTable__container .scrollContainer__inner {
            padding: 0 var(--input-pad-hrz) var(--input-pad-vrt) var(--input-pad-hrz);
        }
    }

    .gCode {
        position: relative;
        border: var(--border) var(--clr-300);
    }
</style>