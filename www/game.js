if (!Array.prototype.pick) {
    Object.defineProperty(Array.prototype, "pick", {
        value: function () {
            if (this.length === 0) return undefined;
            return this[Math.floor(Math.random() * this.length)];
        },
        configurable: true,
        writable: true
    });
}

function fatal(reason) {
    console.error(reason);

    FATALITY.textContent = String(reason);
    FATAL.style.display = "block";
    GAME.style.display = "none";
}

function die() {
    fatal("im ded :(");
}

function preload(citizen) {
    const wnd = document.createElement("div");
    wnd.style.display = "none";
    wnd.classList.add("ad");

    const close = document.createElement("button");
    close.classList.add("close");
    close.textContent = "X";

    close.addEventListener("click", () => {
        try {
            BUTTONS.removeChild(wnd);
        } catch {
            // ignored
        }
    });

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = citizen.link;

    const img = document.createElement("img");
    img.src = `https://neonaut.neocities.org${citizen.img}`;

    wnd.appendChild(title);
    wnd.appendChild(close);
    wnd.appendChild(img);

    BUTTONS.appendChild(wnd);

    return wnd;
}

function main(CITIZENS) {
    function preloadNext() {
        return preload(CITIZENS.pick());
    }

    for (let i = 0; i < 20; i++) {
        const dx = 200, dy = 100;

        const wnd = preloadNext();
        wnd.style.display = "grid";
        wnd.style.position = "absolute";
        wnd.style.left = `${12 + (i % 4) * dx}px`;
        wnd.style.top = `${12 + Math.floor(i / 4) * dy}px`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("/citizens.json").then(r => r.json()).then(main).catch(reason => fatal(reason))
});
