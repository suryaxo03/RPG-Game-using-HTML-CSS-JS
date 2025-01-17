let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  {
    name: "stick",
    power: 5
  },
  {
    name: "dagger",
    power: 30
  },
  {
    name: "claw hammer",
    power: 50
  },
  {
    name: "sword",
    power: 100
  }
];
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the \"town square\". You see a sign that says \"Store\".",
  },
  {
    name: "store",
    "button text": ["Buy 10 heath (10 Gold)", "Buy weapon (30 Gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Welcome to the Store!",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Welcome to the cave, you gonna fight some monsters:",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You're fighting a monster!"
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold."
  },
  {
    name: "lose",
    "button text": ["Restart?", "Restart?", "Restart?"],
    "button functions": [restart, restart, restart],
    text: "You died! Try again."
  },
  {
    name: "win",
    "button text": ["Restart?", "Restart?", "Restart?"],
    "button functions": [restart, restart, restart],
    text: "You won! Play again?"
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You found a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];

  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];

  text.innerText = location.text;
}
function goTown() {
  update(locations[0]);
}
function goStore() {
  update(locations[1]);
}
function goCave() {
  // console.log("Going to Cave!");
  update(locations[2]);
}
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  }
  else {
    text.innerHTML = "You don't have enough gold to buy health! Go to the store and buy some more gold!"
  }
}
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You purchased a" + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText = "You have the following in your inventory: " + inventory;
    }
    else {
      text.innerText = "You don't have enough gold to buy a weapon! Go to the store to purchase some gold!"
    }
  }
  else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold?";
    button1.onclick = sellWeapon;
  }
}
function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    currentWeapon = inventory.shift();
    text.innertText = "You sold a ${currentWeapon}!";
    text.innerText = "You have the following in your inventory: ${inventory}!.";
  }
  else {
    text.innerText = "Don't sell your only weapon!";
  }
}
function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}
function fightDragon() {
  fighting = 2;
  goFight();
}
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}
function attack() {
  console.log("attack() is working!");
  text.innerText = "The " + monsters[fighting].name + "attacks!";
  text.innerText = "You attack it with your " + weapons[currentWeapon].name + ".";
  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
  }
  else {
    text.innerText += "You missed!";
  }
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  }
  else if (monsterHealth <= 0) {
    // if (fighting == 2) {
    //   winGame();
    // }
    // else {
    //   defeatMonster();
    // }
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += "Your" + inventory.pop() + "breaks!";
    currentWeapon--;
  }
}
function dodge() {
  text.innerText = "You dodged the attack from the" + monsters[fighting].name + "!";
}
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}
function lose() {
  update(locations[5]);
}
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText, innerText = xp;
  goTown();
}
function winGame() {
  update(locations[6]);
}
function getMonsterAttackValue(level) {
  let hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit;
}
function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}
function easterEgg() {
  update(locations[7]);
}
function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}
function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  console.log("pick() is working");
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.indexOf(guess) !== -1) {
    text.innerText += "Your guess is correct! You won 20 Gold!";
    gold += 20;
    goldText.innerText = gold;
  }
  else {
    text.innerText += "Your guess is wrong! You lost 10 health!";
    health -= 10;
    health.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}