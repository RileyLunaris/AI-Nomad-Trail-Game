import { Outcome, type OutcomeData } from ".";

export interface OptionData {
    text: string
    chance?: number
    success: OutcomeData
    failure: OutcomeData
}
export class Option {
    protected _id?: string;
    protected _text: string;
    protected _chance: number;
    protected _success: Outcome;
    protected _failure: Outcome;

    public constructor (
        text: string,
        success: Outcome,
        failure: Outcome,
        chance: number = 50
    ) {
        this._text = text;
        this._success = success;
        this._failure = failure;
        this._chance = chance;
    }
    static from (data: OptionData): Option {
        return new Option(
            data.text,
            Outcome.from(data.success),
            Outcome.from(data.failure),
            data.chance ?? 50
        );
    }
    public roll(luck: number = 0): Outcome {
        return ((Math.random() * 100) <= (this._chance + luck)) ? this._success : this._failure;
    }
    get text () {
        return this._text;
    }
}
