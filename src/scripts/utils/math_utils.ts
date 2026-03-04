/**
 * Restricts a value between a set of limits.
 * 
 * @param value value to set between limits.
 * @param upper_bound (optional) Upper limit for the value.
 * @param lower_bound (optional) Lower limit for the value.
 * 
 * @returns Value within limits.
 */
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

/**
 * Creates styles "width:..." string for stat bars based on values.
 * 
 * @param value Current value.
 * @param max Current value maximum.
 * 
 * @returns Formatted style width string.
 */
export function fill_width(
    value: number,
    max: number = 100,
): string {
    if (max === 0) { max = 100 }
    value = limit_value_between(value, max) 
    return `width: ${value/max}%`;
}
