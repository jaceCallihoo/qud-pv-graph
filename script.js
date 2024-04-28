// -- understanding ---------------------------------------------------------->
// Some calculations result in single fractions (chance to hit), others result
// in many (number of penetrations each have their own chance)
// Core question: how do we use these lists of fractions to understand the
// larger implications of the players statistics 

// -- data generation -------------------------------------------------------->
let data = []
let data2 = []
let labels = []
for (let i = 0; i < 40; i++) {
    let pvsGreater = i - 30;
    data.push(evaluateFraction(chanceToPenetrate(pvsGreater)) * 100)
    data2.push(evaluateFraction(dsc2(pvsGreater)) * 100)
    labels.push(pvsGreater)
}

// -- calculation ------------------------------------------------------------>
// given a set of player stats, and a set of npc stats (including health), what 
// are the odds you can kill the enemy in x attacks where x is the bottom axis 
// of the graph and y is the percentage chance
// Steps:
//  - what are the odds of hitting?
//  - (gussing) find the lowest number of times required to penetrate if you
//  rolled max damage on each damage roll
//  - because you may not actually need to roll max damaged on each, calculate
//  the odds of rolling the npcs health in damage with x penetrations
//  - Then find the number of times required to penetrate when rolling the 
//  lowest damage values
//  - The penetrations before the first are gaurenteed to fail for the given x
//  - The penetrations at and after the second ar gaurenteed to succeed for the
//  given x
//  - calculate the chances for all the ones in between
function g(playerStats, npcStats) {
    // get chance to hit
    let attackBonus = playerStats.agility + playerStats.weaponHitBonus
    let defenderDv = npcStats.dv
    // hitChance should serve as a base multiplier for all penetration chances
    let hitChance = chanceToHit(attackBonus, defenderDv)

    // x is the data for the x axis
    let x = Array(100);
    for (let i = 0; i < x.length; i++) {
        // calculate the odds of killing the npc with x attacks
        let maxDamageRoll = getMaxDamageRoll()
        // lowest amount of penetrations required in order to kill. Any amount
        // of penetrations lower than this value is gaurenteed to not kill
        let minRequiredPenetrations = Math.ceil(maxDamageRoll / npcStats.health);

        let minDamageRoll = getMinDamageRoll()
        // the minimum required penetrations gaurenteed to kill reguardless of
        // the damage roll
        let minRequierdPenetrationsGaurenteed = Math.ceil(minDamageRoll / npcStats.health);

        // total odds =
        //      odds of rolling minRequiredPenetrationsGaurenteed
        //      for each number of penetrations below 
        //      minRquiredPenetrationsGaurenteed and above / equal to 
        //      minRequiredPenetrations: add P(minRequiredPenetrations) *
        //      P(given minRequiredPenetrations dice, roll at least npcs health)
        let probabilities = Array(minRequierdPenetrationsGaurenteed - minRequiredPenetrations);
        for (let j = 0; j < probabilities; j++) {
            let numPenetrations = minRequiredPenetrations + j;
            let numDice = numPenetrations * npc.weapon.dice 

        }
    }
}

function getMinDamageRoll(numDice, dieSize) {
    return numDice * 1;
}

function getMaxDamageRoll(numDice, dieSize) {
    return numDice * dieSize;
}

// given a set of player stats and a set of npc stats (excluding health), what
// how many att
function successfulAttackChance() {

}

function chanceToHit(attackBonus, defenderDv) {
    let hitTarget = defenderDv - attackBonus;
    if (hitTarget <= 1) {
        return new Fraction(1, 1);
    }
    if (hitTarget > 20) {
        return new Fraction(0, 1)
    }
    return new Fraction(21 - hitTarget, 20);
}

function chanceToPenetrate(pvsGreater) {
    let dsc = dsc2(pvsGreater);
    let dieFailureChance = complementFraction(dsc)

    let penetrationFailureChance = multiplyFraction(multiplyFraction(dieFailureChance, dieFailureChance), dieFailureChance)
    return complementFraction(penetrationFailureChance)
}

// minReqDieRoll: the lowest number you can roll on teh d10 in order to penetrate
// num8sReq: the number of 10s you must roll on the d10 in order for minReqDieRoll to be above 0
function dsc2(pvsGreater) {
    let minimumPenetratingDieRoll = 3 - pvsGreater;

    // if we are gaurenteed to roll the number required, the chance is 100%
    if (minimumPenetratingDieRoll <= 1) {
        return new Fraction(1, 1);
    }

    // calcule how many eights are neded to be rolled in order to get a penetration 
    let numEightsRequiredToPenetrate = Math.floor((minimumPenetratingDieRoll - 2) / 8);
    minimumPenetratingDieRoll -= numEightsRequiredToPenetrate * (10 - 2);
    let baseMultiplier = new Fraction(1, Math.pow(10, numEightsRequiredToPenetrate))
    
    return new Fraction(11 - minimumPenetratingDieRoll, 10).multiply(baseMultiplier);
}

// -- graphs ----------------------------------------------------------------->
let ctx1 = document.getElementById('canvas1')

console.log(data2)

new Chart(ctx1, {
    type: 'line',
    data: {
        labels,
        datasets: [
            {
                label: 'Chance for triplet penetrate',
                data: data,
                borderWidth: 1
            },
            {
                label: 'Chance for singlet to penetrate',
                data: data2,
                borderWidth: 2
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        animation: false
    }
});

