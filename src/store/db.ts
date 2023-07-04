/* === IMPORTS ============================ */
import Dexie, { type Table } from 'dexie';

/* === TYPES ============================== */
export type OpType = "drill" | "mill";
export type Material = "aluminum" | "brass" | "delrin" | "steel" | "custom";
export type ToolSection = "none" | "all" | "baseToFlute" | "flute" | "baseToShoulder" | "shoulder" | "holder" | "body";
export type EndMillType = "flat" | "ball" | "bull-nose";

/* === INTERFACES ========================= */
export interface feedRateSave {
    id?: number;
    name: string;
    spindleSpeed: number;
    feedRate: number;
    cutterDiameter: number;
    numFlutes: number;
    opType: OpType;
    material: Material;
    toolSpeed: number;
    cuttingFeed: number;
}

export interface toolLengthSave {
    id?: number;
    name: string;
    overallLength: number;
    endMillType: EndMillType;
    fluteLength: number;
    baseToShoulderLength: number;
    holderLength: number;
    cutterDiameter: number;
    shoulderDiameter: number;
    manualFluteLength: boolean;
    manualShoulderLegnth: boolean;
    manualBodyLength: boolean;
}

/* === DATABASE =========================== */
export class MEDexie extends Dexie {
    feedRateSaves!: Table<feedRateSave>; 
    toolLengthSaves!: Table<toolLengthSave>;
  
    constructor() {
        super('MEDatabase');
        this.version(1).stores({
            feedRateSaves: `
                ++id,
                name,
                spindleSpeed,
                feedRate,
                cutterDiameter,
                numFlutes,
                opType,
                material,
                toolSpeed,
                cuttingFeed`,
            toolLengthSaves: `
                ++id,
                name,
                overallLength,
                endMillTypem,
                fluteLength,
                baseToShoulderLength,
                holderLength,
                cutterDiameter,
                shoulderDiameter,
                manualFluteLength,
                manualShoulderLegnth,
                manualBodyLength`
        });
    }
}

export const db = new MEDexie();