function fatal(reason) {
    FATALITY.textContent = String(reason);
    ROOT.classList.add("fatal");
    FATAL.style.display = "block";
    GAME.style.display = "none";
}

function die() {
    fatal("im ded :(");
}

function main(CITIZENS) {
    console.info(`hiii ${CITIZENS.length} citizens!!!`);
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("/citizens.json").then(r => r.json()).then(main).catch(reason => fatal(reason))
});
