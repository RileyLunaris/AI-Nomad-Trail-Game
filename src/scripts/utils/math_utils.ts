export function limit_value_between(
    value: number,
    upper_bound: number = 100,
    lower_bound: number = 0,
) {
    return Math.min(
        Math.max(lower_bound, value), 
        upper_bound
    )
}

export function fill_width(value:number): string {
    return `width: ${limit_value_between(value) / 100}%`;
}
