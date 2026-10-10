document.addEventListener("DOMContentLoaded", function () {
    function fatal(reason) {
        FATALITY.textContent = String(reason);
        ROOT.classList.add("fatal");
        FATAL.style.display = "block";
    }

    fetch("/citizens.json").then(r => r.json()).then(CITIZENS => {
        const msg = `hiii ${CITIZENS.length} citizens!!!`;
        fatal(msg);
        console.info(msg);
    }).catch(reason => fatal(reason))
});
