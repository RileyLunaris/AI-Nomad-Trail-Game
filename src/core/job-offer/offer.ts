
// ═══════════════════════════════════════════════════════════════════════════
//                                  Emails
// ═══════════════════════════════════════════════════════════════════════════

import { shuffleArray } from "@/scripts/utils"
import { bodies, closings, companies, introductions, salutations, signatures, subjects } from "./def"
import type { Email } from "./types"


export function fetchJobOffer(): Email {
    return {
        subject: [
            shuffleArray(subjects)[0],
        ].join(),
        body: [
            shuffleArray(salutations)[0],
            shuffleArray(introductions)[0],
            shuffleArray(bodies)[0],
            shuffleArray(closings)[0],
        ].join("\n\n"),
        signature: [
            shuffleArray(companies)[0],
            shuffleArray(signatures)[0],
        ].join("\n")
    }
}
