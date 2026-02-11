import { shuffle_array } from "../../../utils";
import type { Profession } from "../../types"

import { Author } from "./author";
import { CatTheratpist } from "./cat-therapist";
import { Developer } from "./developer";
import { DumpsterPhilosopher } from "./dumpster-philosopher";
import { EmojiLawyer } from "./emoji-lawyer";
import { Hacker } from "./hacker";
import { LiveStreamer } from "./live-streamer";

const DEFAULT_AMOUNT = 3;
const professions: Profession[] = [
    Author,
    CatTheratpist,
    Developer,
    DumpsterPhilosopher,
    EmojiLawyer,
    Hacker,
    LiveStreamer,
];

export function getProfessionById(id: string): Profession | undefined {
    for ( const profession of professions ) {
        if ( profession.id === id ) {
            return profession
}}}

export function ListRandomProfessions(amount:number=DEFAULT_AMOUNT): Profession[] {
    if ((amount <= 1) || (professions.length <= amount)) amount = DEFAULT_AMOUNT;
    return shuffle_array(professions).slice(0, amount);
}
