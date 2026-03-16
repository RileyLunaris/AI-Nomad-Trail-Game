import { ActionSchema, DilemmaSchema, OutcomeSchema, parseNewScenario } from "./api/generate_scenario.js";
import { getProfessionById, ListRandomProfessions } from "./game/content/professions";
import { getRandomScenario } from "./game/content/scenarios/index.js";
import { Player } from "./game/types/player.js";
import { Option, Outcome, Scenario, type Profession, type Stats } from "./game/types/";
import { JourneyLogView, PlayerInfoView, ScenarioView, TitleBarView } from "./ui";
import { z } from "zod";
import { OptionsView } from "./ui/views/options-view.js";

// Game Configuration
const START_CITY = "New York City, NY";
const END_CITY = "San Francisco, CA";
const TOTAL_DISTANCE = 3000;

let player: Player;
let isProcessing: boolean = false;
let currentScenario: Scenario = new Scenario(); 
console.log(currentScenario)


// #region :: Events 
// ────────────────────────────────────────────────────────────────────
//                              Events
// ────────────────────────────────────────────────────────────────────

/** Events posted by the game. */
export const GameEvents = {
    start: "game :: start",
    player_update: "game :: update-player",
    scenario_update: "game :: update-scenario",
    end: "game :: end",
}

/** Events posted by the UI and player decisions. */
export const UIEvents = {
    profession_choice: "user :: class-select",
    profession_confirmation: "user :: class-confirm",
    scenario_choice: "user :: scenario-option-select",
}

/** Combines the all events into a structured stringed typed */
export type EventName = 
    | typeof GameEvents[keyof typeof GameEvents]
    | typeof UIEvents[keyof typeof UIEvents]

/** Default structure for Event Handlers and optional data. */
export type EventHandler <T = any> = (data: T) => void

/**
 * Generic event bus.
 * 
 * Provides decoupling between the application and the interface without
 * directly referencing eachother.
 * 
 * Components can:
 *  - subcribe to events.
 *  - broadcast events.
 */
class EventBus {
    /** Dictionary of event names with the proper handlers. */
    private notifications = new Map <EventName, Set<EventHandler>> ()

    /**
     * Subscribe a function to an event.
     * 
     * @param event - The event flag to listen for.
     * @param handler - Funtion that will run when the event is broadcast
     * @returns - Function to unsubscribe the function from the event
     */
    subscribe (
        event: EventName,
        handler: EventHandler,
    ) {
        if (!this.notifications.has(event)) {
            this.notifications.set(event, new Set())
        }
        const event_flag = this.notifications.get(event)!
        event_flag.add(handler)

        return () => this.unsubscribe(event, handler)
    }
    
    /**
     * Unsubscribes a function from an eventflag
     * 
     * @param event - The event flag that was listened to.
     * @param handler - Function that will no longer be called.
     */
    unsubscribe(
        event: EventName, 
        handler: EventHandler
    ) {
        this.notifications.get(event)?.delete(handler)
    }

    /**
     * Broadcasts an event to all subscribed handlers.
     * 
     * @param event - The event flag to braodcast for an event.
     * @param data - Optional: data that is passesd to the handlers.
     */
    broadcast <T> (
        event: EventName,
        data?: T,
    ) {
        this.notifications.get(event)?.forEach((handler) => {handler(data)})
    }
}

/** Initialized Event Bus */
export const bus = new EventBus()

// #endregion


// #region :: Components
// ────────────────────────────────────────────────────────────────────
//                              Components
// ────────────────────────────────────────────────────────────────────

/**
 * Default Component class to be implemented.
 * 
 * @protected root - The root div element.
 * @method remove - Removes the container.
 * @property element - returns The root container.
 */
export abstract class Component {
    protected root: HTMLElement

    /**
     * Instantiating method.
     * @param root - Optional: HTML Element container.
     */
    constructor (root?: HTMLElement) {
        this.root = root ? root : document.createElement("div")
        this.root.classList.add("component")
    }

    /** Removes the component container. */
    remove () {
        this.root.remove()
    }

    /** The root element of the component. */
    get element (): HTMLElement {
        return this.root
    }
}

/**
 * Builds a DOM HTMLElement of the stats
 * 
 * @param stats - Stats of the object in reference
 * @returns - HTMLElement paragraph representation of stats
 */
export function cardStatInfoElement (stats: Stats): HTMLElement {
    // objects
    const root = document.createElement("p")
    const divider = document.createElement("span")
    const cash_label = document.createElement("span")
    const equipment_label = document.createElement("span")
    const health_label = document.createElement("span")
    const cash_value = document.createElement("span")
    const equipment_value = document.createElement("span")
    const health_value = document.createElement("span")
    
    // css classes
    cash_value.classList.add("money")

    // text
    cash_label.textContent = "Cash: "
    equipment_label.textContent = "Laptop: "
    health_label.textContent = "Mental: "
    divider.textContent = "  |  "

    //values
    cash_value.textContent = stats.cash!.toLocaleString()
    equipment_value.textContent = `${stats.equipment}%`
    health_value.textContent = `${stats.health}`

    // build
    root.replaceChildren(
        cash_label,
        cash_value,
        divider,
        equipment_label,
        equipment_value,
        divider.cloneNode(true),
        health_label,
        health_value,
    )

    return root
}

/** Container object for an individual profession. */
export class ProfessionCardComponent extends Component {
    private title: HTMLElement = document.createElement("h3")
    private description: HTMLElement = document.createElement("p")
    private info: HTMLElement
    private button: HTMLButtonElement = document.createElement("button")

    private profession: Profession
    private select: CallableFunction
    private unsub: CallableFunction[] = []

    /**
     * Instantiating method for the Profession Card Component
     * @param profession - Profession class for the user to select.
     */
    constructor (
        profession: Profession
    ) {
        // Definitions
        super()
        this.root.classList.add("profession-card")

        // Value Assigning
        this.profession = profession
        this.title.textContent = profession.name
        this.description.textContent = profession.description
        this.info = cardStatInfoElement(profession.stats)
        this.button.textContent = `Start as ${profession.name}`

        // Event Bus Handling
        this.select = () => {
            bus.broadcast(
                UIEvents.profession_choice, 
                profession
        )}
        this.unsub.push(
            bus.subscribe(
                UIEvents.profession_choice, 
                this.onOtherSelect
        ))
        this.unsub.push(
            bus.subscribe(
                UIEvents.profession_confirmation,
                this.onConfirm
            )
        )

        // Event Listeners
        this.root.addEventListener("click", this.onCardSelect)
        this.button.addEventListener("click", this.select(), {once: true})

        // DOM
        this.build()
    }
    
    /** Runs when the profession card is selected. */
    onCardSelect () {
        this.root.appendChild(this.button)
    }

    /** Runs when the user clicks on something else. */
    onOtherSelect () {
        this.root.removeChild(this.button)
    }

    /**
     * Runs when the the user confirms the selection.
     * @param profession - chosen profession.
     */
    onConfirm (profession: Profession) {
        if (profession !== this.profession) {this.remove()}
    }

    /** Builds the DOM Structure */
    build () {
        this.root.replaceChildren(
            this.title,
            this.description,
            this.info,
            this.button,
        )
    }

    /** Properly cleans and removes the objects */
    remove () {
        // Clean-up Event Listeners
        this.root.removeEventListener("click", this.onCardSelect)
        this.button.removeEventListener("click", this.select())
        this.unsub.forEach((unsubscribe) => {unsubscribe()})
        this.root.remove()
    }
}


export class MenuInfo extends Component {
    private title = document.createElement("h3")
    private description = document.createElement("p")
    private hint = document.createElement("p")

    constructor () {
        // Definitions
        super()
        this.root.classList.add("menu")

        // Set Values
        this.title.textContent = "Welcome to the AI Nomad Trail!"
        this.description.textContent = "Select your dream career to begin your journey as a digital nomad."
        this.hint.textContent = "Each profession has different abilities and stats that may help or hinder you."

        // DOM
        this.root.replaceChildren(
            this.title,
            this.description,
            this.hint,
        )
    }
}
// #endregion


// #region :: Screens 
// ────────────────────────────────────────────────────────────────────
//                              Screens
// ────────────────────────────────────────────────────────────────────

/** Default Screen class structure used when managing the User Interface. */
export abstract class UIScreen {
    /** The root screen element */
    protected root: HTMLElement;

    /** Default initializer of the UI Screen. */
    constructor () { 
        this.root = document.createElement("div")
        this.root.classList.add("ui-screen")
    }

    /** Called when screen becomes visible */
    enter (): void {}

    /** Called when screen is removed */
    exit (): void {}

    /**
     * I am groot.
     * @returns The DOM element representing this screen
     */
    get element(): HTMLElement { 
        return this.root 
    }
}

/** Profession Selection Menu Screen. */
export class ProfessionScreen extends UIScreen {
    protected info_panel: MenuInfo
    protected options_panel = document.createElement("div")

    /**
     * Initializer for the Profession Menu Screen.
     * 
     * @param professions - List of possible professions classes to start as.
     */
    constructor (
        professions: Profession[],
    ) {
        // Definitions.
        super()
        this.root.classList.add("profession-screen")
        this.info_panel = new MenuInfo()
        this.options_panel.classList.add("options")

        // Options Panel Building
        professions.forEach(
            (profession) => {
                this.options_panel.appendChild(new ProfessionCardComponent(profession).element)
                bus.broadcast(UIEvents.profession_choice, profession)
            }
        )

        // DOM
        this.root.replaceChildren(
            this.info_panel.element,
            this.options_panel
        )
    }
}

// #endregion


// #region :: User Interface 
// ────────────────────────────────────────────────────────────────────
//                          User Interface
// ────────────────────────────────────────────────────────────────────

/**
 * Manages a stack of UI Screens.
 */
class UIManager {
    /** Stack of active UI Screens. */
    private stack: UIScreen[] = []
    
    constructor () {

    }
    /** 
     * Adds a new screen to the top of the stack. 
     * @param screen - The new screen.
     */
    push (screen: UIScreen): void {
        this.stack.push(screen)
        screen.enter()
    }

    /** 
     * Removes the top screen from the stack. 
     */
    pop (): void {
        const screen = this.stack.pop()
        screen?.exit()
    }

    /**
     * Replaces the current screen with another.
     * @param screen - the new screen.
     */
    replace (screen: UIScreen): void {
        this.pop()
        this.push(screen)
    }

    /**
     * 
     */
    clear (): void {
        while (this.stack.length > 0) {
            this.pop()
        }
    }
    /**
     * Returns the current active screen.
     * @returns - the active screen.
     */
    current (): UIScreen | undefined {
        return this.stack[this.stack.length - 1];
    }
}



// class UserInterfaceManager {
//     private app: HTMLElement;
//     private game: HTMLDivElement;
    

//     private title: TitleBarView;
//     private player: PlayerInfoView;
//     private scenario: ScenarioView;
//     private options: OptionsView;
//     private continue: HTMLButtonElement;
//     private log: JourneyLogView;

//     constructor (
//         travel_action: CallableFunction,
//     ) {
//         // Define the components
//         this.app = document.getElementById("app")!
//         this.game = Object.assign(
//             document.createElement('div'), {
//                 id: "game", 
//                 className: "max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl", 
//         });
//         this.title = new TitleBarView("The Ai Nomad Trail");
//         this.player = new PlayerInfoView();
//         this.scenario = new ScenarioView(
//             "scenario-display", 
//             "scenario-title", 
//             "scenario-description", 
//             "scenario-hint"
//         );
//         this.options = new OptionsView(
//             "action-controls", 
//             "scenario-controls", 
//             "travel-button",
//         );
//         this.log = new JourneyLogView(
//             "log-container", 
//             "log-area"
//         );
//         this.continue = Object.assign(document.createElement("button"), {});
//         this.continue.disabled = false;
//         this.continue.style.backgroundColor = "#16a34a";
//         this.continue.style.opacity = "1";
//         this.continue.style.display = "none";
//         this.continue.onclick = () => {
//             travel_action()
//         }

//         // Build the DOM
//         this.game.replaceChildren(
//             this.title.element,
//             this.player.element,
//             this.scenario.element,
//             this.options.element,
//             this.log.element,
//         );
//         this.app.replaceChildren(
//             this.game
//         );
//     }
//     professionMenu (
//         professions: Profession[],
//         choose_profession: CallableFunction,
//     ): void {
//         this.scenario.title.textContent = "Welcome to the AI Nomad Trail!"
//         this.scenario.description.textContent = "Select your starting profession to begin the journey"
//         this.scenario.hint.textContent = "Your stats are crucial for survival!"

//         this.options.clear();
    
//         professions.forEach(
//             (profession) => {
//                 const profession_card = new ProfessionCardComponent(
//                     profession,
//                     choose_profession,
//                 );
//                 this.options.element.appendChild(profession_card.element)
//             }
//         )
//     }
//     showScenario (
//         newScenario: Scenario,
//         choose_option: CallableFunction,
//     ) {
//         this.scenario.title.textContent = newScenario.text;
//         this.scenario.description.textContent = newScenario.description;
//         this.scenario.show();

//         this.options.clear();
//         newScenario.options.forEach(
//             (option, index) => {
//                 const button = new OptionButtonComponent(option.text, () => {
//                     choose_option(index)
//                 })
//                 this.options.grid.appendChild(button.element);
//             }
//         );
//         this.options.continue.disabled = true;
//         this.options.continue.style.opacity = '0.5';
//     }
//     apppendLog (
//         text: string,
//         color_code: string,
//     ) { 
//         const event = Object.assign(document.createElement("p"), {
//             className: `text-sm mb-1 ${color_code}`,
//             textContent: text,
//         });
//         this.log.pushEvent(event);
//     }
//     popLog () { 
//         this.log.popEvent(); 
//     }
//     updatePlayer (player: Player) {
//         this.player.show();
//         this.player.set_value(player, TOTAL_DISTANCE);
//     }
//     travel () {
//         // this.scenario.
//     }
//     gameOver (result:boolean, message: string) {
//         this.scenario.clear();
//         this.scenario.title.textContent = result ? "CONGRATULATIONS!" : "GAME OVER";
//         this.scenario.description.textContent = message;
//         this.continue.onclick = () => {location.reload()}
//         this.continue.textContent = "Restart";
//         this.scenario.element.appendChild(this.continue)
//     }
// }
// // Initialize the User Interface.
// const ui = new UserInterfaceManager(gameRollTravel);

uiInitialize(
    gameRollTravel
)
uiProfessionMenu(
    ListRandomProfessions(), 
    gameInitialize,
)
function uiInitialize (
    travel_action: CallableFunction,
) {
    const gameArea = document.getElementById('app');
    const game = Object.assign(
        document.createElement('div'), {
            id: "game", 
            className: "max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl", 
    });
    const title = new TitleBarView("The Ai Nomad Trail");
    const player_card = new PlayerInfoView();
    const scenario_card = new ScenarioView("scenario-display", "scenario-title", "scenario-description", "scenario-hint");
    const options_card = new OptionsView("action-controls", "scenario-controls", "travel-button",);
    const log_card = new JourneyLogView("log-container", "log-area");

    // /* options panel */
    // const options_panel = Object.assign(
    //     document.createElement('div'), {
    //         id: "action-controls",
    //         className: "space-y-4",
    // });
    // const options_panel_grid = Object.assign(
    //     document.createElement('div'), {
    //         id: "scenario-controls", 
    //         className: "space-y-4"
    // });
    // const options_panel_continue = Object.assign(
    //     document.createElement('button'), {
    //         id: "travel-button",
    //         onclick: travel_action,
    //         style: "background-color: #9ca3af; cursor: not-allowed; opacity: 0.7;",
    //         className: "w-full px-4 py-3 mt-4 text-white font-bold rounded-lg",
    //         textContent: "Continue Journey (Travel & Risk New Event)", 
    // });
    // options_panel.replaceChildren(
    //     options_panel_grid,
    //     options_panel_continue,
    // )
    /* build the dom */
    game.replaceChildren(
        title.element,
        player_card.element,
        scenario_card.element,
        options_card.element,
        log_card.element,
    );
    if (gameArea) {gameArea.appendChild(game);}
}
function uiProfessionMenu (
    professions: Profession[],
    choose_profession_action: CallableFunction,
) {
    const scenarioDisplay = document.getElementById('scenario-display');
    const scenarioControls = document.getElementById('scenario-controls');
    // const logArea = document.getElementById('log-area');
    const travelButton = document.getElementById('travel-button');

    if (travelButton) travelButton.style.display = 'none';

    
    if (scenarioDisplay) {
        const scenario_title = Object.assign(document.createElement('h3'), {
            className: "text-xl font-semibold text-indigo-800",
            textContent: "Welcome to the AI Nomad Trail!",
        });
        const scenario_description = Object.assign(document.createElement('p'), {
            className: "text-gray-700 mt-2", 
            textContent: `Select your starting profession to begin the journey from ${START_CITY} to ${END_CITY}`, 
        });
        const scenario_hint = Object.assign(document.createElement('p'), {
            className: "text-sm text-gray-500 mt-2", 
            textContent: "Your stats are crucial for survival!", 
        });
        scenarioDisplay.replaceChildren(
            scenario_title,
            scenario_description,
            scenario_hint,
        );
        if (scenarioControls) {scenarioControls.innerHTML = '';}
    }
    if (scenarioControls) {
        professions.forEach(profession => {
            const option_card = Object.assign(document.createElement('div'), {
                className: 'p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow',
            });
            const option_title = Object.assign(document.createElement('h4'), {
                className: "font-bold text-indigo-700", 
                textContent: profession.name
            });
            const option_description = Object.assign(document.createElement('p'), {
                className: "text-sm text-gray-600 mb-2",
                textContent: profession.description,
            });
            const option_stats = Object.assign(document.createElement('p'), {
                className: "text-sm text-gray-500"
            });
            const option_cash = Object.assign(document.createElement('span'), {textContent: "Cash: "});
            const option_cash_value = Object.assign(document.createElement('span'), {
                className: "text-green-600 font-semibold", 
                textContent: `$${profession.stats.cash}`,
            });
            const option_equipment = Object.assign(document.createElement('span'), {textContent: "Laptop: "});
            const option_equipment_value = Object.assign(document.createElement('span'), {textContent: `${profession.stats.equipment}%`});
            const option_health = Object.assign(document.createElement('span'), {textContent: "Mental: "});
            const option_health_value = Object.assign(document.createElement('span'), {textContent: `${profession.stats.health}%`});
            const option_stat_divider = Object.assign(document.createElement('span'), {textContent: " | "});
            
            const button = document.createElement('button');
            button.textContent = `Start as ${profession.name}`;
            button.className = 'w-full mt-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-lg';
            button.onclick = () => {
                if (travelButton) travelButton.style.display = 'block';
                choose_profession_action(profession.id);
            };
            const option_stats_list = [
                option_cash,
                option_cash_value,
                option_stat_divider,
                option_equipment,
                option_equipment_value,
                option_stat_divider,
                option_health,
                option_health_value,
            ];
            for (const stat of option_stats_list) {
                option_stats.appendChild(stat.cloneNode(true));
            }
            option_card.replaceChildren(
                option_title,
                option_description,
                option_stats,
                button,
            );
            scenarioControls.appendChild(option_card);
        });
    }
}
function uiScenario (
    scenario: Scenario,
    confirm_travel_action: CallableFunction,
) {
    if (!scenario) return; 
    const scenarioDisplay = document.getElementById('scenario-display');
    const scenarioControls = document.getElementById('scenario-controls');
    const travelButton = document.getElementById('travel-button') as HTMLButtonElement;

    const scenario_title = Object.assign(
        document.createElement('h3'), {
            className: "text-xl font-semibold mb-4 text-indigo-800", 
            textContent: `${scenario.text}`, 
    });
    const scenario_description = Object.assign(
        document.createElement('p'), {
            className: "text-gray-700", 
            textContent: `${scenario.description}`
    });
    if (scenarioDisplay) {
        scenarioDisplay.replaceChildren(
            scenario_title,
            scenario_description,
        )
    }

    if (scenarioControls) {
        scenarioControls.innerHTML = ''; 

        scenario.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.className = 'w-full px-4 py-2 mb-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-md';
            button.onclick = () => confirm_travel_action(index);
            scenarioControls.appendChild(button);
        });
    }

    if (travelButton) {
        travelButton.disabled = true;
        travelButton.style.opacity = '0.5';
    }
    uiUpdate();
}
function uiUpdate () {
    const cash_value = document.getElementById('cash-value')
    if (cash_value) {cash_value.textContent = `$${player.stats.cash.value}`;}
    const laptop_fill = document.getElementById('laptop-fill')
    if (laptop_fill) {laptop_fill.style.width = `${player.stats.equipment.value}%`;}
    const laptop_label = document.getElementById('laptop-label')
    if (laptop_label) {laptop_label.textContent = `${player.stats.equipment.value}%`;}
    const mental_fill = document.getElementById('mental-fill')
    if (mental_fill) {mental_fill.style.width = `${player.stats.health.value}%`;}
    const mental_label = document.getElementById('mental-label')
    if (mental_label) {mental_label.textContent = `${player.stats.health.value}%`;}
    const progress = Math.min(1, (player.stats.distance.value / TOTAL_DISTANCE)) * 100;
    const progress_fill = document.getElementById('progress-fill')
    if (progress_fill) {progress_fill.style.width = `${progress}%`;}
    const distance_value = document.getElementById('distance-value')
    if (distance_value) {distance_value.textContent = `${player.stats.distance.value} / ${TOTAL_DISTANCE} miles`;}
    
    const player_profession_title = Object.assign(document.createElement('div'), {
            className: "font-bold text-2xl text-indigo-700", 
            textContent: `${player.profession.name}`, 
    });
    const status_info = document.getElementById('status-info')
    if (status_info) {status_info.replaceChildren(player_profession_title);}
    if (player.hasReachedGoal() && player.isAlive()) {uiEndGame(true);}
    else if (!player.isAlive()) {uiEndGame(false);}
}
function uiLogMessage (
    text: string, 
    colorClass: string = 'text-gray-800'
) {
    const log = document.getElementById('log-area');
    const event = Object.assign(
        document.createElement('p'), {
            className: `text-sm mb-1 ${colorClass}`,
            textContent: text,
    });
    if (log) { log.prepend(event); }
}
function uiPopMessage () {
    const log = document.getElementById("log-area") as HTMLDivElement;
    if (log) { log.firstElementChild?.remove() }
}
function uiEndGame (isWin:boolean) {
    const title = isWin ? "CONGRATULATIONS!" : "GAME OVER.";
    const header = Object.assign(
        document.createElement('h2'), {
            className: "text-3xl font-bold", 
            textContent: title,
    });
    const button = Object.assign(document.createElement('button'), {
        className: "bg-blue-500 text-white p-2 mt-4 rounded",
        textContent: "Restart", 
    });
    button.addEventListener("click", () => location.reload());
    const scenario_display = document.getElementById('scenario-display')
    if (scenario_display) {
        scenario_display.replaceChildren(
            header,
            button,
        );
    }
}
function uiTravel () {
    const scenarioDisplay = document.getElementById('scenario-display');
    const scenarioControls = document.getElementById('scenario-controls');
    const scenario_display_text = Object.assign(
        document.createElement('p'), {
            className: "text-lg text-indigo-700 font-semibold",
            textContent: "Traveling...",
    });
    if (scenarioDisplay) scenarioDisplay.appendChild(scenario_display_text); 
    if (scenarioControls) scenarioControls.innerHTML = ''; 
}
function uiTravelButtonDisplay () {
    const travelButton = document.getElementById('travel-button') as HTMLButtonElement;
    if (travelButton) {
        travelButton.disabled = false;
        travelButton.style.opacity = '1';
        travelButton.style.backgroundColor = '#16a34a';
    }
    const scenario_controls = document.getElementById('scenario-controls')
    if (scenario_controls) {scenario_controls.innerHTML = '';}
}
// #endregion


// #region :: Mapping functions 
// ────────────────────────────────────────────────────────────────────
//                          Mapping Functions
// ────────────────────────────────────────────────────────────────────

function mapOutcome (schema: z.infer<typeof OutcomeSchema>): Outcome {
    return new Outcome(
        schema.text,
        {
            cash: -schema.cost,
            equipment: -schema.damage,
            health: -schema.health,
            luck: +schema.luck,
        }
    )
}
function mapOptions (schema: z.infer<typeof ActionSchema>[]): Option[] {
    let options = []
    for (const option of schema) {
        options.push(
            new Option(
                option.text,
                mapOutcome(option.success),
                mapOutcome(option.failure),
                option.chance,
            )
        )
    }
    return options
}
function mapScenario (schema: z.infer<typeof DilemmaSchema>): Scenario {
    return new Scenario(
        schema.title,
        schema.description,
        mapOptions(schema.options)
    );
}
// #endregion


// #region :: Game Functions 
// ────────────────────────────────────────────────────────────────────
//                          Game Functions
// ────────────────────────────────────────────────────────────────────

function gameInitialize(profession_id:string) {
    player = new Player(getProfessionById(profession_id), TOTAL_DISTANCE);
    uiUpdate(); 
    uiLogMessage(`You chose: ${player.profession.name}. Starting with $${player.stats.cash.value}, ${player.stats.equipment.value}% Laptop, and ${player.stats.health.value}% Mental Health.`, 'text-green-600 font-bold');
    gameFetchScenario();
}
function gameRollStat (
    range: number,
    offset: number = 0,
): number {
    return Math.floor((Math.random() * range) + offset)
}
function gameRollTravel () {
    if (isProcessing || !player.isAlive()) return;
    isProcessing = true;

    uiTravel()
    const effect: Stats = {
        cash: -gameRollStat(150, 50),
        equipment: -gameRollStat(5),
        health: -gameRollStat(7),
        distance: gameRollStat(300, 100),
    }

    player.affect(effect)
    uiLogMessage(`Traveled ${effect.distance} miles.`)

    if (player.isAlive() && !player.hasReachedGoal()) {
        gameFetchScenario();
    } else {
        uiUpdate(); 
    }
}
function gameScenarioChoice (choiceIndex:number) {
    currentScenario.choose(choiceIndex)
    player.affect(currentScenario.outcome!.effects);

    uiLogMessage(currentScenario.outcome!.text);
    uiLogMessage(gameEffectMessage(currentScenario.outcome!.effects));
    uiTravelButtonDisplay();
    uiUpdate();
}
async function gameFetchScenario () {
    isProcessing = true;
    uiLogMessage("Fetching new scenario...")

    try {
        const scenarioSchema = await parseNewScenario(currentScenario.summary());
        const scenario = mapScenario(scenarioSchema)
        currentScenario = scenario;
        uiPopMessage();
    } 
    catch (error: unknown) {console.log
        if (error instanceof z.ZodError || error instanceof Error) {
            uiLogMessage(`Using fallback.`, 'text-red-600');
            uiLogMessage(`AI Error: ${error.message}. ${error.stack}.`)
        }
        currentScenario = getRandomScenario();
    }
    uiScenario(currentScenario, gameScenarioChoice);
    isProcessing = false;
}
function gameEffectMessage (effects: Stats) {
    let output: string[] = [];
    if (effects.cash)      { output.push(`cash: ${effects.cash}`); }
    if (effects.equipment) { output.push(`laptop: ${effects.equipment}`); }
    if (effects.health)    { output.push(`mental: ${effects.health}`); }
    if (effects.distance)  { output.push(`traveled: ${effects.distance} miles`); }
    
    if (output.length > 2) 
        { return `Effects: ${output.slice(0, -1).join(", ")}, and ${output[-1]}.` }
    else if (output.length === 2) 
        { return `Effects: ${output.join(" and ")}.` }
    else 
        { return `Effect: ${output[0]}.`}
}
// #endregion
