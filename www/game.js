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

const game = {
    citizens: [],
    gamestate: [],

    push(gs) {
        if ("init" in gs) gs.init();
        this.gamestate.push(gs);
    },

    pop() {
        const gs = this.gamestate.pop();
        if (gs !== undefined && "deinit" in gs) gs.deinit();
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

    nextAd() {
        return this.makeAdFor(this.citizens.pick());
    }
};

const gsm = {
    Test: {
        init() {
            const dx = 200, dy = 100;
            const cols = 5, count = 40;

            for (let i = 0; i < count; i++) {
                const wnd = game.nextAd();
                wnd.setVisible(true);
                wnd.setPosition(12 + (i % cols) * dx, 12 + Math.floor(i / cols) * dy);
            }
        },

        tick() {
            console.info("this should repeat indefinitely");
            return true;
        }
    }
};

function main(citizens) {
    game.citizens = citizens;
    game.push(gsm.Test);

    function tick() {
        if (game.gamestate.length === 0) return;
        const gs = game.gamestate[game.gamestate.length - 1];
        if (!("tick" in gs) || gs.tick() === true)
            requestAnimationFrame(tick);
    }

    tick();
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("/citizens.json").then(r => r.json()).then(main).catch(reason => fatal(reason))
});
