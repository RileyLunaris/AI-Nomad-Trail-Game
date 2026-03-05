import { makeFullStats, PlayerStats, type Profession, type Stats } from ".";

export class Player {
    public profession: Profession;
    public stats: PlayerStats;

    constructor(
        profession: Profession,
        goal_distance: number,
    ) {
        this.profession = profession;
        const starting_stats = makeFullStats(profession.stats);
        starting_stats.distance = goal_distance;
        this.stats = new PlayerStats (starting_stats);
    }

    public isAlive(): boolean {
        return !(
            this.stats.cash.isEmpty() ||
            this.stats.equipment.isEmpty() ||
            this.stats.health.isEmpty() 
        )
    }
    
    public hasReachedGoal (): boolean {
        return (
            this.stats.distance.isFull()
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

    public getLossMessage(): string {
        const reasons: string[] = new Array<string>;

        if (this.stats.cash.isEmpty())      { reasons.push("you ran out of money") }
        if (this.stats.equipment.isEmpty()) { reasons.push("you broke your equipment")}
        if (this.stats.health.isEmpty())    { reasons.push("you burnt out")}
        
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
