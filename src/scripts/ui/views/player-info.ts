import { Component } from "../components/component";
import { StatBar, Stat, Info, ProgressBar } from "../components/player";

export class PlayerInfoView extends Component {
    protected about: Info;
    protected money: Stat;
    protected equipment: StatBar;
    protected health: StatBar;
    protected progress: ProgressBar;
    
    constructor() {
        // Root Element Declaration
        super(document.createElement("div"));

        // Owned Components
        this.root.id = "player-panel";

        this.about = new Info("status-info");
        this.money = new Stat("Cash", "cash-value");
        this.equipment = new StatBar("Laptop", "laptop-label", "laptop-fill", "#22c55e");
        this.health = new StatBar("Health", "mental-label", "mental-fill", "#eab308");
        this.progress = new ProgressBar("distance-value", "progress-fill");

        const stat_bar_grid = Object.assign(document.createElement("div"), {
            className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6",
        });
        
        // Dom Structure
        this.root.replaceChildren(
            this.about.element(),
            stat_bar_grid,
            this.progress.element(),
        );
        stat_bar_grid.replaceChildren(
            this.money.element(),
            this.equipment.element(),
            this.health.element(),
        );
    }
}
