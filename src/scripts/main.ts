
import { z, DilemmaSchema, parse_new_scenario } from "./api/generate_scenario.js";
// import { z } from "zod";

// Game Configuration
const START_CITY = "New York City, NY";
const END_CITY = "San Francisco, CA";
const TOTAL_DISTANCE = 3000;
interface Profession {
    name:string, 
    description:string,
    cash:number,
    laptop:number,
    mental:number,
}
const PROFESSIONS: Profession[] = [
    { name: "AI Prompt Engineer", cash: 3500, laptop: 100, mental: 90, description: "High income, high burnout risk." },
    { name: "Content Creator", cash: 2500, laptop: 95, mental: 100, description: "Flexible schedule, unpredictable income." },
    { name: "DevOps Consultant", cash: 3000, laptop: 100, mental: 100, description: "Stable income, heavy reliance on equipment." }
];

class Player {
    profession:string;
    distance:number;
    cash:number;
    laptop_health:number;
    mental_health:number;
    is_alive:boolean;
    game_over_reason:string;

    constructor(professionName:string) {
        
        const professionData = PROFESSIONS.find(p => p.name === professionName) || PROFESSIONS[0]!;
        this.profession = professionName;
        this.distance = 0;
        this.cash = professionData.cash;
        this.laptop_health = professionData.laptop;
        this.mental_health = professionData.mental;
        this.is_alive = true;
        this.game_over_reason = "";
    }

    clamp(value:number, min:number, max:number) { 
        return Math.max(min, Math.min(max, value)); 
    }
    applyEffect(cash:number, laptop:number, mental:number, outcomeText:string) {
        this.cash += cash;
        this.laptop_health = this.clamp(this.laptop_health + laptop, 0, 100);
        this.mental_health = this.clamp(this.mental_health + mental, 0, 100);
        const cashDisplay = cash >= 0 ? `+${cash}` : `${cash}`;
        this.logMessage(`Outcome: ${outcomeText} (Cash: $${cashDisplay}, Laptop: ${laptop}%, Mental: ${mental}%)`, 'text-blue-600');
        this.checkGameOver();
    }
    
    checkGameOver() {
        if (this.cash <= 0) { this.game_over_reason = "You ran out of cash."; this.is_alive = false; }
        if (this.laptop_health <= 0) { this.game_over_reason = "Your laptop failed."; this.is_alive = false; }
        if (this.mental_health <= 0) { this.game_over_reason = "You burned out."; this.is_alive = false; }
        return !this.is_alive;
    }

    logMessage(text:string, colorClass:string = 'text-gray-800') {
        const log = document.getElementById('log-area');
        const p = document.createElement('p');
        p.className = `text-sm mb-1 ${colorClass}`;
        p.textContent = text;
        if (log) log.prepend(p);
    }
}

let player: Player;
let isProcessing: boolean = false;
interface ScenarioOption {
    text: string;
    cash: number;
    laptop: number;
    mental: number;
    luck: number;
    outcome: string;
}
interface Scenario {
    text: string;
    description: string;
    options: ScenarioOption[];
}
let currentScenario: Scenario; 

function rollForTravel() {
    if (isProcessing || !player.is_alive) return;
    isProcessing = true;
    
    const scenarioDisplay = document.getElementById('scenario-display');
    const scenarioControls = document.getElementById('scenario-controls');
    
    const scenario_display_text = Object.assign(document.createElement('p'), {
            className: "text-lg text-indigo-700 font-semibold",
            textContent: "Traveling...",
    });
    if (scenarioDisplay) scenarioDisplay.appendChild(scenario_display_text); 
    if (scenarioControls) scenarioControls.innerHTML = ''; 
    
    const distanceTraveled = Math.floor(Math.random() * 300) + 100;
    const cost = Math.floor(Math.random() * 150) + 50;
    player.distance += distanceTraveled;
    player.applyEffect(-cost, -2, -5, `Traveled ${distanceTraveled} miles.`);
    updateUI();
    
    if (player.is_alive && player.distance < TOTAL_DISTANCE) {
        fetchScenarioFromAI();
    } else {
        updateUI(); 
    }
}

type OptionInput = string | ScenarioOption;

function mapDilemma(schemaData: z.infer<typeof DilemmaSchema>): Scenario {
  return {
    text: schemaData.title,
    description: schemaData.description,
    options: schemaData.options.map((opt) => {
      // combine multiple player_affects into single object
      const affects = opt.player_affects.reduce(
        (acc, pa) => ({
            cash: acc.cash + pa.money,
            laptop: acc.laptop + pa.damage,
            mental: acc.mental + pa.health,
            luck: acc.luck + pa.luck
        }),
        {   cash: 0,
            laptop: 0,
            mental: 0,
            luck: 0
        }
      );

      return {
        text: opt.text,
        cash: affects.cash,
        laptop: affects.laptop,
        mental: affects.mental,
        luck: affects.luck,
        outcome: opt.outcome
      };
    })
  };
}


async function fetchScenarioFromAI() {
    isProcessing = true;
    try {
        const current_state = {
            last_scenario: {
                title: "Man charged with arson for burning down webpage.",
                action: "spray computer with fire extinguiser",
            },
            locations: {
                target: END_CITY,
                origin: START_CITY,
            },
            player: {
                profession: player.profession,
                stats: {
                    cash: player.cash,
                    equipment: player.laptop_health,
                    health: player.mental_health,
                    luck: 50,
                }
            }
        }
        const scenario = await parse_new_scenario(current_state);
        currentScenario = mapDilemma(scenario);
        
    } catch (error: unknown) {
        if (error instanceof z.ZodError || error instanceof Error) {
            player.logMessage(`AI Error: ${error.message}. Using fallback.`, 'text-red-600');
        }
        currentScenario = {
            text: "A technical glitch occurred.",
            description: "You must troubleshoot now.",
            options: [
                { 
                    text: "Fix it quickly",
                    cash: -50, laptop: 5,
                    mental: 0,
                    luck: -5,
                    outcome: "Patched successfully." 
                },
                { 
                    text: "Ignore and rest", 
                    cash: 0, 
                    laptop: -10, 
                    mental: 10, 
                    luck: 10,
                    outcome: "Feeling refreshed but buggy."
                }
            ]
        };
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

    /* log panel */
    const log_panel = Object.assign(
        scenario_title,
        scenario_description,
    );

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
    const choice = currentScenario.options[choiceIndex];
    if (choice) {
        player.applyEffect(
            choice.cash || 0,
            choice.laptop || 0,
            choice.mental || 0,
            choice.outcome || "Action taken."
        );
    }
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
    if (cash_value) {cash_value.textContent = `$${player.cash}`;}
    const laptop_fill = document.getElementById('laptop-fill')
    if (laptop_fill) {laptop_fill.style.width = `${player.laptop_health}%`;}
    const laptop_label = document.getElementById('laptop-label')
    if (laptop_label) {laptop_label.textContent = `Laptop: ${player.laptop_health}%`;}
    const mental_fill = document.getElementById('mental-fill')
    if (mental_fill) {mental_fill.style.width = `${player.mental_health}%`;}
    const mental_label = document.getElementById('mental-label')
    if (mental_label) {mental_label.textContent = `Mental: ${player.mental_health}%`;}
    const progress = Math.min(1, (player.distance / TOTAL_DISTANCE)) * 100;
    const progress_fill = document.getElementById('progress-fill')
    if (progress_fill) {progress_fill.style.width = `${progress}%`;}
    const distance_value = document.getElementById('distance-value')
    if (distance_value) {distance_value.textContent = `${player.distance} / ${TOTAL_DISTANCE} miles`;}
    
    const player_profession_title = Object.assign(document.createElement('div'), {
            className: "font-bold text-2xl text-indigo-700", 
            textContent: `${player.profession}`, 
    });
    const status_info = document.getElementById('status-info')
    if (status_info) {status_info.replaceChildren(player_profession_title);}
    if (player.distance >= TOTAL_DISTANCE && player.is_alive) {endGame(true);}
    else if (!player.is_alive) {endGame(false);}
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
    const title = Object.assign(
        document.createElement('h1'), {
            className: "text-4xl font-extrabold text-indigo-700 mb-6 border-b pb-3",
            textContent: "The 2025 AI Nomad Trail",
    });
    
    /* player panel */
    const player_panel = Object.assign(
        document.createElement('div'), {
            id: "player-panel"
    });
    const player_panel_profession = Object.assign(
        document.createElement('div'), {
            id: "status-info",
            className: "mb-6"
    });
    const player_status_grid = Object.assign(
        document.createElement('div'), {
            className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6",
    });
    
    /* player money card */
    const player_stat_money_card = Object.assign(
        document.createElement('div'), {
            className: "bg-gray-100 p-4 rounded-lg shadow-inner",
    });
    const player_stat_money_label = Object.assign(
        document.createElement('div'), {
            className: "font-bold text-gray-700 mb-2",
            textContent: "Cash: ",
    });
    const player_stat_money_value = Object.assign(
        document.createElement('span'), {
            id:"cash-value",
            className: "text-green-600",
    });
    player_stat_money_card.replaceChildren(
        player_stat_money_label,
        player_stat_money_value,
    );
    
    /* player equipment card */
    const player_stat_equipment_card = Object.assign(
        document.createElement('div'), {
            className: "bg-gray-100 p-4 rounded-lg shadow-inner", 
    });
    const player_stat_equipment_label = Object.assign(
        document.createElement('p'), {
            id: "laptop-label", 
            className: "text-sm text-gray-700 mb-1", 
            textContent: "Laptop Health: 100%", 
    });
    const player_stat_equipment_bar = Object.assign(
        document.createElement('div'), {
            className: "stat-bar bg-gray-300", 
    });
    const player_stat_equipment_bar_fill = Object.assign(
        document.createElement('div'), {
            id: "laptop-fill", 
            className: "stat-fill bg-green-500", 
            style: "width: 100%;", 
    });
    player_stat_equipment_bar.appendChild(player_stat_equipment_bar_fill);
    player_stat_equipment_card.replaceChildren(
        player_stat_equipment_label, 
        player_stat_equipment_bar, 
    );
    
    /* player health card */
    const player_stat_health_card = Object.assign(
        document.createElement('div'), {
            className: "bg-gray-100 p-4 rounded-lg shadow-inner", 
    });
    const player_stat_health_label = Object.assign(
        document.createElement('p'), {
            id: "mental-label", 
            className: "text-sm text-gray-700 mb-1",
            textContent: "Mental Health: 100%",
    });
    const player_stat_health_bar = Object.assign(
        document.createElement('div'), {
            className: "stat-bar bg-gray-300",
    });
    const player_stat_health_bar_fill = Object.assign(
        document.createElement('div'), {
            id: "mental-fill",
            className: "stat-fill bg-yellow-500",
    });
    player_stat_health_bar.appendChild(player_stat_health_bar_fill);
    player_stat_health_card.replaceChildren(
        player_stat_health_label,
        player_stat_health_bar,
    );
    /* progress bar */
    const player_progress_card = Object.assign(
        document.createElement('div'), {
    });
    const player_progress_bar = Object.assign(
        document.createElement('div'), {
            className:"bg-gray-200 h-3 rounded-full mb-8",
    });
    const player_progress_bar_fill = Object.assign(
        document.createElement('div'), {
            id: "progress-fill",
            className: "progress-bar h-full bg-indigo-500 rounded-full", 
            style: "width: 0%;",
    });
    const player_progress_value = Object.assign(
        document.createElement('p'), {
            id: "distance-value",
            className:"text-sm text-gray-500",
    });
    player_progress_bar.appendChild(player_progress_bar_fill);
    player_progress_card.replaceChildren(
        player_progress_value,
        player_progress_bar,
    );

    /* scenario panel */
    const scenario_panel = Object.assign(
        document.createElement('div'), {
            id: "scenario-display", 
            className: "bg-indigo-50 p-6 rounded-lg shadow-inner mb-6", 
    });
    const scenario_panel_title = Object.assign(
        document.createElement('h3'), {
            id: "scenario-title", 
            className: "text-xl font-semibold text-indigo-800", 
            textContent: "Choose Your Path", 
    });
    const scenario_panel_description = Object.assign(
        document.createElement('p'), {
            id: "scenario-description", 
            className: "text-gray-700 mt-2", 
            textContext: "Select your digital nomad profession to begin your journey."
    });
    const scenario_panel_hint = Object.assign(
        document.createElement('p'), {
            id: "scenario-hit", 
            className: "text-gray-700 mt-2", 
    });
    scenario_panel.replaceChildren(
        scenario_panel_title,
        scenario_panel_description,
        scenario_panel_hint,
    );

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

    /* log panel */
    const log_panel = Object.assign(
        document.createElement('div'), {
            id: "log-container",
            className: "mt-8 pt-4 border-t",
    }); 
    const log_panel_header = Object.assign(
        document.createElement('h4'), {
            className: "text-lg font-semibold text-gray-800 mb-2",
            textContent: "Journey Log",
    });
    const log_panel_output = Object.assign(
        document.createElement('div'), {
            id: "log-area", 
            className: "h-32 overflow-y-scroll bg-gray-50 p-3 rounded border",
    });
    log_panel.replaceChildren(
        log_panel_header, 
        log_panel_output, 
    );

    /* build the dom */
    player_status_grid.replaceChildren(
        player_stat_money_card,
        player_stat_equipment_card,
        player_stat_health_card,
    );
    player_panel.replaceChildren(
        player_panel_profession,
        player_status_grid,
        player_progress_card,
    )
    game.replaceChildren(
        title,
        player_panel,
        scenario_panel,
        options_panel,
        log_panel
    );
    if (gameArea) {gameArea.appendChild(game);}
}

function startInteractionLoop(professionName:string) {
    player = new Player(professionName);
    updateUI(); 
    player.logMessage(`You chose: ${player.profession}. Starting with $${player.cash}, ${player.laptop_health}% Laptop, and ${player.mental_health}% Mental Health.`, 'text-green-600 font-bold');
    fetchScenarioFromAI();
}

function showProfessionSelection() {
    const scenarioDisplay = document.getElementById('scenario-display');
    const scenarioControls = document.getElementById('scenario-controls');
    const logArea = document.getElementById('log-area');
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
        PROFESSIONS.forEach(p => {
            const option_card = Object.assign(document.createElement('div'), {
                className: 'p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow',
            });
            const option_title = Object.assign(document.createElement('h4'), {
                className: "font-bold text-indigo-700", 
                textContent: p.name
            });
            const option_description = Object.assign(document.createElement('p'), {
                className: "text-sm text-gray-600 mb-2",
                textContent: p.description,
            });
            const option_stats = Object.assign(document.createElement('p'), {
                className: "text-sm text-gray-500"
            });
            const option_cash = Object.assign(document.createElement('span'), {textContent: "Cash: "});
            const option_cash_value = Object.assign(document.createElement('span'), {
                className: "text-green-600 font-semibold", 
                textContent: `$${p.cash}`,
            });
            const option_equipment = Object.assign(document.createElement('span'), {textContent: "Laptop: "});
            const option_equipment_value = Object.assign(document.createElement('span'), {textContent: `${p.laptop}%`});
            const option_health = Object.assign(document.createElement('span'), {textContent: "Mental: "});
            const option_health_value = Object.assign(document.createElement('span'), {textContent: `${p.mental}%`});
            const option_stat_divider = Object.assign(document.createElement('span'), {textContent: " | "});
            
            const button = document.createElement('button');
            button.textContent = `Start as ${p.name}`;
            button.className = 'w-full mt-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-lg';
            button.onclick = () => {
                if (travelButton) travelButton.style.display = 'block';
                startInteractionLoop(p.name);
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
    