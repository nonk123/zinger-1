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
    game.reset();

    FATALITY.textContent = String(reason);
    FATAL.style.display = "flex";
}

function die() {
    fatal("im ded :(");
}

const game = {
    citizens: [],
    gamestate: null,

    transition(gs) {
        if (this.gamestate !== null && "deinit" in this.gamestate)
            this.gamestate.deinit();

        this.gamestate = gs;

        if ("init" in this.gamestate)
            this.gamestate.init();
    },

    makeAdFor(citizen) {
        const wnd = document.createElement("div");
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

        const anchor = document.createElement("a");
        anchor.href = `https://${citizen.link}`;
        anchor.addEventListener("click", ev => ev.preventDefault());
        anchor.appendChild(img);

        const scaler = document.createElement("div");
        scaler.classList.add("scaler");
        scaler.appendChild(anchor);

        const crutch = document.createElement("div");
        crutch.classList.add("crutch");
        crutch.appendChild(scaler);

        wnd.appendChild(title);
        wnd.appendChild(close);
        wnd.appendChild(crutch);

        wnd.setVisible = function (visible) {
            this.style.display = visible ? "grid" : "none";
        };

        wnd.setPosition = function (x, y) {
            this.style.position = "absolute";
            this.style.left = `${x}px`;
            this.style.top = `${y}px`;
        }

        wnd.setVisible(false);
        BUTTONS.appendChild(wnd);

        return wnd;
    },

    reset() {
        BUTTONS.innerHTML = "";
    },

    makeNextAd() {
        return this.makeAdFor(this.citizens.pick());
    },
};

const kb = {};

window.addEventListener("keydown", ev => {
    kb[ev.code] = true;
});

window.addEventListener("keyup", ev => {
    kb[ev.code] = false;
});

let mbPrev = {};

const mb = {
    justPressed(button) {
        return !mbPrev[button] && this[button];
    }
};

window.addEventListener("mousedown", ev => {
    mb[ev.button] = true;
});

window.addEventListener("mouseup", ev => {
    mb[ev.button] = false;
});

const gsm = {
    Restart: {
        tainted: false,

        init() {
            BANNER.textContent = `Click to ${this.tainted ? "restart" : "begin"}`;
        },

        deinit() {
            BANNER.textContent = "";
        },

        tick() {
            if (mb.justPressed(0)) {
                this.tainted = true;
                return gsm.Play;
            } else {
                return true;
            }
        }
    },

    Play: {
        init() {
            const dx = 200, dy = 100;
            const cols = 5, count = 40;

            for (let i = 0; i < count; i++) {
                const wnd = game.makeNextAd();
                wnd.setVisible(true);
                wnd.setPosition(12 + (i % cols) * dx, 12 + Math.floor(i / cols) * dy);
            }
        },

        deinit() {
            game.reset();
        },

        tick() {
            return kb["Escape"] ? gsm.Restart : true;
        }
    }
};

function main(citizens) {
    game.citizens = citizens;
    game.transition(gsm.Restart);

    function tick() {
        const gs = game.gamestate;
        const next = "tick" in gs ? gs.tick() : null;
        mbPrev = { ...mb };

        if (next === null) {
            fatal("you killed the game!!!");
            return;
        }

        if (next !== true)
            game.transition(next);

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("/citizens.json").then(r => r.json()).then(main).catch(reason => fatal(reason))
});
