import type { Stats } from ".";

export interface OutcomeData {
    text: string
    effects: Stats
}
export class Outcome {
    protected _text: string;
    protected _effects: Stats;

    constructor (
        text?: string,
        stats?: Stats,
    ) {
        this._text = text ? text : "";
        this._effects = stats ? stats : {};
    }
    static from (data: OutcomeData): Outcome {
        return new Outcome(
            data.text,
            data.effects,
        )
    }
    get text () {
        return this._text;
    }
    get effects () {
        return this._effects;
    }
}
