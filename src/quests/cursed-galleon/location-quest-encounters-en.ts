import type { Encounter } from "../../engine/types";

/**
 * Location quest encounters (English).
 * Triggered by the location quest system when visiting specific map locations.
 */
export const locationQuestEncountersEn: Encounter[] = [
  // ══════════════════════════════════════════════════════
  // COMMON QUESTS
  // ══════════════════════════════════════════════════════

  // ── Tortuga: Smuggler's Cache ──
  {
    id: "lq_smuggler_cache",
    scene: "port",
    family: "quest",
    tags: ["treasure", "smuggling", "tortuga"],
    title: "Smuggler's Cache",
    text: "The old tavern 'Lame Parrot'. The barkeep avoids your gaze, but you notice fresh brickwork in the basement wall. Behind it, a hollow space. Someone walled up an entire stash of supplies and gold.",
    choices: [
      {
        text: "💰 Take everything",
        eff: { gold: [30, 55], crew: 0, karma: -1, curse: 0, rep: { brethren: 1 } },
        msg: "Gold coins, bottles of rum, and a sack of gunpowder. Whose it was no longer matters.",
        flag: "lq_smuggler_looted",
      },
      {
        text: "🤝 Negotiate with the barkeep",
        eff: { gold: [15, 30], crew: 0, karma: 1, curse: 0, rep: { brethren: 2, guild: 1 } },
        msg: "Half for you, half for him. Now you have a reliable contact in Tortuga.",
        flag: "lq_smuggler_ally",
      },
      {
        text: "🔍 Search thoroughly",
        eff: { gold: [20, 40], crew: 0, karma: 0, curse: 0, item: "trade_license" },
        msg: "Among the contraband, a trade license bearing the Jamaica governor's signature. Forged, but convincing.",
        flag: "lq_smuggler_license",
      },
    ],
  },

  // ── Nassau: Healing Herbs ──
  {
    id: "lq_healing_herbs",
    scene: "port",
    family: "quest",
    tags: ["healing", "nassau", "medicine"],
    title: "Healer of the Mangrove Swamps",
    text: "An old woman from the island invites you into her hut among the mangrove trees. Dried herbs, lizard bones, and bubbling jars everywhere. She says the sea brought you here for a reason.",
    choices: [
      {
        text: "💊 Buy medicine (-20 gold)",
        eff: { gold: -20, crew: [1, 2], karma: 0, curse: 0, item: "medicine_chest" },
        msg: "The potion is bitter but works instantly. Sick crew members recover. The healer adds a chest of herbs for the road.",
        flag: "lq_herbs_bought",
      },
      {
        text: "🌿 Ask her to teach you",
        eff: { gold: 0, crew: 1, karma: 1, curse: 0 },
        msg: "A full day among swamp plants. Now your cook knows which herbs stop a fever.",
        flag: "lq_herbs_knowledge",
      },
      {
        text: "🔮 Ask about the curse",
        eff: { gold: -10, crew: 0, karma: 0, curse: -2 },
        msg: "The healer falls silent, then produces a black candle. She burns it, whispering. The pressure in your chest eases. The curse retreats.",
        flag: "lq_herbs_curse_cleanse",
        requires_flag: "has_curse_symptoms",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // UNCOMMON QUESTS
  // ══════════════════════════════════════════════════════

  // ── Port Royal: Sunken Treasure ──
  {
    id: "lq_sunken_treasure",
    scene: "underwater",
    family: "quest",
    tags: ["treasure", "diving", "port_royal"],
    title: "The Sunken Galleon 'San Esteban'",
    text: "A one-legged old sailor points to a spot on your chart. The 'San Esteban' went down with a full hold of Spanish gold. Depth: ten fathoms. Sharks are a certainty, not a rumor.",
    choices: [
      {
        text: "🤿 Dive with the crew",
        eff: { gold: [40, 80], crew: [-2, -1], karma: 0, curse: 1, rep: { crown: -1 } },
        msg: "Sharks circle. Two are taken by the sea. But the hold is breached, and gold comes up by the bucketful.",
        flag: "lq_sunken_looted",
      },
      {
        text: "🦈 Careful descent",
        eff: { gold: [20, 45], crew: 0, karma: 0, curse: 0, item: "map_fragment" },
        msg: "Slowly, methodically. Less gold, but in the captain's quarters you find a piece of a map marked with an 'X'.",
        flag: "lq_sunken_map",
      },
      {
        text: "💀 Hire local divers (-15 gold)",
        eff: { gold: [-15, 30], crew: 0, karma: 1, curse: 0, rep: { guild: 1 } },
        msg: "The locals know these waters. No casualties, solid profit. Honest business.",
        flag: "lq_sunken_hired",
      },
    ],
  },

  // ── Havana: Voodoo Blessing ──
  {
    id: "lq_voodoo_blessing",
    npc: "voodoo_priestess",
    scene: "ethereal",
    family: "quest",
    tags: ["voodoo", "magic", "havana"],
    title: "Priestess of the Crossroads",
    text: "She waits for you at the intersection of three roads. Face painted with white clay, eyes like coal. 'Have you come for a blessing or the truth?' she asks in a voice that comes from nowhere.",
    choices: [
      {
        text: "🙏 Ask for a blessing",
        eff: { gold: -15, crew: 1, karma: 1, curse: -1 },
        msg: "She slaughters a rooster. Blood on the deck. The darkness retreats, and the crew feels a surge of strength. By morning, everyone forgets.",
        flag: "lq_voodoo_blessed",
      },
      {
        text: "🔮 Ask for the doll",
        eff: { gold: -25, crew: 0, karma: -2, curse: 2, item: "voodoo_doll" },
        msg: "A doll of wax and hair. 'Name a name, and it will do the rest,' the priestess whispers. The air grows heavy.",
        flag: "lq_voodoo_doll_acquired",
      },
      {
        text: "❓ Ask for the truth",
        eff: { gold: 0, crew: 0, karma: 2, curse: 1 },
        msg: "'Your ship is not a ship. Your sea is not a sea. You sail through someone's dream, and the dreamer is waking.' The words stay in your head.",
        flag: "lq_voodoo_truth",
      },
    ],
  },

  // ── Cartagena: Master Cartographer ──
  {
    id: "lq_master_cartographer",
    scene: "port",
    family: "quest",
    tags: ["map", "navigation", "cartagena"],
    title: "Don Felix Cartographo",
    text: "The office is buried in maps from floor to ceiling. An old Spaniard in a monocle examines your chart and clicks his tongue. 'You sail blind, Captain. Allow me to show you what this sea truly hides.'",
    choices: [
      {
        text: "🗺️ Buy a map (-30 gold)",
        eff: { gold: -30, crew: 0, karma: 0, curse: 0, item: "map_fragment", rep: { guild: 1 } },
        msg: "A detailed chart marking currents, shallows, and 'places one should not sail.' Priceless.",
        flag: "lq_cartographer_map",
      },
      {
        text: "📜 Trade information",
        eff: { gold: 0, crew: 0, karma: 1, curse: 0, rep: { crown: 1, guild: 1 } },
        msg: "Your notes on uncharted reefs impress him. In return, he marks secret routes on your chart.",
        flag: "lq_cartographer_trade",
      },
      {
        text: "🔍 Ask about the Flying Dutchman",
        eff: { gold: 0, crew: 0, karma: 0, curse: 1 },
        msg: "He turns pale. Pulls out a scroll depicting a ship burning with green fire. 'These coordinates. Never sail there.' You memorize the coordinates.",
        flag: "lq_cartographer_dutchman",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // RARE QUESTS
  // ══════════════════════════════════════════════════════

  // ── Port Royal: Ghost Captain ──
  {
    id: "lq_ghost_captain_deal",
    npc: "ghost_captain",
    scene: "ethereal",
    family: "setpiece",
    tags: ["ghost", "undead", "port_royal"],
    title: "The Ghost of Captain Morgan",
    text: "At midnight in the Port Royal cemetery, a green light flickers. A ghost in a captain's coat sits on his own tombstone. 'Finally, someone who sees,' he says. 'I have a proposition that benefits us both.'",
    choices: [
      {
        text: "👻 Accept the deal",
        eff: { gold: 0, crew: 0, karma: -1, curse: 2, item: "ghost_lantern" },
        msg: "He hands you a lantern that burns without flame. 'It will show the way through fog. But every night, you will see what I see.' Dead ships in black water.",
        flag: "lq_ghost_deal_accepted",
      },
      {
        text: "🧭 Ask for knowledge",
        eff: { gold: 0, crew: 0, karma: 0, curse: 1, item: "cursed_compass" },
        msg: "'A dead captain's compass. It doesn't point north; it points to what you fear most. Or desire. Sometimes they're the same thing. Every dawn it asks a small price for that honesty.'",
        flag: "lq_ghost_compass",
      },
      {
        text: "✝️ Refuse and pray",
        eff: { gold: 0, crew: 1, karma: 3, curse: -2, rep: { crown: 1 } },
        msg: "The ghost vanishes with a shriek. A moment of silence. Then one of your sailors wakes: 'Captain, I dreamed of where gold is hidden...'",
        flag: "lq_ghost_refused",
      },
    ],
  },

  // ── Bermuda: Kraken Lair ──
  {
    id: "lq_kraken_lair_dive",
    scene: "kraken",
    family: "setpiece",
    tags: ["kraken", "deep", "bermuda"],
    title: "The Kraken's Lair",
    text: "The water turns ice-cold. Something beneath the ship casts a shadow the size of an island. A tentacle rises slowly from the deep, holding a tooth larger than a man's arm. This isn't an attack. It's... an offer.",
    choices: [
      {
        text: "🦷 Accept the tooth",
        eff: { gold: 0, crew: 0, karma: 0, curse: 2, item: "kraken_tooth" },
        msg: "The tooth is cold as ice and pulses. The kraken descends. Now you are bound to the deep. Every night you dream of black water.",
        flag: "lq_kraken_pact",
      },
      {
        text: "⚔️ Attack the tentacle",
        eff: { gold: 0, crew: [-3, -1], karma: 0, curse: 0, rep: { brethren: 2 } },
        msg: "Madness! But the harpoons tear flesh. Ink floods the deck. The kraken retreats. Among the ink, gold coins from sunken ships.",
        flag: "lq_kraken_fought",
      },
      {
        text: "🐚 Offer the Siren Shell",
        eff: { gold: 0, crew: 0, karma: 2, curse: -1, loseItem: "siren_shell" },
        msg: "The shell sings underwater. The kraken freezes. Then it slowly lowers its tentacle and pushes your ship toward an unknown cove, full of treasure.",
        flag: "lq_kraken_siren",
        requires_item: "siren_shell",
      },
    ],
  },

  // ── Nassau: Pirate King's Tomb ──
  {
    id: "lq_pirate_king",
    scene: "cave",
    family: "setpiece",
    tags: ["pirate_king", "tomb", "nassau"],
    title: "Tomb of the Pirate King",
    text: "A cave behind a waterfall. Walls covered in pirate marks from hundreds of crews. In the center, a stone throne with a skeleton in captain's garb. In its bony hand, a black pearl.",
    choices: [
      {
        text: "🖤 Take the Black Pearl",
        eff: { gold: 0, crew: 0, karma: -1, curse: 3, item: "black_pearl" },
        msg: "The pearl pulses with dark light. The skeleton turns its head and whispers: 'Now you are next.' The crew is terrified. But the pearl... it protects against the deep.",
        flag: "lq_pirate_king_pearl",
      },
      {
        text: "⚓ Bow and leave",
        eff: { gold: [30, 60], crew: 0, karma: 3, curse: -1, rep: { brethren: 3 } },
        msg: "Respect for the dead. The walls crack open, revealing a hidden niche filled with gold. The Pirate King rewards those who do not take by force.",
        flag: "lq_pirate_king_respect",
      },
      {
        text: "📜 Read the wall inscriptions",
        eff: { gold: 0, crew: 0, karma: 1, curse: 1, item: "ancient_key" },
        msg: "Among hundreds of names, you find instructions: how to open the Temple of the Deep. And a key, bricked into the wall beside them.",
        flag: "lq_pirate_king_key",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // LEGENDARY QUESTS
  // ══════════════════════════════════════════════════════

  // ── Bermuda: Davy Jones' Locker ──
  {
    id: "lq_davy_jones",
    scene: "underwater",
    family: "setpiece",
    tags: ["davy_jones", "legendary", "bermuda"],
    title: "Davy Jones' Locker",
    text: "At the bottom of the Bermuda Triangle lies a city of ships. Thousands of sunken vessels fused by coral into a grotesque palace. At its heart, a beating heart. Davy Jones' Locker. The entrance stands open.",
    choices: [
      {
        text: "💀 Open the locker",
        eff: { gold: [80, 150], crew: [-2, 0], karma: -3, curse: 5, item: "ghost_lantern" },
        msg: "Inside, a beating heart. And gold, so much gold. You take it all. The heart stops. The sea shudders. Now the deep knows your name.",
        flag: "lq_davy_jones_opened",
      },
      {
        text: "🙏 Return what belongs to the sea",
        eff: { gold: -20, crew: 2, karma: 5, curse: -3, rep: { brethren: 2 } },
        msg: "You cast your gold into the locker. The heart beats faster. Dead sailors from the sunken ships rise and join your crew. Living, not ghosts.",
        flag: "lq_davy_jones_sacrifice",
      },
      {
        text: "🔑 Use the Ancient Key",
        eff: { gold: [50, 100], crew: 0, karma: 0, curse: 0, loseItem: "ancient_key", item: "siren_shell" },
        msg: "The key opens a hidden compartment in the locker. Not gold; the Siren Shell, an artifact that lets you breathe underwater. And a map of places where Davy Jones hid his treasures.",
        flag: "lq_davy_jones_key",
        requires_item: "ancient_key",
      },
    ],
  },

  // ── Havana: Fountain of Youth ──
  {
    id: "lq_fountain",
    scene: "ethereal",
    family: "setpiece",
    tags: ["fountain", "legendary", "havana"],
    title: "The Fountain of Youth",
    text: "Through the jungle, past poisonous frogs and conquistador skeletons. The fountain is small. A modest spring flowing from the rock. But the water is silver-blue, and where it touches the earth, flowers bloom that should not exist.",
    choices: [
      {
        text: "💧 Drink the water",
        eff: { gold: 0, crew: [2, 4], karma: 0, curse: 3 },
        msg: "Your body fills with strength. Wounds heal. But in the mirror, a stranger's face. Younger, yes, but... not yours. The water takes something in return.",
        flag: "lq_fountain_drank",
      },
      {
        text: "🧪 Bottle it up",
        eff: { gold: [40, 80], crew: 1, karma: 1, curse: 1, item: "medicine_chest" },
        msg: "One bottle for the crew, the rest to sell. The water cures disease, but not for free. Everyone healed dreams of the ocean floor.",
        flag: "lq_fountain_bottled",
      },
      {
        text: "🚫 Don't drink and walk away",
        eff: { gold: 0, crew: 0, karma: 4, curse: -2, rep: { crown: 2 } },
        msg: "You seal the entrance with stones. Some things are not meant for mortals. On the way out, you find a golden tablet: 'Wise is the one who does not take all.'",
        flag: "lq_fountain_refused",
      },
    ],
  },

  // ── Tortuga: Flying Dutchman ──
  {
    id: "lq_dutchman",
    scene: "ethereal",
    family: "setpiece",
    tags: ["dutchman", "legendary", "tortuga"],
    title: "The Flying Dutchman",
    text: "At midnight in Tortuga's harbor, a ship appears burning with green fire. Sails of mist, masts of bone. On deck stands a captain without a face. He extends his hand. He seeks a replacement.",
    choices: [
      {
        text: "🚢 Become captain of the Dutchman",
        eff: { gold: [100, 200], crew: [-5, -3], karma: -5, curse: 5, rep: { brethren: -3 } },
        msg: "Your men scream. Green flame engulfs the ship. Half the crew flees. But now you are immortal. The sea obeys. The price: your humanity.",
        flag: "lq_dutchman_captain",
      },
      {
        text: "⚔️ Battle the ghosts",
        eff: { gold: [30, 60], crew: [-3, -1], karma: 2, curse: 2, rep: { brethren: 3, crown: 1 } },
        msg: "Absurd, to fight phantoms. But your crew does not yield. At dawn the Dutchman vanishes, leaving a chest of gold on the waves and eternal glory.",
        flag: "lq_dutchman_fought",
      },
      {
        text: "🏮 Show the Ghost Lantern",
        eff: { gold: 0, crew: 0, karma: 0, curse: -3, loseItem: "ghost_lantern" },
        msg: "The faceless captain gazes at the lantern. Takes it. The green flame dies. 'At last,' he whispers. The Dutchman dissolves into mist. The curse is lifted, yours as well.",
        flag: "lq_dutchman_freed",
        requires_item: "ghost_lantern",
      },
    ],
  },
];
