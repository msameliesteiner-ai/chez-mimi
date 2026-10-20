// Farben der Schichten
const C = {
  crema:   "#c98d55",
  espresso:"#3b2314",
  coffee:  "#6b4126",
  mix:     "#a9774d",
  milk:    "#ecd9bd",
  foam:    "#fbf4ea",
  cream:   "#fffdf7"
};

// Alle Getränke: Schichten von OBEN nach UNTEN
// share = Anteil der Schicht, fill = wie voll die Tasse ist (0 bis 1)
const drinks = [
  {
    name: "Espresso", price: "2,60 €", fill: 0.45,
    desc: "Kurz, kräftig, pur.",
    layers: [
      { label: "Crema", color: C.crema, share: 18 },
      { label: "Espresso", color: C.espresso, share: 82 }
    ]
  },
  {
    name: "Cappuccino", price: "3,90 €", fill: 0.95,
    desc: "Espresso, heiße Milch und eine Haube aus Milchschaum.",
    layers: [
      { label: "Milchschaum", color: C.foam, share: 32 },
      { label: "Heiße Milch", color: C.milk, share: 33 },
      { label: "Espresso", color: C.espresso, share: 35 }
    ]
  },
  {
    name: "Latte Macchiato", price: "4,20 €", fill: 1,
    desc: "Viel Milch, ein Schuss Espresso – schön geschichtet.",
    layers: [
      { label: "Milchschaum", color: C.foam, share: 14 },
      { label: "Heiße Milch", color: C.milk, share: 56 },
      { label: "Espresso", color: C.espresso, share: 30 }
    ]
  },
  {
    name: "Flat White", price: "4,00 €", fill: 0.85,
    desc: "Doppelter Espresso mit samtigem Mikroschaum.",
    layers: [
      { label: "Mikroschaum", color: C.foam, share: 12 },
      { label: "Samtmilch", color: C.milk, share: 38 },
      { label: "Doppelter Espresso", color: C.espresso, share: 50 }
    ]
  },
  {
    name: "Wiener Melange", price: "4,10 €", fill: 0.95,
    desc: "Der Wiener Klassiker: Kaffee, Milch und Milchschaum.",
    layers: [
      { label: "Milchschaum", color: C.foam, share: 25 },
      { label: "Heiße Milch", color: C.milk, share: 30 },
      { label: "Kaffee", color: C.coffee, share: 45 }
    ]
  },
  {
    name: "Einspänner", price: "4,50 €", fill: 0.95,
    desc: "Starker Mokka unter einer Haube aus Schlagobers.",
    layers: [
      { label: "Schlagobers", color: C.cream, share: 38 },
      { label: "Mokka", color: C.espresso, share: 62 }
    ]
  }
];

// Tasse als SVG zeichnen
function cupSVG(drink, id) {
  const bottom = 150;          // Boden der Tasse
  const maxHeight = 94;        // maximale Füllhöhe
  const total = maxHeight * drink.fill;
  let y = bottom - total;      // Start oben im Getränk
  let rects = "";

  drink.layers.forEach(layer => {
    const h = total * layer.share / 100;
    rects += `<rect x="25" y="${y.toFixed(1)}" width="150" height="${(h + 0.6).toFixed(1)}" fill="${layer.color}"/>`;
    y += h;
  });

  return `
  <svg class="cup" viewBox="0 0 220 190" role="img" aria-label="${drink.name} im Querschnitt">
    <defs>
      <clipPath id="clip-${id}">
        <path d="M30 52 H170 V92 Q170 150 100 150 Q30 150 30 92 Z"/>
      </clipPath>
    </defs>

    <!-- Dampf -->
    <g class="steam">
      <path d="M80 38 q-8 -10 0 -20 q8 -10 0 -20" transform="translate(0,22)"/>
      <path d="M100 38 q-8 -10 0 -20 q8 -10 0 -20" transform="translate(0,22)"/>
      <path d="M120 38 q-8 -10 0 -20 q8 -10 0 -20" transform="translate(0,22)"/>
    </g>

    <!-- Untertasse -->
    <ellipse cx="100" cy="160" rx="82" ry="12" fill="#e7d6bd"/>
    <ellipse cx="100" cy="157" rx="62" ry="8" fill="#f3e6d1"/>

    <!-- Henkel -->
    <path d="M168 66 H182 Q204 66 204 88 Q204 110 180 110 H165"
          fill="none" stroke="#f6efe4" stroke-width="9" stroke-linecap="round"/>
    <path d="M168 66 H182 Q204 66 204 88 Q204 110 180 110 H165"
          fill="none" stroke="#d8c7ae" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Tasse (Körper) -->
    <path d="M30 52 H170 V92 Q170 150 100 150 Q30 150 30 92 Z" fill="#fbf7f0"/>

    <!-- Schichten, auf die Tassenform zugeschnitten -->
    <g clip-path="url(#clip-${id})">${rects}</g>

    <!-- Tassen-Rand und Glanz -->
    <path d="M30 52 H170 V92 Q170 150 100 150 Q30 150 30 92 Z"
          fill="none" stroke="#d8c7ae" stroke-width="2"/>
    <path d="M40 70 V92 Q40 128 70 140" fill="none" stroke="#fff" stroke-opacity="0.45"
          stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

// Karten in die Seite einfügen
const container = document.getElementById("drinks");

drinks.forEach((drink, i) => {
  const legend = drink.layers
    .map(l => `<li><span class="dot" style="background:${l.color}"></span>${l.label}</li>`)
    .join("");

  container.insertAdjacentHTML("beforeend", `
    <article class="card">
      ${cupSVG(drink, i)}
      <h3>${drink.name}</h3>
      <p class="price">${drink.price}</p>
      <p class="desc">${drink.desc}</p>
      <ul class="legend">${legend}</ul>
    </article>
  `);
});
