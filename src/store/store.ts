/* === IMPORTS ============================ */
import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

/* === STORES ============================= */
export const colorTheme = writable("light");
export const hasColorTheme = writable(false);
export const motionPref = writable("full");
export const hasMotionPref = writable(false);
export const loadedFeedRateSave = writable(-1);
export const loadedToolLengthSave = writable(-1);

/* === LOCAL STORAGE ====================== */
if (browser) {
    if (localStorage.colorTheme) {colorTheme.set(localStorage.colorTheme); hasColorTheme.set(true);};
    if (localStorage.motionPref) {motionPref.set(localStorage.motionPref); hasMotionPref.set(true);};
    if (localStorage.loadedFeedRateSave) loadedFeedRateSave.set(parseInt(localStorage.loadedFeedRateSave));
    if (localStorage.loadedToolLengthSave) loadedToolLengthSave.set(parseInt(localStorage.loadedToolLengthSave));
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

loadedFeedRateSave.subscribe(value => {
    if (!browser) return;
    localStorage.loadedFeedRateSave = value;
});

loadedToolLengthSave.subscribe(value => {
    if (!browser) return;
    localStorage.loadedToolLengthSave = value;
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