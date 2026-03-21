import type { Encounter } from "../../engine/types";

/**
 * QUESTLINE 1: "The Surgeon's Debt"
 * Triggers at any port. A dying girl, a desperate surgeon, and a cure
 * that costs more than gold.
 *
 * Themes: sacrifice vs pragmatism, the price of saving one life,
 * what you become when you try to play god.
 */
const surgeonDebt: Encounter[] = [
  {
    id: "ql_surgeon_start", scene: "port", title: "A Doctor's Plea",
    text: "A man in a blood-stained coat grabs your arm at the docks. 'Captain, please. My daughter has the Black Fever. There's a cure, but it grows only on the Phantom Reef. No ship will take me. They say the reef is cursed.' His hands are shaking. The girl in his arms can't be older than seven.",
    family: "quest", tags: ["surgeon", "moral"], phase: "early",
    weight: 1.8, exclusivityGroup: "ql_surgeon",
    choices: [
      { text: "🩺 'Get aboard. We sail now.'", eff: { crew: 0, chain: "ql_surgeon_aboard" }, msg: "The doctor clutches his daughter and climbs the gangplank. Your crew exchanges looks.", flag: "surgeon_quest" },
      { text: "💰 'I'll need compensation.' (30 gold)", eff: { gold: 30, chain: "ql_surgeon_aboard" }, msg: "He counts coins with trembling fingers. Thirty gold. Everything he has.", flag: "surgeon_quest_paid" },
      { text: "❌ 'I'm sorry. I can't.'", eff: { karma: -1, curse: 0 }, msg: "He doesn't beg. Just nods. You see him an hour later, rowing a dinghy toward open sea. Alone." },
    ],
  },
  {
    id: "ql_surgeon_aboard", scene: "open_sea", title: "The Doctor's Confession",
    text: "Night watch. The surgeon sits by his daughter, who shivers despite the heat. He speaks quietly: 'The Black Fever... I created it. I was trying to make a cure for plague. The experiment got out. Three villages are dead because of me. Elena caught it from my own instruments.' He looks at you. 'If you want to throw me overboard, I understand.'",
    requires: () => false, // chain only
    choices: [
      { text: "😶 'Keep talking.'", eff: { chain: "ql_surgeon_reef" }, msg: "He tells you the cure is a coral that only grows where cursed ships have sunk. The reef is no legend." },
      { text: "🤬 'You killed villages and you want MY help?'", eff: { karma: 1, chain: "ql_surgeon_reef" }, msg: "'Yes,' he says simply. 'I am a monster asking another monster for help. We pirates understand each other.' The crew heard everything.", flag: "surgeon_truth_known" },
      { text: "🌊 Throw him overboard", eff: { crew: -1, karma: -2, curse: 1 }, msg: "He doesn't resist. But his daughter screams. Your first mate pulls her from the railing. 'Captain... she stays. I won't drown a child.' You now have a dying girl and no doctor.", flag: "surgeon_drowned" },
    ],
  },
  {
    id: "ql_surgeon_reef", scene: "underwater", title: "The Phantom Reef",
    text: "The reef glows green beneath the hull. Shapes of sunken ships shimmer below. The surgeon points: 'The coral grows on the bones of the cursed. I need someone to dive. But... anyone who touches it will carry a piece of the curse.' He looks at his own hands. 'I would go myself, but if I die, no one can prepare the cure.'",
    requires: () => false,
    choices: [
      { text: "🏊 Dive yourself", eff: { curse: 2, chain: "ql_surgeon_cure" }, msg: "The water is warm and wrong. You feel the dead watching. The coral comes off in your hands, pulsing like a heartbeat. Something down there whispered your name.", flag: "captain_dived" },
      { text: "👥 Send a crewman", eff: { crew: -1, curse: 0, chain: "ql_surgeon_cure" }, msg: "Tomás volunteers. He surfaces with the coral and a blank stare. By morning, his hair is white. He doesn't speak anymore. But the coral is here.", flag: "crew_dived" },
      { text: "🩺 'You created this. You dive.'", eff: { chain: "ql_surgeon_doctor_dives" }, msg: "He nods slowly. 'Fair.' He strips off his coat and jumps." },
    ],
  },
  {
    id: "ql_surgeon_doctor_dives", scene: "underwater", title: "The Doctor Dives",
    text: "He's been under too long. Bubbles stop. Then, a hand breaks the surface, clutching coral. You pull him up. He's breathing, barely. His eyes have changed color, one green, one black. 'I saw them,' he whispers. 'The villagers I killed. They're down there. They let me take it. But they want something in return.'",
    requires: () => false,
    choices: [
      { text: "❓ 'What do they want?'", eff: { chain: "ql_surgeon_cure" }, msg: "'A life for a life. Someone must stay at the reef when we leave. Not die. Stay. Forever.' He closes his eyes. 'I'll do it. After I save Elena.'", flag: "surgeon_bargain" },
      { text: "🚫 'We leave. Now. No bargains with ghosts.'", eff: { curse: 1, chain: "ql_surgeon_cure" }, msg: "As you sail away, the water behind you churns. Something is following the ship. The surgeon says nothing, but holds Elena tighter." },
    ],
  },
  {
    id: "ql_surgeon_cure", scene: "port", title: "The Cure",
    text: (state) => {
      if (state.flags.has("surgeon_bargain")) {
        return "The surgeon works through the night. By dawn, Elena's fever breaks. She opens her eyes and smiles. The surgeon holds her, crying. Then he looks at you. 'Captain. I need you to take her to Port Royal. My sister lives there. I... I have to go back to the reef now. A promise is a promise.' Elena doesn't understand yet.";
      }
      return "The surgeon works through the night. By dawn, Elena's fever breaks. Color returns to her cheeks. She opens her eyes and asks for water. The surgeon collapses, laughing and weeping. But the coral still glows in the corner of the cabin. And outside, the sea feels different. Watching.";
    },
    requires: () => false,
    choices: [
      {
        text: "👨‍👧 Take Elena to safety",
        eff: { gold: 0, crew: 0, karma: 3, curse: 0 },
        msg: (state) => state.flags.has("surgeon_bargain")
          ? "You watch the surgeon row back to the reef in a dinghy. Elena waves from the deck, not understanding why papa is leaving. He doesn't look back. The green glow swallows the boat. Your crew is silent for three days."
          : "You drop Elena at the next port. She hugs the surgeon. He whispers: 'Thank you, Captain. For everything.' They disappear into the crowd. Something feels lighter.",
        flag: "surgeon_quest_good",
      },
      {
        text: "💰 'The cure formula. That's worth a fortune.'",
        eff: { gold: [60, 100], crew: 0, karma: -3, curse: 2 },
        msg: "The surgeon stares at you. 'You'd sell a plague cure?' He writes the formula. His hand is steady now. 'Take it. Sell it. Make your fortune from suffering. You and I are the same after all.' Elena watches you with her father's eyes.",
        flag: "surgeon_quest_greedy",
      },
      {
        text: "🔥 Destroy the coral",
        eff: { gold: 0, crew: 0, karma: 2, curse: -1 },
        msg: "You burn the remaining coral on deck. Green smoke rises. The surgeon nods. 'Good. No one else should be tempted.' Elena is safe. The formula dies with you. Somewhere, the reef stops glowing.",
        flag: "surgeon_quest_destroy",
      },
    ],
  },
];

/**
 * QUESTLINE 2: "The Governor's Masquerade"
 * Infiltration, betrayal, and a choice between justice and survival.
 * A rebellion, a tyrant, and a spy who might be playing everyone.
 *
 * Themes: freedom vs order, trust, when every side is wrong.
 */
const governorMasquerade: Encounter[] = [
  {
    id: "ql_governor_start", scene: "port", title: "The Woman in Red",
    text: "A woman in a crimson dress blocks your path in the market. 'Captain. I know what you are. And I need exactly that.' She slides a sealed letter across the table. 'Governor Blackwood has invited the colonial elite to a masquerade ball. Three days from now. I need someone inside who isn't afraid to get their hands dirty.' She smiles. 'The pay is 200 gold. The cause is freedom.'",
    family: "quest", tags: ["governor", "infiltration", "politics"], phase: "mid",
    weight: 1.5, exclusivityGroup: "ql_governor",
    choices: [
      { text: "🎭 'Tell me more.'", eff: { chain: "ql_governor_briefing" }, msg: "She glances around, then leads you to a back room. 'My name is Catalina. What I'm about to tell you could get us both hanged.'", flag: "governor_quest" },
      { text: "💰 '200 up front.'", eff: { gold: 100, chain: "ql_governor_briefing" }, msg: "'Half now, half after.' She drops a pouch on the table. Heavy. 'Now listen carefully.'", flag: (s) => s.gold >= 0 ? "governor_quest" : null },
      { text: "🚶 'Politics isn't my business.'", eff: { karma: 0, curse: 0 }, msg: "She watches you leave. 'Everyone says that. Until it is.' You feel her eyes on your back for three blocks." },
    ],
  },
  {
    id: "ql_governor_briefing", scene: "port", title: "The Plan",
    text: "Catalina unfolds a map of the governor's mansion. 'Blackwood isn't just a governor. He's been selling colonists into slavery. Forging debts, seizing homes, shipping families to sugar plantations. I have proof, but it's locked in his study. During the masquerade, you get in, find the ledger, get out. Simple.' She pauses. 'There's one complication. My contact inside is the governor's wife. Lady Blackwood. She hates her husband, but she's also... unpredictable.'",
    requires: () => false,
    choices: [
      { text: "🎩 'I'll need a disguise.'", eff: { gold: -15, chain: "ql_governor_ball" }, msg: "Catalina provides a merchant lord's outfit. Complete with powdered wig. Your first mate laughs for ten minutes straight." },
      { text: "🗡️ 'What about guards?'", eff: { chain: "ql_governor_ball" }, msg: "'Twelve soldiers. Four at doors, the rest patrol. Lady Blackwood will distract the captain of the guard at midnight. That's your window.' She hands you a floor plan.", flag: "governor_knows_guards" },
      { text: "🤔 'Why should I trust you?'", eff: { chain: "ql_governor_ball" }, msg: "She rolls up her sleeve. Plantation brand marks. 'Because I was one of them. Sold at fifteen. Escaped at twenty. I've been planning this for four years.' Her eyes are iron.", flag: "governor_trusts_catalina" },
    ],
  },
  {
    id: "ql_governor_ball", scene: "port", title: "The Masquerade",
    text: "Candles, music, perfume thick enough to taste. Masks everywhere. You spot Lady Blackwood in a silver fox mask, the governor in gold. Then you see something Catalina didn't mention: the governor is talking to a pirate hunter. Captain Navarro. The man who burned Tortuga's docks last spring. He's here as a guest. You're wearing a borrowed suit in a room full of people who hang pirates for sport.",
    requires: () => false,
    choices: [
      { text: "🔍 Sneak to the study", eff: { chain: "ql_governor_study" }, msg: "You slip through a service corridor. A maid sees you, freezes, looks away. The study door is ahead." },
      { text: "🍷 Approach Lady Blackwood", eff: { chain: "ql_governor_lady" }, msg: "She sees you and tilts her head. 'You're not from here.' Her voice is ice and honey. 'Follow me. But not too closely.'" },
      { text: "⚔️ Confront the governor directly", eff: { crew: -1, karma: 1, curse: 0, chain: "ql_governor_confrontation" }, msg: "You tear off your mask. 'Governor Blackwood! The sea knows what you've done!' Chaos erupts. Navarro draws his sword. This was not the plan." },
    ],
  },
  {
    id: "ql_governor_study", scene: "cave", title: "The Study",
    text: "The ledger is there, on his desk. Hundreds of names. Families sold. Debts fabricated. It's worse than Catalina said. But there's something else: letters from Catalina herself. She's been writing to Blackwood for months. Offering information. Names of rebel leaders. In exchange for... a pardon and a plantation of her own. She's playing both sides.",
    requires: () => false,
    choices: [
      { text: "📖 Take the ledger AND Catalina's letters", eff: { chain: "ql_governor_escape" }, msg: "You take everything. Now you have leverage over the governor AND Catalina. Power is a dangerous drug.", flag: "governor_has_all" },
      { text: "📖 Take only the ledger", eff: { chain: "ql_governor_escape" }, msg: "The ledger is what matters. Catalina's betrayal is her own problem. You have what you came for.", flag: "governor_has_ledger" },
      { text: "🔥 Burn the study", eff: { curse: 1, chain: "ql_governor_fire" }, msg: "You knock a candle into the curtains. If no one can have the proof, no one can use it. The mansion starts to burn. Screams from the ballroom." },
    ],
  },
  {
    id: "ql_governor_lady", scene: "port", title: "Lady Blackwood",
    text: "She leads you to a balcony. Removes her mask. She's younger than you expected. 'I know why you're here. Catalina sent you for the ledger. But I have a better offer.' She holds up a key. 'The vault beneath the mansion. Not papers. Gold. Blackwood's personal fortune. Stolen from a hundred families. I say we take it all and let this place burn. I'm done being a governor's wife.' Her eyes are wild. 'What do you say, Captain?'",
    requires: () => false,
    choices: [
      { text: "🔑 'The vault. Let's go.'", eff: { chain: "ql_governor_vault" }, msg: "She smiles like someone who's been waiting years for this moment. 'This way. And Captain? If Catalina asks, I was never here.'", flag: "governor_vault_route" },
      { text: "📖 'I came for the ledger. Justice, not gold.'", eff: { chain: "ql_governor_study" }, msg: "Her smile fades. 'Justice. In the Caribbean. You're either naive or suicidal.' She hands you the study key anyway. 'Good luck with that.'" },
      { text: "🤝 'Both. We take the proof AND the gold.'", eff: { chain: "ql_governor_vault" }, msg: "'Greedy. I like it.' She takes your arm like you're a dance partner. 'The vault first. It's closer.'", flag: "governor_both" },
    ],
  },
  {
    id: "ql_governor_vault", scene: "cave", title: "The Governor's Vault",
    text: "Gold bars. Chests of coins. Jewelry. More wealth than your ship could carry in ten trips. Lady Blackwood is already filling a sack. Then you hear boots on the stairs. Guards. And a voice: Catalina's. 'Check the vault! The pirate went below!' She sold you out. Lady Blackwood goes pale. 'That witch. She was working with my husband all along.'",
    requires: () => false,
    choices: [
      { text: "⚔️ Fight through", eff: { gold: [80, 150], crew: [-2, -1], karma: 0, curse: 0, chain: "ql_governor_end" }, msg: "Steel on steel in torchlight. You grab what you can and cut a path out. Lady Blackwood takes a pistol from a dead guard and follows. She doesn't flinch.", flag: "governor_fought" },
      { text: "🕳️ Secret passage? (Cunning)", eff: { gold: [60, 100], crew: 0, karma: 0, curse: 0, chain: "ql_governor_end" }, msg: "You find a drainage grate. Sewage tunnel to the harbor. Undignified, but alive. Lady Blackwood wrinkles her nose. 'If you tell anyone about this, I'll kill you myself.'", flag: "governor_escaped" },
      { text: "🏳️ Surrender and negotiate", eff: { gold: 0, crew: 0, karma: 0, curse: 0, chain: "ql_governor_end" }, msg: "The governor appears at the top of the stairs. 'A pirate in my vault. How predictable.' But you still have the ledger knowledge. He can't afford to kill you publicly.", flag: "governor_captured" },
    ],
  },
  {
    id: "ql_governor_confrontation", scene: "combat", title: "Chaos at the Ball",
    text: "Tables overturn. Guests scream. Navarro advances with sword drawn. The governor retreats behind his guards. Catalina appears at a window, watching. She could help. She doesn't move. This was never about justice. You were the distraction.",
    requires: () => false,
    choices: [
      { text: "⚔️ Duel Navarro", eff: { gold: 0, crew: -1, karma: 1, curse: 0, chain: "ql_governor_end" }, msg: "He's good. But you're desperate. You disarm him and press a blade to his throat. 'Tell everyone what Blackwood does.' Navarro stares. 'I already knew.' The room goes silent.", flag: "governor_duel_won" },
      { text: "💣 Grab a chandelier rope (chaos)", eff: { gold: [20, 40], crew: 0, karma: -1, curse: 0, chain: "ql_governor_end" }, msg: "You cut the rope. The chandelier crashes. In the chaos, you grab the governor's signet ring and run. Proof of nothing, but worth a fortune." },
      { text: "🏃 Run for the docks", eff: { gold: 0, crew: 0, karma: -1, curse: 0, chain: "ql_governor_end" }, msg: "You flee. Behind you, you hear Catalina's voice: 'He was acting alone! Arrest him!' Everyone believes her." },
    ],
  },
  {
    id: "ql_governor_fire", scene: "combat", title: "The Mansion Burns",
    text: "Fire crawls up the walls. The ballroom is chaos. You hear screams, not all of them adult. There are children at this party. Servants trapped upstairs. The governor screams orders. Catalina has vanished. Through the smoke, you see a staircase leading up, and the front door leading out.",
    requires: () => false,
    choices: [
      { text: "🏃 Run for the harbor", eff: { gold: 0, crew: 0, karma: -3, curse: 2 }, msg: "You run. Behind you, the screams fade. By morning, you learn fourteen people died. Three were children. The governor survived. The ledger is ash. Nothing was accomplished.", flag: "governor_coward" },
      { text: "⬆️ Save who you can", eff: { crew: [1, 2], karma: 3, curse: 0, chain: "ql_governor_end" }, msg: "You run upstairs. Smoke burns your lungs. You carry two children and a maid down through a window. The maid turns out to be Blackwood's bookkeeper. She remembers every number in the ledger. Everything.", flag: "governor_hero" },
      { text: "🔥 Find Blackwood in the chaos", eff: { karma: -1, curse: 1, chain: "ql_governor_end" }, msg: "You find him trying to save his paintings. Not people. Paintings. 'You deserve this,' you say. He turns, terrified. For once, the tyrant sees what his victims saw.", flag: "governor_judged" },
    ],
  },
  {
    id: "ql_governor_escape", scene: "combat", title: "The Escape",
    text: "Alarm bells. Soldiers pour into the corridors. You clutch the ledger under your coat. The front gate is blocked. The garden wall is climbable. But you spot Catalina at the gate, arguing with guards, pointing inside. She's directing them to you.",
    requires: () => false,
    choices: [
      { text: "🧱 Over the wall", eff: { gold: 0, crew: 0, karma: 0, curse: 0, chain: "ql_governor_end" }, msg: "You scale the wall, tearing your borrowed suit. In the alley below, a boy watches. 'Captain?' It's the surgeon's daughter. Elena. She's holding a lantern. 'Catalina told me to wait here. She said you'd come this way.' Nothing makes sense anymore.", flag: "governor_escaped" },
      { text: "⚔️ Confront Catalina", eff: { crew: -1, karma: 0, curse: 0, chain: "ql_governor_end" }, msg: "You grab her arm. 'You played me.' She doesn't deny it. 'I play everyone. But the ledger is real. Use it or don't. I got what I needed.' She vanishes into the crowd. What did she get?", flag: "governor_catalina_confronted" },
      { text: "📄 Drop the ledger where guards will find it", eff: { gold: 0, crew: 0, karma: 2, curse: 0, chain: "ql_governor_end" }, msg: "You leave the ledger on a guard's desk, open to the worst page. You gain nothing. But by morning, the garrison is in revolt. Some truths are their own weapons.", flag: "governor_leaked" },
    ],
  },
  {
    id: "ql_governor_end", scene: "port", title: "Aftermath",
    text: (state) => {
      if (state.flags.has("governor_hero")) return "The port is in chaos. The mansion is a skeleton of black timbers. But you're alive, and the bookkeeper is singing numbers to the harbor master, who is writing furiously. By nightfall, Governor Blackwood is in chains. Not because of your heroics. Because of a maid who remembered everything. Sometimes the small people bring down the powerful.";
      if (state.flags.has("governor_leaked")) return "Three days later, a merchant ship brings news: Governor Blackwood arrested by his own garrison. The ledger was damning. Catalina has vanished. Lady Blackwood left on a ship to Spain. Nobody mentions the pirate who was at the ball. You're a ghost in this story. Perhaps that's best.";
      if (state.flags.has("governor_fought")) return "You and Lady Blackwood stand on the dock, covered in blood and sewer water. She laughs, then can't stop laughing. 'I've never felt this alive.' She offers to join your crew. A governor's wife who can shoot, knows every port official, and has nothing left to lose.";
      if (state.flags.has("governor_duel_won")) return "Navarro lets you go. 'Professional courtesy,' he says. 'But next time, I won't hesitate.' The ball is ruined. Blackwood's reputation is cracked. Catalina got whatever she wanted. And you have a story no one will believe.";
      return "The port shrinks behind you. Whatever happened at that mansion, it changed something. The crew whispers about it. The sea feels larger now. Some things can't be put back in the box.";
    },
    requires: () => false,
    choices: [
      { text: "⚓ Set sail. Don't look back.", eff: { gold: 0, crew: 0, karma: 1, curse: 0 }, msg: "The past is a port you've left. The sea ahead is all that matters. But your reputation precedes you now. Every harbor will know what happened.", flag: "governor_quest_done" },
      { text: "🍺 Drink to the chaos.", eff: { gold: -5, crew: 1, karma: 0, curse: 0 }, msg: "You buy rum for the crew. They toast to the strangest night of their lives. Morale soars. Someone starts a song about the pirate at the governor's ball.", flag: "governor_quest_done" },
    ],
  },
];

/**
 * QUESTLINE 3: "The Drowned Bell"
 * A supernatural mystery about a bell that controls storms,
 * a fishing village dying of hunger, and drowned souls demanding justice.
 *
 * Themes: duty to the dead vs duty to the living,
 * whether peace built on a lie is worth keeping.
 */
const drownedBell: Encounter[] = [
  {
    id: "ql_bell_start", scene: "island", title: "The Silent Village",
    text: "A fishing village. No boats in the harbor. No fish drying on racks. Children sit on the pier, staring at water they're forbidden to enter. An elder approaches. 'The bell stopped ringing. For a hundred years the Chapel Bell kept storms away. Three weeks ago, it fell silent. Now the storms won't stop. We can't fish. We can't eat. The bell is down there.' She points to the water. 'In the drowned chapel. Where the dead pray.'",
    family: "quest", tags: ["bell", "supernatural", "village"], phase: ["mid", "late"],
    weight: 1.6, exclusivityGroup: "ql_bell",
    choices: [
      { text: "🔔 'I'll find your bell.'", eff: { chain: "ql_bell_dive_prep" }, msg: "The elder nods. 'Be careful, Captain. The dead down there... they remember why the bell was silenced.' Something in her eyes she isn't telling you.", flag: "bell_quest" },
      { text: "🍞 Give them food (−10 gold)", eff: { gold: -10, karma: 2, chain: "ql_bell_dive_prep" }, msg: "You share your stores. The children eat like animals. The elder watches. 'Kind. But kindness won't stop the storms. Will you help us?'", flag: "bell_quest_fed" },
      { text: "🚶 'Not my problem.'", eff: { karma: -1, curse: 0 }, msg: "You sail away. That night, the worst storm you've ever seen hits. Coincidence. It has to be coincidence." },
    ],
  },
  {
    id: "ql_bell_dive_prep", scene: "island", title: "The Fisherman's Warning",
    text: "An old fisherman pulls you aside. His hands are scarred, one eye is clouded. 'I was the last to dive. Thirty years ago. I saw the chapel. I saw them. Rows of drowned sailors, kneeling in pews, praying. The bell sits on the altar. But here's what the elder won't tell you...' He leans close. 'The bell doesn't control storms. It controls the dead. It keeps them down. Chained to the seabed. When it rings, THEY can't rise. If you bring it back up, the storms stop. But so do the chains.'",
    requires: () => false,
    choices: [
      { text: "💀 'What happens if the dead rise?'", eff: { chain: "ql_bell_dive" }, msg: "'Nobody knows. They've been down there for a century. Sailors, slavers, prisoners thrown overboard. Hundreds of them. All praying for something.' He shudders. 'Maybe justice. Maybe revenge. Does it matter?'", flag: "bell_knows_truth" },
      { text: "🔔 'The village needs the bell. I'm diving.'", eff: { chain: "ql_bell_dive" }, msg: "'Then you choose the living over the dead. I can respect that. But don't say I didn't warn you.' He gives you a weighted belt and a waterproof lantern." },
      { text: "🤔 'Why did it stop ringing?'", eff: { chain: "ql_bell_dive" }, msg: "He freezes. 'Because someone down there finally learned how to stop it. Someone who's been dead for a hundred years but hasn't stopped thinking.' He crosses himself and walks away.", flag: "bell_someone_woke" },
    ],
  },
  {
    id: "ql_bell_dive", scene: "underwater", title: "The Drowned Chapel",
    text: "Green light. Silence so complete it has a sound. The chapel is real: coral-crusted walls, shattered windows, and pews. They're there. Dozens of drowned dead, kneeling, mouths open in silent prayer. Their eyes follow you. On the altar, the bell sits in a nest of chains. One figure stands at the pulpit: a drowned woman in a captain's uniform. She turns to you. Her mouth moves. You hear her in your skull: 'You come to take our chains back. To silence us again.'",
    requires: () => false,
    choices: [
      { text: "🔔 Take the bell", eff: { curse: 2, chain: "ql_bell_take" }, msg: "You grab the bell. The dead SCREAM. Not with mouths. With everything. The water trembles. Chains snap. The drowned woman watches, not stopping you. 'You choose the living. We'll remember.'", flag: "bell_taken" },
      { text: "💀 'What do you want?'", eff: { chain: "ql_bell_negotiate" }, msg: "The drowned captain tilts her head. 'We want what all dead want. To be heard. To be known. To have someone say our names.' She gestures at the pews. 'These were slaves. Thrown overboard during a fever. The village above? Their masters' grandchildren. The bell was cast to keep us silent. To forget.'", flag: "bell_heard_dead" },
      { text: "🏊 Swim back up immediately", eff: { curse: 1 }, msg: "You surface gasping. The dead didn't stop you. But they watched. And you know, with absolute certainty, that this isn't over." },
    ],
  },
  {
    id: "ql_bell_negotiate", scene: "underwater", title: "The Names",
    text: "She drifts closer. 'There is a ledger. In the village elder's house. The old shipping manifest. Our names are on it. Read them. At the shore. Let the sea hear. That is all we ask. Then we will let the bell ring again.' She pauses. 'But the elder will fight you. The manifest proves what her ancestors did. The village was built on the selling and drowning of human beings. The bell was cast to bury the truth with us.'",
    requires: () => false,
    choices: [
      { text: "📖 'I'll read the names.'", eff: { chain: "ql_bell_names" }, msg: "She closes her eyes. Something like peace crosses her face. 'The manifest is hidden under the chapel floorboards. In the elder's home. She knows it's there.' You surface with purpose.", flag: "bell_promise_names" },
      { text: "🔔 'I'll take the bell instead. Faster.'", eff: { curse: 2, chain: "ql_bell_take" }, msg: "Her face hardens. 'Then you are no different from them.' The dead rise from the pews. Hands reach for you. You grab the bell and kick for the surface. Something scratches your ankle. It will never fully heal.", flag: "bell_taken_forced" },
      { text: "⚖️ 'Both. Names AND bell.'", eff: { chain: "ql_bell_names" }, msg: "'Read the names first. Then the bell is yours. This is our only condition.' She extends a hand made of coral and bone. You shake it. The water goes warm.", flag: "bell_deal_both" },
    ],
  },
  {
    id: "ql_bell_take", scene: "island", title: "The Bell Returns",
    text: "You surface with the bell. The village erupts in joy. Children cheer. The elder takes it with trembling hands, hangs it in the new chapel frame, and rings it. The sound splits the sky. Clouds part. Sunlight. But out at sea, the water churns. Shapes breach the surface and sink again. The dead are restless. The fisherman catches your eye and shakes his head slowly.",
    requires: () => false,
    choices: [
      { text: "⚓ Leave before it gets worse", eff: { gold: [20, 40], karma: -1, curse: 1 }, msg: "The elder pays you. As you sail away, you look back. The sea around the village is boiling with shapes. They'll be fine. Probably. The bell is ringing. That's enough. Isn't it?", flag: "bell_quest_done" },
      { text: "😔 'There are people down there. Slaves your ancestors drowned.'", eff: { karma: 2, chain: "ql_bell_confession" }, msg: "The elder freezes. The whole village goes quiet. 'How dare you,' she whispers. But the fisherman speaks up: 'He's right. I saw them too. Thirty years ago. We all know.'", flag: "bell_truth_told" },
    ],
  },
  {
    id: "ql_bell_names", scene: "island", title: "The Manifest",
    text: "You return to the village and find the elder's home. Under the floorboards, wrapped in oilcloth, the manifest. Names. Ages. Prices. 'Abiola, age 14. Sold for 30 shillings. Disposed at sea, day 47.' Hundreds of entries. 'Disposed at sea.' That's what they wrote. The elder appears in the doorway. 'Put that back.' She's holding a gutting knife. 'That paper is the only thing keeping this village together. If people learn what our founders did...'",
    requires: () => false,
    choices: [
      { text: "📖 Read the names at the shore anyway", eff: { crew: 0, karma: 3, curse: -2, chain: "ql_bell_reading" }, msg: "You push past her. She doesn't use the knife. At the shore, you begin reading. 'Abiola. Kwame. Fatima. Olu...' The sea goes still. Perfectly, impossibly still." },
      { text: "🤝 'We read them together. As a village.'", eff: { karma: 4, curse: -3, chain: "ql_bell_reading" }, msg: "You look at her. 'Your ancestors did this. You can't undo it. But you can acknowledge it.' She drops the knife. She's crying. 'I know their names. I've read this paper a thousand times. I just couldn't say them out loud.'", flag: "bell_village_reads" },
      { text: "📄 'Keep your secret. But the dead know.'", eff: { karma: 0, curse: 1 }, msg: "You put the manifest back. The elder sags with relief. That night, the storm returns worse than before. The bell rings, but it sounds different now. Like a scream.", flag: "bell_quest_done" },
    ],
  },
  {
    id: "ql_bell_confession", scene: "island", title: "The Village Reckoning",
    text: "The village square. Everyone gathered. The fisherman is speaking. '...my grandmother told me. Slave ships. Our port was a disposal point. The sick, the rebellious, the ones who wouldn't break. Thrown overboard with chains. The bell was forged to keep their spirits trapped.' An older woman starts crying. A young man storms off. A child asks, 'What does disposed mean?' No one answers.",
    requires: () => false,
    choices: [
      { text: "📖 'There's a manifest. Let me read the names.'", eff: { karma: 3, curse: -2, chain: "ql_bell_reading" }, msg: "You retrieve it. The village listens. Some cover their mouths. Some bow their heads. When you finish, the sea around the village is mirror-calm for the first time in weeks.", flag: "bell_village_reads" },
      { text: "🔔 'Ring the bell for them. Not against them.'", eff: { karma: 2, curse: -1 }, msg: "The elder rings the bell. This time she rings it slowly. Like a funeral toll. Like an apology. The sound carries across the water. The shapes beneath the surface stop moving. One by one, they sink. Peace or defeat. You can't tell.", flag: "bell_quest_done" },
    ],
  },
  {
    id: "ql_bell_reading", scene: "island", title: "The Names on the Water",
    text: (state) => {
      const villageTogether = state.flags.has("bell_village_reads");
      if (villageTogether) {
        return "The entire village stands at the shore. The elder reads first. Her voice breaks on every name, but she doesn't stop. Others take over when she can't continue. 'Abiola. Kwame. Fatima. Olu. Amara. Yusuf...' Two hundred and seventeen names. The sea absorbs each one. When the last name is spoken, the drowned captain surfaces, just her face, above the water. She nods once. And is gone. The water is calm. The bell rings on its own. Three clear notes.";
      }
      return "You stand alone at the water's edge. The village watches from behind doors. You read every name. Two hundred and seventeen souls. Your voice gives out twice. You keep going. When you finish, the water glows green, then blue, then clear. Shapes rise to the surface and dissolve like morning mist. The drowned captain is the last. She looks at you. 'You are heard.' Then she's gone.";
    },
    requires: () => false,
    choices: [
      {
        text: "🔔 Ring the bell",
        eff: { gold: [20, 50], crew: 1, karma: 3, curse: -3 },
        msg: (state) => state.flags.has("bell_village_reads")
          ? "You ring the bell together. The storms are gone. The fish return by morning. The village carves the names into the chapel wall. Every name. They'll never be forgotten again. The elder gives you everything she can spare. It's not much. It's everything."
          : "You ring the bell. Clear and bright. The storms break. Sunlight floods the cove. The fisherman is the first to launch a boat. He catches more fish in one hour than the village has seen in a month. They thank you. But some won't meet your eyes. The truth is heavier than gratitude.",
        flag: "bell_quest_done",
      },
    ],
  },
];

export const questlineEncountersEn: Encounter[] = [
  ...surgeonDebt,
  ...governorMasquerade,
  ...drownedBell,
];
