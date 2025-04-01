export function pipsToDice(totalPips) {
    // Early return for zero
    if (totalPips === 0)
        return "0";

    // Handle negative values
    const isNegative = totalPips < 0;
    const absolutePips = Math.abs(totalPips);

    // Calculate dice and remaining pips
    const dice = Math.floor(absolutePips / 3);
    const pips = absolutePips % 3;

    // Form the result
    let result = "";

    if (dice > 0)
        result = (isNegative ? "-" : "") + dice + "D";

    if (pips > 0)
        result += (isNegative ? "-" : "+") + pips;

    return result;
}
