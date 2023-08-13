/*
 * This project was created by Donovan Adrian and any
 * edits or changes must be confirmed as valid by Donovan
 * with written consent under any circumstance.
 */

let colorShifter;

window.onload = function() {
    backgroundAlternator();

    function backgroundAlternator() {
        let nowBackground = 0;
        let alternator = 0;
        colorShifter = setInterval(function () {
            nowBackground = nowBackground + 1000;
            if (nowBackground >= 15000) {
                nowBackground = 0;
                if (alternator == 0) {
                    alternator++;
                    document.body.style.background = "#0041a3";
                } else if (alternator == 1) {
                    alternator++;
                    document.body.style.background = "#008222";
                } else if (alternator == 2) {
                    alternator++;
                    document.body.style.background = "#0b8781";
                } else if (alternator == 3) {
                    alternator++;
                    document.body.style.background = "#870b0b";
                } else {
                    alternator = 0;
                    document.body.style.background = "#700b87";
                }
            }
        }, 1000);
    }
};
