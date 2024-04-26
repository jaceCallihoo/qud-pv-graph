// -- log test --------------------------------------------------------------->

function x() {
    dsc2(1)
}
x()

for (let i = 0; i < 20; i++) {
    let pvsGreater = i - 10;
    let {numerator, denominator} = dieSuccessChance(pvsGreater);
    let num = numerator / denominator;
    let inv = 1.0 - num;
    let hit = 1.0 - (inv * inv * inv);
    let minimumPenetratingDieRoll = 3 - pvsGreater;
    console.log({pvsGreater, num, inv, minimumPenetratingDieRoll, hit, hit2: evaluateFraction(f(pvsGreater)), hit3: evaluateFraction(f2(pvsGreater))}) 
}

// -- data generation -------------------------------------------------------->
let data = []
let data2 = []
let labels = []
for (let i = 0; i < 30; i++) {
    let pvsGreater = i - 20;
    data.push(evaluateFraction(f(pvsGreater)) * 100)
    data2.push(evaluateFraction(f2(pvsGreater)) * 100)
    labels.push(pvsGreater)
}

// -- calculation ------------------------------------------------------------>
//  if rolling the d10-2 wont penetrate
//      add 8 to the roll and multiply the output by 1/10 for each 8 required
//  if the roll is garenteed to hit
//      return 1/1
//  if the roll needed to hit is 7
//      return (minD10RollNeeded / 10) * ...
//  if the roll needed to hit is 8
//      return (89 / 100) * ...
//  else
//      error
//
function f(pvsGreater) {
    let dsc = dieSuccessChance(pvsGreater);
    let dieFailureChance = complementFraction(dsc)

    let penetrationFailureChance = multiplyFraction(multiplyFraction(dieFailureChance, dieFailureChance), dieFailureChance)
    return complementFraction(penetrationFailureChance)
    // return penetrationChance.numerator / penetrationChance.denominator
}

function f2(pvsGreater) {
    let dsc = dsc2(pvsGreater);
    let dieFailureChance = complementFraction(dsc)

    let penetrationFailureChance = multiplyFraction(multiplyFraction(dieFailureChance, dieFailureChance), dieFailureChance)
    return complementFraction(penetrationFailureChance)
}

// minReqDieRoll: the lowest number you can roll on teh d10 in order to penetrate
// num8sReq: the number of 10s you must roll on the d10 in order for minReqDieRoll to be above 0
function dsc2(pvsGreater) {
    if (pvsGreater == -5) {
    }
    let minimumPenetratingDieRoll = 3 - pvsGreater;

    // if we are gaurenteed to roll the number required, the chance is 100%
    if (minimumPenetratingDieRoll <= 1) {
        return { numerator: 1, denominator: 1 };
    }

    // calcule 
    let numEightsRequiredToPenetrate = Math.floor((minimumPenetratingDieRoll - 2) / 8);
    console.log(numEightsRequiredToPenetrate)
    minimumPenetratingDieRoll -= numEightsRequiredToPenetrate * (10 - 2);
    let baseMultiplier = { numerator: 1, denominator: Math.pow(10, numEightsRequiredToPenetrate) }
    
    if (minimumPenetratingDieRoll <= 9) {
        return multiplyFraction({ numerator: 11 - minimumPenetratingDieRoll, denominator: 10 }, baseMultiplier)
    }

    // if we need to roll a 10 on the d10 to penetrate, that means that there 
    // there is a 1/10 possibility on the *re-roll* that we will get a -1 and
    // the final value will not penetrate. Because all other values result in a
    // penetration, the odds are 1/10 * 9/10 = 9/100
    if (minimumPenetratingDieRoll == 10) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
        return multiplyFraction({ numerator: 89, denominator: 100 }, baseMultiplier)
    }

    console.error("Should not go here :(")
}

function dieSuccessChance(pvsGreater) {
    // get number of numbers on the 1d10-2 that result in a pen
    // what are the odds of rolling one penetration?
    //      = the inverse odds of rolling none
    // what are the odds of rolling three?
    //      = the odds of rolling a penetration ^3

    
    // what are the odds of rolling the target number?
    // if they are <= 8, it is x/8 where x is the target number - 7
    // if its > 8, add 8 to the target value, then do the above calculation, but multiply the fraction by 1/8
    let minimumPenetratingDieRoll = 3 - pvsGreater;
    if (minimumPenetratingDieRoll <= 1) {
        // is 100 %
        return { numerator: 1, denominator: 1 };
    }

    // todo: this is probably wrong
    // could probably move this above and just set a denominator modifier based
    // on how many eights are needed to be rolled in order to penetrade
    if (minimumPenetratingDieRoll > 10) {
        // caulculate the mooore
        // see how many times we need to add 10 to the d10 in order to get it below 8
        let numTens = Math.floor(minimumPenetratingDieRoll / 8);
        minimumPenetratingDieRoll -= numTens * (10 - 2);
        return multiplyFraction(
            {numerator: 11 - minimumPenetratingDieRoll, denominator: 10},
            {numerator: 1, denominator: Math.pow(10, numTens)}
        );
        // return { numerator: 11 - minimumPenetratingDieRoll, denominator: Math.pow(10, (numEights + 1)) }
    }

    return { numerator: 11 - minimumPenetratingDieRoll, denominator: 10 }
}

// -- fraction helpers ------------------------------------------------------->
function invertFraction(a) {
    console.assert(validateFraction(a))
    return {
        numerator: a.denominator,
        denominator: a.numerator
    };
}

function complementFraction(a) {
    console.assert(validateFraction(a))
    return {
        numerator: a.denominator - a.numerator,
        denominator: a.denominator
    };
}

function multiplyFraction(a, b) {
    console.assert(validateFraction(a))
    console.assert(validateFraction(b))
    return {
        numerator: a.numerator * b.numerator,
        denominator: a.denominator * b.denominator
    };
}

function evaluateFraction(a) {
    console.assert(validateFraction(a))
    console.assert(a.numerator && a.denominator)
    return a.numerator / a.denominator;
}

function validateFraction(a) {
    return (
        'numerator' in a &&
        'denominator' in a &&
        Number.isInteger(a.numerator) &&
        Number.isInteger(a.denominator)
    )
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
                label: 'Chance to penetrate',
                data: data,
                borderWidth: 1
            },
            {
                label: 'C',
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

