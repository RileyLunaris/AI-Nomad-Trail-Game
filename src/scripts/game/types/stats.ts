export interface Stats{
    cash?: number,
    equipment?: number,
    health?: number,
    luck?: number,
    distance?: number,
}

export interface FullStats extends Required<Stats> {}
export function makeFullStats (stats: Stats): FullStats {
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

    public affect (value: number): StatValue {
        this.value = Math.min(
            Math.max(
                (this.value + value), 
                this.min
            ), 
            this.max
        );
        return this;
    }

    public modify (value: number): StatValue {
        this.value += value;
        this.max += value; // infinities stay infinities
        return this;
    }

    public isEmpty (): boolean {
        return this.value <= this.min;
    }

    public isFull (): boolean {
        return this.value >= this.max;
    }

    public percent(): string {
        return `${(this.value / this.max) * 100}%`
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

    public affect (stats: Stats): PlayerStats {
        if (stats.cash) { this.cash.affect(stats.cash); }
        if (stats.equipment) { this.equipment.affect(stats.equipment); }
        if (stats.health) { this.health.affect(stats.health); }
        if (stats.luck) { this.luck.affect(stats.luck); }
        if (stats.distance) { this.distance.affect(stats.distance); }
        return this;
    }

    public modify (stats: Stats): PlayerStats {
        if (stats.cash) { this.cash.modify(stats.cash); }
        if (stats.equipment) { this.equipment.modify(stats.equipment); }
        if (stats.health) { this.health.modify(stats.health); }
        if (stats.luck) { this.luck.modify(stats.luck); }
        if (stats.distance) { this.distance.modify(stats.distance); }
        return this;
    }
}