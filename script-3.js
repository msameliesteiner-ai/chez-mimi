// Layer colors
const C = {
  crema:   "#c98d55",
  espresso:"#3b2314",
  coffee:  "#6b4126",
  milk:    "#ecd9bd",
  foam:    "#fbf4ea",
  cream:   "#fffdf7"
};

// All drinks: layers from TOP to BOTTOM
// share = size of the layer, fill = how full the cup is (0 to 1)
const drinks = [
  {
    name: "Espresso", price: "€2.60", fill: 0.45,
    desc: "Short, strong, pure.",
    layers: [
      { label: "Crema", color: C.crema, share: 18 },
      { label: "Espresso", color: C.espresso, share: 82 }
    ]
  },
  {
    name: "Cappuccino", price: "€3.90", fill: 0.95,
    desc: "Espresso, steamed milk and a cap of milk foam.",
    layers: [
      { label: "Milk foam", color: C.foam, share: 32 },
      { label: "Steamed milk", color: C.milk, share: 33 },
      { label: "Espresso", color: C.espresso, share: 35 }
    ]
  },
  {
    name: "Latte Macchiato", price: "€4.20", fill: 1,
    desc: "Lots of milk, a shot of espresso – beautifully layered.",
    layers: [
      { label: "Milk foam", color: C.foam, share: 14 },
      { label: "Steamed milk", color: C.milk, share: 56 },
      { label: "Espresso", color: C.espresso, share: 30 }
    ]
  },
  {
    name: "Flat White", price: "€4.00", fill: 0.85,
    desc: "Double espresso with silky microfoam.",
    layers: [
      { label: "Microfoam", color: C.foam, share: 12 },
      { label: "Silky milk", color: C.milk, share: 38 },
      { label: "Double espresso", color: C.espresso, share: 50 }
    ]
  },
  {
    name: "Wiener Melange", price: "€4.10", fill: 0.95,
    desc: "The Viennese classic: coffee, milk and milk foam.",
    layers: [
      { label: "Milk foam", color: C.foam, share: 25 },
      { label: "Steamed milk", color: C.milk, share: 30 },
      { label: "Coffee", color: C.coffee, share: 45 }
    ]
  },
  {
    name: "Einspänner", price: "€4.50", fill: 0.95,
    desc: "Strong mocha under a cloud of whipped cream.",
    layers: [
      { label: "Whipped cream", color: C.cream, share: 38 },
      { label: "Mocha", color: C.espresso, share: 62 }
    ]
  }
];

// Draw the cup as SVG (a cross-section, so you can see the layers)
function cupSVG(drink, id) {
  const bottom = 150;          // bottom of the cup
  const maxHeight = 94;        // maximum fill height
  const total = maxHeight * drink.fill;
  let y = bottom - total;      // start at the top of the drink
  let rects = "";

  drink.layers.forEach((layer, i) => {
    const h = total * layer.share / 100;
    rects += `<rect class="layer" data-i="${i}" x="25" y="${y.toFixed(1)}" width="150" height="${(h + 0.6).toFixed(1)}" fill="${layer.color}"/>`;
    y += h;
  });

  const body = "M30 52 H170 V92 Q170 150 100 150 Q30 150 30 92 Z";

  return `
  <svg class="cup" viewBox="0 0 220 190" role="img" aria-label="${drink.name} cross-section">
    <defs>
      <clipPath id="clip-${id}"><path d="${body}"/></clipPath>
    </defs>

    <!-- Steam -->
    <g class="steam" fill="none" stroke-width="3.5" stroke-linecap="round">
      <path d="M78 42 q-8 -10 0 -20 q8 -10 0 -20"/>
      <path d="M100 42 q-8 -10 0 -20 q8 -10 0 -20"/>
      <path d="M122 42 q-8 -10 0 -20 q8 -10 0 -20"/>
    </g>

    <!-- Sparkles -->
    <use class="twinkle" href="#sparkle" x="4" y="58" width="20" height="20" color="#d9264a"/>
    <use class="twinkle t2" href="#sparkle" x="188" y="22" width="16" height="16" color="#6b1230"/>

    <!-- Saucer -->
    <ellipse cx="100" cy="160" rx="84" ry="13" fill="#f7a8c4" stroke="#6b1230" stroke-width="3"/>
    <ellipse cx="100" cy="158" rx="60" ry="7" fill="#fde4ec"/>

    <!-- Handle -->
    <path d="M168 68 H184 Q205 68 205 90 Q205 112 182 112 H164" fill="none" stroke="#6b1230" stroke-width="13" stroke-linecap="round"/>
    <path d="M168 68 H184 Q205 68 205 90 Q205 112 182 112 H164" fill="none" stroke="#fffafc" stroke-width="6" stroke-linecap="round"/>

    <!-- Cup body -->
    <path d="${body}" fill="#fffafc"/>

    <!-- Layers, clipped to the cup shape -->
    <g clip-path="url(#clip-${id})">${rects}</g>

    <!-- Cup outline, rim and shine -->
    <path d="${body}" fill="none" stroke="#6b1230" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="24" y="47" width="152" height="9" rx="4.5" fill="#fffafc" stroke="#6b1230" stroke-width="3"/>
    <path d="M40 72 V92 Q40 126 66 138" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

// Insert the drink cards into the page
const container = document.getElementById("drinks");

drinks.forEach((drink, i) => {
  const legend = drink.layers
    .map((l, j) => `<li tabindex="0" data-i="${j}"><span class="dot" style="background:${l.color}"></span>${l.label}</li>`)
    .join("");

  container.insertAdjacentHTML("beforeend", `
    <article class="card">
      <span class="price">${drink.price}</span>
      <div class="cup-wrap">${cupSVG(drink, i)}</div>
      <h3>${drink.name}</h3>
      <p class="desc">${drink.desc}</p>
      <ul class="legend">${legend}</ul>
    </article>
  `);
});

// Spotlight a layer when you hover / focus / tap its name
document.querySelectorAll(".card").forEach(card => {
  const layers = card.querySelectorAll(".layer");
  const clear = () => {
    card.classList.remove("focus");
    layers.forEach(r => r.classList.remove("active"));
  };
  card.querySelectorAll(".legend li").forEach(li => {
    const show = () => {
      clear();
      card.classList.add("focus");
      layers[li.dataset.i].classList.add("active");
    };
    li.addEventListener("mouseenter", show);
    li.addEventListener("focus", show);
    li.addEventListener("click", show);
    li.addEventListener("mouseleave", clear);
    li.addEventListener("blur", clear);
  });
});

// Scrolling strip of drink names
const track = document.getElementById("marqueeTrack");
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#heart"/></svg>';
const group = `<div class="group">${drinks.map(d => `<span class="item">${d.name}</span>${heart}`).join("")}</div>`;
track.innerHTML = group + group;

// Loyalty card: tap to collect hearts
const stampsBox = document.getElementById("stamps");
const stampMsg = document.getElementById("stampMsg");
const stamps = [];

for (let i = 0; i < 10; i++) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "stamp" + (i === 9 ? " free" : "");
  b.setAttribute("aria-label", i === 9 ? "Free coffee" : `Stamp ${i + 1}`);
  b.innerHTML = i === 9
    ? "FREE"
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#heart"/></svg>';
  if (i < 9) b.addEventListener("click", () => { b.classList.toggle("on"); updateStamps(); });
  stampsBox.appendChild(b);
  stamps.push(b);
}

function updateStamps() {
  const count = stamps.slice(0, 9).filter(b => b.classList.contains("on")).length;
  stamps[9].classList.toggle("ready", count === 9);
  stampMsg.textContent = count === 9
    ? "Yay! Your next coffee is on us ♥"
    : `${count} / 9 hearts collected`;
}

document.getElementById("resetStamps").addEventListener("click", () => {
  stamps.forEach(b => b.classList.remove("on"));
  updateStamps();
});
