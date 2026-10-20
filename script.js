const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = isOpen ? '×' : '☰';
});
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) { menuToggle.textContent = '☰'; menuToggle.setAttribute('aria-label', 'Open navigation'); }
}));

// Interactive menu filters
document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.menu-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

// Dream Drink Generator: each combination creates a matching name, description and price.
const moods = {
  cosy: { adjective: 'Cosy Cloud', intro: 'A soft', price: 4.8 },
  bold: { adjective: 'Bold Bloom', intro: 'A bold', price: 4.6 },
  romantic: { adjective: 'Sweetheart Sip', intro: 'A dreamy', price: 4.9 },
  playful: { adjective: 'Cherry Pop', intro: 'A playful', price: 4.7 }
};
const flavours = {
  vanilla: { label: 'vanilla', names: ['Vanilla', 'Velvet Vanilla', 'Vanilla Kiss'] },
  strawberry: { label: 'strawberry', names: ['Strawberry', 'Pink Berry', 'Berry Blush'] },
  caramel: { label: 'caramel', names: ['caramel', 'Caramel Glow', 'Golden Caramel'] },
  chocolate: { label: 'chocolate', names: ['chocolate', 'Cocoa Cloud', 'Choco Cherry'] }
};
const milks = {
  oat: { label: 'oat milk', extra: 0.2 },
  whole: { label: 'whole milk', extra: 0 },
  almond: { label: 'almond milk', extra: 0.3 },
  no: { label: 'no milk', extra: -0.3 }
};
const moodSelect = document.getElementById('moodSelect');
const flavourSelect = document.getElementById('flavourSelect');
const milkSelect = document.getElementById('milkSelect');
const makeDrink = document.getElementById('makeDrink');
const saveDrink = document.getElementById('saveDrink');
let currentDrink = null;

function createDreamDrink() {
  const mood = moods[moodSelect.value] || moods.cosy;
  const flavour = flavours[flavourSelect.value] || flavours.vanilla;
  const milk = milks[milkSelect.value] || milks.oat;
  const names = flavour.names;
  const nameIndex = moodSelect.value === 'bold' ? 1 : moodSelect.value === 'romantic' ? 2 : 0;
  const drinkName = `${names[nameIndex]} ${mood.adjective}`;
  const milkPhrase = milk.label === 'no milk' ? 'without milk' : `with ${milk.label}`;
  const descriptions = {
    cosy: `A comforting ${flavour.label} latte ${milkPhrase} — a warm little hug in a cup.`,
    bold: `A punchy ${flavour.label} coffee ${milkPhrase}, made for main-character energy.`,
    romantic: `A dreamy ${flavour.label} latte ${milkPhrase}, with a little extra sweetness.`,
    playful: `A fun ${flavour.label} coffee ${milkPhrase} — bright, cheeky and full of charm.`
  };
  const price = Math.max(3.5, mood.price + milk.extra + (flavourSelect.value === 'strawberry' ? 0.3 : 0));
  currentDrink = { name: drinkName, description: descriptions[moodSelect.value], price: `€${price.toFixed(2)}` };
  document.getElementById('resultName').textContent = currentDrink.name;
  document.getElementById('resultDescription').textContent = currentDrink.description;
  document.getElementById('resultPrice').textContent = currentDrink.price;
  document.getElementById('savedMessage').hidden = true;
  saveDrink.textContent = '♡ Save my match';
  saveDrink.setAttribute('aria-pressed', 'false');
  const cup = document.getElementById('resultCup');
  cup.animate?.([{ transform: 'scale(.92) rotate(-4deg)' }, { transform: 'scale(1.04) rotate(3deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 420, easing: 'ease-out' });
}
makeDrink?.addEventListener('click', createDreamDrink);
saveDrink?.addEventListener('click', () => {
  if (!currentDrink) createDreamDrink();
  const saved = saveDrink.getAttribute('aria-pressed') !== 'true';
  saveDrink.setAttribute('aria-pressed', String(saved));
  saveDrink.textContent = saved ? '♥ Match saved!' : '♡ Save my match';
  document.getElementById('savedMessage').hidden = !saved;
});
createDreamDrink();
