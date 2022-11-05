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
    toolSpeed: number;
    cuttingFeed: number;
    saveCount: number;
}

/* === INIT VARIABLES ===================== */
let feedRateSavesArray: feedRateSave[] = [];

/* === STORES ============================= */
export const feedRateSaves = writable(feedRateSavesArray);
export const loadedFeedRateSave = writable(-1);
export const feedRateSaveCount = writable(1);

/* === LOCAL STORAGE ====================== */
if (browser) {
    if (localStorage.feedRateSaves) feedRateSaves.set(JSON.parse(localStorage.feedRateSaves));
    if (parseInt(localStorage.loadedFeedRateSave) < localStorage.feedRateSaves?.length) loadedFeedRateSave.set(parseInt(localStorage.loadedFeedRateSave));
    if (localStorage.feedRateSaves) feedRateSaveCount.set(parseInt(localStorage.feedRateSaveCount));
};

/* === UPDATES ============================ */
feedRateSaves.subscribe(value => {
    if (!browser) return;
    localStorage.feedRateSaves = JSON.stringify(value);

    // reset feedRateSaveCount to 1 if all saves are deleted
    if (value.length === 0) feedRateSaveCount.set(1);
});

loadedFeedRateSave.subscribe(value => {
    if (!browser) return;
    localStorage.loadedFeedRateSave = value;
});

feedRateSaveCount.subscribe(value => {
    if (!browser) return;
    localStorage.feedRateSaveCount = value;
});