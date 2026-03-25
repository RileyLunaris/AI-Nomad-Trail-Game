// old imports
import { ActionSchema, DilemmaSchema, OutcomeSchema, parseNewScenario } from "./scripts/api/generate_scenario.js";
import { getProfessionById, ListRandomProfessions } from "./scripts/game/content/professions/index.js";
import { getRandomScenario } from "./scripts/game/content/scenarios/index.js";
import { Player } from "./scripts/game/types/player.js";
import { Option, Outcome, Scenario, type Profession, type Stats } from "./scripts/game/types/index.js";
import { JourneyLogView, PlayerInfoView, ScenarioView, TitleBarView } from "./scripts/ui/index.js";
import { z } from "zod";
import { OptionsView } from "./scripts/ui/views/options-view.js";

// New Imports
import { EventBus } from "@/events"
import { GameEngine } from "./core/game/engine.js";
import { ScreenController, ScreenManager } from "@/ui";

// Game Configuration
const START_CITY = "New York City, NY";
const END_CITY = "San Francisco, CA";
const TOTAL_DISTANCE = 3000;

let player: Player;
let isProcessing: boolean = false;
let currentScenario: Scenario = new Scenario(); 

// Containers
const game_container = document.getElementById("app")
const dev_window = document.createElement("div")
game_container?.append(dev_window)

// User Interface
const bus = new EventBus()
const man = new ScreenManager(dev_window)
const ctlr = new ScreenController(bus, man)
ctlr.subscribe()
const game = new GameEngine(bus)


// #region Old User Interface
// ───────────────────────────────────────────────────────────────────────


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
    const options_card = new OptionsView("action-controls", "scenario-controls", "travel-button", travel_action);
    const log_card = new JourneyLogView("log-container", "log-area");

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
// ───────────────────────────────────────────────────────────────────────
// #region Mapping functions 


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
// ───────────────────────────────────────────────────────────────────────
// #region Game Functions 


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
