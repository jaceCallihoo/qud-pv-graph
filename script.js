let ctx1 = document.getElementById('canvas1')

new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });



function chance() {
    // get number of numers on the 1d10-2 that result in a pen
}





const pv = 6;
const av = 5;

function penRoll() {
    let totalPenetrations = 0;
    let pvPenalty = 0;

    while (true) {
        let currentPenetrations = 0;
        for (let i = 0; i < 3; i++) {
            let penetrationValue = 0;
            while (true) {
                let roll = rollDie(10) - 2;
                penetrationValue += roll;
                console.assert(roll <= 8, "roll can not be more 8")
                if (roll !== 8) {
                    break;
                }
            }

            if (penetrationValue + pv - pvPenalty > av) {
                currentPenetrations++;
            }
        }

        totalPenetrations += currentPenetrations;
        pvPenalty += 2;

        console.assert(currentPenetrations <= 3, "can not penetrate more than 3 times")
        if (currentPenetrations !== 3) {
            break;
        }
    }

    return totalPenetrations;
}

function rollDie(size) {
    return Math.floor(Math.random() * size) + 1;
}

console.log(penRoll())
