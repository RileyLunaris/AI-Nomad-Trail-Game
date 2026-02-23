export function shuffle_array<T>(list: T[]): T[] {
    // Make a shallow copy so we don't mutate the original
    const array = list.slice();

    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        const temp = array[i]!;
        array[i] = array[j]!;
        array[j] = temp;
    }
    return array;
}
