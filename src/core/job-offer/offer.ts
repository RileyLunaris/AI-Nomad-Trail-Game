
// ═══════════════════════════════════════════════════════════════════════════
//                                  Emails
// ═══════════════════════════════════════════════════════════════════════════

import { shuffleArray } from "@/scripts/utils"
import { 
    bodies, 
    closings, 
    companies, 
    introductions, 
    positions, 
    salutations, 
    signatures, 
    subjects 
} from "./components"
import type { Offer } from "."


export function fetchJobOffer(position_title: string): Offer {
    // offer variable building
    const position_declaration = [
        shuffleArray(positions)[0],
        Math.random() < 0.9 ? position_title : "[position_title]"
    ].join(" ")

    const offer_subject = [
        shuffleArray(subjects)[0],
    ].join()

    const offer_body = [
        shuffleArray(salutations)[0],
        shuffleArray(introductions)[0],
        shuffleArray(bodies)[0],
        position_declaration,
        shuffleArray(closings)[0],
    ].join("\n\n")

    const offer_signature = [
        shuffleArray(companies)[0],
        shuffleArray(signatures)[0],
    ].join("\n")

    // Offer Construction
    return {
        position: position_title,
        subject: offer_subject,
        body: offer_body,
        signature: offer_signature,
    }
}
