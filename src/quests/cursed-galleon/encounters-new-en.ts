import type { Encounter } from "../../engine/types";

export const newEncountersEn: Encounter[] = [
  // ── PORT ENCOUNTERS ──
  {
    id: "port_tavern_map", scene: "port", phase: "early", family: "quest", title: "Map on the Table",
    text: "A drunk old man in the tavern scribbles on a napkin. 'Isle of Tears. L'Olonnais's treasure is still there.'",
    choices: [
      { text: "💰 Buy the map (−15)", eff: { gold: -15, crew: 0, karma: 0, curse: 0 }, msg: "His trembling hand traces a route. Something in his eyes says: he's been there.", flag: "knows_olonne_treasure" },
      { text: "🍺 Get him drunk (−5)", eff: { gold: -5, crew: 0, karma: 0, curse: 0 }, msg: "After the third bottle he whispers: 'Don't take the pearls. Only silver. The pearls weep at night.'", flag: "olonne_warning" },
      { text: "⚔️ Take it by force", eff: { gold: 0, crew: 0, karma: -2, curse: 1 }, msg: "The old man is fast. A knife in the table beside your hand. But you grabbed the map first.", flag: "knows_olonne_treasure" },
      { text: "💨 Don't trust drunkards", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Half of pirate maps lead nowhere. Wisdom? Or a missed chance?" },
    ],
  },
  {
    id: "port_shipwright", scene: "port", phase: "early", family: "ambient", title: "Master Shipwright",
    text: "Litvak, the best carpenter in the Caribbean. He inspects your hull and grimaces: 'Another month, and the bottom falls off.'",
    choices: [
      { text: "🔧 Full repair (−30)", eff: { gold: -30, crew: 0, karma: 0, curse: 0, rep: { guild: 1 } }, msg: "Three days of work. Hull like new. Litvak says: 'She'll hold through any storm.' Adds copper sheathing.", flag: "hull_reinforced" },
      { text: "🔧 Patch job (−10)", eff: { gold: -10, crew: 0, karma: 0, curse: 0 }, msg: "It'll hold. Not long, but it'll hold." },
      { text: "🤝 Offer a share", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Litvak stares at the sea. 'Haven't sailed in years. I'm in.' Now you have a shipwright aboard.", flag: "has_shipwright" },
    ],
  },
  {
    id: "port_slave_market", scene: "port", phase: "mid", family: "setpiece", weight: 0.8, title: "The Slave Market",
    text: "Port Royal. People sold like cattle. Among the captives, you spot a sailor with a Brotherhood tattoo.",
    choices: [
      { text: "💰 Buy their freedom (−20)", eff: { gold: -20, crew: 2, karma: 3, curse: 0, rep: { brethren: 3, crown: -1 } }, msg: "Two freed. One turns out to be a navigator, the other speaks three languages. The gratitude in their eyes is worth more than gold.", flag: "freed_captives" },
      { text: "⚔️ Free them by force", eff: { gold: 0, crew: [3, 5], karma: 2, curse: 0, rep: { crown: -3, brethren: 4 } }, msg: "Chaos at the market. Chains broken. Five follow you. The port is closed to you forever.", flag: "port_royal_enemy" },
      { text: "😔 Look away", eff: { gold: 0, crew: 0, karma: -2, curse: 1 }, msg: "Screams behind you. Some things you never forget." },
      { text: "📜 Forge documents (−10)", eff: { gold: -10, crew: 1, karma: 2, curse: 0, rep: { guild: -1 } }, msg: "A forged letter of manumission. The navigator walks out calmly. Nobody noticed.", flag: "freed_captives" },
    ],
  },
  {
    id: "port_fortune_teller", scene: "port", family: "quest", title: "Fortune Teller from Haiti",
    text: "A dark-skinned woman with white eyes blocks your path. 'I see your future. It is wet.'",
    choices: [
      { text: "🔮 Listen (−5)", eff: { gold: -5, crew: 0, karma: 0, curse: 1 }, msg: s => s.curse >= 5 ? "'The Sea King has already set his eyes on you. You need kraken blood.' She produces a dried tooth." : "'Three choices ahead will change everything. The first will seem easy.'", flag: s => s.curse >= 5 ? "kraken_cure_hint" : null },
      { text: "🧿 Ask for protection (−15)", eff: { gold: -15, crew: 0, karma: 0, curse: -2, item: "voodoo_doll" }, msg: "'Keep it. But know this: every healing has a price. The doll takes the pain, but remembers it.'", flag: "voodoo_protection" },
      { text: "🚶 Walk around her", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "'You'll come back,' she says to your back. 'They always do.'" },
    ],
  },
  {
    id: "port_auction", scene: "port", phase: "mid", family: "ambient", title: "Prize Auction",
    text: "Plunder from five captured ships is laid out on the wharf. Captains bid for the choicest pieces.",
    choices: [
      { text: "💰 Bid (−20)", eff: { gold: -20, crew: 0, karma: 0, curse: 0, item: "trade_license" }, msg: "You snag a bundle of Dutch trading licenses. With these, you can pass any blockade." },
      { text: "📢 Sell your own", eff: { gold: [20, 45], crew: 0, karma: 0, curse: 0 }, msg: "Decent price. Coin in your pocket." },
      { text: "🗣️ Listen to the talk", eff: { gold: 0, crew: 0, karma: 0, curse: 0, rep: { brethren: 1 } }, msg: "A French privateer whispers about a convoy from Cartagena. Twelve galleons. Inca gold.", flag: "knows_cartagena_convoy" },
      { text: "🤝 Seek allies", eff: { gold: -5, crew: 0, karma: 0, curse: 0, rep: { brethren: 2 } }, msg: "Captain Duvall offers a joint raid. His brigantine is fast, and he knows these waters.", flag: "duvall_alliance" },
    ],
  },

  // ── UNDERWATER ENCOUNTERS ──
  {
    id: "underwater_wreck_spanish", scene: "underwater", phase: "mid", family: "quest", title: "Spanish Caravel",
    text: "The hull lies on its side. Seaweed wraps the cannons. Something glints in the captain's cabin.",
    choices: [
      { text: "🤿 Dive into the cabin", eff: { gold: [25, 55], crew: [-1, 0], karma: 0, curse: 1 }, msg: "The captain's skeleton sits at his desk. In his hand, a locket with a woman's portrait. Gold all around, but you feel only sadness.", flag: "spanish_captain_locket" },
      { text: "🔍 Search the hold", eff: { gold: [10, 30], crew: 0, karma: 0, curse: 0 }, msg: "Barrels of spices. Most spoiled, but some still valuable." },
      { text: "📜 Ship's log", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Last entry: 'Something pulls us down. Not a storm. Something alive.' The ink is smeared with tears.", flag: "knows_deep_thing" },
      { text: "🙏 Pray for the fallen", eff: { gold: 0, crew: 1, karma: 2, curse: -1 }, msg: "Silence underwater. Your crew watches with respect. Even pirates have honor." },
    ],
  },
  {
    id: "underwater_coral_city", scene: "underwater", phase: "late", family: "setpiece", weight: 0.7, title: "Coral City",
    text: "Beneath the water, the outlines of buildings emerge. Coral has grown over walls and towers. This is not nature. This is architecture.",
    requires: s => s.flags?.has("knows_deep_thing") || s.curse >= 7,
    choices: [
      { text: "🤿 Enter", eff: { gold: [30, 70], crew: [-1, 0], karma: 0, curse: 4 }, msg: "Inside, there is air. How? Golden inscriptions on the walls. A language older than humanity. You understand one word: 'Welcome.'", flag: "entered_coral_city" },
      { text: "🔭 Observe", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "Something moves between the buildings. People? No. But not fish either. Something in between." },
      { text: "💨 Leave immediately", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Some doors are better left unopened. The sea respects those who know their limits." },
    ],
  },
  {
    id: "underwater_pearl_bed", scene: "underwater", phase: "early", family: "ambient", title: "Pearl Beds",
    text: "Shallows with crystal-clear water. Thousands of pearl oysters on the bottom. Easy pickings.",
    choices: [
      { text: "🤿 Gather pearls", eff: { gold: [15, 35], crew: 0, karma: 0, curse: 0 }, msg: "A few hours of work. The pearls are gorgeous. Some are unusually large." },
      { text: "🤿 Gather everything (deeper)", eff: { gold: [30, 60], crew: [-1, 0], karma: 0, curse: 1, item: "black_pearl" }, msg: "The deeper oysters hold black pearls. Beautiful, but cold to the touch." },
      { text: "🐚 Examine the giant shell", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "A giant shell opens. Inside, not a pearl. An eye. It blinks.", flag: "pearl_eye" },
      { text: "💨 Don't stop", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Shallows in open ocean are rarely there without reason. Caution keeps you alive." },
    ],
  },
  {
    id: "underwater_sea_cave", scene: "underwater", family: "quest", title: "Underwater Cave",
    text: "An opening in the rock beneath the water. The current pulls inward. Inside, something glows green.",
    choices: [
      { text: "🤿 Swim in", eff: { gold: [20, 50], crew: [-1, 0], karma: 0, curse: 3 }, msg: "The cave opens into an underground lake. On the bottom lies an anchor of unknown metal. It is warm and hums.", flag: "found_deep_anchor" },
      { text: "🔍 Send a sailor", eff: { gold: 0, crew: 0, karma: -1, curse: 1 }, msg: "He returns after an hour. White as a sheet. 'Something lives in there, Captain. Something big.' Says nothing more.", flag: "knows_deep_thing" },
      { text: "🎣 Lower a rope", eff: { gold: [5, 15], crew: 0, karma: 0, curse: 0 }, msg: "You pull up an old musket and a pouch of coins. Someone was here before you." },
    ],
  },
  {
    id: "underwater_giant_squid", scene: "underwater", phase: "mid", family: "ambient", title: "Shadow in the Deep",
    text: "The ship passes over a trench. A shadow on the bottom moves. Enormous. Slow. Intelligent.",
    choices: [
      { text: "👀 Stare into it", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: s => s.flags?.has("kraken_pact") ? "The kraken recognizes you. A tentacle slowly rises and gently touches the hull. A greeting?" : "Eyes the size of barrels. It studies you. You are uninteresting. For now." },
      { text: "💰 Throw gold", eff: { gold: -10, crew: 0, karma: 0, curse: -1 }, msg: "Coins sink slowly. A tentacle carefully gathers them. The shadow drifts away. Tribute accepted." },
      { text: "💨 Full sail!", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Wisdom begins with a healthy fear." },
      { text: "🔔 Ring the bell", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("bell_rang") ? "The bell resonates with the deep. The shadow freezes. Then answers: a vibration passes through the entire ship." : "The shadow flinches and vanishes quickly. You got lucky.", flag: "bell_rang" },
    ],
  },

  // ── ETHEREAL / SUPERNATURAL ──
  {
    id: "ethereal_time_loop", scene: "ethereal", phase: "mid", family: "setpiece", weight: 0.6, exclusivityGroup: "supernatural_time", title: "Deja Vu",
    text: "Everything repeats. This wind, these clouds, those exact words from the bosun. You have lived this day before.",
    choices: [
      { text: "🔄 Change something", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "You turn the helm left instead of right. Reality cracks. For an instant you see ALL variants simultaneously.", flag: "broke_loop" },
      { text: "📝 Write it all down", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "The diary fills itself. Your handwriting, but from the future. 'Don't trust the island with two palms.'", flag: "future_warning" },
      { text: "😴 Go to sleep", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "You wake, and the day is different. Maybe it always was. Maybe not." },
    ],
  },
  {
    id: "ethereal_dead_sea", scene: "ethereal", phase: "late", family: "setpiece", weight: 0.5, title: "Dead Sea",
    text: "No wind, no current, no sound. The water is thick as oil. The reflection of the clouds has frozen.",
    requires: s => s.curse >= 6,
    choices: [
      { text: "🚣 Row", eff: { gold: 0, crew: -1, karma: 0, curse: 1 }, msg: "Oars break against the water. One sailor falls overboard and sinks like a stone. The water doesn't hold him." },
      { text: "🎵 Sing", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: s => s.flags?.has("siren_bond") ? "The siren answers from beneath the thick water. The current comes alive. She pulls you toward the exit." : "Your voice breaks the silence. The water starts to move. Slowly, but you sail." },
      { text: "⏳ Wait", eff: { gold: 0, crew: 0, karma: 0, curse: 3 }, msg: "An hour? A day? A week? Time has no meaning here. When the wind returns, your shadows have grown longer.", flag: "touched_stillness" },
    ],
  },
  {
    id: "ethereal_compass_speaks", scene: "ethereal", family: "quest", title: "The Compass Speaks",
    text: "In the dead of night, the compass begins to spin and stops, pointing at you.",
    requires: s => s.inventory.includes("cursed_compass"),
    choices: [
      { text: "🧭 Follow it", eff: { gold: 0, crew: 0, karma: 0, curse: 2, chain: "ethereal_compass_destination" }, msg: "The needle pulls south. Further, further, where the maps are blank." },
      { text: "🔥 Destroy the compass", eff: { gold: 0, crew: 0, karma: 0, curse: -2, loseItem: "cursed_compass" }, msg: "You throw it into the fire. The metal screams. A sound metal should not make." },
      { text: "❓ Ask 'Where?'", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "The needle traces a word on the glass: 'HOME'. Whose home?" },
    ],
  },
  {
    id: "ethereal_compass_destination", scene: "ethereal", family: "quest", title: "The Needle's End",
    text: "The compass stops. Before you, nothing. Empty sea. But the needle trembles with excitement.",
    choices: [
      { text: "🤿 Dive", eff: { gold: [40, 80], crew: 0, karma: 0, curse: 4 }, msg: "Beneath the water, a gate. Golden, magnificent. Locked. The compass becomes the key. Beyond the gate you see a city that breathes.", flag: "found_golden_gate" },
      { text: "⚓ Drop anchor and wait", eff: { gold: 0, crew: 0, karma: 0, curse: 2 }, msg: "At dawn, a column rises from the water. On it sits a bird that should not exist. It looks at you and says your name." },
      { text: "💨 Turn back", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "The compass goes dark. Now it's just a piece of metal. You feel relief. And emptiness." },
    ],
  },
  {
    id: "ethereal_northern_lights", scene: "ethereal", family: "ambient", title: "Aurora in the Tropics",
    text: "In the tropics. Impossible. Green and violet light dances across the sky. The crew stands frozen.",
    choices: [
      { text: "✨ Watch in wonder", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "Beautiful. Simply beautiful. Not everything at sea has to be terrifying." },
      { text: "🔭 Study it", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "The light forms symbols. You don't know the language, but you feel it: a warning. Or an invitation.", flag: "aurora_symbols" },
      { text: "🎶 Sing a sea shanty", eff: { gold: 0, crew: 1, karma: 0, curse: 1 }, msg: s => s.flags?.has("siren_contact") ? "The siren appears in the glow. 'They say: something wakes on the bottom. Something old.' She is worried." : "The crew joins in. The most beautiful night of the voyage." },
    ],
  },

  // ── CREW RELATIONSHIP ──
  {
    id: "crew_cook_secret", scene: "open_sea", family: "relationship", title: "The Cook's Secret",
    text: "Cook Jean-Pierre makes the best soup in the Caribbean. But at night you see him talking to the fire.",
    choices: [
      { text: "👀 Keep watching", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "The fire answers. Tiny flame figures dance on his palm. He feeds them oil.", flag: "cook_fire_magic" },
      { text: "❓ Ask directly", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "'My grandmother was a mambo from Haiti. I'm no sorcerer, Captain. I just talk to those who listen.' Honesty.", flag: "cook_trust" },
      { text: "🚫 Forbid it", eff: { gold: 0, crew: -1, karma: -1, curse: 0 }, msg: "Jean-Pierre goes quiet. The soup becomes ordinary. The crew notices the difference." },
    ],
  },
  {
    id: "crew_old_bones", scene: "open_sea", family: "relationship", phase: "mid", title: "Old Bones",
    text: "The oldest sailor, whom everyone calls Bones, coughs blood. 'Last voyage, Captain. I promise.'",
    requires: s => s.day >= 5,
    choices: [
      { text: "🏥 Treat him (−10)", eff: { gold: -10, crew: 0, karma: 1, curse: 0 }, msg: "'You're a good one, Captain.' Bones knows every port, every reef. While he lives, you're safe.", flag: "bones_alive" },
      { text: "🗣️ Listen to his story", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "Sailed with Henry Morgan. The Panama raid. 'I've seen gold destroy men. Three hundred times.' The crew listens with reverence.", flag: "bones_story" },
      { text: "😔 Put him ashore", eff: { gold: 0, crew: -1, karma: 0, curse: 0, delay: { daysLater: 5, encounterId: "bones_ghost", hint: "Old Bones' spirit seeks the ship" } }, msg: "Bones salutes. 'Fair winds, Captain.' Not offended. Just sad." },
    ],
  },
  {
    id: "bones_ghost", scene: "ethereal", family: "consequence", title: "The Ghost of Bones",
    text: "At dawn, you see the old man on deck. Translucent. 'Told you. Last voyage.'",
    choices: [
      { text: "🙏 Say goodbye", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "'Thank you, Captain. Now I am part of the sea.' He dissolves into the spray." },
      { text: "❓ What do you see?", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: "'Everything. The living and the dead. Your ship glows, Captain. Like a beacon for those on the bottom.'" },
    ],
  },
  {
    id: "crew_twins_argument", scene: "open_sea", family: "relationship", title: "The Twins Quarrel",
    text: "Brothers Ricardo and Alvaro haven't spoken in three days. The reason: who spotted the dolphin first.",
    choices: [
      { text: "😄 Laugh it off", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "The crew roars. The twins turn red, then laugh too. Peace." },
      { text: "⚖️ Hold a formal trial", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "Full pirate tribunal. Witness testimony. Oath on the Code. Verdict: the dolphin saw them first. Both satisfied.", flag: "twins_tribunal" },
      { text: "⚔️ Let them fight it out", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "They fight for an hour. A draw. They embrace, bloody. Now they have a new rivalry: who heals first." },
    ],
  },
  {
    id: "crew_navigator_doubt", scene: "open_sea", family: "relationship", phase: "mid", title: "The Navigator's Doubt",
    text: "Your helmsman stands over the chart. 'Captain, we're sailing the wrong way. I know it, but I can't explain it.'",
    requires: s => s.day >= 7,
    choices: [
      { text: "🧭 Trust his instinct", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: s => s.flags?.has("saved_martin") ? "Martin lays his hand on the chart. 'He's right. The stars say: turn.' You change course." : "You change course. An hour later you see reefs where you would have sailed. The helmsman saved the ship.", flag: "navigator_trusted" },
      { text: "🚫 I am the captain", eff: { gold: 0, crew: -1, karma: -1, curse: 0 }, msg: "The helmsman silently returns to work. He won't speak up next time." },
      { text: "🗣️ Discuss with the crew", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "Democracy on deck. They vote to change course. The helmsman is glad to be heard.", flag: "navigator_trusted" },
    ],
  },
  {
    id: "crew_song_contest", scene: "open_sea", family: "relationship", title: "Who Sings Best",
    text: "Evening. Rum. Someone starts 'Fifteen men on a dead man's chest'. Others join in.",
    requires: s => s.crew >= 5,
    choices: [
      { text: "🎵 Join in", eff: { gold: 0, crew: 1, karma: 1, curse: 0 }, msg: "Your voice is terrible. Nobody cares. Best evening in weeks." },
      { text: "🎶 Sing a folk song", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: s => s.flags?.has("cook_trust") ? "Jean-Pierre picks up the melody on a Haitian fife. Two worlds, one music. The crew applauds." : "Nobody understands the words. But the melody is sad and beautiful. The silence after the last note says more than applause." },
      { text: "🍺 Just listen", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "A captain who listens to his crew. A rarity on these seas." },
    ],
  },

  // ── EXPLORATION ──
  {
    id: "explore_olonne_island", scene: "island", family: "quest", title: "Isle of Tears",
    text: "The island from the old man's map. Overgrown, quiet. Stones on the beach spell out: 'BACK.'",
    requires: s => s.flags?.has("knows_olonne_treasure"),
    choices: [
      { text: "🏝️ Venture inland", eff: { gold: [30, 70], crew: [-1, 0], karma: 0, curse: 2 }, msg: s => s.flags?.has("olonne_warning") ? "You take only silver. Leave the pearls. At night you hear weeping from the treasure, but it doesn't touch you." : "L'Olonnais's treasure! Gold, pearls, silver. At night, the pearls begin to weep. A thin, inhuman sound.", flag: "olonne_found" },
      { text: "🔍 Careful scouting", eff: { gold: [10, 25], crew: 0, karma: 0, curse: 0 }, msg: "You find silver tangled in tree roots. You go no further. Wisdom?" },
      { text: "💨 Heed the sign", eff: { gold: 0, crew: 0, karma: 1, curse: -1 }, msg: "Some treasures aren't worth seeking. L'Olonnais knew. Now so do you." },
    ],
  },
  {
    id: "explore_hidden_lagoon", scene: "island", family: "ambient", title: "Hidden Lagoon",
    text: "Beyond the rocks, a cove that appears on no chart. Turquoise water. Ruins of a fort on the shore.",
    choices: [
      { text: "🏰 Explore the fort", eff: { gold: [15, 35], crew: 0, karma: 0, curse: 0 }, msg: "An abandoned Spanish fort. Cannons rusted, but the powder is dry. You find provisions and a chart of local reefs.", flag: "found_hidden_fort" },
      { text: "🏊 Swim", eff: { gold: 0, crew: 2, karma: 0, curse: 0 }, msg: "A day of rest. Fresh water from a waterfall. The crew comes alive." },
      { text: "🗺️ Chart it", eff: { gold: 0, crew: 0, karma: 0, curse: 0, reveal: [15, 9] }, msg: "Now it's your secret harbor. A place to repair, rest, hide.", flag: "secret_lagoon" },
    ],
  },
  {
    id: "explore_mangrove_maze", scene: "island", family: "ambient", title: "Mangrove Maze",
    text: "Channels between mangrove trees. Roots like walls. Something glints deeper in.",
    choices: [
      { text: "🚣 Row deeper", eff: { gold: [10, 30], crew: 0, karma: 0, curse: 1 }, msg: "Deeper, the maze tightens. A locket hangs from a tree branch with a lock of hair inside. Carved beside it: 'For the one who forgot.'", flag: "found_memory_locket" },
      { text: "🎣 Fish", eff: { gold: 0, crew: 1, karma: 0, curse: 0 }, msg: "The mangroves teem with fish. A fresh meal lifts spirits." },
      { text: "🔍 Search the shores", eff: { gold: 0, crew: 0, karma: 0, curse: 0, delay: { daysLater: 3, encounterId: "mangrove_stowaway", hint: "Someone was hiding in the mangroves" } }, msg: "You find tracks. Someone lives here. Bare feet, small. A child?" },
    ],
  },
  {
    id: "mangrove_stowaway", scene: "open_sea", family: "consequence", title: "Stowaway",
    text: "In the hold, the crew finds a teenager. Ragged, starving. Says pirates left him on the island a year ago.",
    choices: [
      { text: "🤝 Take him aboard", eff: { gold: 0, crew: 1, karma: 2, curse: 0 }, msg: "'I know these waters better than anyone. A year among the reefs.' A cabin boy with golden hands.", flag: "has_cabin_boy" },
      { text: "❓ Interrogate", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "'My captain buried something on that island. Something that screams at night.' Eyes too old for his age.", flag: "knows_screaming_treasure" },
      { text: "🏝️ Put him ashore at the next island", eff: { gold: 0, crew: 0, karma: -1, curse: 0 }, msg: "He watches you leave. Doesn't cry. He's used to it." },
    ],
  },
  {
    id: "explore_volcanic_vent", scene: "island", phase: "mid", family: "ambient", title: "Hot Springs",
    text: "On a deserted island, boiling water erupts from the ground. Sulfur stench. But around the springs, strange flowers bloom.",
    choices: [
      { text: "🌺 Gather the flowers", eff: { gold: [5, 15], crew: 0, karma: 0, curse: 0, item: "medicine_chest" }, msg: "Jean-Pierre (or anyone with experience) recognizes them: rare medicinal plants. You'll make a fine medicine chest." },
      { text: "💧 Bathe in the springs", eff: { gold: 0, crew: 1, karma: 0, curse: -1 }, msg: "The hot water eases pain and fatigue. Wounds heal faster. Even the curse weakens." },
      { text: "🔍 Dig", eff: { gold: [15, 40], crew: 0, karma: 0, curse: 1 }, msg: "Beneath the sulfur you find obsidian figurines. Ancient, detailed. The faces on them resemble your crew." },
    ],
  },
  {
    id: "explore_lighthouse", scene: "island", phase: "late", family: "quest", title: "Lighthouse at the Edge of the World",
    text: "A lighthouse on a lonely reef. The fire burns, but there are no signs of life around it.",
    requires: s => s.day >= 12,
    choices: [
      { text: "🔍 Enter", eff: { gold: [10, 20], crew: 0, karma: 0, curse: 3 }, msg: "Inside, time has stopped. Food on the table is fresh but covered in dust. On the wall, a map with a single point marked: 'Entrance'. Below it, a date: yesterday.", flag: "lighthouse_map" },
      { text: "🔥 Extinguish the fire", eff: { gold: 0, crew: 0, karma: 0, curse: -2 }, msg: "The flame resists. Then dies. In the darkness you hear a distant: 'Thank you. We can finally sleep.'" },
      { text: "⚓ Stay away", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: "The fire blinks. Morse? S.O.S.? Or something else. You'll never know." },
    ],
  },

  // ── COMBAT ──
  {
    id: "combat_spanish_fleet", scene: "combat", phase: "mid", family: "setpiece", weight: 0.9, enemyType: "enemy", title: "Spanish Squadron",
    text: "Three ships flying the flag of Castile. The lead frigate turns toward you. Gun ports open.",
    choices: [
      { text: "⚔️ Attack!", eff: { gold: [40, 90], crew: [-4, -2], karma: -1, curse: 0, rep: { crown: -2, brethren: 3 } }, msg: s => s.flags?.has("trained_crew") ? "Your drilled crew moves like clockwork. The frigate surrenders after the first broadside." : "A brutal fight. But you break through the line." },
      { text: "💨 Run with the wind", eff: { gold: 0, crew: 0, karma: 0, curse: 0 }, msg: s => s.flags?.has("hull_reinforced") ? "The reinforced hull absorbs several hits. You pull away." : "The Spanish are slow but persistent. You break free after an hour." },
      { text: "🏳️ Fly a false flag", eff: { gold: 0, crew: 0, karma: -1, curse: 0, rep: { crown: -1 } }, msg: s => s.flags?.has("spanish_disguise") ? "It works! You pass as one of their own. Your heart pounds loud enough to hear on deck." : "Wrong flag. They fire! You flee under fire, but without losses.", flag: "spanish_disguise" },
      { text: "🗺️ Lure them onto reefs", eff: { gold: [20, 40], crew: 0, karma: 0, curse: 0 }, msg: "You lead them through the shallows. One frigate runs aground. You collect what floats.", requires_flag: "has_guide" },
    ],
  },
  {
    id: "combat_french_privateer", scene: "combat", phase: "early", family: "ambient", enemyType: "enemy", title: "French Privateer",
    text: "An elegant corvette under the tricolor. The captain in a white wig bows from the deck. 'Surrender, mes amis!'",
    choices: [
      { text: "⚔️ Board them!", eff: { gold: [20, 50], crew: [-2, -1], karma: -1, curse: 0, rep: { brethren: 1 } }, msg: "The French fight with style, but you fight with efficiency. The captain's wig falls into the sea." },
      { text: "🤝 Parley", eff: { gold: [-10, 0], crew: 0, karma: 1, curse: 0, rep: { crown: 1 } }, msg: "'Wine for passage?' An exchange. The captain winks. 'If you see Duvall, tell him I remember the card debts.'", flag: "french_contact" },
      { text: "🏴 Pirate salute", eff: { gold: 0, crew: 0, karma: 0, curse: 0, rep: { brethren: 1 } }, msg: s => s.flags?.has("duvall_alliance") ? "'Duvall? He's my cousin! Why didn't you say so?' They embrace. You get free passage through French waters." : "A shot in the air. The privateer hesitates. Then returns the salute and sails away. Respect.", flag: "french_salute" },
    ],
  },
  {
    id: "combat_barbary_corsairs", scene: "combat", phase: "mid", family: "ambient", enemyType: "enemy", title: "Barbary Corsairs",
    text: "Fast galleys with lateen sails. Barbary corsairs, far from home but no less dangerous.",
    choices: [
      { text: "⚔️ Fight!", eff: { gold: [15, 40], crew: [-3, -1], karma: 0, curse: 0 }, msg: s => s.flags?.has("armed") ? "Muskets stop the first boarding wave. The corsairs retreat." : "They are fast and fierce. You barely win." },
      { text: "🤝 Offer trade", eff: { gold: -10, crew: 0, karma: 0, curse: 0, rep: { guild: 1 } }, msg: "They want powder and rum. A trade. The captain gifts a curved dagger. 'For luck.'", flag: "barbary_trade" },
      { text: "🗣️ [Scholar] Speak Arabic", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "The corsair captain is surprised. 'Rare to meet an educated pirate.' He lets you pass without a fight. Even shares a chart of the currents.", flag: "barbary_respect", requires_flag: "origin_scholar" },
      { text: "💨 Flee through the reefs", eff: { gold: 0, crew: [-1, 0], karma: 0, curse: 0 }, msg: "The galleys dare not enter the narrow strait. You squeeze between the rocks. One oar broken, one man overboard." },
    ],
  },
  {
    id: "combat_sea_serpent", scene: "kraken", phase: "late", family: "setpiece", weight: 0.6, enemyType: "ghost", title: "Sea Serpent",
    text: "The water rises in a wall. A head breaks the surface, covered in seaweed and barnacles. Ancient eyes study you with curiosity.",
    requires: s => s.day >= 10,
    choices: [
      { text: "⚔️ Open fire!", eff: { gold: 0, crew: [-3, -1], karma: 0, curse: 2 }, msg: s => s.flags?.has("found_deep_anchor") ? "The anchor hums in response to the serpent's presence. The creature shudders and dives." : "Cannonballs bounce off its scales. Its tail snaps the mast. But you survive." },
      { text: "🎵 Sing", eff: { gold: 0, crew: 0, karma: 0, curse: 1 }, msg: s => s.flags?.has("siren_bond") ? "The siren appears. She speaks to the serpent in a language older than humanity. The serpent bows its head. Respect." : "The serpent listens. Tilts its head. Then slowly submerges. Not hostile. Just uninterested.", flag: "serpent_met" },
      { text: "💰 Throw a chest of gold", eff: { gold: -30, crew: 0, karma: 0, curse: -2, item: "black_pearl" }, msg: "The gold sinks. The serpent watches you for a long time. Then spits out a pearl the size of a fist." },
      { text: "🙏 Bow", eff: { gold: 0, crew: 0, karma: 2, curse: 0 }, msg: "The serpent freezes. Then slowly inclines its head in return. Respect between predators. It swims away.", flag: "serpent_respect" },
    ],
  },
  {
    id: "combat_ghost_fleet", scene: "combat", phase: "late", family: "setpiece", weight: 0.5, enemyType: "ghost", exclusivityGroup: "supernatural_fleet", title: "Ghost Fleet",
    text: "They emerge from the fog, one after another. Five. Ten. Twenty ships. All dead. All sailing toward you.",
    requires: s => s.curse >= 8 && s.day >= 12,
    choices: [
      { text: "⚔️ Break through!", eff: { gold: 0, crew: [-4, -2], karma: 0, curse: 3 }, msg: s => s.flags?.has("ghost_crew") ? "Your dead sailors nod to the dead fleet. 'He's one of ours.' The fleet parts." : "You hack through shadows. Bullets pass right through. Only fire works." },
      { text: "🔥 Burn it all", eff: { gold: 0, crew: -1, karma: 0, curse: -3 }, msg: "You light a barrel of rum and throw it. Fire engulfs the dead fleet. Screams? Or gratitude?" },
      { text: "💀 Become one of them", eff: { gold: [50, 100], crew: [2, 4], karma: -3, curse: 5 }, msg: "You raise the black flag. 'I am your admiral.' The dead salute. The living on deck go pale.", flag: "ghost_admiral" },
      { text: "🔔 Ring the bell", eff: { gold: 0, crew: 0, karma: 0, curse: -1 }, msg: s => s.flags?.has("bell_rang") ? "The bell tears the fabric between worlds. The fleet scatters like smoke. You have learned to speak to the other side." : "The sound freezes the fleet for a moment. Enough to turn and run.", requires_flag: "bell_rang" },
    ],
  },
];
