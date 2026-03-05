
import { ActionSchema, DilemmaSchema, OutcomeSchema, parseNewScenario } from "./api/generate_scenario.js";
import { getProfessionById, ListRandomProfessions } from "./game/content/professions";
import { getRandomScenario } from "./game/content/scenarios/index.js";
import type { GameStateSummary } from "./game/types/game-state.js";
import { Player } from "./game/types/player.js";
import type { Option, Outcome, Scenario } from "./game/types/scenario.js";
import type { Stats } from "./game/types/stats.js";
import { JourneyLogView, PlayerInfoView, ScenarioView, TitleBarView } from "./ui";
import { z } from "zod";

// Game Configuration
const START_CITY = "New York City, NY";
const END_CITY = "San Francisco, CA";
const TOTAL_DISTANCE = 3000;

let player: Player;
let isProcessing: boolean = false;
let currentScenario: Scenario; 

// Functions
function effectMessage (effects: Stats) {
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
function logMessage (
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
function rollForTravel() {
    if (isProcessing || !player.isAlive()) return;
    isProcessing = true;
    
    const scenarioDisplay = document.getElementById('scenario-display');
    const scenarioControls = document.getElementById('scenario-controls');

    const scenario_display_text = Object.assign(
        document.createElement('p'), {
            className: "text-lg text-indigo-700 font-semibold",
            textContent: "Traveling...",
    });
    if (scenarioDisplay) scenarioDisplay.appendChild(scenario_display_text); 
    if (scenarioControls) scenarioControls.innerHTML = ''; 
    
    const distance = Math.floor(Math.random() * 300) + 100;
    const cost = Math.floor(Math.random() * 150) + 50;
    const damage = Math.floor(Math.random() * 5);
    const health = Math.floor(Math.random() * 7);
    player.affect({
        cash: -cost,
        equipment: -damage,
        health: -health,
        distance: +distance,
    })
    logMessage(`Traveled ${distance} miles.`)
    updateUI();
    
    if (player.isAlive() && !player.hasReachedGoal()) {
        fetchScenarioFromAI();
    } else {
        updateUI(); 
    }
}
function mapOutcome (schema: z.infer<typeof OutcomeSchema>): Outcome {
    return {
        text: schema.text,
        effects: {
            cash: -schema.cost,
            equipment: -schema.damage,
            health: -schema.health,
            luck: +schema.luck,
        }
    }
}
function mapOption (schema: z.infer<typeof ActionSchema>): Option {
    return {
        text: schema.text,
        chance: schema.chance,
        success: mapOutcome(schema.success),
        failure: mapOutcome(schema.failure),
    }
}
function mapScenario (schema: z.infer<typeof DilemmaSchema>): Scenario {
    return {
        text: schema.title,
        description: schema.description,
        options: schema.options.map(mapOption)
    };
}

function getCurrentStateSummary (): GameStateSummary {
    if (!currentScenario) {
        return {
            scenario: "new game",
            attempt: "started game",
            profession: player.profession.name,
        }
    } else {
        return {
            scenario: currentScenario.description ?? "",
            attempt: currentScenario.outcome!.text,
            profession: player.profession.name,
        }
    }
}
async function fetchScenarioFromAI() {
    isProcessing = true;
    try {
        logMessage("Fetching new scenario...")
        const scenario = await parseNewScenario(getCurrentStateSummary());
        currentScenario = mapScenario(scenario);
    } 
    catch (error: unknown) {
        if (error instanceof z.ZodError || error instanceof Error) {
            logMessage(`Using fallback.`, 'text-red-600');
            logMessage(`AI Error: ${error.message}. ${error.stack}.`)
        }
        currentScenario = getRandomScenario();
    }
    displayCurrentScenario();
    isProcessing = false;
}

function displayCurrentScenario() {
    if (!currentScenario) return; 
    const scenarioDisplay = document.getElementById('scenario-display');
    const scenarioControls = document.getElementById('scenario-controls');
    const travelButton = document.getElementById('travel-button') as HTMLButtonElement;

    const scenario_title = Object.assign(
        document.createElement('h3'), {
            className: "text-xl font-semibold mb-4 text-indigo-800", 
            textContent: `${currentScenario.text}`, 
    });
    const scenario_description = Object.assign(
        document.createElement('p'), {
            className: "text-gray-700", 
            textContent: `${currentScenario.description}`
    });
    if (scenarioDisplay) {
        scenarioDisplay.replaceChildren(
            scenario_title,
            scenario_description,
        )
    }

    if (scenarioControls) {
        scenarioControls.innerHTML = ''; 

        currentScenario.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.className = 'w-full px-4 py-2 mb-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-md';
            button.onclick = () => handleScenarioChoice(index);
            scenarioControls.appendChild(button);
        });
    }

    if (travelButton) {
        travelButton.disabled = true;
        travelButton.style.opacity = '0.5';
    }
    updateUI();
}

function handleScenarioChoice(choiceIndex:number) {
    const choice: Option | undefined = currentScenario.options[choiceIndex];
    if (!choice) { return; }
    
    const roll = Math.random()*100;
    const chance = choice.chance ?? 50;
    const success = roll < chance;
    console.log(`Rolled: ${roll}, against ${chance} : result: ${success}`)


    if (success) { currentScenario.outcome = choice.success; }
    else { currentScenario.outcome = choice.failure; }
    
    player.affect(currentScenario.outcome.effects)
    logMessage(currentScenario.outcome.text)
    logMessage(effectMessage(currentScenario.outcome.effects))

    const travelButton = document.getElementById('travel-button') as HTMLButtonElement;
    if (travelButton) {
        travelButton.disabled = false;
        travelButton.style.opacity = '1';
        travelButton.style.backgroundColor = '#16a34a';
    }
    const scenario_controls = document.getElementById('scenario-controls')
    if (scenario_controls) {scenario_controls.innerHTML = '';}
    updateUI();
}

function updateUI() {
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
    if (player.hasReachedGoal() && player.isAlive()) {endGame(true);}
    else if (!player.isAlive()) {endGame(false);}
}

function endGame(isWin:boolean) {
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

function initializeGameLayout() {
    const gameArea = document.getElementById('app');
    const game = Object.assign(
        document.createElement('div'), {
            id: "game", 
            className: "max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl", 
    });
    const title = new TitleBarView("The Ai Nomad Trail");
    const player_card = new PlayerInfoView();
    const scenario_card = new ScenarioView("scenario-display", "scenario-title", "scenario-description", "scenario-hint");
    // const options_card = new Options("action-controls", "scenario-controls", "travel-button",);
    const log_card = new JourneyLogView("log-container", "log-area");

    /* options panel */
    const options_panel = Object.assign(
        document.createElement('div'), {
            id: "action-controls",
            className: "space-y-4",
    });
    const options_panel_grid = Object.assign(
        document.createElement('div'), {
            id: "scenario-controls", 
            className: "space-y-4"
    });
    const options_panel_continue = Object.assign(
        document.createElement('button'), {
            id: "travel-button",
            onclick: rollForTravel,
            style: "background-color: #9ca3af; cursor: not-allowed; opacity: 0.7;",
            className: "w-full px-4 py-3 mt-4 text-white font-bold rounded-lg",
            textContent: "Continue Journey (Travel & Risk New Event)", 
    });
    options_panel.replaceChildren(
        options_panel_grid,
        options_panel_continue,
    )

    /* build the dom */
    game.replaceChildren(
        title.element(),
        player_card.element(),
        scenario_card.element(),
        options_panel,
        log_card.element(),
    );
    if (gameArea) {gameArea.appendChild(game);}
}

function startInteractionLoop(profession_id:string) {
    player = new Player(getProfessionById(profession_id), TOTAL_DISTANCE);
    updateUI(); 
    logMessage(`You chose: ${player.profession.name}. Starting with $${player.stats.cash.value}, ${player.stats.equipment.value}% Laptop, and ${player.stats.health.value}% Mental Health.`, 'text-green-600 font-bold');
    fetchScenarioFromAI();
}

function showProfessionSelection() {
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
        const new_professions = ListRandomProfessions();
        new_professions.forEach(profession => {
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
                startInteractionLoop(profession.id);
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

// Initialize game
initializeGameLayout();
showProfessionSelection();
