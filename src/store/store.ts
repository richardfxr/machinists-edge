/* === IMPORTS ============================ */
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

/* === INTERFACES ========================= */
export interface feedRateSave {
    [key: string]: any;
    name: string;
    spindleSpeed: number;
    feedRate: number;
    cutterDiameter: number;
    numFlutes: number;
    opType: "drill" | "mill";
    material: "aluminum" | "brass" | "delrin" | "steel" | "custom";
    customToolSpeed: number;
    customCuttingFeed: number;
}

/* === INIT VARIABLES ===================== */
let feedRateSavesArray: feedRateSave[] = [];
let loadedFeedRateSaveInedx: number = -1;

/* === STORES ============================= */
export const feedRateSaves = writable(feedRateSavesArray);
export const loadedFeedRateSave = writable(loadedFeedRateSaveInedx);

/* === LOCAL STORAGE ====================== */
if (browser) {
    if (localStorage.feedRateSaves) feedRateSaves.set(JSON.parse(localStorage.feedRateSaves));
    if (localStorage.loadedFeedRateSave < localStorage.feedRateSaves?.length) loadedFeedRateSave.set(localStorage.loadedFeedRateSave);
};

/* === UPDATES ============================ */
feedRateSaves.subscribe(value => {
    if (!browser) return;
    console.log("feedRateSaves:", value);
    localStorage.feedRateSaves = JSON.stringify(value);
});

loadedFeedRateSave.subscribe(value => {
    if (!browser) return;

    console.log("loadedFeedRateSave:", value);

    if (value === null)
        localStorage.removeItem("loadedFeedRateSave");
    else
        localStorage.loadedFeedRateSave = value;
});