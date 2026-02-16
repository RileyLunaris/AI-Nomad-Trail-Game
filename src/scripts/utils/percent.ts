export function percent(value:number): string {
    return `${Math.min(100, Math.max(0, value)) / 100}%`;
}
