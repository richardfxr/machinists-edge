/* === IMPORTS ============================ */
import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

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
export const colorTheme = writable("light");
export const hasColorTheme = writable(false);
export const motionPref = writable("full");
export const hasMotionPref = writable(false);
export const feedRateSaves = writable(feedRateSavesArray);
export const loadedFeedRateSave = writable(-1);
export const feedRateSaveCount = writable(1);

/* === LOCAL STORAGE ====================== */
if (browser) {
    if (localStorage.colorTheme) {colorTheme.set(localStorage.colorTheme); hasColorTheme.set(true);};
    if (localStorage.motionPref) {motionPref.set(localStorage.motionPref); hasMotionPref.set(true);};
    if (localStorage.feedRateSaves) feedRateSaves.set(JSON.parse(localStorage.feedRateSaves));
    if (parseInt(localStorage.loadedFeedRateSave) < localStorage.feedRateSaves?.length) loadedFeedRateSave.set(parseInt(localStorage.loadedFeedRateSave));
    if (localStorage.feedRateSaves) feedRateSaveCount.set(parseInt(localStorage.feedRateSaveCount));
};

/* === UPDATES ============================ */
colorTheme.subscribe(value => {
    if (!browser) return;

    // set data-theme attribute on <html>
    document.documentElement.setAttribute('data-theme', value);

    // save value to localStorage if hasColorTheme
    if(get(hasColorTheme)) localStorage.colorTheme = value;
});

hasColorTheme.subscribe(value => {
    if (!browser) return;

    if (value)
        localStorage.colorTheme = get(colorTheme);
    else
        localStorage.removeItem("colorTheme");
});

motionPref.subscribe(value => {
    if (!browser) return;

    // set data-theme attribute on <html>
    document.documentElement.setAttribute('data-motion', value);

    // save value to localStorage if hasColorTheme
    if(get(hasMotionPref)) localStorage.motionPref = value;
})

hasMotionPref.subscribe(value => {
    if (!browser) return;

    if (value)
        localStorage.motionPref = get(motionPref);
    else
        localStorage.removeItem("motionPref");
});

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

/* === CLIENT SIDE INITIALIZATION ========= */
if (browser) {
    // initial theme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches && !get(hasColorTheme)) {
        colorTheme.set("dark");
    }

    // color theme event listeners
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        if (!get(hasColorTheme)) {
            // set appropriate selectedTheme if user has not manually selected theme
            e.matches ? colorTheme.set("dark") : colorTheme.set("light");
        }
    });

    // initial motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !get(hasMotionPref)) {
        motionPref.set("reduced");
    }

    // motion preference event listeners
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", e => {
        if (!get(hasMotionPref)) {
            // set appropriate selectedTheme if user has not manually selected theme
            e.matches ? motionPref.set("reduced") : motionPref.set("full");
        }
    });
};