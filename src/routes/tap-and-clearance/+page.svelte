<script lang="ts">
    /* === IMPORTS ============================ */
    import { writable } from 'svelte/store';
    import { slide, fade } from 'svelte/transition';
    import Heading from "$lib/heading.svelte";
    import ScrollContainer from "$lib/scrollContainer.svelte";
    import SearchBar from '$lib/searchBar.svelte';
    import { motionPref } from "../../store/store";

    /* === VARAIBLES ========================== */
    interface threadsAndTap {
        "tpi": string,
        "minorDia": string,
        "size75": [string, string],
        "size50": [string, string]
    };

    interface screw {
        "screwSize": string,
        "majorDia": string,
        "details": threadsAndTap[],
        "closeFit": [string, string],
        "freeFit": [string, string]
    };

    const screws: screw[] = [
        {
            "screwSize": "0",
            "majorDia": "0.0600",
            "details": [
                {"tpi": "80", "minorDia": "0.0447", "size75": ["3/64", "0.0469"], "size50": ["55", "0.0520"]}
            ],
            "closeFit": ["52", "0.0635"],
            "freeFit": ["50", "0.0700"]
        },
        {
            "screwSize": "1",
            "majorDia": "0.0730",
            "details": [
                {"tpi": "64", "minorDia": "0.0538", "size75": ["53", "0.0595"], "size50": ["1/16", "0.0625"]},
                {"tpi": "72", "minorDia": "0.0560", "size75": ["53", "0.0595"], "size50": ["52", "0.0635"]}
            ],
            "closeFit": ["48", "0.0760"],
            "freeFit": ["46", "0.0810"]
        },
        {
            "screwSize": "2",
            "majorDia": "0.0860",
            "details": [
                {"tpi": "56", "minorDia": "0.0641", "size75": ["50", "0.0700"], "size50": ["49", "0.0730"]},
                {"tpi": "64", "minorDia": "0.0668", "size75": ["50", "0.0700"], "size50": ["48", "0.0760"]}
            ],
            "closeFit": ["43", "0.0890"],
            "freeFit": ["41", "0.0960"]
        },
        {
            "screwSize": "3",
            "majorDia": "0.0990",
            "details": [
                {"tpi": "48", "minorDia": "0.0734", "size75": ["47", "0.0785"], "size50": ["44", "0.0860"]},
                {"tpi": "56", "minorDia": "0.0771", "size75": ["45", "0.0820"], "size50": ["43", "0.0890"]}
            ],
            "closeFit": ["37", "0.1040"],
            "freeFit": ["35", "0.1100"]
        },
        {
            "screwSize": "4",
            "majorDia": "0.1120",
            "details": [
                {"tpi": "40", "minorDia": "0.0813", "size75": ["43", "0.0890"], "size50": ["41", "0.0960"]},
                {"tpi": "48", "minorDia": "0.0864", "size75": ["42", "0.0935"], "size50": ["40", "0.0980"]}
            ],
            "closeFit": ["32", "0.1160"],
            "freeFit": ["30", "0.1285"]
        },
        {
            "screwSize": "5",
            "majorDia": "0.1250",
            "details": [
                {"tpi": "40", "minorDia": "0.0943", "size75": ["38", "0.1015"], "size50": ["7/64", "0.1094"]},
                {"tpi": "44", "minorDia": "0.0971", "size75": ["37", "0.1040"], "size50": ["35", "0.1100"]}
            ],
            "closeFit": ["30", "0.1285"],
            "freeFit": ["29", "0.1360"]
        },
        {
            "screwSize": "6",
            "majorDia": "0.1380",
            "details": [
                {"tpi": "32", "minorDia": "0.0997", "size75": ["36", "0.1065"], "size50": ["32", "0.1160"]},
                {"tpi": "40", "minorDia": "0.1073", "size75": ["33", "0.1130"], "size50": ["31", "0.1200"]}
            ],
            "closeFit": ["27", "0.1440"],
            "freeFit": ["25", "0.1495"]
        },
        {
            "screwSize": "8",
            "majorDia": "0.1640",
            "details": [
                {"tpi": "32", "minorDia": "0.1257", "size75": ["29", "0.1360"], "size50": ["27", "0.1440"]},
                {"tpi": "36", "minorDia": "0.1299", "size75": ["29", "0.1360"], "size50": ["26", "0.1470"]}
            ],
            "closeFit": ["18", "0.1695"],
            "freeFit": ["16", "0.1770"]
        },
        {
            "screwSize": "10",
            "majorDia": "0.1900",
            "details": [
                {"tpi": "24", "minorDia": "0.1389", "size75": ["25", "0.1495"], "size50": ["20", "0.1610"]},
                {"tpi": "32", "minorDia": "0.1517", "size75": ["21", "0.1590"], "size50": ["18", "0.1695"]}
            ],
            "closeFit": ["9", "0.1960"],
            "freeFit": ["7", "0.2010"]
        },
        {
            "screwSize": "12",
            "majorDia": "0.2160",
            "details": [
                {"tpi": "24", "minorDia": "0.1649", "size75": ["16", "0.1770"], "size50": ["12", "0.1890"]},
                {"tpi": "28", "minorDia": "0.1722", "size75": ["14", "0.1820"], "size50": ["10", "0.1935"]},
                {"tpi": "32", "minorDia": "0.1777", "size75": ["13", "0.1850"], "size50": ["9", "0.1960"]}
            ],
            "closeFit": ["2", "0.2210"],
            "freeFit": ["1", "0.2280"]
        },
        {
            "screwSize": "1/4",
            "majorDia": "0.2500",
            "details": [
                {"tpi": "20", "minorDia": "0.1887", "size75": ["7", "0.2010"], "size50": ["7/32", "0.2188"]},
                {"tpi": "28", "minorDia": "0.2062", "size75": ["3", "0.2130"], "size50": ["1", "0.2280"]},
                {"tpi": "32", "minorDia": "0.2117", "size75": ["7/32", "0.2188"], "size50": ["1", "0.2280"]}
            ],
            "closeFit": ["F", "0.2570"],
            "freeFit": ["H", "0.2660"]
        },
        {
            "screwSize": "5/16",
            "majorDia": "0.3125",
            "details": [
                {"tpi": "18", "minorDia": "0.2443", "size75": ["F", "0.2570"], "size50": ["J", "0.2770"]},
                {"tpi": "24", "minorDia": "0.2614", "size75": ["I", "0.2720"], "size50": ["9/32", "0.2812"]},
                {"tpi": "32", "minorDia": "0.2742", "size75": ["9/32", "0.2812"], "size50": ["L", "0.2900"]}
            ],
            "closeFit": ["P", "0.3230"],
            "freeFit": ["Q", "0.3320"]
        },
        {
            "screwSize": "3/8",
            "majorDia": "0.3750",
            "details": [
                {"tpi": "16", "minorDia": "0.2983", "size75": ["5/16", "0.3125"], "size50": ["Q", "0.3320"]},
                {"tpi": "24", "minorDia": "0.3239", "size75": ["Q", "0.3320"], "size50": ["S", "0.3480"]},
                {"tpi": "32", "minorDia": "0.3367", "size75": ["11/32", "0.3438"], "size50": ["T", "0.3580"]}
            ],
            "closeFit": ["W", "0.3860"],
            "freeFit": ["X", "0.3970"]
        },
        {
            "screwSize": "7/16",
            "majorDia": "0.4375",
            "details": [
                {"tpi": "14", "minorDia": "0.3499", "size75": ["U", "0.3680"], "size50": ["25/64", "0.3906"]},
                {"tpi": "20", "minorDia": "0.3762", "size75": ["25/64", "0.3906"], "size50": ["13/32", "0.4062"]},
                {"tpi": "28", "minorDia": "0.3937", "size75": ["Y", "0.4040"], "size50": ["Z", "0.4130"]}
            ],
            "closeFit": ["29/64", "0.4531"],
            "freeFit": ["15/32", "0.4687"]
        },
        {
            "screwSize": "1/2",
            "majorDia": "0.5000",
            "details": [
                {"tpi": "13", "minorDia": "0.4056", "size75": ["27/64", "0.4219"], "size50": ["29/64", "0.4531"]},
                {"tpi": "20", "minorDia": "0.4387", "size75": ["29/64", "0.4531"], "size50": ["15/32", "0.4688"]},
                {"tpi": "28", "minorDia": "0.4562", "size75": ["15/32", "0.4688"], "size50": ["15/32", "0.4688"]}
            ],
            "closeFit": ["33/64", "0.5156"],
            "freeFit": ["17/32", "0.5312"]
        },
        {
            "screwSize": "9/16",
            "majorDia": "0.5625",
            "details": [
                {"tpi": "12", "minorDia": "0.4603", "size75": ["31/64", "0.4844"], "size50": ["33/64", "0.5156"]},
                {"tpi": "18", "minorDia": "0.4943", "size75": ["33/64", "0.5156"], "size50": ["17/32", "0.5312"]},
                {"tpi": "24", "minorDia": "0.5114", "size75": ["33/64", "0.5156"], "size50": ["17/32", "0.5312"]}
            ],
            "closeFit": ["37/64", "0.5781"],
            "freeFit": ["19/32", "0.5938"]
        },
        {
            "screwSize": "5/8",
            "majorDia": "0.6250",
            "details": [
                {"tpi": "11", "minorDia": "0.5135", "size75": ["17/32", "0.5312"], "size50": ["9/16", "0.5625"]},
                {"tpi": "18", "minorDia": "0.5568", "size75": ["37/64", "0.5781"], "size50": ["19/32", "0.5938"]},
                {"tpi": "24", "minorDia": "0.5739", "size75": ["37/64", "0.5781"], "size50": ["19/32", "0.5938"]}
            ],
            "closeFit": ["41/64", "0.6406"],
            "freeFit": ["21/32", "0.6562"]
        },
        {
            "screwSize": "11/16",
            "majorDia": "0.6875",
            "details": [
                {"tpi": "24", "minorDia": "0.6364", "size75": ["41/64", "0.6406"], "size50": ["21/32", "0.6562"]}
            ],
            "closeFit": ["45/64", "0.7031"],
            "freeFit": ["23/32", "0.7188"]
        },
        {
            "screwSize": "3/4",
            "majorDia": "0.7500",
            "details": [
                {"tpi": "10", "minorDia": "0.6273", "size75": ["21/32", "0.6562"], "size50": ["11/16", "0.6875"]},
                {"tpi": "16", "minorDia": "0.6733", "size75": ["11/16", "0.6875"], "size50": ["45/64", "0.7031"]},
                {"tpi": "20", "minorDia": "0.6887", "size75": ["45/64", "0.7031"], "size50": ["23/32", "0.7188"]}
            ],
            "closeFit": ["49/64", "0.7656"],
            "freeFit": ["25/32", "0.7812"]
        },
        {
            "screwSize": "13/16",
            "majorDia": "0.8125",
            "details": [
                {"tpi": "20", "minorDia": "0.7512", "size75": ["49/64", "0.7656"], "size50": ["25/32", "0.7812"]}
            ],
            "closeFit": ["53/64", "0.8281"],
            "freeFit": ["27/32", "0.8438"]
        },
        {
            "screwSize": "7/8",
            "majorDia": "0.8750",
            "details": [
                {"tpi": "9", "minorDia": "0.7387", "size75": ["49/64", "0.7656"], "size50": ["51/64", "0.7969"]},
                {"tpi": "14", "minorDia": "0.7874", "size75": ["13/16", "0.8125"], "size50": ["53/64", "0.8281"]},
                {"tpi": "20", "minorDia": "0.8137", "size75": ["53/64", "0.8281"], "size50": ["27/32", "0.8438"]}
            ],
            "closeFit": ["57/64", "0.8906"],
            "freeFit": ["29/32", "0.9062"]
        },
        {
            "screwSize": "15/16",
            "majorDia": "0.9375",
            "details": [
                {"tpi": "20", "minorDia": "0.8762", "size75": ["57/64", "0.8906"], "size50": ["29/32", "0.9062"]}
            ],
            "closeFit": ["61/64", "0.9531"],
            "freeFit": ["31/32", "0.9688"]
        },
        {
            "screwSize": "1",
            "majorDia": "1.0000",
            "details": [
                {"tpi": "8", "minorDia": "0.8466", "size75": ["7/8", "0.8750"], "size50": ["59/64", "0.9219"]},
                {"tpi": "12", "minorDia": "0.8978", "size75": ["15/16", "0.9375"], "size50": ["61/64", "0.9531"]},
                {"tpi": "20", "minorDia": "0.9387", "size75": ["61/64", "0.9531"], "size50": ["31/32", "0.9688"]}
            ],
            "closeFit": ["1-1/64", "1.0156"],
            "freeFit": ["1-1/32", "1.0313"]
        },
    ];

    const searchTerm = writable("");

    let filteredScrews: screw[] = screws;

    /* === REACTIVE DECLARATIONS ============== */
    // call searchCodes() every time $searchTerm changes
    $: ($searchTerm || $searchTerm === "") && searchScrews($searchTerm);

    /* === FUNCTIONS ========================== */
    function animate(node: HTMLElement, options: { animation: Function, duration: number, delay?: number }) {
        if ($motionPref === "reduced")
            return fade(node, { duration: 200 });
        else
            return options.animation(node, options);
    }

    function searchScrews(searchTerm: string) {
        if (searchTerm.startsWith('0.') || searchTerm.startsWith('1.') || searchTerm.startsWith('.')) {
            // search majorDia if searchTerm is a decimal
            filteredScrews = screws.filter(screw => screw.majorDia.includes(searchTerm))
        } else {
            // search screwSize otherwise
            filteredScrews = screws.filter(screw => screw.screwSize.includes(searchTerm))
        }
    }
</script>


<svelte:head>
    <title>Tap &amp; Clearance Drill Sizes | Machinist's Edge</title>
    <meta
        name="description"
        content="Tap and clearance drill charts."
    />
</svelte:head>


<Heading>Tap & Clearance Drill Sizes</Heading>

<div class="page tapAndClearance">
    <SearchBar
        label="search screw sizes"
        placeholder="Search screw sizes"
        bind:value={$searchTerm}
        sticky />
    
    <ScrollContainer contains="fullTable">
        <table class="table">
            <caption class="label">Tap &amp; Clearance</caption>

            {#if $searchTerm !== "" && filteredScrews.length === 0}
                <p class="noResult" in:animate={{ animation: slide, duration: 200, delay: 150 }}>
                    <span>no results</span>
                </p>
            {:else}
                <thead transition:animate={{ animation: slide, duration: 300 }}>
                    <tr>
                        <th scope="col" class="label">screw size</th>
                        <th scope="col" class="label">major diameter</th>
                        <th scope="col" class="label">threads<wbr>/inch</th>
                        <th scope="col" class="label">minor diameter</th>
                        <th scope="col" colspan="2" class="label">75% thread</th>
                        <th scope="col" colspan="2" class="label">50% thread</th>
                        <th scope="col" colspan="2" class="label">close fit</th>
                        <th scope="col" colspan="2" class="label">free fit</th>
                    </tr>
                </thead>
                <tbody transition:animate={{ animation: slide, duration: 300 }}>
                    {#each filteredScrews as {screwSize, majorDia, details, closeFit, freeFit}}
                        <tr
                            transition:animate|local={{ animation: fade, duration: 200 }}>
                            <th scope="row" rowspan={details.length} class="screwSize">{screwSize}</th>
                            <td rowspan={details.length}>{majorDia}</td>
                            <td>{details[0].tpi}</td>
                            <td>{details[0].minorDia}</td>
                            <td class="fraction">{details[0].size75[0]}</td>
                            <td class="decimal">{details[0].size75[1]}</td>
                            <td class="fraction">{details[0].size50[0]}</td>
                            <td class="decimal">{details[0].size50[1]}</td>
                            <td rowspan={details.length} class="fraction">{closeFit[0]}</td>
                            <td rowspan={details.length} class="decimal">{closeFit[1]}</td>
                            <td rowspan={details.length} class="fraction">{freeFit[0]}</td>
                            <td rowspan={details.length} class="decimal">{freeFit[1]}</td>
                        </tr>

                        {#if details.length > 1}
                            {#each details.slice(1) as {tpi, minorDia, size75, size50}}
                                <tr class="partial">
                                    <td>{tpi}</td>
                                    <td>{minorDia}</td>
                                    <td class="fraction">{size75[0]}</td>
                                    <td class="decimal">{size75[1]}</td>
                                    <td class="fraction">{size50[0]}</td>
                                    <td class="decimal">{size50[1]}</td>
                                </tr>
                            {/each}
                        {/if}
                    {/each}
                </tbody>
            {/if}
        </table>
    </ScrollContainer>
</div>


<style lang="scss">
    .tapAndClearance {
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

            tbody {
                tr {
                    .fraction {
                        padding-right: 0;
                        width: 1%;
                    }

                    .decimal {
                        padding-left: 0;

                        &::before {
                            content: " = ";
                            white-space: pre;
                            color: var(--clr-600);
                        }
                    }
                }
            }
        }
    }
</style>