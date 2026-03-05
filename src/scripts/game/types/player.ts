import { make_full_stats, PlayerStats, type Profession, type Stats } from ".";

export class Player {
    protected profession: Profession;
    protected stats: PlayerStats;

    constructor(
        profession: Profession,
        goal_distance: number,
    ) {
        this.profession = profession;
        const starting_stats = make_full_stats(profession.stats);
        starting_stats.distance = goal_distance;
        this.stats = new PlayerStats (starting_stats);
    }

    public is_alive(): boolean {
        return (
            this.stats.cash.is_empty() ||
            this.stats.equipment.is_empty() ||
            this.stats.health.is_empty() 
        )
    }
    
    public has_reached_goal (): boolean {
        return (
            this.stats.distance.is_full()
        )
    }
    public affect (effect: Stats): Player {
        this.stats.affect(effect);
        return this;
    }

    public modify (effect: Stats): Player {
        this.stats.modify(effect);
        return this;
    }

    public get_loss_message(): string {
        const reasons: string[] = new Array<string>;

        if (this.stats.cash.is_empty())      { reasons.push("you ran out of money") }
        if (this.stats.equipment.is_empty()) { reasons.push("you broke your equipment")}
        if (this.stats.health.is_empty())    { reasons.push("you burnt out")}
        
        if (reasons.length > 2) { 
            return `${reasons.slice(0, -1).join(", ")}, and ${reasons[-1]}`;
        } else if (reasons.length === 2) {
            return reasons.join(" and ")
        } else if (reasons.length === 1) {
            return reasons[0]!;
        } else {
            return ""
        }
    }
}


