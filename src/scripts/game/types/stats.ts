export interface Stats{
    cash?: number,
    equipment?: number,
    health?: number,
    luck?: number,
    distance?: number,
}

export interface FullStats extends Required<Stats> {}
export function make_full_stats (stats: Stats): FullStats {
    return {
        cash: stats.cash ?? 0,
        equipment: stats.equipment ?? 0,
        health: stats.health ?? 0,
        luck: stats.luck ?? 0,
        distance: stats.distance ?? 0,
    };
}

export class StatValue {
    public value: number; 
    public min: number;
    public max: number;

    public constructor (
        value: number,
        min: number = -Infinity,
        max: number = Infinity,
    ) {
        this.value = value;
        this.min = min;
        this.max = max;
    }

    public add (value: number): StatValue {
        this.value = Math.min(
            Math.max(
                (this.value + value), 
                this.min
            ), 
            this.max
        );
        return this;
    }

    public upgrade (value: number): StatValue {
        this.value += value;
        this.max += value; // infinities stay infinities
        return this;
    }

    public is_okay (): boolean {
        return this.value > this.min;
    }
}

export class PlayerStats {
    public cash: StatValue;
    public equipment: StatValue;
    public health: StatValue;
    public luck: StatValue;
    public distance: StatValue

    public constructor (stats: FullStats) {
        this.cash = new StatValue(stats.cash, 0);
        this.equipment = new StatValue(stats.equipment, 0, stats.equipment);
        this.health = new StatValue(stats.health, 0, stats.health);
        this.luck = new StatValue(stats.luck);
        this.distance = new StatValue(0, 0, stats.distance)
    }

    public add (stats: Stats): PlayerStats {
        if (stats.cash) { this.cash.add(stats.cash); }
        if (stats.equipment) { this.equipment.add(stats.equipment); }
        if (stats.health) { this.health.add(stats.health); }
        if (stats.luck) { this.luck.add(stats.luck); }
        if (stats.distance) { this.distance.add(stats.distance); }
        return this;
    }

    public upgrade (stats: Stats): PlayerStats {
        if (stats.cash) { this.cash.upgrade(stats.cash); }
        if (stats.equipment) { this.equipment.upgrade(stats.equipment); }
        if (stats.health) { this.health.upgrade(stats.health); }
        if (stats.luck) { this.luck.upgrade(stats.luck); }
        if (stats.distance) { this.distance.upgrade(stats.distance); }
        return this;
    }
}