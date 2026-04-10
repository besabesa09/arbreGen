const COLORS = [
  { b: '#EEEDFE', f: '#3C3489' },
  { b: '#E1F5EE', f: '#085041' },
  { b: '#FAECE7', f: '#993C1D' },
  { b: '#E6F1FB', f: '#0C447C' },
  { b: '#FAEEDA', f: '#854F0B' },
  { b: '#EAF3DE', f: '#27500A' },
  { b: '#FBEAF0', f: '#72243E' }
];

function createInitialTree(username) {
  const tree = { fams: {}, ppl: {}, nid: 1, cc: 0, rootId: null };
  const personId = createPerson(tree, username);
  tree.rootId = createFamily(tree, personId);
  return tree;
}

function nextId(tree) {
  const id = `n${tree.nid}`;
  tree.nid += 1;
  return id;
}

function initialsFromName(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

function createPerson(tree, name) {
  const normalizedName = String(name || '').trim();
  if (!normalizedName) {
    throw createBadRequest('Le nom est obligatoire.');
  }

  const id = nextId(tree);
  tree.ppl[id] = {
    id,
    name: normalizedName,
    ini: initialsFromName(normalizedName)
  };
  return id;
}

function createFamily(tree, parentOneId) {
  const id = nextId(tree);
  const ci = tree.cc % COLORS.length;

  tree.cc += 1;
  tree.fams[id] = {
    id,
    p1: parentOneId,
    p2: null,
    kids: [],
    ci
  };
  return id;
}

function cloneTree(tree) {
  return JSON.parse(JSON.stringify(tree));
}

function ensureTreeShape(tree) {
  if (!tree || typeof tree !== 'object') {
    throw createBadRequest('Arbre invalide.');
  }

  if (!tree.fams || !tree.ppl || typeof tree.nid !== 'number' || typeof tree.cc !== 'number') {
    throw createBadRequest("La structure de l'arbre est invalide.");
  }

  return tree;
}

function addPartner(tree, familyId, partnerName) {
  const family = tree.fams[familyId];
  if (!family) {
    throw createNotFound('Famille introuvable.');
  }
  if (family.p2) {
    throw createBadRequest('Cette famille a deja un partenaire.');
  }

  family.p2 = createPerson(tree, partnerName);
  return tree;
}

function addChild(tree, familyId, childName) {
  const family = tree.fams[familyId];
  if (!family) {
    throw createNotFound('Famille introuvable.');
  }
  if (!family.p2) {
    throw createBadRequest("Ajoutez d'abord un partenaire avant de creer un enfant.");
  }

  const childId = createPerson(tree, childName);
  const childFamilyId = createFamily(tree, childId);
  family.kids.push(childFamilyId);
  return tree;
}

function updatePerson(tree, personId, name) {
  const person = tree.ppl[personId];
  if (!person) {
    throw createNotFound('Personne introuvable.');
  }

  const normalizedName = String(name || '').trim();
  if (!normalizedName) {
    throw createBadRequest('Le nom est obligatoire.');
  }

  person.name = normalizedName;
  person.ini = initialsFromName(normalizedName);
  return tree;
}

function deleteFamilyBranch(tree, familyId) {
  if (!tree.fams[familyId]) {
    throw createNotFound('Famille introuvable.');
  }
  if (tree.rootId === familyId) {
    throw createBadRequest("La racine de l'arbre ne peut pas etre supprimee.");
  }

  const parentFamily = Object.values(tree.fams).find((family) => family.kids.includes(familyId));
  if (!parentFamily) {
    throw createBadRequest('Impossible de detacher cette branche.');
  }

  parentFamily.kids = parentFamily.kids.filter((kidId) => kidId !== familyId);
  removeFamilyRecursively(tree, familyId);
  return tree;
}

function removePartner(tree, familyId) {
  const family = tree.fams[familyId];
  if (!family) {
    throw createNotFound('Famille introuvable.');
  }
  if (!family.p2) {
    throw createBadRequest('Aucun partenaire a supprimer.');
  }

  delete tree.ppl[family.p2];
  family.p2 = null;
  family.kids.forEach((kidId) => removeFamilyRecursively(tree, kidId));
  family.kids = [];
  return tree;
}

function removeFamilyRecursively(tree, familyId) {
  const family = tree.fams[familyId];
  if (!family) {
    return;
  }

  family.kids.forEach((kidId) => removeFamilyRecursively(tree, kidId));
  delete tree.ppl[family.p1];
  if (family.p2) {
    delete tree.ppl[family.p2];
  }
  delete tree.fams[familyId];
}

function createBadRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function createNotFound(message) {
  const error = new Error(message);
  error.status = 404;
  return error;
}

module.exports = {
  COLORS,
  cloneTree,
  createInitialTree,
  ensureTreeShape,
  addPartner,
  addChild,
  updatePerson,
  deleteFamilyBranch,
  removePartner
};
