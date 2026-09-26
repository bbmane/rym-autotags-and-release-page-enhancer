// https://rateyourmusic.com/genres/

// Trova tutti i pulsanti "Show subgenres" e li clicca in sequenza
document.querySelectorAll('.button_expand').forEach(button => {
    button.click();
});


(() => {
  const childrenMap = new Map(); // parent -> Set(children)
  const parentMap = new Map();   // child -> parent
  const genreOrder = [];        // Mantiene l'ordine esatto di comparsa nel DOM

  // Helper per ripulire il testo del genere
  const clean = text => text ? text.trim().toLowerCase().replace(/\s+/g, ' ') : '';

  // 1. Scansione di tutti i nodi lista in ordine DOM (la tua logica funzionante)
  const items = document.querySelectorAll('li, div.genre, tr, .genre_row');

  items.forEach(el => {
    const mainA = el.querySelector(':scope > a, :scope > span > a, :scope > .genre_name, a.genre');
    if (!mainA) return;
    const parentName = clean(mainA.textContent);
    if (!parentName) return;

    if (!childrenMap.has(parentName)) {
      childrenMap.set(parentName, new Set());
      genreOrder.push(parentName);
    }

    const childLinks = el.querySelectorAll('ul a, ol a, .subgenres a, .children a');
    childLinks.forEach(cA => {
      const childName = clean(cA.textContent);
      if (childName && childName !== parentName) {
        childrenMap.get(parentName).add(childName);
        if (!parentMap.has(childName)) {
          parentMap.set(childName, parentName);
        }
      }
    });
  });

  // Fallback basato su indentazione
  if (genreOrder.length === 0) {
    let lastParentsByLevel = {};

    document.querySelectorAll('a[href*="/genre/"]').forEach(a => {
      const name = clean(a.textContent);
      if (!name) return;

      const li = a.closest('li');
      let level = 0;
      let curr = li;
      while (curr && curr !== document.body) {
        if (curr.tagName === 'UL' || curr.tagName === 'OL') level++;
        curr = curr.parentElement;
      }

      lastParentsByLevel[level] = name;

      if (level > 1 && lastParentsByLevel[level - 1]) {
        const parentName = lastParentsByLevel[level - 1];
        if (!childrenMap.has(parentName)) {
          childrenMap.set(parentName, new Set());
          genreOrder.push(parentName);
        }
        childrenMap.get(parentName).add(name);
        if (!parentMap.has(name)) {
          parentMap.set(name, parentName);
        }
      }
    });
  }

  // 2. Helper per calcolare la profondità di un genere
  function getDepth(genre) {
    let depth = 0;
    let curr = genre;
    while (parentMap.has(curr)) {
      depth++;
      curr = parentMap.get(curr);
    }
    return depth;
  }

  // Helper per raccogliere tutti i discendenti di un genere
  function getAllDescendants(node) {
    let desc = [];
    if (childrenMap.has(node)) {
      for (const child of childrenMap.get(node)) {
        desc.push(child);
        desc = desc.concat(getAllDescendants(child));
      }
    }
    return desc;
  }

  // 3. Individua i macro-generi radice (quelli senza genitore superiore)
  const roots = genreOrder.filter(g => !parentMap.has(g) && childrenMap.has(g) && childrenMap.get(g).size > 0);

  // 4. Generazione dell'output con raggruppamento e ordinamento corretto
  let output = '// --- GENERATED GROUP_MAP ---\nconst GROUP_MAP = [\n';

  roots.forEach(root => {
    output += `  // --- ${root.toUpperCase()} ---\n`;

    // Raccoglie tutti i generi padri all'interno di questo macro-albero
    const descendants = getAllDescendants(root);
    const subParents = Array.from(new Set([root, ...descendants]))
      .filter(g => childrenMap.has(g) && childrenMap.get(g).size > 0);

    // Ordina i padri per profondità decrescente (i più profondi prima, la radice per ultima)
    subParents.sort((a, b) => getDepth(b) - getDepth(a));

    subParents.forEach(p => {
      const children = Array.from(childrenMap.get(p));
      // Includiamo sia il genitore che i suoi figli nella proprietà list
      const fullList = Array.from(new Set([p, ...children])).sort();
      
      output += `  { list: ${JSON.stringify(fullList)}, add: () => ["${p}"] },\n`;
    });
  });

  output += '];';

  console.log(output);

  if (typeof copy === 'function') {
    copy(output);
    console.log(`✅ GROUP_MAP generata con successo e copiata negli appunti!`);
  }
})();




