const COLORS = [
  { b: '#EEEDFE', f: '#3C3489' },
  { b: '#E1F5EE', f: '#085041' },
  { b: '#FAECE7', f: '#993C1D' },
  { b: '#E6F1FB', f: '#0C447C' },
  { b: '#FAEEDA', f: '#854F0B' },
  { b: '#EAF3DE', f: '#27500A' },
  { b: '#FBEAF0', f: '#72243E' }
];

const state = {
  currentUser: null,
  tree: null,
  modalAction: null
};

const loginScreen = document.getElementById('login-screen');
const treeScreen = document.getElementById('tree-screen');
const loginInput = document.getElementById('login-input');
const usersSection = document.getElementById('users-section');
const usersList = document.getElementById('users-list');
const activeUser = document.getElementById('active-user');
const treeRoot = document.getElementById('tree-root');
const treeWrap = document.getElementById('tree-wrap');
const treeLines = document.getElementById('tree-lines');
const saveIndicator = document.getElementById('save-indicator');
const modal = document.getElementById('name-modal');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-input');

document.getElementById('login-button').addEventListener('click', handleLogin);
document.getElementById('logout-button').addEventListener('click', logout);
document.getElementById('export-pdf-button').addEventListener('click', exportPdf);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-confirm').addEventListener('click', confirmModal);

loginInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
});

modalInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    confirmModal();
  }
});

window.addEventListener('resize', () => {
  if (state.tree) {
    drawLines();
  }
});

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Erreur API.' }));
    throw new Error(payload.message || 'Erreur API.');
  }

  return response.json();
}

async function init() {
  await loadUsers();
}

async function loadUsers() {
  const users = await api('/api/users');
}

async function handleLogin() {
  const username = loginInput.value.trim();
  if (!username) {
    return;
  }

  try {
    setSaveState('Connexion...');
    const user = await api('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username })
    });

    state.currentUser = user;
    state.tree = user.tree;
    activeUser.textContent = user.username;

    loginScreen.classList.add('hidden');
    treeScreen.classList.remove('hidden');
    setSaveState('Tout est sauvegarde');
    renderTree();
    await loadUsers();
  } catch (error) {
    setSaveState(error.message);
    window.alert(error.message);
  }
}

function logout() {
  state.currentUser = null;
  state.tree = null;
  loginInput.value = '';
  loginScreen.classList.remove('hidden');
  treeScreen.classList.add('hidden');
  closeModal();
}

function openModal(title, onConfirm, initialValue = '') {
  state.modalAction = onConfirm;
  modalTitle.textContent = title;
  modalInput.value = initialValue;
  modal.classList.remove('hidden');
  modalInput.focus();
}

function closeModal() {
  state.modalAction = null;
  modal.classList.add('hidden');
  modalInput.value = '';
}

async function confirmModal() {
  const value = modalInput.value.trim();
  if (!value || !state.modalAction) {
    return;
  }

  const action = state.modalAction;
  closeModal();
  await action(value);
}

function renderTree() {
  if (!state.tree || !state.tree.rootId) {
    treeRoot.innerHTML = '';
    return;
  }

  treeRoot.innerHTML = renderFamily(state.tree.rootId);
  bindTreeEvents();

  requestAnimationFrame(() => {
    requestAnimationFrame(drawLines);
  });
}

function renderFamily(familyId) {
  const family = state.tree.fams[familyId];
  const children = family.kids.length
    ? `<div class="family-children">${family.kids.map((kidId) => renderFamily(kidId)).join('')}</div>`
    : '';

  return `
    <article class="family" id="family-${family.id}">
      <div class="couple-row" id="row-${family.id}">
        ${renderPersonCard(family.id, family.p1, family.ci, false)}
        ${
          family.p2
            ? `<div class="link-rings"><span></span><span></span></div>${renderPersonCard(family.id, family.p2, family.ci, true)}
               <div class="family-actions">
                 <button class="inline-add" data-action="add-child" data-family-id="${family.id}">+</button>
                 <small>Enfant</small>
               </div>`
            : `<div class="family-actions">
                 <button class="inline-add" data-action="add-partner" data-family-id="${family.id}">+</button>
                 <small>Partenaire</small>
               </div>`
        }
      </div>
      ${children}
    </article>
  `;
}

function renderPersonCard(familyId, personId, colorIndex, isPartner) {
  const person = state.tree.ppl[personId];
  const color = COLORS[colorIndex];
  const extraButton = isPartner
    ? `<button class="secondary" data-action="remove-partner" data-family-id="${familyId}">Supprimer partenaire</button>`
    : state.tree.rootId !== familyId
      ? `<button class="danger" data-action="delete-branch" data-family-id="${familyId}">Supprimer branche</button>`
      : '';

  return `
    <div class="person-card">
      <div class="person-avatar" style="background:${color.b};color:${color.f}">${escapeHtml(person.ini)}</div>
      <p class="person-name">${escapeHtml(person.name)}</p>
      <div class="person-actions">
        <button class="secondary" data-action="rename-person" data-person-id="${person.id}">Renommer</button>
        ${extraButton}
      </div>
    </div>
  `;
}

function bindTreeEvents() {
  treeRoot.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', async () => {
      const { action, familyId, personId } = element.dataset;

      if (action === 'add-partner') {
        openModal('Nom du partenaire', async (name) => {
          await mutateTree(`/api/trees/${state.currentUser._id}/families/${familyId}/partner`, 'POST', { name });
        });
      }

      if (action === 'add-child') {
        openModal("Nom de l'enfant", async (name) => {
          await mutateTree(`/api/trees/${state.currentUser._id}/families/${familyId}/children`, 'POST', { name });
        });
      }

      if (action === 'rename-person') {
        const currentName = state.tree.ppl[personId]?.name || '';
        openModal('Nouveau nom', async (name) => {
          await mutateTree(`/api/trees/${state.currentUser._id}/people/${personId}`, 'PATCH', { name });
        }, currentName);
      }

      if (action === 'delete-branch') {
        if (window.confirm('Supprimer cette branche et tous ses descendants ?')) {
          await mutateTree(`/api/trees/${state.currentUser._id}/families/${familyId}`, 'DELETE');
        }
      }

      if (action === 'remove-partner') {
        if (window.confirm('Supprimer le partenaire et les descendants de cette union ?')) {
          await mutateTree(`/api/trees/${state.currentUser._id}/families/${familyId}/partner`, 'DELETE');
        }
      }
    });
  });
}

async function mutateTree(path, method, body) {
  try {
    setSaveState('Sauvegarde...');
    state.tree = await api(path, {
      method,
      body: body ? JSON.stringify(body) : undefined
    });
    setSaveState('Tout est sauvegarde');
    renderTree();
  } catch (error) {
    setSaveState(error.message);
    window.alert(error.message);
  }
}

function drawLines() {
  drawLinesFor(treeWrap, treeRoot, treeLines);
}

function drawLinesFor(wrapElement, rootElement, linesElement) {
  const { width, height } = getTreeContentSize(wrapElement, rootElement);
  const wrapBox = wrapElement.getBoundingClientRect();
  linesElement.setAttribute('width', width);
  linesElement.setAttribute('height', height);
  linesElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
  linesElement.style.width = `${width}px`;
  linesElement.style.height = `${height}px`;

  const lines = [];
  Object.values(state.tree.fams).forEach((family) => {
    if (!family.kids.length) {
      return;
    }

    const row = rootElement.querySelector(`#row-${family.id}`);
    if (!row) {
      return;
    }

    const rowBox = row.getBoundingClientRect();
    const parentX = rowBox.left + rowBox.width / 2 - wrapBox.left + wrapElement.scrollLeft;
    const parentY = rowBox.bottom - wrapBox.top + wrapElement.scrollTop;

    const childCoords = family.kids
      .map((kidId) => {
        const childRow = rootElement.querySelector(`#row-${kidId}`);
        if (!childRow) {
          return null;
        }

        const childBox = childRow.getBoundingClientRect();
        return {
          x: childBox.left + childBox.width / 2 - wrapBox.left + wrapElement.scrollLeft,
          y: childBox.top - wrapBox.top + wrapElement.scrollTop
        };
      })
      .filter(Boolean);

    if (!childCoords.length) {
      return;
    }

    const minX = Math.min(...childCoords.map((coord) => coord.x));
    const maxX = Math.max(...childCoords.map((coord) => coord.x));
    const midY = parentY + (childCoords[0].y - parentY) * 0.45;

    lines.push(`<line x1="${parentX}" y1="${parentY}" x2="${parentX}" y2="${midY}" stroke="#b9a27d" stroke-width="1.5" />`);
    lines.push(`<line x1="${minX}" y1="${midY}" x2="${maxX}" y2="${midY}" stroke="#b9a27d" stroke-width="1.5" />`);
    childCoords.forEach((coord) => {
      lines.push(`<line x1="${coord.x}" y1="${midY}" x2="${coord.x}" y2="${coord.y}" stroke="#b9a27d" stroke-width="1.5" />`);
    });
  });

  linesElement.innerHTML = lines.join('');
}

function getTreeContentSize(wrapElement = treeWrap, rootElement = treeRoot) {
  const styles = window.getComputedStyle(wrapElement);
  const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

  const width = Math.max(
    wrapElement.scrollWidth,
    Math.ceil(rootElement.scrollWidth + paddingX)
  );
  const height = Math.max(
    wrapElement.scrollHeight,
    Math.ceil(rootElement.scrollHeight + paddingY)
  );

  return { width, height };
}

function createExportSurface() {
  const clone = treeWrap.cloneNode(true);
  clone.id = 'tree-wrap-export';
  const cloneRoot = clone.querySelector('#tree-root');
  const cloneLines = clone.querySelector('#tree-lines');

  clone.style.position = 'fixed';
  clone.style.left = '-100000px';
  clone.style.top = '0';
  clone.style.maxWidth = 'none';
  clone.style.maxHeight = 'none';
  clone.style.overflow = 'visible';
  clone.style.minHeight = '0';
  clone.style.width = 'max-content';
  clone.style.height = 'max-content';
  clone.style.background = '#fffdf8';
  clone.scrollLeft = 0;
  clone.scrollTop = 0;
  document.body.appendChild(clone);

  const { width, height } = getTreeContentSize(clone, cloneRoot);
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  drawLinesFor(clone, cloneRoot, cloneLines);

  return { clone, width, height };
}

async function exportPdf() {
  const button = document.getElementById('export-pdf-button');

  button.disabled = true;
  button.textContent = 'Generation...';

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  drawLines();

  const { clone: exportSurface, width, height } = createExportSurface();

  try {
    const canvas = await window.html2canvas(exportSurface, {
      scale: 2,
      backgroundColor: '#fffdf8',
      useCORS: true,
      logging: false,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'l' : 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const titleY = 9;
    const contentStartY = 14;
    const renderWidth = pageWidth - margin * 2;
    const renderHeight = (canvas.height * renderWidth) / canvas.width;
    const firstPageAvailableHeight = pageHeight - contentStartY - margin;
    const otherPagesAvailableHeight = pageHeight - margin * 2;
    const imageData = canvas.toDataURL('image/png');

    pdf.text(`Arbre genealogique - ${state.currentUser.username}`, pageWidth / 2, titleY, { align: 'center' });
    pdf.addImage(imageData, 'PNG', margin, contentStartY, renderWidth, renderHeight);

    let consumedHeight = firstPageAvailableHeight;
    while (consumedHeight < renderHeight) {
      pdf.addPage();
      pdf.addImage(imageData, 'PNG', margin, margin - consumedHeight, renderWidth, renderHeight);
      consumedHeight += otherPagesAvailableHeight;
    }

    pdf.save(`arbre_${state.currentUser.username.replace(/\s+/g, '_')}.pdf`);
    setSaveState('PDF exporte');
  } catch (error) {
    window.alert("Erreur lors de l'export PDF.");
  } finally {
    exportSurface.remove();
    drawLines();
    button.disabled = false;
    button.textContent = 'Exporter PDF';
  }
}

function setSaveState(message) {
  saveIndicator.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

init().catch((error) => {
  console.error(error);
  setSaveState(error.message);
});
