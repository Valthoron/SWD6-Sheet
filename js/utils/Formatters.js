function pipsToDice(totalPips) {
    let dice = Math.floor(totalPips / 3);
    let pips = totalPips % 3;

    if (pips === 0)
        return dice + "D";

    return dice + "D+" + pips;
}
