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
            this.stats.cash.is_okay() &&
            this.stats.equipment.is_okay() &&
            this.stats.health.is_okay() 
        )
    }
    
    public apply_effect(effect: Stats): void {
        this.stats.add(effect)
    }
}