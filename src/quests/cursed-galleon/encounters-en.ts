import type { Encounter } from "../../engine/types";

export const encountersEn: Encounter[] = [
  // ── SEA / TRADE ──
  {
    id: "merchant_spice", scene: "open_sea", title: "Spice Merchant",
    text: "A trader from Madagascar. Smells of cinnamon and cardamom. Offers a deal.",
    choices: [
      { text: "⚔️ Board them", eff: { gold: [25, 60], crew: [-2, 0], karma: -2, curse: 1 }, msg: "The hold is ours. The merchant watches with hatred." },
      { text: "💰 Buy spices (−15)", eff: { gold: -15, crew: 0, karma: 1, curse: 0 }, msg: "Spices will warm the cold nights. Morale rises.", flag: "has_spices" },
      { text: "📜 Ask about rumors", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Whispers of a sunken temple to the east, where gold goes untouched — because it bites.", flag: "knows_temple" },
    ],
  },
  {
    id: "merchant_weapons", scene: "open_sea", title: "Arms Smuggler",
    text: "A Dutch sloop under a false flag. Its hull bristles with muskets.",
    choices: [
      { text: "💰 Buy weapons (−25)", eff: { gold: -25, crew: 0, karma: 0, curse: 0 }, msg: "The crew is armed. The next fight will be easier.", flag: "armed" },
      { text: "⚔️ Take by force", eff: { gold: [10, 30], crew: [-1, 0], karma: -2, curse: 0 }, msg: "The smuggler swore revenge. Now he's your enemy.", flag: "arms_dealer_enemy" },
      { text: "🤝 Trade information", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "He tells of a British convoy passing in two days.", flag: "knows_convoy" },
    ],
  },
  {
    id: "merchant_silk", scene: "open_sea", title: "Chinese Junk",
    text: "A majestic ship with crimson sails. Silk, porcelain, tea.",
    choices: [
      { text: "🤝 Trade fairly", eff: { gold: [5, 20], crew: 0, karma: 2, curse: 0 }, msg: "The captain gifts a compass that 'points not north, but to what you seek'.", flag: "cursed_compass" },
      { text: "⚔️ Board them", eff: { gold: [40, 80], crew: [-3, -1], karma: -3, curse: 2 }, msg: "The junk burns. Among the silk — a scroll with unknown symbols. It pulses." },
      { text: "🍵 Tea with the captain", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "A former pirate. One of yours stays, but two of his crew ask to join you.", flag: "chinese_allies" },
    ],
  },
  {
    id: "floating_cargo", scene: "open_sea", title: "Floating Cargo",
    text: "Barrels of rum drifting after a wreck. Dozens of them.",
    choices: [
      { text: "🍺 Pick them up", eff: { gold: [10, 25], crew: 1, karma: 0, curse: 0 }, msg: "Rum is the currency of the Caribbean. The crew rejoices." },
      { text: "🔍 Search for the source", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "A wrecked ship. No one alive. The flag — familiar.", flag: "wreck_clue" },
      { text: "💨 Don't stop", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Caution is rare among pirates." },
    ],
  },
  {
    id: "whale", scene: "open_sea", title: "Whales",
    text: "A pod of whales swims alongside. Enormous, calm, ancient.",
    choices: [
      { text: "🐋 Watch in awe", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "For a moment, no one is a pirate. Just people gazing at a wonder." },
      { text: "🎯 Hunt", eff: { gold: [15, 30], crew: 0, karma: -2, curse: 1 }, msg: "Blood in the water. Gold in the hold. The sea will remember." },
      { text: "🎵 Listen to their song", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("siren_contact") ? "The siren answers the whales. A conversation millions of years old." : "A deep hum that resonates in your bones." },
    ],
  },
  // ── STORMS ──
  {
    id: "storm_basic", scene: "storm", title: "Storm!",
    text: "A wall of rain. The mast cracks. Waves tower above the deck.",
    choices: [
      { text: "⚓ Heave to", eff: { gold: 0, crew: [-1, 0], karma: 0, curse: 0 }, msg: "We survived. One was swept overboard." },
      { text: "🏴 Full sail ahead!", eff: { gold: 0, crew: [-2, 0], karma: 0, curse: 0 }, msg: s => s.crew >= 7 ? "Broke through! But two are missing." : "Not enough hands. Serious losses." },
      { text: "🌊 Catch the current", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "The current carries you somewhere wrong. The stars are different. The sky is the wrong color.", flag: "lost_waters" },
    ],
  },
  {
    id: "storm_lightning", scene: "storm", title: "Lightning Storm",
    text: "Lightning strikes the sea. For an instant you see SOMETHING beneath the water — enormous.",
    choices: [
      { text: "👀 Peer closer", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "It peers back. Now you know — the deep has eyes.", flag: "deep_watcher" },
      { text: "🙈 Look away", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "What you didn't see doesn't exist. At least, it's easier that way." },
      { text: "🔔 Ring the bell", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Something beneath the water freezes... and drifts away. This time.", flag: "bell_rang" },
    ],
  },
  {
    id: "storm_wreck", scene: "storm", title: "Wreckage in the Waves",
    text: "The storm destroyed someone's ship. Among the planks — a chest.",
    choices: [
      { text: "📦 Retrieve the chest", eff: { gold: [15, 50], crew: [-1, 0], karma: 0, curse: 0 }, msg: s => s.flags?.has("cursed_compass") ? "The compass points straight to it. Gold — and a medallion that whispers at night." : "Gold! One was swept away saving a barrel." },
      { text: "🆘 Search for survivors", eff: { gold: 0, crew: [1, 2], karma: 2, curse: 0 }, msg: "A navigator and a cook. Both swear their loyalty.", flag: "rescued_sailors" },
      { text: "💨 Don't risk it", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "The wreckage vanishes. Perhaps the right call." },
    ],
  },
  // ── ISLANDS ──
  {
    id: "island_village", scene: "island", title: "Fishing Village",
    text: "A small cove. Palm huts. Children on the beach.",
    choices: [
      { text: "🤝 Trade", eff: { gold: [5, 15], crew: 0, karma: 1, curse: 0 }, msg: "Fresh fish and fruit. The crew is grateful for a proper meal." },
      { text: "🔥 Raid", eff: { gold: [10, 25], crew: 0, karma: -4, curse: 2 }, msg: "Children scream. The elder curses in a language you don't know. The words burn into memory.", flag: "village_curse" },
      { text: "🏥 Rest", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "A day without the sea. The crew becomes human again." },
    ],
  },
  {
    id: "island_ruins", scene: "island", title: "Temple Ruins",
    text: "Stone columns in the green. On the walls — depictions of the sea and something from the deep.",
    choices: [
      { text: "🔍 Explore", eff: { gold: [0, 30], crew: 0, karma: 0, curse: 2 }, msg: "Golden figurines. And a depiction of a ship that looks like yours. It's hundreds of years old.", flag: "temple_visited" },
      { text: "📜 Read the inscriptions", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("knows_temple") ? "The merchant spoke truth. 'Gold remembers the hands that touched it.'" : "An unknown language. The carvings show: a sacrifice to the sea — and the sea answers." },
      { text: "💣 Leave it be", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "Respect for another's sacred ground. The sea takes notice." },
    ],
  },
  {
    id: "island_volcano", scene: "island", title: "Volcanic Island",
    text: "The ground trembles. Black sand. A glimmer in the rocks.",
    choices: [
      { text: "⛏️ Mine", eff: { gold: [20, 60], crew: [-2, -1], karma: 0, curse: 0 }, msg: "Obsidian and gold. Two got burned." },
      { text: "🌋 Climb to the top", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "You see an island that's not on any map. It shimmers.", flag: "saw_phantom_island" },
      { text: "💧 Mineral springs", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "The crew rests, wounds heal." },
    ],
  },
  {
    id: "island_abandoned", scene: "island", title: "Abandoned Camp",
    text: "Belongings, a hammock, a dead fire. In the sand — a word: 'RUN'.",
    choices: [
      { text: "🔍 Search", eff: { gold: [5, 15], crew: 0, karma: 0, curse: 1 }, msg: "A diary. Last entry: 'It comes out at night. It looks like me.'", flag: "doppelganger_warning" },
      { text: "🏃 Heed the warning", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Common sense prevails over curiosity." },
      { text: "🔥 Wait until nightfall", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "From the forest walks... you. An exact copy. It smiles and dissolves.", flag: "met_double" },
    ],
  },
  {
    id: "island_native_chief", scene: "island", title: "Island Chieftain",
    text: "Warriors emerge from the jungle. Their leader — a woman with scars and wise eyes.",
    choices: [
      { text: "🎁 Offer gifts", eff: { gold: -10, crew: 0, karma: 2, curse: 0 }, msg: "She accepts and offers a guide through the reefs. A priceless gift.", flag: "has_guide" },
      { text: "⚔️ Show of force", eff: { gold: 0, crew: [-1, 0], karma: -2, curse: 1 }, msg: "Poisoned arrows. One killed. You flee under a hail of darts." },
      { text: "🙏 Ask for shelter", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "A week of rest. One sailor falls in love and stays. But two islanders wish to see the world." },
    ],
  },
  // ── CREW ──
  {
    id: "crew_sick", scene: "open_sea", title: "Sickness Aboard",
    text: "Tropical fever. Three in hammocks, the rest are afraid.",
    requires: s => s.day > 3,
    choices: [
      { text: "🏥 Treat them (−20)", eff: { gold: -20, crew: 0, karma: 1, curse: 0 }, msg: s => s.flags?.has("has_spices") ? "The Malagasy spices make perfect medicine! Everyone recovers." : "Medicine at the next stop. Most recover." },
      { text: "🚢 Abandon the sick", eff: { gold: 0, crew: -3, karma: -2, curse: 1 }, msg: "Left on an island. Their eyes are the last thing you see." },
      { text: "🙏 Wait it out", eff: { gold: 0, crew: [-2, -1], karma: 0, curse: 0 }, msg: "Some recover, some don't." },
    ],
  },
  {
    id: "crew_celebration", scene: "open_sea", title: "Crew Celebrates",
    text: "A good haul! Rum flows like a river. Songs carry for miles.",
    requires: s => s.gold > 50,
    choices: [
      { text: "🍺 Celebrate! (−10)", eff: { gold: -10, crew: 1, karma: 0, curse: 0 }, msg: "Best night in months. Even old Morgan dances." },
      { text: "🚫 Ban the rum", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "A captain without rum is a dangerous man. Whispers on deck." },
      { text: "🎲 Gambling", eff: { gold: [-20, 20], crew: 0, karma: 0, curse: 0 }, msg: "The dice fly. Some get rich, some lose the shirt off their back." },
    ],
  },
  {
    id: "crew_mutiny", scene: "open_sea",
    title: s => s.karma < -3 ? "Mutiny!" : "Mutiny!",
    text: s => s.karma < -3 ? "The crew surrounds you with knives. 'You've gone too far, Captain.'" : "Part of the crew demands a change of course.",
    requires: s => s.day > 7,
    choices: [
      { text: "⚔️ Crush it", eff: { gold: 0, crew: [-3, -2], karma: -1, curse: 0 }, msg: s => s.flags?.has("armed") ? "The smuggler's weapons settle the dispute. Swiftly and terribly." : "Blood on the deck." },
      { text: "🤝 Negotiate", eff: { gold: [-15, -5], crew: [0, 1], karma: 1, curse: 0 }, msg: "A bigger share. The crew calms down. For now." },
      { text: "🗳️ Put it to a vote", eff: { gold: 0, crew: 0, karma: 2, curse: 0 }, msg: s => s.karma >= 0 ? "They vote for you. Democracy works when they trust the captain." : "They vote against. But you accept the result." },
    ],
  },
  {
    id: "crew_storyteller", scene: "open_sea", title: "Night of Stories",
    text: "Dead calm. Stars. An old sailor tells tales of the Black Pearl.",
    choices: [
      { text: "👂 Listen", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "The crew grows closer. In the darkness — human warmth." },
      { text: "❓ About the curse", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.curse > 3 ? "'I see it on you, Captain. You already smell of the deep.'" : "'Curses are fairy tales. A real pirate fears only dead calm.'" },
      { text: "🗣️ Tell your story", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "You tell them why you became a pirate. Silence. 'I'm with you, Captain.'" },
    ],
  },
  {
    id: "crew_desertion", scene: "port", title: "Deserters",
    text: "Three are gone by morning. Fled with some of the gold.",
    requires: s => s.day > 5 && s.karma < 0,
    choices: [
      { text: "🔍 Hunt them down", eff: { gold: [5, 15], crew: [-1, 0], karma: -2, curse: 0 }, msg: "Found two. The third vanished. Punishment is public." },
      { text: "💨 Let them go", eff: { gold: -15, crew: -3, karma: 0, curse: 0 }, msg: "Fewer mouths, fewer problems." },
      { text: "📢 Recruit replacements", eff: { gold: -10, crew: [1, 3], karma: 0, curse: 0 }, msg: "The port tavern — a forge of pirates." },
    ],
  },
  {
    id: "crew_duel", scene: "open_sea", title: "Duel on Deck",
    text: "Two sailors reach for their knives. A dispute over shares of the loot.",
    choices: [
      { text: "⚖️ Judge fairly", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "A fair verdict. Both comply. Respect earned." },
      { text: "🗡️ Let them fight", eff: { gold: 0, crew: -1, karma: -1, curse: 0 }, msg: "One falls. The law of the sea — cruel, but clear." },
      { text: "🍺 Rum will solve it", eff: { gold: -5, crew: 0, karma: 0, curse: 0 }, msg: "An hour later they're hugging. The problem hasn't vanished, just postponed." },
    ],
  },
  // ── COMBAT ──
  {
    id: "navy_patrol", scene: "combat", title: "Navy Corvette",
    text: "British flag. 20 guns. They've spotted you.",
    choices: [
      { text: "⚔️ Fight!", eff: { gold: [0, 50], crew: [-4, -2], karma: -1, curse: 0 }, msg: s => s.flags?.has("armed") ? "The smuggler's weapons decide the battle!" : "A bloody fight. Barely survived." },
      { text: "💨 Run", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.crew >= 6 ? "Full sails! The corvette can't keep up." : "Not enough hands. Barely broke away." },
      { text: "🏳️ Pose as a merchant", eff: { gold: [-10, 0], crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("arms_dealer_enemy") ? "The smuggler is aboard! He recognizes you. You flee under fire." : "Forged papers work. Your heart pounds for an hour." },
    ],
  },
  {
    id: "pirate_rival", scene: "combat", title: "Black Barrett",
    text: "A pirate brig. The captain is a notorious cutthroat. He shouts an offer.",
    choices: [
      { text: "⚔️ Fight", eff: { gold: [20, 70], crew: [-3, -1], karma: 0, curse: 0 }, msg: "Barrett fights like a demon. But you're better." },
      { text: "🤝 Join forces", eff: { gold: 0, crew: [2, 4], karma: 0, curse: 0 }, msg: "Two ships. An unreliable ally, but useful for now.", flag: "barret_alliance" },
      { text: "🍺 Rum and a chat", eff: { gold: -5, crew: 0, karma: 1, curse: 0 }, msg: "Barrett is a chatty drunk. Tells of an island where ships vanish.", flag: "knows_bermuda" },
    ],
  },
  {
    id: "convoy_attack", scene: "combat", title: "British Convoy!",
    text: "Three merchants escorted by a frigate. The grand prize — the grand risk.",
    requires: s => s.flags?.has("knows_convoy"),
    choices: [
      { text: "⚔️ Take them all!", eff: { gold: [50, 120], crew: [-5, -2], karma: -2, curse: 0 }, msg: s => s.flags?.has("barret_alliance") ? "With Barrett, it's a hunt. The convoy surrenders." : "One against four. Madness. But gold enough for three lifetimes." },
      { text: "🎯 Pick off the straggler", eff: { gold: [20, 40], crew: [-1, 0], karma: -1, curse: 0 }, msg: "The trailing merchant — easy prey." },
      { text: "👀 Reconnoiter", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "You memorize the route. Next time.", flag: "convoy_route" },
    ],
  },
  {
    id: "spanish_galleon", scene: "combat", title: "Spanish Galleon!",
    text: "The golden flag of Castile. A massive ship. Slow, but with 40 cannons.",
    choices: [
      { text: "⚔️ Dawn attack", eff: { gold: [40, 100], crew: [-4, -2], karma: -1, curse: 0 }, msg: s => s.flags?.has("has_guide") ? "The guide knows the reefs — you lure the galleon onto the shallows. Easy prey!" : "Head-on assault. The cannons are devastating. But boarding is your element." },
      { text: "🏴 Raise the Spanish flag", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "You approach point-blank. By the time they realize — too late. But if someone survived and recognized you...", flag: "spanish_disguise" },
      { text: "💨 Sail around", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Not every fight is worth starting. Wisdom is a weapon too." },
    ],
  },
  // ── SUPERNATURAL ──
  {
    id: "sirens_song", scene: "ethereal", title: "Song in the Fog",
    text: "A melody with no source. The crew freezes. Someone steps toward the rail.",
    choices: [
      { text: "🔇 Wax in ears", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "It works. But the melody was beautiful." },
      { text: "🎵 Listen", eff: { gold: 0, crew: [-2, -1], karma: 0, curse: 3 }, msg: "Two leap overboard with smiles on their faces." },
      { text: "🎶 Sing back", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "A woman's voice: 'Interesting. We'll meet again.' In the fog — eyes.", flag: "siren_contact" },
    ],
  },
  {
    id: "siren_return", scene: "ethereal", title: "She Has Come",
    text: "A woman with pearls in her hair sits on the bow. The crew doesn't see her. Only you.",
    requires: s => s.flags?.has("siren_contact"),
    choices: [
      { text: "❓ What do you want?", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "'You're interesting. Usually people either flee or drown. You — you sing.' She offers a bargain.", flag: "siren_deal" },
      { text: "⚔️ Get off my ship", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "'Brave and foolish.' She vanishes in a spray of sea." },
      { text: "🎶 Sing again", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "For an instant you see the world through her eyes — infinite depth. Beautiful. Terrifying.", flag: "siren_bond" },
    ],
  },
  {
    id: "ghost_ship", scene: "combat", enemyType: "ghost", title: "Ghost Ship",
    text: "A rotting galleon with no flag. On the deck — skeletons that move.",
    choices: [
      { text: "💀 Board it!", eff: { gold: [30, 80], crew: [-2, 0], karma: 0, curse: 4 }, msg: "The skeletons fight in silence. In the hold — a map to a place that shouldn't exist.", flag: "ghost_map" },
      { text: "🔥 Burn it", eff: { gold: 0, crew: 0, karma: 1, curse: -2 }, msg: "Fire devours the dead wood. The sound — a scream, or perhaps gratitude." },
      { text: "👻 Speak to them", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: s => s.flags?.has("deep_watcher") ? "'It waits,' says the dead captain. 'It has always waited for you.'" : "'Don't go to the bottom. There's no treasure there. Only the price.'" },
    ],
  },
  {
    id: "kraken_attack", scene: "kraken", title: "KRAKEN!",
    text: "The water boils. Tentacles thick as the mast coil around the ship.",
    choices: [
      { text: "⚔️ Hack away!", eff: { gold: 0, crew: [-4, -2], karma: 0, curse: 0 }, msg: s => s.flags?.has("armed") ? "The weapons sever the tentacles! The Kraken retreats." : "Axes against flesh. A long fight." },
      { text: "💰 Feed it gold", eff: { gold: [-40, -20], crew: 0, karma: 0, curse: -1 }, msg: "The tentacles carefully take the chests. A deal." },
      { text: "🩸 Blood sacrifice", eff: { gold: 0, crew: -3, karma: -3, curse: 4 }, msg: "Three souls for passage. The Kraken releases you. Its eyes are the same as those in the deep.", flag: "kraken_pact" },
    ],
  },
  {
    id: "eclipse", scene: "ethereal", title: "Eclipse",
    text: "The moon swallows the sun. Total darkness. Different stars.",
    choices: [
      { text: "🔭 Study the stars", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("saved_martin") ? "Martin goes pale: 'These stars are from another sky. We're between worlds.'" : "Like a map to a place that shouldn't exist." },
      { text: "🙏 Pray", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "The darkness recedes. Prayer or time?" },
      { text: "🎲 Toss a coin into the sea", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "The sea returns a different coin. 200 years older." },
    ],
  },
  {
    id: "sea_fog", scene: "ethereal", title: "Thick Fog",
    text: "Zero visibility. Someone calls you by name.",
    choices: [
      { text: "📢 Answer", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("siren_bond") ? "The siren: 'It's dangerous ahead. Turn back.' For the first time — genuine concern?" : "The voice fades. Then — distant, inhuman laughter." },
      { text: "🔇 Stay silent", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "The fog clears. You're in the same spot. Time — stolen." },
      { text: "🔔 Ring the bell", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("bell_rang") ? "The bell cuts through the fog. Each time — it retreats a step. You've learned its language." : "The bell tolls — and the fog parts. But behind it — another fog." },
    ],
  },
  // ── CASTAWAY CHAIN ──
  {
    id: "castaway_normal", scene: "open_sea", title: "Man on the Wreckage",
    text: "A sailor clings to a plank. Face sunburned.",
    choices: [
      { text: "🤝 Rescue him", eff: { gold: 0, crew: 1, karma: 2, curse: 0 }, msg: "Martin. Former navigator. Reads the stars like no one else.", flag: "saved_martin" },
      { text: "💰 Only for information", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Coordinates to a sunken galleon laden with Spanish gold.", flag: "knows_galleon" },
      { text: "💨 Sail past", eff: { gold: 0, crew: 0, karma: -2, curse: 1 }, msg: "He watches you go. The next night, someone sees him in the water." },
    ],
  },
  {
    id: "castaway_cursed", scene: "ethereal", title: "Figure on the Water",
    text: "A person STANDS on the water. Not sinking. Eyes pure white. Smiling.",
    requires: s => s.curse >= 5,
    choices: [
      { text: "🤝 Reach out", eff: { gold: 0, crew: 0, karma: 0, curse: 4 }, msg: "'Thank you. Now I can leave.' Vanishes. The cold in your hand — remains.", flag: "cold_touch" },
      { text: "❓ Who are you?", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("doppelganger_warning") ? "'I am the one who was before you. And after you. We are all the same person.' The diary was true." : "'No one. Everyone. The sea remembers each soul.'" },
      { text: "🔥 Shoot", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: "The bullet passes through. He looks surprised. Dissolves." },
    ],
  },
  // ── PORT ──
  {
    id: "port_tortuga", scene: "port", title: "Tortuga",
    text: "The pirate capital. Everything has its price.",
    choices: [
      { text: "🔧 Repairs (−20)", eff: { gold: -20, crew: 0, karma: 0, curse: 0 }, msg: "Hull, mast, cannons — good as new.", flag: "ship_repaired" },
      { text: "📢 Recruit (−10)", eff: { gold: -10, crew: [2, 4], karma: 0, curse: 0 }, msg: "New faces, new hands, new problems." },
      {
        text: "🗣️ Tavern (−5)", eff: { gold: -5, crew: 0, karma: 0, curse: 0 },
        msg: s => {
          if (s.curse > 3) return "A healer in the corner: 'I see a shadow on you. Come — I can help.'";
          if (!s.flags?.has("knows_bermuda")) return "A drunk captain talks of a place where ships vanish.";
          return "The usual pirate tall tales. The rum's not bad.";
        },
        flag: s => s.curse > 3 ? "knows_healer" : null,
      },
    ],
  },
  {
    id: "port_nassau", scene: "port", title: "Nassau",
    text: "The governor offers pardons to pirates.",
    requires: s => s.day > 10,
    choices: [
      { text: "📜 Accept the pardon", eff: { gold: -30, crew: -2, karma: 4, curse: -3 }, msg: "Part of the gold as 'tax'. Two leave. But now you're legitimate." },
      { text: "🏴 Raid the port", eff: { gold: [30, 60], crew: [-2, 0], karma: -4, curse: 2 }, msg: "Nassau burns. Your name is known to all." },
      { text: "💨 Sail on", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "The law isn't for you." },
    ],
  },
  {
    id: "healer", scene: "port", title: "The Healer",
    text: "A dark room. Candles. A woman covered in tattoos stares through you.",
    requires: s => s.flags?.has("knows_healer") && s.curse >= 4,
    choices: [
      { text: "💰 Healing (−30)", eff: { gold: -30, crew: 0, karma: 0, curse: -4 }, msg: "'A curse is a debt. I'll lessen it, but not erase it.' Pain — then relief." },
      { text: "❓ What's wrong with me?", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => `'${s.curse} layers of darkness. Each choice — a coin in the sea's coffer. When it's full — the sea will come.'` },
      { text: "🚪 Leave", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "'You'll be back. They all come back.'" },
    ],
  },
  // ── CONSEQUENCES ──
  {
    id: "martin_betrayal", scene: "open_sea", title: "Martin Is Gone",
    text: "He's gone by morning. On the deck — a word written in blood.",
    requires: s => s.flags?.has("saved_martin") && s.karma < -2 && s.day > 10,
    choices: [
      { text: "📖 Read it", eff: { gold: -20, crew: -1, karma: 0, curse: 2 }, msg: "'You don't deserve them.' He took gold and one sailor." },
      { text: "🔥 Burn it", eff: { gold: -20, crew: 0, karma: 0, curse: 0 }, msg: "You burn the plank. No one saw." },
    ],
  },
  {
    id: "martin_saves", scene: "storm", title: "Martin Knows the Way",
    text: "Storm! Martin studies the stars through a break in the clouds. 'Trust me.'",
    requires: s => s.flags?.has("saved_martin") && s.karma >= 0 && s.day > 8,
    choices: [
      { text: "🧭 Trust him", eff: { gold: [10, 30], crew: 0, karma: 1, curse: 0 }, msg: "He guides through the storm like silk. A cove with treasures on the seabed." },
      { text: "🚫 I'm the captain", eff: { gold: 0, crew: -1, karma: 0, curse: 0 }, msg: "Martin falls silent. He won't offer help again." },
    ],
  },
  {
    id: "barret_betrayal", scene: "combat", title: "Barrett Stabs You in the Back!",
    text: "In the dead of night — a cannon blast. 'Nothing personal!'",
    requires: s => s.flags?.has("barret_alliance") && s.gold > 60 && s.day > 12,
    choices: [
      { text: "⚔️ Fight!", eff: { gold: [-20, 0], crew: [-3, -1], karma: 0, curse: 0 }, msg: "Betrayal hurts more than wounds." },
      { text: "💰 Pay him off", eff: { gold: -40, crew: 0, karma: 0, curse: 0 }, msg: "'See? We can still make deals!' Barrett laughs." },
      { text: "🤝 Offer more", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "'Together we'll take ten times as much.' — 'Fine. But next time — I'm captain.'", flag: "barret_deal" },
    ],
  },
  {
    id: "village_ghost", scene: "ethereal", title: "The Elder's Voice",
    text: "At night — whispers. A language you don't know, yet understand: 'Return what you took.'",
    requires: s => s.flags?.has("village_curse"),
    choices: [
      { text: "💰 Return it (−20)", eff: { gold: -20, crew: 0, karma: 3, curse: -3 }, msg: "You throw gold into the sea toward the island. The whispers fade. Relief." },
      { text: "🚫 Ignore it", eff: { gold: 0, crew: -1, karma: -1, curse: 3 }, msg: "The whisper becomes a scream. One sailor — from the village — throws himself overboard." },
      { text: "🙏 Apologize", eff: { gold: 0, crew: 0, karma: 2, curse: -1 }, msg: "The whispers quiet. Not forgiveness, but a truce." },
    ],
  },
  // ── DEEP SUPERNATURAL ──
  {
    id: "cursed_treasure", scene: "cave", title: "Treasure Cave",
    text: "Gold to the ceiling. Pearls, diamonds. And silence. Absolute.",
    requires: s => s.flags?.has("ghost_map") || s.flags?.has("knows_temple"),
    choices: [
      { text: "💰 Take everything", eff: { gold: [80, 150], crew: 0, karma: 0, curse: 5 }, msg: "The gold is WARM. The coins pulse. No matter how much you take — more appears." },
      { text: "💍 Just one thing", eff: { gold: [20, 40], crew: 0, karma: 0, curse: 1 }, msg: "A ruby ring. It fits perfectly. Too perfectly." },
      { text: "🚫 Nothing", eff: { gold: 0, crew: 0, karma: 3, curse: -3 }, msg: "The cave... exhales? Respect? Disappointment?" },
    ],
  },
  {
    id: "phantom_island", scene: "ethereal", title: "Phantom Island",
    text: "White trees. Black sand. Time moves differently here.",
    requires: s => s.flags?.has("saw_phantom_island") || s.curse >= 8,
    choices: [
      { text: "🏝️ Go ashore", eff: { gold: [0, 40], crew: 0, karma: 0, curse: 3 }, msg: "Your belongings. Things you haven't lost yet. The future? A parallel?", flag: "visited_phantom" },
      { text: "🔭 Observe", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "On the shore — you. Waving at yourself." },
      { text: "💨 Flee", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "It vanishes the moment you look away." },
    ],
  },
  {
    id: "deep_temple", scene: "underwater", title: "Temple on the Seabed",
    text: "The water is clear to the bottom. Columns, arches, light.",
    requires: s => s.flags?.has("temple_visited") || s.flags?.has("deep_watcher"),
    choices: [
      { text: "🤿 Dive", eff: { gold: [20, 60], crew: [-1, 0], karma: 0, curse: 4 }, msg: s => s.flags?.has("kraken_pact") ? "The Kraken escorts you to the entrance. Inside — not gold. Knowledge." : "Beautiful and horrifying. An artifact pulses in your hands." },
      { text: "🔔 Ring the bell", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("bell_rang") ? "The temple ANSWERS. The columns glow. Something rises." : "The sound drowns in the water. But you were heard." },
      { text: "🙏 Pray", eff: { gold: 0, crew: 0, karma: 2, curse: -2 }, msg: "Someone listens. The pressure eases. The curse recedes." },
    ],
  },
  {
    id: "mirror_sea", scene: "ethereal", title: "M I R R O R  S E A",
    text: "The water is a perfect mirror. Your ship is reflected, but sailing the other way.",
    requires: s => s.curse >= 10,
    choices: [
      { text: "🪞 Jump in", eff: { gold: 0, crew: 0, karma: 0, curse: 5 }, msg: "Below, everything is reversed. Your crew is dead. You are immortal. Alternative or trap?" },
      { text: "💔 Shatter it", eff: { gold: 0, crew: -1, karma: 0, curse: -3 }, msg: "A cannon into the water. The mirror cracks. Someone screams — their reflection vanished." },
      { text: "🙈 Close your eyes", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Your own voice from below: 'You can't run from yourself forever.'" },
    ],
  },
  {
    id: "dead_captain", scene: "ethereal", title: "T H E  C A P T A I N  R E T U R N S",
    text: "A shadow on the deck. 'This was always my ship.'",
    requires: s => s.curse >= 12,
    choices: [
      { text: "⚔️ Fight or leave", eff: { gold: 0, crew: -1, karma: 0, curse: -2 }, msg: "Sword through shadow. He retreats. 'Temporarily.'" },
      { text: "🤝 Share command", eff: { gold: [20, 40], crew: [1, 3], karma: 0, curse: 4 }, msg: "The dead captain brings a dead crew. Living and dead together." },
      { text: "🚪 Surrender the ship", eff: { gold: -999, crew: 0, karma: 3, curse: -5 }, msg: "A rowboat. Freedom from everything." },
    ],
  },
  {
    id: "doppelganger", scene: "ethereal", title: "H E  R E T U R N S",
    text: "Your doppelganger. The crew can't tell who's real.",
    requires: s => s.flags?.has("met_double") && s.curse >= 8,
    choices: [
      { text: "⚔️ Fight", eff: { gold: 0, crew: -1, karma: 0, curse: -2 }, msg: "You kill him. Or did he kill you? You're not sure." },
      { text: "❓ Who are you?", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "'I'm the you who made the right choices. You're the mistake.' Vanishes. You feel lesser." },
      { text: "🤝 Accept", eff: { gold: 0, crew: 0, karma: 0, curse: 4 }, msg: "You embrace yourself. Every choice, alternative, version. Then — darkness.", flag: "merged" },
    ],
  },
  {
    id: "galleon_found", scene: "underwater", title: "The Sunken Galleon",
    text: "The coordinates were right. Spanish gold on the shallows.",
    requires: s => s.flags?.has("knows_galleon"),
    choices: [
      { text: "🤿 Dive", eff: { gold: [40, 90], crew: [-1, 0], karma: 0, curse: 2 }, msg: "Skeletons clutch the chests, still guarding them." },
      { text: "🔍 Be cautious", eff: { gold: [15, 30], crew: 0, karma: 0, curse: 0 }, msg: "Surface retrieval only. The skeletons below start stirring at sunset." },
      { text: "📜 Search for the log", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "'We found the gold of El Dorado. The gold found us. It doesn't let go.'", flag: "eldorado_knowledge" },
    ],
  },
  {
    id: "bermuda_zone", scene: "ethereal", title: "Dead Zone",
    text: "No wind, no current. The compass spins. Three empty ships.",
    requires: s => s.flags?.has("knows_bermuda"),
    choices: [
      { text: "🔍 Search them", eff: { gold: [20, 50], crew: 0, karma: 0, curse: 3 }, msg: "On one — warm food. On another — a log dated tomorrow. On the third — your name carved into the mast." },
      { text: "🕯️ Light the lanterns", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "Wind returns — from all directions at once. You exit somewhere wrong." },
      { text: "🙏 Wait for dawn", eff: { gold: 0, crew: -1, karma: 0, curse: 2 }, msg: "Dawn takes 18 hours. The sun rises in the wrong place. One sailor loses his mind." },
    ],
  },
];
