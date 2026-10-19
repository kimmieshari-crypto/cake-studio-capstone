/* Cake Studio interactions: read choices, update the preview, and calculate demo prices. */
'use strict';

// Keep prices together so changing the menu later is straightforward.
const BASE_PRICES = { '1': 25, '2': 45 };
const DECORATION_PRICES = { Sprinkles: 5, Flowers: 8, Butterflies: 6, Pearls: 5 };
const COLORS = {
  Pink: ['#f5a3c4', '#ffd4e6'], Lavender: ['#c6a6f4', '#e8d7ff'],
  White: ['#fff8ee', '#ffffff'], Blue: ['#96d6f2', '#d7f2ff'],
  Mint: ['#a8dfbe', '#ddf7e5'], Yellow: ['#ffe39a', '#fff2c6'],
  Peach: ['#ffc0aa', '#ffe1d6'], Cocoa: ['#b98169', '#d8aa95']
};
const DECORATION_EMOJIS = { Flowers: '🌸', Butterflies: '🦋', Pearls: '✨' };

const byId = id => document.getElementById(id);
const selected = name => document.querySelector(`input[name="${name}"]:checked`).value;
const selectedDecorations = () => [...document.querySelectorAll('input[name="decoration"]:checked')].map(input => input.value);
const money = amount => `$${amount.toFixed(2)}`;

// Read the form once for each update to keep the display and total consistent.
function getDesign() {
  const tiers = selected('tiers');
  const decorations = selectedDecorations();
  return {
    tiers, flavor: selected('flavor'), frosting: selected('frosting'),
    decorations, message: byId('cake-message').value.trim(),
    total: BASE_PRICES[tiers] + decorations.reduce((sum, name) => sum + DECORATION_PRICES[name], 0)
  };
}

function renderDecorations(container, decorations) {
  // Rebuild decorative elements without injecting any user-provided HTML.
  container.replaceChildren();
  if (decorations.includes('Sprinkles')) {
    const sprinkles = document.createElement('div');
    sprinkles.className = 'sprinkle-overlay';
    container.append(sprinkles);
  }
  for (const name of decorations) {
    if (!DECORATION_EMOJIS[name]) continue;
    const symbol = document.createElement('span');
    symbol.className = 'decoration-emoji';
    symbol.textContent = DECORATION_EMOJIS[name];
    container.append(symbol);
  }
}

function updateDesign() {
  const design = getDesign();
  const cake = byId('cake-art');
  cake.classList.toggle('two-tiers', design.tiers === '2');
  cake.style.setProperty('--cake', COLORS[design.frosting][0]);
  cake.style.setProperty('--cake-light', COLORS[design.frosting][1]);
  cake.setAttribute('aria-label', `${design.frosting} ${design.tiers === '2' ? 'two-tier' : 'one-tier'} ${design.flavor} cake with ${design.decorations.join(', ') || 'no decorations'}`);
  renderDecorations(byId('cake-decor'), design.decorations);
  renderDecorations(byId('top-decor'), design.decorations);
  byId('summary-tiers').textContent = design.tiers === '2' ? 'Two Tiers' : 'One Tier';
  byId('summary-flavor').textContent = design.flavor;
  byId('summary-frosting').textContent = design.frosting;
  byId('summary-decorations').textContent = design.decorations.join(', ') || 'None';
  byId('total-price').textContent = money(design.total);
  // An existing receipt becomes stale after any edit, so hide it until requested again.
  byId('receipt').hidden = true;
}

// Display a local, non-purchasing summary of the current selections.
function showSummary() {
  const design = getDesign();
  const receipt = byId('receipt');
  receipt.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = 'Your Sweet Creation';
  receipt.append(heading);
  const lines = [
    `Cake: ${design.tiers === '2' ? 'Two Tiers' : 'One Tier'}`,
    `Flavor: ${design.flavor}`,
    `Frosting: ${design.frosting}`,
    `Decorations: ${design.decorations.join(', ') || 'None'}`,
    ...(design.message ? [`Message: ${design.message}`] : []),
    `Estimated total: ${money(design.total)}`
  ];
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    receipt.append(p);
  }
  receipt.hidden = false;
}

function resetDesign() {
  document.querySelector('input[name="tiers"][value="1"]').checked = true;
  document.querySelector('input[name="flavor"][value="Vanilla"]').checked = true;
  document.querySelector('input[name="frosting"][value="Pink"]').checked = true;
  document.querySelectorAll('input[name="decoration"]').forEach(input => { input.checked = false; });
  byId('cake-message').value = '';
  updateDesign();
}

document.querySelectorAll('input[name="tiers"], input[name="flavor"], input[name="frosting"], input[name="decoration"]').forEach(input => input.addEventListener('change', updateDesign));
byId('cake-message').addEventListener('input', updateDesign);
byId('summary-button').addEventListener('click', showSummary);
byId('reset-button').addEventListener('click', resetDesign);
updateDesign();
