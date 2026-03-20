import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────── PIXEL ART SPRITES ─────────── */
const SPRITES = {
    ship: [
        "......BB......",
        ".....BBBB.....",
        "....BBBBBB....",
        "WWWWWWWWWWWWWW",
        ".MMMMMMMMMMMM.",
        "..MMMMMMMMMM..",
        "...SSSSSSSS...",
        "....SSSSSS....",
    ],
    enemy: [
        "......RR......",
        ".....RRRR.....",
        "....RRRRRR....",
        "DDDDDDDDDDDDDD",
        ".DDDDDDDDDDDD.",
        "..DDDDDDDDDD..",
        "...DDDDDDDD...",
        "....DDDDDD....",
    ],
    ghost: [
        "......GG......",
        ".....GGGG.....",
        "....GGGGGG....",
        "GGGGGGGGGGGGGG",
        ".GGGGGGGGGGG..",
        "..GG.GGGG.GG..",
        "...G..GG..G...",
        "..G....G....G.",
    ],
    palm: [
        "....GGG.......",
        "...GGGGG......",
        "..GGGGGGG.....",
        "....GGG.GGG...",
        ".....W........",
        ".....W........",
        ".....W........",
        ".....WW.......",
    ],
    tentacle: [
        "....PP",
        "...PP.",
        "..PP..",
        ".PP...",
        ".PP...",
        "..PP..",
        "...PP.",
        "...PP.",
    ],
    building: [
        "...RRRR...",
        "..RRRRRR..",
        ".RRRRRRRR.",
        "WWWWWWWWWW",
        "WW.WW.WWWW",
        "WW.WW.WWWW",
        "WW.WWDWWWW",
        "WWWWWDWWWW",
    ],
    chest: [
        ".YYYYYY.",
        "YYYYYYYY",
        "YDYYYYDY",
        "YYYYYYYY",
        "WWWWWWWW",
        "WDDDDDW.",
        "WDDDDDW.",
        "WWWWWWWW",
    ],
};

const SP_C = {
    B: "#40c0f0", W: "#e8dcc8", M: "#6b3e1c", S: "#c8b898",
    R: "#c02020", D: "#3a2a1a", G: "#40b848", Y: "#f0c040",
    P: "#8040a0", ".": null,
};

function drawSp(ctx, spr, x, y, sc = 3, a = 1) {
    ctx.globalAlpha = a;
    spr.forEach((row, ry) => {
        [...row].forEach((ch, rx) => {
            if (SP_C[ch]) { ctx.fillStyle = SP_C[ch]; ctx.fillRect(x + rx * sc, y + ry * sc, sc, sc); }
        });
    });
    ctx.globalAlpha = 1;
}

/* ─────────── SCENE RENDERERS ─────────── */
function sceneOpenSea(ctx, W, H, f, curse) {
    const cr = Math.min(curse / 15, 1);
    ctx.fillStyle = `rgb(${10 + cr * 30 | 0},${10 + cr * 5 | 0},${26 + cr * 50 | 0})`;
    ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) {
        const w = Math.sin((x + f * 0.8) * 0.03) * Math.cos((y + f * 0.5) * 0.04);
        if (w > 0.2 - (y / H) * 0.2) {
            ctx.fillStyle = `rgba(${30 + cr * 40 | 0},${Math.max(0, 30 - cr * 20) | 0},${60 + cr * 30 | 0},0.35)`;
            ctx.fillRect(x, y, 6, 6);
        }
    }
    drawSp(ctx, SPRITES.ship, W / 2 - 21, H / 2 + Math.sin(f * 0.05) * 3, 3);
}

function sceneStorm(ctx, W, H, f) {
    ctx.fillStyle = "#08081a"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) {
        if (Math.sin((x + f * 2) * 0.05) * Math.cos((y + f * 1.5) * 0.06) > 0.1) {
            ctx.fillStyle = "rgba(20,20,50,0.6)"; ctx.fillRect(x, y, 4, 4);
        }
    }
    if (Math.sin(f * 0.07) > 0.95) {
        ctx.fillStyle = "rgba(255,255,200,0.8)";
        const lx = W * 0.3 + Math.sin(f) * 50;
        ctx.fillRect(lx, 0, 3, H * 0.6); ctx.fillRect(lx - 8, H * 0.3, 20, 3);
    }
    for (let i = 0; i < 40; i++) {
        ctx.fillStyle = "rgba(150,180,220,0.4)";
        ctx.fillRect((i * 97 + f * 3) % W, (i * 53 + f * 5) % H, 1, 6);
    }
    drawSp(ctx, SPRITES.ship, W / 2 - 21, H / 2 + Math.sin(f * 0.08) * 8, 3);
}

function sceneIsland(ctx, W, H, f) {
    ctx.fillStyle = "#1a2a4e"; ctx.fillRect(0, 0, W, H);
    for (let y = H * 0.6; y < H; y += 6) for (let x = 0; x < W; x += 6) {
        ctx.fillStyle = `rgba(${20 + Math.sin(x * 0.1 + f * 0.3) * 10 | 0},30,60,0.25)`;
        ctx.fillRect(x, y, 6, 6);
    }
    ctx.fillStyle = "#e0c878";
    ctx.beginPath(); ctx.ellipse(W * 0.65, H * 0.52, 80, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#50a040";
    ctx.beginPath(); ctx.ellipse(W * 0.65, H * 0.45, 60, 25, 0, Math.PI, Math.PI * 2); ctx.fill();
    drawSp(ctx, SPRITES.palm, W * 0.55, H * 0.2, 3);
    drawSp(ctx, SPRITES.palm, W * 0.72, H * 0.25, 2.5);
    drawSp(ctx, SPRITES.ship, W * 0.15, H * 0.65 + Math.sin(f * 0.04) * 2, 3);
}

function sceneCave(ctx, W, H, f) {
    ctx.fillStyle = "#0a0808"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1a1410";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W * 0.3, 0); ctx.lineTo(W * 0.15, H * 0.4); ctx.lineTo(0, H * 0.3); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W * 0.7, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H * 0.3); ctx.lineTo(W * 0.85, H * 0.4); ctx.fill();
    ctx.fillStyle = "#1a2a3a"; ctx.fillRect(0, H * 0.7, W, H * 0.3);
    for (let i = 0; i < 8; i++) {
        const gx = (Math.sin(f * 0.02 + i * 1.5) * 0.3 + 0.5) * W;
        const gy = (Math.cos(f * 0.015 + i * 2.1) * 0.2 + 0.5) * H;
        ctx.fillStyle = `rgba(64,240,160,${0.3 + Math.sin(f * 0.04 + i) * 0.2})`;
        ctx.beginPath(); ctx.arc(gx, gy, 3 + Math.sin(f * 0.03 + i) * 2, 0, Math.PI * 2); ctx.fill();
    }
    drawSp(ctx, SPRITES.chest, W / 2 - 12, H * 0.55, 3, 0.8 + Math.sin(f * 0.03) * 0.2);
}

function sceneCombat(ctx, W, H, f, etype) {
    ctx.fillStyle = "#0e0e2a"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) {
        if (Math.sin((x + f * 1.2) * 0.04) * Math.cos((y + f * 0.8) * 0.05) > 0.2) {
            ctx.fillStyle = "rgba(40,20,20,0.3)"; ctx.fillRect(x, y, 6, 6);
        }
    }
    drawSp(ctx, etype === "ghost" ? SPRITES.ghost : SPRITES.enemy, W / 2 - 21, H * 0.15 + Math.sin(f * 0.06 + 1) * 3, 3, etype === "ghost" ? 0.7 : 1);
    drawSp(ctx, SPRITES.ship, W / 2 - 21, H * 0.6 + Math.sin(f * 0.05) * 2, 3);
    if (f % 30 < 5) { ctx.fillStyle = "rgba(255,200,50,0.6)"; ctx.beginPath(); ctx.arc(W / 2 + (Math.random() - 0.5) * 60, H * 0.4, 4, 0, Math.PI * 2); ctx.fill(); }
}

function sceneEthereal(ctx, W, H, f) {
    ctx.fillStyle = "#12081e"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 15; i++) {
        const ox = (Math.sin(f * 0.008 + i * 2.3) * 0.5 + 0.5) * W;
        const oy = (Math.cos(f * 0.006 + i * 1.7) * 0.5 + 0.5) * H;
        const r = 30 + Math.sin(f * 0.02 + i) * 15;
        const gd = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        gd.addColorStop(0, `rgba(128,32,192,${0.15 + Math.sin(f * 0.03 + i) * 0.08})`);
        gd.addColorStop(1, "rgba(128,32,192,0)");
        ctx.fillStyle = gd; ctx.fillRect(ox - r, oy - r, r * 2, r * 2);
    }
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(200,180,255,${0.1 + Math.sin(f * 0.05 + i) * 0.08})`;
        ctx.fillRect((i * 127 + f * 0.5) % W, (i * 83 + f * 0.3) % H, 2, 2);
    }
    drawSp(ctx, SPRITES.ship, W / 2 - 21, H / 2 + Math.sin(f * 0.04) * 4, 3, 0.8);
}

function scenePort(ctx, W, H, f) {
    ctx.fillStyle = "#14182a"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1a2a4a"; ctx.fillRect(0, H * 0.65, W, H * 0.35);
    ctx.fillStyle = "#3a2a1a"; ctx.fillRect(W * 0.4, H * 0.5, W * 0.6, 8);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = "#2a1a0a"; ctx.fillRect(W * 0.45 + i * 40, H * 0.5, 4, H * 0.2); }
    drawSp(ctx, SPRITES.building, W * 0.5, H * 0.2, 3);
    drawSp(ctx, SPRITES.building, W * 0.75, H * 0.25, 2.5);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = `rgba(255,200,80,${0.4 + Math.sin(f * 0.04 + i * 2) * 0.2})`; ctx.fillRect(W * 0.52 + i * 18, H * 0.28, 3, 3); }
    drawSp(ctx, SPRITES.ship, W * 0.1, H * 0.62 + Math.sin(f * 0.04) * 2, 3);
}

function sceneUnderwater(ctx, W, H, f) {
    const gd = ctx.createLinearGradient(0, 0, 0, H);
    gd.addColorStop(0, "#0a2a4a"); gd.addColorStop(1, "#041828");
    ctx.fillStyle = gd; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgba(100,180,255,${0.15 + Math.sin(f * 0.03 + i) * 0.1})`;
        ctx.beginPath(); ctx.arc((i * 89 + f * 0.4) % W, H - ((i * 67 + f * 0.8) % H), 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `hsl(${(i * 40 + f * 0.5) % 360}, 60%, 40%)`;
        ctx.beginPath(); ctx.ellipse(W * 0.2 + i * 50, H * 0.8 + Math.sin(i * 1.5) * 15, 12, 8, 0, Math.PI, Math.PI * 2); ctx.fill();
    }
    drawSp(ctx, SPRITES.tentacle, W * 0.15, H * 0.3 + Math.sin(f * 0.04) * 8, 3, 0.6);
    drawSp(ctx, SPRITES.tentacle, W * 0.8, H * 0.4 + Math.cos(f * 0.035) * 6, 3, 0.5);
}

function sceneKraken(ctx, W, H, f) {
    ctx.fillStyle = "#080810"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 5) for (let x = 0; x < W; x += 5) {
        if (Math.sin((x + f * 2) * 0.06) * Math.cos((y + f * 1.5) * 0.07) > 0.1) {
            ctx.fillStyle = "rgba(20,10,30,0.5)"; ctx.fillRect(x, y, 5, 5);
        }
    }
    for (let i = 0; i < 6; i++) drawSp(ctx, SPRITES.tentacle, W * (0.1 + i * 0.15), H * 0.5 + Math.sin(f * 0.04 + i * 1.2) * 20, 3, 0.7);
    drawSp(ctx, SPRITES.ship, W / 2 - 21, H * 0.2 + Math.sin(f * 0.06) * 5, 3);
}

const SCENES = { open_sea: sceneOpenSea, storm: sceneStorm, island: sceneIsland, cave: sceneCave, combat: sceneCombat, ethereal: sceneEthereal, port: scenePort, underwater: sceneUnderwater, kraken: sceneKraken };

function GameCanvas({ scene, curse = 0, day = 0, enemyType }) {
    const ref = useRef(null), fr = useRef(0);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext("2d"), W = c.width, H = c.height;
        let id;
        const draw = () => {
            fr.current++;
            const r = SCENES[scene] || sceneOpenSea;
            if (scene === "combat") r(ctx, W, H, fr.current, enemyType);
            else if (scene === "open_sea") r(ctx, W, H, fr.current, curse);
            else r(ctx, W, H, fr.current);
            ctx.fillStyle = "#f0c040"; ctx.font = "bold 10px monospace"; ctx.fillText(`ДЕНЬ ${day}`, 8, 14);
            const cr = Math.min(curse / 15, 1);
            if (cr > 0) { ctx.fillStyle = "#8020c0"; ctx.fillText("☠".repeat(Math.min(Math.ceil(cr * 5), 5)), W - 10 - cr * 50, 14); }
            id = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(id);
    }, [scene, curse, day, enemyType]);
    return <canvas ref={ref} width={380} height={210} style={{ width: "100%", maxWidth: 760, imageRendering: "pixelated", borderRadius: 4, border: `2px solid ${curse > 10 ? "#8020c0" : "#2a2a5e"}` }} />;
}

/* ─────────── ENCOUNTERS (40+) ─────────── */
const E = [
    // ── SEA / TRADE ──
    {
        id: "merchant_spice", scene: "open_sea", title: "Торговець спеціями", text: "Купець з Мадагаскару. Пахне корицею і кардамоном. Пропонує обмін.", choices: [
            { text: "⚔️ Абордаж", eff: { gold: [25, 60], crew: [-2, 0], karma: -2, curse: 1 }, msg: "Трюм наш. Торговець дивиться з ненавистю." },
            { text: "💰 Купити спецій (−15)", eff: { gold: -15, crew: 0, karma: 1, curse: 0 }, msg: "Спеції зігріють у холодні ночі. Мораль росте.", flag: "has_spices" },
            { text: "📜 Запитати про слухи", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Шепоче про затонулий храм на схід, де золото ніхто не бере — бо воно кусається.", flag: "knows_temple" },
        ]
    },
    {
        id: "merchant_weapons", scene: "open_sea", title: "Контрабандист зброї", text: "Нідерландський шлюп під фальшивим прапором. Борт обвішаний мушкетами.", choices: [
            { text: "💰 Купити зброю (−25)", eff: { gold: -25, crew: 0, karma: 0, curse: 0 }, msg: "Команда озброєна. Наступний бій буде легшим.", flag: "armed" },
            { text: "⚔️ Забрати силою", eff: { gold: [10, 30], crew: [-1, 0], karma: -2, curse: 0 }, msg: "Контрабандист поклявся помститися. Тепер він — ваш ворог.", flag: "arms_dealer_enemy" },
            { text: "🤝 Обмін інформацією", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Розповідає про британський конвой через два дні.", flag: "knows_convoy" },
        ]
    },
    {
        id: "merchant_silk", scene: "open_sea", title: "Китайська джонка", text: "Величний корабель з багряними вітрилами. Шовк, порцеляна, чай.", choices: [
            { text: "🤝 Торгувати чесно", eff: { gold: [5, 20], crew: 0, karma: 2, curse: 0 }, msg: "Капітан дарує компас, що 'показує не північ, а те, що шукаєш'.", flag: "cursed_compass" },
            { text: "⚔️ Абордаж", eff: { gold: [40, 80], crew: [-3, -1], karma: -3, curse: 2 }, msg: "Джонка горить. Серед шовку — сувій з невідомими символами. Він пульсує." },
            { text: "🍵 Чай з капітаном", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "Колишній пірат. Один з ваших лишається, але двоє його людей просяться до вас.", flag: "chinese_allies" },
        ]
    },
    {
        id: "floating_cargo", scene: "open_sea", title: "Плавучий вантаж", text: "Бочки рому дрейфують після аварії. Десятки бочок.", choices: [
            { text: "🍺 Підібрати", eff: { gold: [10, 25], crew: 1, karma: 0, curse: 0 }, msg: "Ром — валюта Карибів. Команда радіє." },
            { text: "🔍 Шукати джерело", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Розбитий корабель. Нікого живого. Прапор — знайомий.", flag: "wreck_clue" },
            { text: "💨 Не зупинятись", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Обережність — рідкість серед піратів." },
        ]
    },
    {
        id: "whale", scene: "open_sea", title: "Кити", text: "Стадо китів пливе поруч. Величезні, спокійні, древні.", choices: [
            { text: "🐋 Милуватись", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "На мить — ніхто не пірат. Просто люди, які дивляться на диво." },
            { text: "🎯 Полювати", eff: { gold: [15, 30], crew: 0, karma: -2, curse: 1 }, msg: "Кров у воді. Золото в трюмі. Море запам'ятає." },
            { text: "🎵 Слухати спів", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("siren_contact") ? "Сирена відповідає китам. Розмова, якій мільйони років." : "Низький гул, що резонує в кістках." },
        ]
    },
    // ── STORMS ──
    {
        id: "storm_basic", scene: "storm", title: "Шторм!", text: "Стіна дощу. Щогла тріщить. Хвилі вищі за борт.", choices: [
            { text: "⚓ Лягти в дрейф", eff: { gold: 0, crew: [-1, 0], karma: 0, curse: 0 }, msg: "Пережили. Одного змило за борт." },
            { text: "🏴 На повних вітрилах!", eff: { gold: 0, crew: [-2, 0], karma: 0, curse: 0 }, msg: s => s.crew >= 7 ? "Прорвалися! Але двох не дорахувалися." : "Замало рук. Серйозні втрати." },
            { text: "🌊 Вловити течію", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Течія виносить кудись не туди. Зірки — інші. Небо не того кольору.", flag: "lost_waters" },
        ]
    },
    {
        id: "storm_lightning", scene: "storm", title: "Блискавичний шторм", text: "Блискавка б'є в море. На мить бачите ЩОСь під водою — величезне.", choices: [
            { text: "👀 Вдивитись", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Воно теж вдивляється. Тепер ви знаєте — глибина має очі.", flag: "deep_watcher" },
            { text: "🙈 Відвернутися", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Що не бачив — того не існує. Принаймні, так легше." },
            { text: "🔔 Вдарити в дзвін", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Щось під водою завмирає... і відпливає. Цього разу.", flag: "bell_rang" },
        ]
    },
    {
        id: "storm_wreck", scene: "storm", title: "Уламки в хвилях", text: "Шторм розбив чийсь корабель. Між дощок — скриня.", choices: [
            { text: "📦 Дістати скриню", eff: { gold: [15, 50], crew: [-1, 0], karma: 0, curse: 0 }, msg: s => s.flags?.has("cursed_compass") ? "Компас вказує прямо на неї. Золото — і медальйон, що шепоче вночі." : "Золото! Одного змило, рятуючи бочку." },
            { text: "🆘 Шукати вцілілих", eff: { gold: 0, crew: [1, 2], karma: 2, curse: 0 }, msg: "Навігатор і кухар. Обидва клянуться в вірності.", flag: "rescued_sailors" },
            { text: "💨 Не ризикувати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Уламки зникають. Можливо, правильне рішення." },
        ]
    },
    // ── ISLANDS ──
    {
        id: "island_village", scene: "island", title: "Рибальське поселення", text: "Маленька бухта. Хатини з пальм. Діти на пляжу.", choices: [
            { text: "🤝 Торгувати", eff: { gold: [5, 15], crew: 0, karma: 1, curse: 0 }, msg: "Свіжа риба та фрукти. Команда вдячна за нормальну їжу." },
            { text: "🔥 Пограбувати", eff: { gold: [10, 25], crew: 0, karma: -4, curse: 2 }, msg: "Діти кричать. Старійшина проклинає мовою, яку не знаєте. Слова врізаються в пам'ять.", flag: "village_curse" },
            { text: "🏥 Відпочити", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "День без моря. Команда стає людьми знову." },
        ]
    },
    {
        id: "island_ruins", scene: "island", title: "Руїни храму", text: "Кам'яні колони в зелені. На стінах — зображення моря і чогось з глибини.", choices: [
            { text: "🔍 Дослідити", eff: { gold: [0, 30], crew: 0, karma: 0, curse: 2 }, msg: "Золоті фігурки. І зображення корабля, що виглядає як ваш. Йому сотні років.", flag: "temple_visited" },
            { text: "📜 Прочитати написи", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("knows_temple") ? "Торговець казав правду. 'Золото пам'ятає руки, що його чіпали.'" : "Невідома мова. Малюнки: жертва морю — і море відповідає." },
            { text: "💣 Не чіпати", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "Повага до чужих святинь. Море це бачить." },
        ]
    },
    {
        id: "island_volcano", scene: "island", title: "Вулканічний острів", text: "Земля тремтить. Чорний пісок. У скелях — блиск.", choices: [
            { text: "⛏️ Видобувати", eff: { gold: [20, 60], crew: [-2, -1], karma: 0, curse: 0 }, msg: "Обсидіан та золото. Двоє дістали опіки." },
            { text: "🌋 На вершину", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Бачите острів, якого немає на карті. Він мерехтить.", flag: "saw_phantom_island" },
            { text: "💧 Мінеральні джерела", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Команда відпочиває, рани загоюються." },
        ]
    },
    {
        id: "island_abandoned", scene: "island", title: "Покинутий табір", text: "Речі, гамак, згаслий вогонь. На піску — слово: 'ТІКАЙТЕ'.", choices: [
            { text: "🔍 Обшукати", eff: { gold: [5, 15], crew: 0, karma: 0, curse: 1 }, msg: "Щоденник. Останній запис: 'Воно виходить вночі. Воно виглядає як я.'", flag: "doppelganger_warning" },
            { text: "🏃 Послухати пораду", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Здоровий глузд переважає цікавість." },
            { text: "🔥 Чекати вночі", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "З лісу виходить... ви. Точна копія. Посміхається і розчиняється.", flag: "met_double" },
        ]
    },
    {
        id: "island_native_chief", scene: "island", title: "Вождь острова", text: "Воїни виходять з джунглів. Їх лідер — жінка з шрамами і мудрими очима.", choices: [
            { text: "🎁 Подарунки", eff: { gold: -10, crew: 0, karma: 2, curse: 0 }, msg: "Вона приймає дари і пропонує провідника через рифи. Безцінний дар.", flag: "has_guide" },
            { text: "⚔️ Продемонструвати силу", eff: { gold: 0, crew: [-1, 0], karma: -2, curse: 1 }, msg: "Отруєні стріли. Одного вбито. Тікаєте під градом дротиків." },
            { text: "🙏 Попросити притулку", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "Тиждень відпочинку. Один матрос закохується і лишається. Але двоє островитян хочуть побачити світ." },
        ]
    },
    // ── CREW ──
    {
        id: "crew_sick", scene: "open_sea", title: "Хвороба на борту", text: "Тропічна лихоманка. Троє в гамаках, решта боїться.", requires: s => s.day > 3, choices: [
            { text: "🏥 Лікувати (−20)", eff: { gold: -20, crew: 0, karma: 1, curse: 0 }, msg: s => s.flags?.has("has_spices") ? "Спеції від мадагаскарця — ідеальні ліки! Всі одужують." : "Ліки на наступній зупинці. Більшість видужує." },
            { text: "🚢 Висадити хворих", eff: { gold: 0, crew: -3, karma: -2, curse: 1 }, msg: "Залишаєте на острові. Їхні очі — останнє, що бачите." },
            { text: "🙏 Чекати", eff: { gold: 0, crew: [-2, -1], karma: 0, curse: 0 }, msg: "Хтось одужує, хтось ні." },
        ]
    },
    {
        id: "crew_celebration", scene: "open_sea", title: "Команда святкує", text: "Вдала здобич! Ром тече рікою. Пісні на милю.", requires: s => s.gold > 50, choices: [
            { text: "🍺 Святкувати! (−10)", eff: { gold: -10, crew: 1, karma: 0, curse: 0 }, msg: "Найкраща ніч за місяці. Навіть старий Морган танцює." },
            { text: "🚫 Заборонити ром", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "Капітан без рому — небезпечна людина. Шепіт на палубі." },
            { text: "🎲 Азартні ігри", eff: { gold: [-20, 20], crew: 0, karma: 0, curse: 0 }, msg: "Кістки летять. Хтось збагатів, хтось програв сорочку." },
        ]
    },
    {
        id: "crew_mutiny", scene: "open_sea", title: "Бунт!", text: s => s.karma < -3 ? "Команда обступає з ножами. 'Ти занадто далеко зайшов, капітане.'" : "Частина команди вимагає зміни курсу.", requires: s => s.day > 7, choices: [
            { text: "⚔️ Придушити", eff: { gold: 0, crew: [-3, -2], karma: -1, curse: 0 }, msg: s => s.flags?.has("armed") ? "Зброя контрабандиста вирішує суперечку. Швидко і страшно." : "Кров на палубі." },
            { text: "🤝 Переговори", eff: { gold: [-15, -5], crew: [0, 1], karma: 1, curse: 0 }, msg: "Більша частка. Команда заспокоюється. Поки що." },
            { text: "🗳️ Голосування", eff: { gold: 0, crew: 0, karma: 2, curse: 0 }, msg: s => s.karma >= 0 ? "Голосують за вас. Демократія працює, коли вірять капітану." : "Голосують проти. Але приймаєте результат." },
        ]
    },
    {
        id: "crew_storyteller", scene: "open_sea", title: "Ніч історій", text: "Штиль. Зірки. Старий матрос розповідає про Чорну Перлину.", choices: [
            { text: "👂 Слухати", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Команда зближується. У темряві — людське тепло." },
            { text: "❓ Про прокляття", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.curse > 3 ? "'Я бачу його на тобі, капітане. Ти вже пахнеш глибиною.'" : "'Прокляття — казки. Справжній пірат боїться лише безвітря.'" },
            { text: "🗣️ Своя історія", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Говорите, чому стали піратом. Тиша. 'Я з тобою, капітане.'" },
        ]
    },
    {
        id: "crew_desertion", scene: "port", title: "Дезертири", text: "Зранку трьох немає. Втекли з частиною золота.", requires: s => s.day > 5 && s.karma < 0, choices: [
            { text: "🔍 Знайти і покарати", eff: { gold: [5, 15], crew: [-1, 0], karma: -2, curse: 0 }, msg: "Двох знайшли. Третій — зник. Покарання публічне." },
            { text: "💨 Нехай ідуть", eff: { gold: -15, crew: -3, karma: 0, curse: 0 }, msg: "Менше ротів — менше проблем." },
            { text: "📢 Набрати нових", eff: { gold: -10, crew: [1, 3], karma: 0, curse: 0 }, msg: "Портова таверна — кузня піратів." },
        ]
    },
    {
        id: "crew_duel", scene: "open_sea", title: "Дуель на палубі", text: "Два матроси схопилися за ножі. Суперечка через частку здобичі.", choices: [
            { text: "⚖️ Розсудити", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Справедливий вирок. Обидва підкоряються. Поважають." },
            { text: "🗡️ Хай б'ються", eff: { gold: 0, crew: -1, karma: -1, curse: 0 }, msg: "Один лежить. Закон моря — жорстокий, але зрозумілий." },
            { text: "🍺 Ром вирішить", eff: { gold: -5, crew: 0, karma: 0, curse: 0 }, msg: "Через годину обнімаються. Проблема не зникла, але відклалася." },
        ]
    },
    // ── COMBAT ──
    {
        id: "navy_patrol", scene: "combat", title: "Патрульний корвет", text: "Британський прапор. 20 гармат. Вас помітили.", choices: [
            { text: "⚔️ Бій!", eff: { gold: [0, 50], crew: [-4, -2], karma: -1, curse: 0 }, msg: s => s.flags?.has("armed") ? "Зброя контрабандиста рішає бій!" : "Кривавий бій. Ледь вижили." },
            { text: "💨 Тікати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.crew >= 6 ? "Повні вітрила! Корвет не встигає." : "Замало рук. Ледь відірвались." },
            { text: "🏳️ Прикинутись торговцем", eff: { gold: [-10, 0], crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("arms_dealer_enemy") ? "На борту — контрабандист! Він впізнає вас. Доводиться тікати під обстрілом." : "Фальшиві документи працюють. Серце б'ється годину." },
        ]
    },
    {
        id: "pirate_rival", scene: "combat", title: "Чорний Баррет", text: "Піратський бриг. Капітан — відомий головоріз. Кричить пропозицію.", choices: [
            { text: "⚔️ Бій", eff: { gold: [20, 70], crew: [-3, -1], karma: 0, curse: 0 }, msg: "Баррет б'ється як демон. Але ви — кращі." },
            { text: "🤝 Об'єднатися", eff: { gold: 0, crew: [2, 4], karma: 0, curse: 0 }, msg: "Два кораблі. Ненадійний союзник, але поки вигідний.", flag: "barret_alliance" },
            { text: "🍺 Ром і розмова", eff: { gold: -5, crew: 0, karma: 1, curse: 0 }, msg: "Баррет — балакучий п'яниця. Розповідає про острів, де пропадають кораблі.", flag: "knows_bermuda" },
        ]
    },
    {
        id: "convoy_attack", scene: "combat", title: "Британський конвой!", text: "Три торговці під охороною фрегата. Головний приз — головний ризик.", requires: s => s.flags?.has("knows_convoy"), choices: [
            { text: "⚔️ Всіх разом!", eff: { gold: [50, 120], crew: [-5, -2], karma: -2, curse: 0 }, msg: s => s.flags?.has("barret_alliance") ? "З Барретом — це полювання. Конвой здається." : "Один проти чотирьох. Божевілля. Але золота — на три життя." },
            { text: "🎯 Тільки останнього", eff: { gold: [20, 40], crew: [-1, 0], karma: -1, curse: 0 }, msg: "Відставший торговець — легка здобич." },
            { text: "👀 Розвідка", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Запам'ятовуєте маршрут. Наступного разу.", flag: "convoy_route" },
        ]
    },
    {
        id: "spanish_galleon", scene: "combat", title: "Іспанський галеон!", text: "Золотий прапор Кастилії. Величезний корабель. Повільний, але з 40 гарматами.", choices: [
            { text: "⚔️ Атака на світанку", eff: { gold: [40, 100], crew: [-4, -2], karma: -1, curse: 0 }, msg: s => s.flags?.has("has_guide") ? "Провідник знає рифи — заманюєте галеон на мілину. Легка здобич!" : "Лобова атака. Гармати б'ють страшно. Але абордаж — ваша стихія." },
            { text: "🏴 Підняти іспанський прапор", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "Підходите впритул. Коли розуміють — пізно. Але якщо хтось вижив і впізнає...", flag: "spanish_disguise" },
            { text: "💨 Обійти стороною", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Не кожен бій варто починати. Мудрість — теж зброя." },
        ]
    },
    // ── SUPERNATURAL ──
    {
        id: "sirens_song", scene: "ethereal", title: "Спів у тумані", text: "Мелодія без джерела. Команда завмирає. Хтось крокує до борту.", choices: [
            { text: "🔇 Воск у вуха", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Працює. Але мелодія була красивою." },
            { text: "🎵 Слухати", eff: { gold: 0, crew: [-2, -1], karma: 0, curse: 3 }, msg: "Двоє стрибають за борт із посмішкою." },
            { text: "🎶 Заспівати у відповідь", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Жіночий голос: 'Цікавий. Ми ще зустрінемося.' У тумані — очі.", flag: "siren_contact" },
        ]
    },
    {
        id: "siren_return", scene: "ethereal", title: "Вона прийшла", text: "Жінка з перлинами у волоссі сидить на носі. Команда не бачить. Тільки ви.", requires: s => s.flags?.has("siren_contact"), choices: [
            { text: "❓ Що тобі треба?", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "'Ти цікавий. Зазвичай люди або тікають, або тонуть. Ти — співаєш.' Пропонує угоду.", flag: "siren_deal" },
            { text: "⚔️ Геть з мого корабля", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "'Хоробрий і дурний.' Зникає у бризках." },
            { text: "🎶 Заспівати знову", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "На мить бачите світ її очима — нескінченну глибину. Красиво. Страшно.", flag: "siren_bond" },
        ]
    },
    {
        id: "ghost_ship", scene: "combat", enemyType: "ghost", title: "Корабель-привид", text: "Гнилий галеон без прапора. На палубі — скелети, що рухаються.", choices: [
            { text: "💀 На борт!", eff: { gold: [30, 80], crew: [-2, 0], karma: 0, curse: 4 }, msg: "Скелети б'ються мовчки. У трюмі — карта до місця, якого не існує.", flag: "ghost_map" },
            { text: "🔥 Підпалити", eff: { gold: 0, crew: 0, karma: 1, curse: -2 }, msg: "Вогонь пожирає мертве дерево. Звук — то чи крик, то чи подяка." },
            { text: "👻 Поговорити", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: s => s.flags?.has("deep_watcher") ? "'Воно чекає,' — каже мертвий капітан. — 'Воно завжди чекало на тебе.'" : "'Не йди на дно. Там не скарб. Там — ціна.'" },
        ]
    },
    {
        id: "kraken_attack", scene: "kraken", title: "КРАКЕН!", text: "Вода закипає. Щупальця товщиною зі щоглу обхоплюють корабель.", choices: [
            { text: "⚔️ Рубати!", eff: { gold: 0, crew: [-4, -2], karma: 0, curse: 0 }, msg: s => s.flags?.has("armed") ? "Зброя рубає щупальця! Кракен відступає." : "Сокири проти м'яса. Довгий бій." },
            { text: "💰 Згодувати золото", eff: { gold: [-40, -20], crew: 0, karma: 0, curse: -1 }, msg: "Щупальця обережно забирають скрині. Угода." },
            { text: "🩸 Жертва крові", eff: { gold: 0, crew: -3, karma: -3, curse: 4 }, msg: "Три душі за пропуск. Кракен відпускає. Його очі — ті самі, що й у глибині.", flag: "kraken_pact" },
        ]
    },
    {
        id: "eclipse", scene: "ethereal", title: "Затемнення", text: "Місяць закриває сонце. Повна темрява. Інші зірки.", choices: [
            { text: "🔭 Вивчати зірки", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("saved_martin") ? "Мартін блідне: 'Ці зірки — з іншого неба. Ми між світами.'" : "Як карта до місця, якого не має бути." },
            { text: "🙏 Молитись", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "Темрява відступає. Молитва чи час?" },
            { text: "🎲 Кинути монету в море", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Море повертає іншу монету. Старішу на 200 років." },
        ]
    },
    {
        id: "sea_fog", scene: "ethereal", title: "Густий туман", text: "Видимість — нуль. Хтось кличе вас на ім'я.", choices: [
            { text: "📢 Відповісти", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("siren_bond") ? "Сирена: 'Далі небезпечно. Повертай.' Вперше — щира турбота?" : "Голос стихає. Потім — далекий нелюдський сміх." },
            { text: "🔇 Мовчати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Туман розсіюється. Ви на тому ж місці. Час — вкрадений." },
            { text: "🔔 Бити в дзвін", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("bell_rang") ? "Дзвін прорізає туман. Щоразу — відступає на крок. Ви навчились його мові." : "Дзвін — і туман розходиться. Але за ним — інший туман." },
        ]
    },
    // ── CASTAWAY CHAIN ──
    {
        id: "castaway_normal", scene: "open_sea", title: "Людина на уламках", text: "Моряк чіпляється за дошку. Обличчя обпалене.", choices: [
            { text: "🤝 Врятувати", eff: { gold: 0, crew: 1, karma: 2, curse: 0 }, msg: "Мартін. Колишній штурман. Читає зірки як ніхто.", flag: "saved_martin" },
            { text: "💰 Тільки за інформацію", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Координати затонулого галеону з іспанським золотом.", flag: "knows_galleon" },
            { text: "💨 Повз", eff: { gold: 0, crew: 0, karma: -2, curse: 1 }, msg: "Він дивиться вслід. Наступної ночі хтось бачить його у воді." },
        ]
    },
    {
        id: "castaway_cursed", scene: "ethereal", title: "Фігура на воді", text: "Людина СТОЇТЬ на воді. Не тоне. Очі — повністю білі. Усміхається.", requires: s => s.curse >= 5, choices: [
            { text: "🤝 Простягнути руку", eff: { gold: 0, crew: 0, karma: 0, curse: 4 }, msg: "'Дякую. Тепер я можу піти.' Зникає. Холод у вашій руці — лишається.", flag: "cold_touch" },
            { text: "❓ Хто ти?", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("doppelganger_warning") ? "'Я — той, хто був до тебе. І після тебе. Ми всі — одна людина.' Щоденник — правда." : "'Ніхто. Всі. Море пам'ятає кожного.'" },
            { text: "🔥 Стріляти", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "Куля наскрізь. Він здивований. Розчиняється." },
        ]
    },
    // ── PORT ──
    {
        id: "port_tortuga", scene: "port", title: "Тортуга", text: "Піратська столиця. Все — за правильну ціну.", choices: [
            { text: "🔧 Ремонт (−20)", eff: { gold: -20, crew: 0, karma: 0, curse: 0 }, msg: "Корпус, щогла, гармати — як нові.", flag: "ship_repaired" },
            { text: "📢 Набрати людей (−10)", eff: { gold: -10, crew: [2, 4], karma: 0, curse: 0 }, msg: "Нові обличчя, нові руки, нові проблеми." },
            {
                text: "🗣️ Таверна (−5)", eff: { gold: -5, crew: 0, karma: 0, curse: 0 }, msg: s => {
                    if (s.curse > 3) return "Знахарка в кутку: 'Бачу тінь на тобі. Приходь — допоможу.'";
                    if (!s.flags?.has("knows_bermuda")) return "П'яний капітан про місце, де зникають кораблі.";
                    return "Звичайні піратські байки. Ром — непоганий.";
                }, flag: s => s.curse > 3 ? "knows_healer" : null
            },
        ]
    },
    {
        id: "port_nassau", scene: "port", title: "Нассау", text: "Губернатор пропонує помилування піратам.", requires: s => s.day > 10, choices: [
            { text: "📜 Прийняти помилування", eff: { gold: -30, crew: -2, karma: 4, curse: -3 }, msg: "Частина золота як 'податок'. Двоє йдуть. Але тепер ви — легальні." },
            { text: "🏴 Пограбувати порт", eff: { gold: [30, 60], crew: [-2, 0], karma: -4, curse: 2 }, msg: "Нассау горить. Ваше ім'я знає кожен." },
            { text: "💨 Повз", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Закон — не для вас." },
        ]
    },
    {
        id: "healer", scene: "port", title: "Знахарка", text: "Темна кімната. Свічки. Жінка з татуюваннями дивиться крізь вас.", requires: s => s.flags?.has("knows_healer") && s.curse >= 4, choices: [
            { text: "💰 Зцілення (−30)", eff: { gold: -30, crew: 0, karma: 0, curse: -4 }, msg: "'Прокляття — борг. Я зменшу, але не зітру.' Біль — і полегшення." },
            { text: "❓ Що зі мною?", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => `'${s.curse} шарів темряви. Кожен вибір — монета в скарбничку моря. Коли набереться — море прийде.'` },
            { text: "🚪 Піти", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "'Повернешся. Всі повертаються.'" },
        ]
    },
    // ── CONSEQUENCES ──
    {
        id: "martin_betrayal", scene: "open_sea", title: "Мартін зник", text: "Вранці його немає. На палубі — кров'ю написано слово.", requires: s => s.flags?.has("saved_martin") && s.karma < -2 && s.day > 10, choices: [
            { text: "📖 Прочитати", eff: { gold: -20, crew: -1, karma: 0, curse: 2 }, msg: "'Ти не заслуговуєш їх.' Забрав золото і одного матроса." },
            { text: "🔥 Стерти", eff: { gold: -20, crew: 0, karma: 0, curse: 0 }, msg: "Спалюєте дошку. Ніхто не бачив." },
        ]
    },
    {
        id: "martin_saves", scene: "storm", title: "Мартін знає шлях", text: "Шторм! Мартін дивиться на зірки крізь розрив у хмарах. 'Довірся мені.'", requires: s => s.flags?.has("saved_martin") && s.karma >= 0 && s.day > 8, choices: [
            { text: "🧭 Довіритися", eff: { gold: [10, 30], crew: 0, karma: 1, curse: 0 }, msg: "Веде крізь шторм як по шовку. Бухта зі скарбами на дні." },
            { text: "🚫 Я сам капітан", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "Мартін замовкає. Більше не пропонує допомогу." },
        ]
    },
    {
        id: "barret_betrayal", scene: "combat", title: "Баррет вдарив у спину!", text: "Серед ночі — гарматний постріл. 'Нічого особистого!'", requires: s => s.flags?.has("barret_alliance") && s.gold > 60 && s.day > 12, choices: [
            { text: "⚔️ Бій!", eff: { gold: [-20, 0], crew: [-3, -1], karma: 0, curse: 0 }, msg: "Зрада болить більше за рани." },
            { text: "💰 Відкупитися", eff: { gold: -40, crew: 0, karma: 0, curse: 0 }, msg: "'Бачиш? Ми ще домовляємося!' — сміється Баррет." },
            { text: "🤝 Запропонувати більше", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "'Разом візьмемо в десять разів більше.' — 'Добре. Але наступного разу — я капітан.'", flag: "barret_deal" },
        ]
    },
    {
        id: "village_ghost", scene: "ethereal", title: "Голос старійшини", text: "Вночі — шепіт. Мова, яку ви не знаєте, але розумієте: 'Повертай, що взяв.'", requires: s => s.flags?.has("village_curse"), choices: [
            { text: "💰 Повернути (−20)", eff: { gold: -20, crew: 0, karma: 3, curse: -3 }, msg: "Кидаєте золото в море у напрямку острова. Шепіт стихає. Полегшення." },
            { text: "🚫 Ігнорувати", eff: { gold: 0, crew: -1, karma: -1, curse: 3 }, msg: "Шепіт стає криком. Один матрос — з села — кидається за борт." },
            { text: "🙏 Вибачитись", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "Шепіт тихне. Не пробачення — але перемир'я." },
        ]
    },
    // ── DEEP SUPERNATURAL ──
    {
        id: "cursed_treasure", scene: "cave", title: "Печера скарбів", text: "Золото до стелі. Перлини, діаманти. І тиша. Абсолютна.", requires: s => s.flags?.has("ghost_map") || s.flags?.has("knows_temple"), choices: [
            { text: "💰 Все забрати", eff: { gold: [80, 150], crew: 0, karma: 0, curse: 5 }, msg: "Золото ТЕПЛЕ. Монети пульсують. Скільки б не брали — більше з'являється." },
            { text: "💍 Одну річ", eff: { gold: [20, 40], crew: 0, karma: 0, curse: 1 }, msg: "Перстень з рубіном. Ідеально сідає. Занадто ідеально." },
            { text: "🚫 Нічого", eff: { gold: 0, crew: 0, karma: 3, curse: -3 }, msg: "Печера... видихає? Повагу? Розчарування?" },
        ]
    },
    {
        id: "phantom_island", scene: "ethereal", title: "Острів-примара", text: "Білі дерева. Чорний пісок. Час тут — інший.", requires: s => s.flags?.has("saw_phantom_island") || s.curse >= 8, choices: [
            { text: "🏝️ Висадитися", eff: { gold: [0, 40], crew: 0, karma: 0, curse: 3 }, msg: "Ваші речі. Які ви ще не загубили. Майбутнє? Паралельне?", flag: "visited_phantom" },
            { text: "🔭 Спостерігати", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "На березі — ви. Махаєте собі рукою." },
            { text: "💨 Тікати", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Зникає, щойно відвертаєтесь." },
        ]
    },
    {
        id: "deep_temple", scene: "underwater", title: "Храм на дні", text: "Вода прозора до дна. Колони, арки, світло.", requires: s => s.flags?.has("temple_visited") || s.flags?.has("deep_watcher"), choices: [
            { text: "🤿 Пірнути", eff: { gold: [20, 60], crew: [-1, 0], karma: 0, curse: 4 }, msg: s => s.flags?.has("kraken_pact") ? "Кракен ескортує до входу. Всередині — не золото. Знання." : "Прекрасно і жахливо. Артефакт пульсує в руках." },
            { text: "🔔 Вдарити в дзвін", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("bell_rang") ? "Храм ВІДПОВІДАЄ. Колони світяться. Щось піднімається." : "Звук тоне у воді. Але вас почули." },
            { text: "🙏 Помолитися", eff: { gold: 0, crew: 0, karma: 2, curse: -2 }, msg: "Хтось слухає. Тиск слабшає. Прокляття відступає." },
        ]
    },
    {
        id: "mirror_sea", scene: "ethereal", title: "Д З Е Р К А Л Ь Н Е  М О Р Е", text: "Вода — ідеальне дзеркало. Ваш корабель відображується, але пливе в інший бік.", requires: s => s.curse >= 10, choices: [
            { text: "🪞 Стрибнути", eff: { gold: 0, crew: 0, karma: 0, curse: 5 }, msg: "Внизу — все навпаки. Ваша команда мертва. Ви безсмертний. Альтернатива чи пастка?" },
            { text: "💔 Розбити", eff: { gold: 0, crew: -1, karma: 0, curse: -3 }, msg: "Гармата у воду. Дзеркало тріскає. Хтось кричить — його відображення зникло." },
            { text: "🙈 Закрити очі", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Свій голос знизу: 'Ти не можеш тікати від себе вічно.'" },
        ]
    },
    {
        id: "dead_captain", scene: "ethereal", title: "К А П І Т А Н  П О В Е Р Н У В С Я", text: "Тінь на палубі. 'Це завжди був мій корабель.'", requires: s => s.curse >= 12, choices: [
            { text: "⚔️ Бий або йди", eff: { gold: 0, crew: -1, karma: 0, curse: -2 }, msg: "Меч крізь тінь. Відступає. 'Тимчасово.'" },
            { text: "🤝 Розділити владу", eff: { gold: [20, 40], crew: [1, 3], karma: 0, curse: 4 }, msg: "Мертвий капітан приводить мертву команду. Живі і мертві разом." },
            { text: "🚪 Віддати корабель", eff: { gold: -999, crew: 0, karma: 3, curse: -5 }, msg: "Шлюпка. Свобода від усього." },
        ]
    },
    {
        id: "doppelganger", scene: "ethereal", title: "В І Н  П О В Е Р Н У В С Я", text: "Ваш двійник. Команда не знає, хто справжній.", requires: s => s.flags?.has("met_double") && s.curse >= 8, choices: [
            { text: "⚔️ Бій", eff: { gold: 0, crew: -1, karma: 0, curse: -2 }, msg: "Вбиваєте його. Або він вас? Ви не впевнені." },
            { text: "❓ Хто ти?", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "'Я — ти з правильними виборами. Ти — помилка.' Зникає. Ви відчуваєте себе менше." },
            { text: "🤝 Прийняти", eff: { gold: 0, crew: 0, karma: 0, curse: 4 }, msg: "Обіймаєте себе. Кожен вибір, альтернатива, версія. Потім — темрява.", flag: "merged" },
        ]
    },
    {
        id: "galleon_found", scene: "underwater", title: "Затонулий галеон", text: "Координати — правильні. Іспанське золото на мілині.", requires: s => s.flags?.has("knows_galleon"), choices: [
            { text: "🤿 Пірнати", eff: { gold: [40, 90], crew: [-1, 0], karma: 0, curse: 2 }, msg: "Скелети тримають скрині, наче досі охороняють." },
            { text: "🔍 Обережно", eff: { gold: [15, 30], crew: 0, karma: 0, curse: 0 }, msg: "Тільки з поверхні. Скелети внизу починають ворушитися на заході." },
            { text: "📜 Шукати журнал", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "'Ми знайшли золото Ельдорадо. Золото знайшло нас. Воно не відпускає.'", flag: "eldorado_knowledge" },
        ]
    },
    {
        id: "bermuda_zone", scene: "ethereal", title: "Мертва зона", text: "Ні вітру, ні течії. Компас крутиться. Три порожні кораблі.", requires: s => s.flags?.has("knows_bermuda"), choices: [
            { text: "🔍 Обшукати", eff: { gold: [20, 50], crew: 0, karma: 0, curse: 3 }, msg: "На одному — тепла їжа. На іншому — журнал з завтрашньою датою. На третьому — ваше ім'я на щоглі." },
            { text: "🕯️ Запалити вогні", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Вітер повертається — з усіх боків. Виходите кудись не туди." },
            { text: "🙏 Чекати світанку", eff: { gold: 0, crew: -1, karma: 0, curse: 2 }, msg: "Світанок через 18 годин. Сонце — не на сході. Один матрос збожеволів." },
        ]
    },
];

/* ─────────── ENDINGS ─────────── */
const ENDINGS = [
    { req: s => s.curse >= 15, title: "М І Ж  С В І Т А М И", text: s => s.flags?.has("merged") ? "Ви і двійник — одне. Безсмертний капітан. Ваш корабель пливе крізь час." : "Вічний капітан вічного корабля. Ваше ім'я — попередження.", color: "#40f8a0" },
    { req: s => s.curse >= 12 && s.crew <= 2, title: "П О Г Л И Н У Т И Й", text: () => "Прокляття забрало все. Порожня оболонка на порожньому кораблі.", color: "#8020c0" },
    { req: s => s.crew <= 0, title: "О С Т А Н Н І Й", text: () => "Нікого. Хвилі і чайки. Дрейфуєте.", color: "#c02020" },
    { req: s => s.gold >= 150 && s.curse >= 8, title: "П Р О К Л Я Т Е  З О Л О Т О", text: s => s.flags?.has("eldorado_knowledge") ? "Золото Ельдорадо — пастка. Ви — частина колекції." : "Золото тліє. Багатство без свободи.", color: "#f0c040" },
    { req: s => s.karma >= 8, title: "Л Е Г Е Н Д А", text: s => s.flags?.has("siren_bond") ? "Сирена проводжає в порт. Вас поважає суша, море і глибина." : "Ваше ім'я — синонім честі.", color: "#40c0f0" },
    { req: s => s.gold >= 200, title: "К О Р О Л Ь", text: s => s.flags?.has("barret_deal") ? "Ви і Баррет ділите Кариби. Довго не протримається." : "Золота більше, ніж можна витратити.", color: "#f0c040" },
    { req: () => true, title: "В И Ж И В", text: s => s.flags?.has("visited_phantom") ? "Повернулись. Але чи це ваш світ? Все трохи інакше." : "Не герой, не лиходій. Моряк, який повернувся.", color: "#c8c8d8" },
];

function getEnding(s) { for (const e of ENDINGS) if (e.req(s)) return e; return ENDINGS[ENDINGS.length - 1]; }

/* ─────────── ENCOUNTER PICKER ─────────── */
function pickEncounter(state, used) {
    const avail = E.filter(e => {
        if (used.has(e.id)) return false;
        if (e.requires && !e.requires(state)) return false;
        return true;
    });
    const conseq = avail.filter(e => e.requires);
    const normal = avail.filter(e => !e.requires);
    if (conseq.length > 0 && (normal.length === 0 || Math.random() < 0.6))
        return conseq[Math.floor(Math.random() * conseq.length)];
    if (normal.length > 0) return normal[Math.floor(Math.random() * normal.length)];
    const fallback = E.filter(e => !e.requires || e.requires(state));
    return fallback[Math.floor(Math.random() * fallback.length)] || E[0];
}

function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function rv(v) { return Array.isArray(v) ? rand(v[0], v[1]) : (typeof v === "number" ? v : 0); }

/* ─────────── UI ─────────── */
const Px = ({ children, color = "#c8c8d8", size = 10, style = {} }) => (
    <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: size, color, lineHeight: 2.4, letterSpacing: 0.5, ...style }}>{children}</span>
);
const Stat = ({ label, value, color }) => (
    <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${color}33`, padding: "6px 8px", borderRadius: 2, textAlign: "center", minWidth: 0, flex: "1 1 0" }}>
        <Px size={7} color="rgba(200,200,216,0.5)">{label}</Px><br /><Px size={13} color={color}>{value}</Px>
    </div>
);
const Btn = ({ onClick, children, color = "#40c0f0", size = 12 }) => (
    <button onClick={onClick} style={{ background: "none", border: `2px solid ${color}`, color, fontFamily: '"Press Start 2P", monospace', fontSize: size, padding: "14px 24px", cursor: "pointer", transition: "all 0.2s", minHeight: 48 }}
        onMouseOver={e => { e.target.style.background = color; e.target.style.color = "#0a0a1a"; }}
        onMouseOut={e => { e.target.style.background = "none"; e.target.style.color = color; }}
    >{children}</button>
);

export default function PirateGame() {
    const [screen, setScreen] = useState("title");
    const [state, setState] = useState(null);
    const [encounter, setEncounter] = useState(null);
    const [result, setResult] = useState(null);
    const [ending, setEnding] = useState(null);
    const [usedIds, setUsedIds] = useState(new Set());
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const l = document.createElement("link");
        l.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
        l.rel = "stylesheet"; document.head.appendChild(l);
        return () => document.head.removeChild(l);
    }, []);

    useEffect(() => {
        if (state?.curse >= 8) {
            const iv = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 80 + Math.random() * 150); }, 1500 + Math.random() * 3000);
            return () => clearInterval(iv);
        }
    }, [state?.curse]);

    const startGame = () => {
        setState({ gold: 30, crew: 8, karma: 0, curse: 0, day: 1, flags: new Set(), log: [] });
        setUsedIds(new Set()); setScreen("sailing"); setEncounter(null); setResult(null); setEnding(null);
    };

    const sail = useCallback(() => {
        if (!state) return;
        if (state.day >= 20 || state.crew <= 0 || state.curse >= 15) {
            setEnding(getEnding(state)); setScreen("ending"); return;
        }
        const enc = pickEncounter(state, usedIds);
        setUsedIds(p => new Set([...p, enc.id]));
        setEncounter(enc); setResult(null); setScreen("encounter");
        setState(s => ({ ...s, day: s.day + 1 }));
    }, [state, usedIds]);

    const makeChoice = (ch) => {
        const e = ch.eff;
        const gd = rv(e.gold), cd = rv(e.crew);
        const ns = { ...state, flags: new Set(state.flags) };
        ns.gold = Math.max(0, state.gold + gd);
        ns.crew = Math.max(0, state.crew + cd);
        ns.karma = state.karma + (e.karma || 0);
        ns.curse = Math.max(0, state.curse + (e.curse || 0));
        if (ch.flag) { const f = typeof ch.flag === "function" ? ch.flag(state) : ch.flag; if (f) ns.flags.add(f); }
        const msg = typeof ch.msg === "function" ? ch.msg(state) : ch.msg;
        let sum = [];
        if (gd > 0) sum.push(`+${gd}💰`); if (gd < 0) sum.push(`${gd}💰`);
        if (cd > 0) sum.push(`+${cd}👥`); if (cd < 0) sum.push(`${cd}👥`);
        if (e.curse > 0) sum.push(`+${e.curse}☠`); if (e.curse < 0) sum.push(`${e.curse}☠`);
        ns.log = [...state.log, { day: state.day, title: encounter.title, summary: sum.join(" ") }];
        setState(ns); setResult(msg);
    };

    const cr = state ? Math.min(state.curse / 15, 1) : 0;
    const wrap = {
        minHeight: "100vh", background: glitch ? `linear-gradient(${Math.random() * 360}deg,#1a0a2e,#0a1a1a)` : "linear-gradient(180deg,#0a0a1a,#1a1a3e)",
        display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px",
        fontFamily: '"Press Start 2P",monospace', color: "#c8c8d8", transition: "background 0.5s",
        overflow: "hidden", transform: glitch ? `translate(${rand(-3, 3)}px,${rand(-2, 2)}px)` : "none",
    };

    if (screen === "title") return (
        <div style={wrap}>
            <div style={{ textAlign: "center", marginTop: 40, maxWidth: 600 }}>
                <div style={{ fontSize: 11, color: "#f0c040", marginBottom: 16, letterSpacing: 2 }}>☠ ☠ ☠</div>
                <Px size={20} color="#f0c040">ПРОКЛЯТИЙ</Px><br /><Px size={20} color="#f0c040">ГАЛЕОН</Px>
                <div style={{ margin: "24px 0" }}><GameCanvas scene="open_sea" curse={0} day={0} /></div>
                <div style={{ marginBottom: 24, lineHeight: 2.5 }}>
                    <Px size={10}>20 днів. Один корабель. Кожен вибір — наслідок.</Px><br />
                    <Px size={10} color="#8020c0">Море пам'ятає все.</Px>
                </div>
                <Btn onClick={startGame} color="#f0c040" size={13}>ВИЙТИ В МОРЕ</Btn>
            </div>
        </div>
    );

    if (!state) return null;

    if (screen === "ending" && ending) {
        const et = typeof ending.text === "function" ? ending.text(state) : ending.text;
        return (
            <div style={wrap}>
                <div style={{ textAlign: "center", maxWidth: 600, marginTop: 20 }}>
                    <GameCanvas scene="ethereal" curse={state.curse} day={state.day} />
                    <div style={{ margin: "20px 0 12px" }}><Px size={13} color={ending.color}>{ending.title}</Px></div>
                    <div style={{ margin: "12px 0 24px", lineHeight: 2.5 }}><Px size={10}>{et}</Px></div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                        <Stat label="ЗОЛОТО" value={state.gold} color="#f0c040" />
                        <Stat label="КОМАНДА" value={state.crew} color="#40c0f0" />
                        <Stat label="КАРМА" value={state.karma > 0 ? `+${state.karma}` : state.karma} color={state.karma >= 0 ? "#40f8a0" : "#c02020"} />
                        <Stat label="ПРОКЛЯТТЯ" value={state.curse} color="#8020c0" />
                    </div>
                    <div style={{ marginBottom: 8 }}><Px size={8}>ЖУРНАЛ ({state.log.length}):</Px></div>
                    <div style={{ maxHeight: 160, overflowY: "auto", textAlign: "left", padding: "8px 12px", background: "rgba(0,0,0,0.4)", borderRadius: 4, marginBottom: 20 }}>
                        {state.log.map((l, i) => (
                            <div key={i} style={{ marginBottom: 5 }}>
                                <Px size={7} color="#f0c040">Д{l.day}</Px> <Px size={7}>{l.title}</Px> <Px size={7} color="rgba(200,200,216,0.4)">{l.summary}</Px>
                            </div>
                        ))}
                    </div>
                    <Btn onClick={startGame} color="#f0c040">ЗНОВУ В МОРЕ</Btn>
                </div>
            </div>
        );
    }

    const sc = encounter?.scene || "open_sea";
    const tt = encounter ? encounter.title : "";
    const tx = encounter ? (typeof encounter.text === "function" ? encounter.text(state) : encounter.text) : "";

    return (
        <div style={wrap}>
            <div style={{ width: "100%", maxWidth: 600 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                    <Stat label="ЗОЛОТО" value={state.gold} color="#f0c040" />
                    <Stat label="КОМАНДА" value={state.crew} color={state.crew <= 3 ? "#c02020" : "#40c0f0"} />
                    <Stat label="ДЕНЬ" value={cr > 0.5 ? `${state.day}̷/̶2̸0̷` : `${state.day}/20`} color={cr > 0.5 ? "#8020c0" : "#c8c8d8"} />
                    {state.curse > 0 && <Stat label={cr > 0.6 ? "П̷Р̴К̸Л̵" : "ТЬМА"} value={state.curse} color="#8020c0" />}
                </div>
                <GameCanvas scene={screen === "encounter" ? sc : "open_sea"} curse={state.curse} day={state.day} enemyType={encounter?.enemyType} />
                {screen === "sailing" && (
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Btn onClick={sail} color={cr > 0.6 ? "#8020c0" : "#40c0f0"}>
                            {cr > 0.6 ? "П̸Л̵И̶В̷Т̸И̵..." : "ПЛИВТИ ДАЛІ"}
                        </Btn>
                        {state.curse > 0 && state.curse < 5 && <div style={{ marginTop: 12 }}><Px size={9} color="rgba(128,32,192,0.5)">Щось дивне у повітрі...</Px></div>}
                        {state.curse >= 5 && state.curse < 10 && <div style={{ marginTop: 12 }}><Px size={9} color="rgba(128,32,192,0.7)">Тіні рухаються самі по собі</Px></div>}
                        {state.curse >= 10 && <div style={{ marginTop: 12 }}><Px size={9} color="#8020c0">Р̶Е̷А̷Л̸Ь̵Н̸І̸С̷Т̸Ь̵ ̵Т̷Р̸І̶Щ̷И̸Т̵Ь̷</Px></div>}
                    </div>
                )}
                {screen === "encounter" && encounter && (
                    <div style={{ marginTop: 14 }}>
                        <div style={{ marginBottom: 8 }}>
                            <Px size={12} color={encounter.requires ? "#8020c0" : "#f0c040"}>{tt}</Px>
                        </div>
                        <div style={{ marginBottom: 16, lineHeight: 2.4 }}><Px size={10}>{tx}</Px></div>
                        {!result ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {encounter.choices.map((ch, i) => {
                                    const cost = ch.eff.gold && typeof ch.eff.gold === "number" && ch.eff.gold < 0 ? Math.abs(ch.eff.gold) : 0;
                                    const ok = cost <= state.gold;
                                    return (
                                        <button key={i} onClick={() => ok && makeChoice(ch)} style={{
                                            background: ok ? "rgba(255,255,255,0.03)" : "rgba(255,0,0,0.05)",
                                            border: `1px solid ${ok ? "rgba(200,200,216,0.2)" : "rgba(200,50,50,0.3)"}`,
                                            color: ok ? "#c8c8d8" : "rgba(200,100,100,0.5)",
                                            fontFamily: '"Press Start 2P",monospace', fontSize: 10, padding: "12px 14px",
                                            cursor: ok ? "pointer" : "not-allowed", textAlign: "left", transition: "all 0.2s",
                                            borderRadius: 4, opacity: ok ? 1 : 0.6, lineHeight: 2.2, minHeight: 48,
                                        }}
                                            onMouseOver={e => { if (ok) { e.target.style.borderColor = "#f0c040"; e.target.style.color = "#f0c040"; e.target.style.background = "rgba(240,192,64,0.06)"; } }}
                                            onMouseOut={e => { if (ok) { e.target.style.borderColor = "rgba(200,200,216,0.2)"; e.target.style.color = "#c8c8d8"; e.target.style.background = "rgba(255,255,255,0.03)"; } }}
                                        >{ch.text}{!ok ? " (замало 💰)" : ""}</button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>
                                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,200,216,0.12)", padding: "12px 14px", borderRadius: 4, marginBottom: 16, lineHeight: 2.4 }}>
                                    <Px size={10} color="#e8dcc8">{result}</Px>
                                </div>
                                <Btn onClick={() => { setScreen("sailing"); setEncounter(null); setResult(null); }} size={11}>ПЛИВТИ ДАЛІ →</Btn>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
