// index.js — cheeseburger bot
require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const fs = require('fs');

const DATA_FILE = process.env.RAILWAY_ENVIRONMENT ? '/app/data/data.json' : './data.json';

// Load persisted data or start fresh
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const persistedData = loadData();

const CHEESEBURGER_GIF = 'https://tenor.com/view/dodge-matrix-charborg-gif-14001012220497599567';
const LOSER_GIF = 'https://tenor.com/view/niko-oneshot-ballin-teste-niko-ballin-gif-26110464';

const TRIVIA = [
  // Geography
  { q: 'What is the capital of France?', a: 'paris' },
  { q: 'What is the capital of Japan?', a: 'tokyo' },
  { q: 'What is the capital of Australia?', a: 'canberra' },
  { q: 'What is the largest country in the world by area?', a: 'russia' },
  { q: 'What is the smallest country in the world?', a: 'vatican city' },
  { q: 'What is the longest river in the world?', a: 'nile' },
  { q: 'What is the tallest mountain in the world?', a: 'mount everest' },
  { q: 'What is the largest ocean on Earth?', a: 'pacific' },
  { q: 'How many continents are there?', a: '7' },
  { q: 'What country has the most natural lakes?', a: 'canada' },
  { q: 'What is the capital of Brazil?', a: 'brasilia' },
  { q: 'What is the capital of Canada?', a: 'ottawa' },
  // Science
  { q: 'What planet is closest to the sun?', a: 'mercury' },
  { q: 'What gas do plants absorb from the atmosphere?', a: 'carbon dioxide' },
  { q: 'How many bones are in the human body?', a: '206' },
  { q: 'What is the chemical symbol for gold?', a: 'au' },
  { q: 'What is the chemical symbol for water?', a: 'h2o' },
  { q: 'What is the smallest planet in our solar system?', a: 'mercury' },
  { q: 'What is the largest planet in our solar system?', a: 'jupiter' },
  { q: 'How many chromosomes do humans have?', a: '46' },
  { q: 'What is the speed of light in km/s? (approximate)', a: '300000' },
  { q: 'What element has the atomic number 1?', a: 'hydrogen' },
  { q: 'What is the hardest natural substance on Earth?', a: 'diamond' },
  { q: 'How many hearts does an octopus have?', a: '3' },
  { q: 'What planet is known as the Red Planet?', a: 'mars' },
  { q: 'What is the powerhouse of the cell?', a: 'mitochondria' },
  // Math
  { q: 'What is 12 x 12?', a: '144' },
  { q: 'What is the square root of 144?', a: '12' },
  { q: 'How many sides does a hexagon have?', a: '6' },
  { q: 'What is 15% of 200?', a: '30' },
  { q: 'What is the value of Pi to 2 decimal places?', a: '3.14' },
  // History
  { q: 'What year did World War 2 end?', a: '1945' },
  { q: 'What year did World War 1 start?', a: '1914' },
  { q: 'Who was the first President of the United States?', a: 'george washington' },
  { q: 'In what year did the Titanic sink?', a: '1912' },
  { q: 'What year did man first land on the moon?', a: '1969' },
  { q: 'What ancient wonder was located in Alexandria?', a: 'lighthouse' },
  { q: 'Who invented the telephone?', a: 'alexander graham bell' },
  { q: 'What year did the Berlin Wall fall?', a: '1989' },
  // Art & Culture
  { q: 'Who painted the Mona Lisa?', a: 'leonardo da vinci' },
  { q: 'Who wrote Romeo and Juliet?', a: 'shakespeare' },
  { q: 'How many colors are in a rainbow?', a: '7' },
  { q: 'What language has the most native speakers in the world?', a: 'mandarin' },
  { q: 'How many strings does a standard guitar have?', a: '6' },
  { q: 'What is the most spoken language in the world overall?', a: 'english' },
  { q: 'Who wrote Harry Potter?', a: 'jk rowling' },
  { q: 'What is the name of the lion in The Lion, the Witch and the Wardrobe?', a: 'aslan' },
  // Animals
  { q: 'What is the fastest land animal?', a: 'cheetah' },
  { q: 'What is the largest animal on Earth?', a: 'blue whale' },
  { q: 'How many legs does a spider have?', a: '8' },
  { q: 'What is the only mammal capable of true flight?', a: 'bat' },
  { q: 'What is a group of lions called?', a: 'pride' },
  { q: 'How many legs does an insect have?', a: '6' },
  { q: 'What animal is known as the ship of the desert?', a: 'camel' },
  { q: 'What is the tallest animal in the world?', a: 'giraffe' },
  // Food & Drink
  { q: 'What country did pizza originate from?', a: 'italy' },
  { q: 'What fruit is known as the king of fruits?', a: 'durian' },
  { q: 'How many teaspoons are in a tablespoon?', a: '3' },
  { q: 'What nut is used to make marzipan?', a: 'almond' },
  // Video Games
  { q: 'What is the best-selling video game of all time?', a: 'minecraft' },
  { q: 'What company makes the PlayStation?', a: 'sony' },
  { q: 'What is the name of the princess in Super Mario?', a: 'peach' },
  { q: 'What color is Sonic the Hedgehog?', a: 'blue' },
  { q: 'How many Pokemon were in the original Gen 1 Pokedex?', a: '151' },
  { q: 'What game features a character named Master Chief?', a: 'halo' },
  { q: 'In Minecraft, what do you use to make a bed?', a: 'wool and wood' },
  // Sports
  { q: 'How many players are on a standard soccer team?', a: '11' },
  { q: 'How many rings are on the Olympic flag?', a: '5' },
  { q: 'What sport is played at Wimbledon?', a: 'tennis' },
  { q: 'How many points is a touchdown worth in American football?', a: '6' },
  { q: 'What country invented basketball?', a: 'canada' },
  { q: 'How many players are on a basketball team on the court at one time?', a: '5' },
  { q: 'What is the maximum score in ten pin bowling?', a: '300' },
  { q: 'In what sport would you perform a slam dunk?', a: 'basketball' },
  // Pop culture
  { q: 'What is the name of the fictional kingdom in Frozen?', a: 'arendelle' },
  { q: 'What band was Harry Styles in before going solo?', a: 'one direction' },
  { q: 'How many infinity stones are there in the MCU?', a: '6' },
  { q: 'What is the name of Thor\'s hammer?', a: 'mjolnir' },
  { q: 'What streaming service is known for the show Stranger Things?', a: 'netflix' },
  { q: 'What color is Pikachu?', a: 'yellow' },
  { q: 'What is the name of Simba\'s father in The Lion King?', a: 'mufasa' },
  { q: 'What TV show features the characters Dwight Schrute and Michael Scott?', a: 'the office' },
  // Technology
  { q: 'What does CPU stand for?', a: 'central processing unit' },
  { q: 'What does HTTP stand for?', a: 'hypertext transfer protocol' },
  { q: 'What company makes the iPhone?', a: 'apple' },
  { q: 'What programming language is known for its snake logo?', a: 'python' },
  { q: 'What does RAM stand for?', a: 'random access memory' },
  { q: 'What social media platform uses a bird as its logo?', a: 'twitter' },
  { q: 'What does USB stand for?', a: 'universal serial bus' },
  // Random fun
  { q: 'How many seconds are in an hour?', a: '3600' },
  { q: 'What is the most popular card game in the world?', a: 'poker' },
  { q: 'What is the fear of spiders called?', a: 'arachnophobia' },
  { q: 'How many days are in a leap year?', a: '366' },
  { q: 'What is the most consumed beverage in the world after water?', a: 'tea' },
  { q: 'What is the longest word in the English language?', a: 'pneumonoultramicroscopicsilicovolcanoconiosis' },
  { q: 'How many zeros are in one million?', a: '6' },
  { q: 'What planet has the most moons?', a: 'saturn' },
];

const SCRAMBLE_WORDS = [
  'banana', 'elephant', 'guitar', 'mountain', 'dolphin', 'umbrella', 'cactus',
  'lantern', 'penguin', 'volcano', 'biscuit', 'blanket', 'chimney', 'diamond',
  'feather', 'galaxy', 'hamster', 'iceberg', 'jungle', 'kitchen', 'lobster',
  'mustard', 'noodle', 'octopus', 'parrot', 'quicksand', 'rainbow', 'sandwich',
  'tornado', 'unicorn', 'vampire', 'walrus', 'xylophone', 'yogurt', 'zebra',
  'avocado', 'broccoli', 'coconut', 'doughnut', 'eggplant', 'flamingo', 'giraffe',
  'honeybee', 'igloo', 'jellyfish', 'kangaroo', 'lollipop', 'mushroom', 'narwhal',
];


const WYR = [
  'Would you rather fight 1 horse-sized duck or 100 duck-sized horses?',
  'Would you rather never use the internet again or never watch TV/movies again?',
  'Would you rather always be 10 minutes late or always be 20 minutes early?',
  'Would you rather have unlimited money or unlimited free time?',
  'Would you rather lose all your memories or never be able to make new ones?',
  'Would you rather be able to fly or be invisible?',
  'Would you rather always have to say what you\'re thinking or never speak again?',
  'Would you rather live in the past or the future?',
  'Would you rather be the funniest person in the room or the smartest?',
  'Would you rather never sleep again or never eat food again?',
  'Would you rather have free Wi-Fi everywhere or free food anywhere?',
  'Would you rather know how you die or when you die?',
  'Would you rather give up social media or give up music?',
  'Would you rather be famous but hated or unknown but loved?',
  'Would you rather only be able to whisper or only be able to shout?',
  'Would you rather always be cold or always be hot?',
  'Would you rather be able to talk to animals or speak every language?',
  'Would you rather have no fingers or no toes?',
  'Would you rather always win arguments or always win at games?',
  'Would you rather be 2 inches tall or 20 feet tall?',
  'Would you rather have a pause button or a rewind button for your life?',
  'Would you rather eat pizza every day or never eat pizza again?',
  'Would you rather be the first person on Mars or the richest person on Earth?',
  'Would you rather have hiccups for the rest of your life or always feel like you need to sneeze?',
  'Would you rather only be able to watch one TV show forever or never watch TV again?',
  // Round 2
  'Would you rather have the ability to read minds or see the future?',
  'Would you rather always have to sing instead of speak or dance everywhere you go?',
  'Would you rather lose your sense of taste or your sense of smell?',
  'Would you rather be stuck on a deserted island alone or with someone you hate?',
  'Would you rather have a photographic memory or be able to forget anything on demand?',
  'Would you rather only eat sweet food or only eat savory food forever?',
  'Would you rather be able to breathe underwater or survive in space?',
  'Would you rather have legs as long as your fingers or fingers as long as your legs?',
  'Would you rather be the best player on a losing team or the worst player on a winning team?',
  'Would you rather have unlimited battery on all your devices or never get sick again?',
  'Would you rather live without music or live without movies?',
  'Would you rather be able to teleport anywhere or time travel to the future only?',
  'Would you rather always have to wear a costume or never be allowed to wear a costume again?',
  'Would you rather find true love or win the lottery?',
  'Would you rather speak every language or play every instrument?',
  'Would you rather be feared or be loved?',
  'Would you rather have a talking dog or a talking cat?',
  'Would you rather be able to stop time or slow it down by half?',
  'Would you rather have free plane tickets anywhere forever or free food at every restaurant forever?',
  'Would you rather never age physically or never age mentally?',
  'Would you rather always know when someone is lying or be the perfect liar?',
  'Would you rather have everyone laugh at your jokes or always win every game you play?',
  'Would you rather give up your phone for a month or give up showering for a month?',
  'Would you rather only be able to eat one meal a day or have to eat every hour?',
  'Would you rather have a rewind button or a fast forward button for life?',
];
function scrambleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const scrambled = arr.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
}

const activeSessions = new Map();
const cheeseburgerIntervals = new Map();
// Stores required role ID per guild for !cheeseburger (null = no restriction)
const cheeseburgerRoles = new Map(Object.entries(persistedData));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
  const lower = content.toLowerCase();

  // ── !cheeseburger ──────────────────────────────────────────────────────────
  if (lower === '!cheeseburger') {
    const requiredRoleId = cheeseburgerRoles.get(message.guild.id);
    if (requiredRoleId && !message.member.roles.cache.has(requiredRoleId)) {
      await message.react('❌');
      return;
    }
    if (cheeseburgerIntervals.has(message.channel.id)) {
      return message.reply('Already spamming! Use `!burgernocheese` to stop.');
    }

    await message.reply('Spamming activated! Use `!burgernocheese` to stop.');

    // Sends 5 GIFs per burst, doubles delay between bursts, caps at 30s
    let delay = 500;
    const MAX_DELAY = 30 * 1000;
    const BURST = 5;

    const sendBurst = async () => {
      for (let i = 0; i < BURST; i++) {
        if (!cheeseburgerIntervals.has(message.channel.id)) return;
        try {
          await message.channel.send(CHEESEBURGER_GIF);
        } catch (err) {
          console.error('Cheeseburger send error:', err);
          cheeseburgerIntervals.delete(message.channel.id);
          return;
        }
        // Small gap between GIFs in the same burst to avoid rate limits
        await new Promise(res => setTimeout(res, 300));
      }
      if (!cheeseburgerIntervals.has(message.channel.id)) return;
      delay = Math.min(delay * 2, MAX_DELAY);
      const timeout = setTimeout(sendBurst, delay);
      cheeseburgerIntervals.set(message.channel.id, timeout);
    };

    const timeout = setTimeout(sendBurst, delay);
    cheeseburgerIntervals.set(message.channel.id, timeout);

  // ── !set @role ────────────────────────────────────────────────────────────
  } else if (lower.startsWith('!set')) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ Only admins can set the cheeseburger role!');
    }
    const role = message.mentions.roles.first();
    if (!role) {
      return message.reply('❌ Mention a role. Example: `!set @role`');
    }
    cheeseburgerRoles.set(message.guild.id, role.id);
    saveData(Object.fromEntries(cheeseburgerRoles));
    await message.reply(`✅ Only members with **${role.name}** can now use \`!cheeseburger\`!`);

  // ── !burgernocheese ────────────────────────────────────────────────────────
  } else if (lower === '!burgernocheese') {
    if (!cheeseburgerIntervals.has(message.channel.id)) {
      return message.reply('❌ No gifs are being sent right now!');
    }
    clearInterval(cheeseburgerIntervals.get(message.channel.id));
    cheeseburgerIntervals.delete(message.channel.id);
    await message.reply('🚫 Cheeseburger mode stopped. No more gifs...');

  // ── !loser @user ───────────────────────────────────────────────────────────
  } else if (lower.startsWith('!loser')) {
    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Mention a user. Example: `!loser @username`');
    await message.channel.send(`${target} ${LOSER_GIF}`);

  // ── !poll question ─────────────────────────────────────────────────────────
  } else if (lower.startsWith('!poll')) {
    const question = content.slice(5).trim();
    if (!question) return message.reply('❌ Please provide a question. Example: `!poll Is pineapple on pizza good?`');
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📊 Poll')
      .setDescription(question)
      .setFooter({ text: `Asked by ${message.author.username}` })
      .setTimestamp();
    const pollMessage = await message.channel.send({ embeds: [embed] });
    await pollMessage.react('👍');
    await pollMessage.react('👎');
    await message.delete().catch(() => {});

  // ── !bleh ──────────────────────────────────────────────────────────────────
  } else if (lower === '!bleh') {
    await message.reply('😝');

  // ── !coinflip ──────────────────────────────────────────────────────────────
  } else if (lower === '!coinflip') {
    await message.reply(Math.random() < 0.5 ? 'Heads 🪙' : 'Tails 🪙');

  // ── !rps ───────────────────────────────────────────────────────────────────
  } else if (lower.startsWith('!rps')) {
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const userChoice = content.slice(4).trim().toLowerCase();
    if (!choices.includes(userChoice)) return message.reply('❌ Pick one: `!rps rock`, `!rps paper`, or `!rps scissors`');
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let outcome;
    if (userChoice === botChoice) outcome = "It's a tie! 🤝";
    else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) outcome = 'You win! 🎉';
    else outcome = 'You lose! 😈';
    await message.reply(`You: ${emojis[userChoice]}  |  Me: ${emojis[botChoice]}\n${outcome}`);

  // ── !shiprigged (hidden command) ────────────────────────────────────────────
  } else if (lower.startsWith('!ship') && /!ship\s+\S+\s+\S+\s+[013]$/.test(lower)) {
    const parts = content.trim().split(/\s+/);
    const code = parts[parts.length - 1];
    const [user1, user2] = message.mentions.members.map(m => m.user.username);

    let score, verdict;
    if (code === '0')      { score = 1;   verdict = 'Run. 💀'; }
    else if (code === '1') { score = 50;  verdict = 'It could work 🤔'; }
    else                   { score = 100; verdict = 'Soulmates 💍'; }

    let bar = '';
    const filled = Math.round(score / 10);
    for (let i = 0; i < 10; i++) bar += i < filled ? '💗' : '🖤';

    const embed = new EmbedBuilder()
      .setColor(0xff6b9d)
      .setTitle('💘 Ship Calculator')
      .setDescription(`**${user1}** & **${user2}**\n\n${bar}\n\n**${score}%** — ${verdict}`);
    await message.reply({ embeds: [embed] });

  // ── !ship @user1 @user2 ───────────────────────────────────────────────────
  } else if (lower.startsWith('!ship')) {
    const members = message.mentions.members;
    if (members.size < 2) return message.reply('❌ Mention two users. Example: `!ship @user1 @user2`');
    const [user1, user2] = members.map(m => m.user.username);
    const score = Math.floor(Math.random() * 101);
    let bar = '';
    const filled = Math.round(score / 10);
    for (let i = 0; i < 10; i++) bar += i < filled ? '💗' : '🖤';
    let verdict;
    if (score >= 80) verdict = 'Soulmates 💍';
    else if (score >= 60) verdict = 'Pretty good 💕';
    else if (score >= 40) verdict = 'It could work 🤔';
    else if (score >= 20) verdict = 'Unlikely 😬';
    else verdict = 'Run. 💀';
    const embed = new EmbedBuilder()
      .setColor(0xff6b9d)
      .setTitle('💘 Ship Calculator')
      .setDescription(`**${user1}** & **${user2}**\n\n${bar}\n\n**${score}%** — ${verdict}`);
    await message.reply({ embeds: [embed] });

    // ── !say ───────────────────────────────────────────────────────────────────
  } else if (lower.startsWith('!say')) {
    const text = content.slice(4).trim();
    if (!text) return message.reply('❌ Provide a message. Example: `!say hello everyone`');
    await message.delete().catch(() => {});
    await message.channel.send(text);

  // ── !countdown ─────────────────────────────────────────────────────────────
  } else if (lower.startsWith('!countdown')) {
    const num = parseInt(content.slice(10).trim());
    if (isNaN(num) || num < 1 || num > 10) return message.reply('❌ Provide a number between 1 and 10. Example: `!countdown 5`');
    if (activeSessions.get(`countdown-${message.channel.id}`)) return message.reply('❌ A countdown is already running in this channel!');
    activeSessions.set(`countdown-${message.channel.id}`, true);
    await message.reply(`Starting countdown from **${num}**!`);
    for (let i = num; i > 0; i--) {
      await new Promise(res => setTimeout(res, 1000));
      await message.channel.send(`**${i}**`);
    }
    await new Promise(res => setTimeout(res, 1000));
    await message.channel.send('**0**');
    activeSessions.delete(`countdown-${message.channel.id}`);

  // ── !trivia ────────────────────────────────────────────────────────────────
  } else if (lower === '!trivia') {
    if (activeSessions.get(`trivia-${message.channel.id}`)) return message.reply('❌ A trivia question is already active! Answer it first.');
    const item = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('🧠 Trivia Time!')
      .setDescription(item.q)
      .setFooter({ text: 'Type your answer in chat — you have 30 seconds!' });
    await message.channel.send({ embeds: [embed] });
    activeSessions.set(`trivia-${message.channel.id}`, item.a);
    const collector = message.channel.createMessageCollector({ filter: m => !m.author.bot, time: 30000 });
    collector.on('collect', async m => {
      if (m.content.trim().toLowerCase() === item.a) {
        await m.reply(`✅ Correct! The answer was **${item.a}**! 🎉`);
        collector.stop('answered');
      }
    });
    collector.on('end', async (_, reason) => {
      activeSessions.delete(`trivia-${message.channel.id}`);
      if (reason !== 'answered') await message.channel.send(`⏰ Time's up! The answer was **${item.a}**.`);
    });

  // ── !scramble ──────────────────────────────────────────────────────────────
  } else if (lower === '!scramble') {
    if (activeSessions.get(`scramble-${message.channel.id}`)) return message.reply('❌ A scramble is already active! Unscramble it first.');
    const word = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)];
    const scrambled = scrambleWord(word);
    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle('🔀 Unscramble!')
      .setDescription(`**\`${scrambled.toUpperCase()}\`**`)
      .setFooter({ text: 'Type the unscrambled word — you have 30 seconds!' });
    await message.channel.send({ embeds: [embed] });
    activeSessions.set(`scramble-${message.channel.id}`, word);
    const collector = message.channel.createMessageCollector({ filter: m => !m.author.bot, time: 30000 });
    collector.on('collect', async m => {
      if (m.content.trim().toLowerCase() === word) {
        await m.reply(`✅ Correct! The word was **${word}**! 🎉`);
        collector.stop('answered');
      }
    });
    collector.on('end', async (_, reason) => {
      activeSessions.delete(`scramble-${message.channel.id}`);
      if (reason !== 'answered') await message.channel.send(`⏰ Time's up! The word was **${word}**.`);
    });

  // ── !join ──────────────────────────────────────────────────────────────────
  } else if (lower === '!join') {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('❌ You need to be in a voice channel first!');
    }
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: true,
    });
    await message.reply(`🔇 Joined **${voiceChannel.name}** (deafened)`);

  // ── !leave ─────────────────────────────────────────────────────────────────
  } else if (lower === '!leave') {
    const { getVoiceConnection } = require('@discordjs/voice');
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) {
      return message.reply('❌ I\'m not in a voice channel!');
    }
    connection.destroy();
    await message.reply('👋 Left the voice channel!');

  // ── !wyr ───────────────────────────────────────────────────────────────────────────
  } else if (lower === '!wyr') {
    const question = WYR[Math.floor(Math.random() * WYR.length)];
    const embed = new EmbedBuilder()
      .setColor(0xa855f7)
      .setTitle('🤔 Would You Rather...')
      .setDescription(question)
      .setFooter({ text: 'React with 🇦 or 🇧 to vote!' });
    const wyrMsg = await message.channel.send({ embeds: [embed] });
    await wyrMsg.react('🇦');
    await wyrMsg.react('🇧');

  // ── !remind (time) (message) ────────────────────────────────────────────────
  } else if (lower.startsWith('!remind')) {
    const parts = content.slice(7).trim().split(' ');
    const timeStr = parts[0].toLowerCase();
    const reminderText = parts.slice(1).join(' ');
    let seconds;
    let label;
    if (timeStr.endsWith('h')) {
      const h = parseFloat(timeStr);
      seconds = Math.round(h * 3600);
      label = `${h} hour${h === 1 ? '' : 's'}`;
    } else if (timeStr.endsWith('m')) {
      const m = parseFloat(timeStr);
      seconds = Math.round(m * 60);
      label = `${m} minute${m === 1 ? '' : 's'}`;
    } else if (timeStr.endsWith('s')) {
      seconds = parseInt(timeStr);
      label = `${seconds} second${seconds === 1 ? '' : 's'}`;
    } else {
      seconds = parseInt(timeStr);
      label = `${seconds} second${seconds === 1 ? '' : 's'}`;
    }
    if (isNaN(seconds) || seconds < 1 || seconds > 86400) {
      return message.reply('❌ Usage: `!remind (time) (message)` — e.g. `!remind 30s`, `!remind 5m`, `!remind 2h` (max 24h)');
    }
    if (!reminderText) {
      return message.reply('❌ Please include a reminder message. Example: `!remind 5m take out the trash`');
    }
    await message.reply('⏰ Got it! I\'ll remind you in **' + label + '**!');
    setTimeout(async () => {
      await message.channel.send(`⏰ ${message.author} reminder: **${reminderText}**`);
    }, seconds * 1000);

  // ── !help ──────────────────────────────────────────────────────────────────
  } else if (lower === '!help') {
    const embed = new EmbedBuilder()
      .setColor(0xf4a522)
      .setTitle('🍔 Commands')
      .addFields(
        { name: '!cheeseburger', value: 'Starts sending cheeseburger GIFs every 10–60 seconds' },
        { name: '!burgernocheese', value: 'Stops the cheeseburger GIFs' },
        { name: '!loser @user', value: 'Calls someone a loser with a GIF' },
        { name: '!poll (question)', value: 'Creates a 👍 👎 poll' },
        { name: '!bleh', value: 'Sends 😝' },
        { name: '!coinflip', value: 'Flips a coin' },
        { name: '!rps (rock/paper/scissors)', value: 'Play rock paper scissors against the bot' },
        { name: '!ship @user1 @user2', value: 'Calculate compatibility between two users' },
        { name: '!say (message)', value: 'Make the bot say something' },
        { name: '!countdown (1-10)', value: 'Counts down to GO!' },
        { name: '!trivia', value: 'Asks a trivia question — first to answer wins!' },
        { name: '!scramble', value: 'Unscramble a word — first to answer wins!' },
        { name: '!wyr', value: 'Sends a random Would You Rather question' },
        { name: '!remind (time) (message)', value: 'Pings you after a set time — use s/m/h e.g. `!remind 5m hi`' },
        { name: '!join', value: 'Joins your voice channel (deafened)' },
        { name: '!leave', value: 'Leaves the voice channel' },
        { name: '!help', value: 'Shows this list' },
      );
    await message.reply({ embeds: [embed] });
  }
});

client.on('error', (err) => console.error('Discord client error:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN is missing in .env');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
