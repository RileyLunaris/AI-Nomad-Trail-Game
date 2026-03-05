import type { Scenario } from "../../types";

export const FIREWALL_FIASCO: Scenario = {
    text: "Firewall Fiasco",
    description: "You realize that you've been browsing the web at your local coffee shop and your firewall was disabled. In an attempt to bring it back, your cause your webpage to catch fire.",
    options: [
        {
            text: "spray computer with a fire extinguiser",
            success: {
                text: "the web page only lost a few pesky ad's making your browsing more efficient.",
                effects: {
                    equipment: +5,
                },
            },
            failure: {
                text: "your firewall was suppressed again and your keyboard is full of white foam.",
                effects: {
                    equipment: -25,
                },
            },
        }, 
        {
            text: "Install and run 'firefix'",
            success: {
                text: "The program works! your firewall is back and the webpage is restored!", 
                effects:{
                    cash: -50,
                    equipment: -5,
                    health: -1,
                },
            },
            failure: {
                text: "Your webpage is smoldering, your fans are spinning out of control, your firewall is still down, and you are pretty sure you just installed malware.", 
                effects: {
                    cash: -20,
                    equipment: -35,
                    health: -5,
                },
            },
        },
    ],
};
