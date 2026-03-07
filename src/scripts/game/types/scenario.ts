import { Outcome, Option, type OptionData } from ".";

export interface ScenarioData {
    text: string
    description: string
    options: OptionData[]
}
export class Scenario {
    public text: string;
    public description: string;
    public outcome?: Outcome;
    public options: Option[];

    constructor (
        text?: string,
        description?: string,
        options?: Option[],
    ) {
        this.text = text ? text : "new_game";
        this.description = description ? description : "new_player";
        this.options = options ? options : [];
    }
    static from (data: ScenarioData): Scenario {
        return new Scenario(
            data.text,
            data.description,
            data.options.map(option => Option.from(option))
        );
    }
    public choose (index: number): void {
        index = (Number.isInteger(index) && index >= 0 && index <= this.options.length) ? index : 0;
        const option = this.options[index]!;
        this.outcome = this.outcome ? this.outcome : option.roll();
    }
    
    public summary () {
        return `
Last Scenario: ${this.text ? this.text : ""}
Player Action: ${this.outcome ? this.outcome.text: ""}
`
    }
}
