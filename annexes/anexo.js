document.addEventListener("DOMContentLoaded", () => {
  const btnBack = document.getElementById("btnBack");
  const form = document.getElementById("annexForm");
  if (!form) return;

  const tableRows = document.getElementById("tableRows");
  const btnAddRow = document.getElementById("btnAddRow");
  const indeferidosList = document.getElementById("indeferidosList");
  const btnAddIndeferido = document.getElementById("btnAddIndeferido");

  // Funções de criação de elementos
  function createInput(type, name, placeholder, value = "") {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.value = value;
    return input;
  }

  // Adicionar linha na tabela (Lógica dinâmica por anexo)
  function addRow(data = {}) {
    if (!tableRows) return;
    const tr = document.createElement("tr");
    const isAnexoV = document.title.includes("Anexo V");

    if (isAnexoV) {
      // Estrutura específica Anexo V
      const count = tableRows.children.length + 1;
      tr.innerHTML = `
        <td>${count}º</td>
        <td><input type="text" name="candidato_nome[]" value="${data.nome || ""}"></td>
        <td><input type="text" name="candidato_rg[]" value="${data.rg || ""}"></td>
        <td><input type="checkbox" name="aulas_fatec[]" ${data.aulas ? "checked" : ""}></td>
        <td>
          <select name="contrato[]" style="width:100%; padding:8px; border:1px solid #ddd;">
            <option value="selecionar">selecionar</option>
            <option value="C.T." ${data.contrato === "C.T." ? "selected" : ""}>C.T.</option>
            <option value="P.S." ${data.contrato === "P.S." ? "selected" : ""}>P.S.</option>
          </select>
        </td>
        <td><input type="number" name="pontos[]" value="${data.pontos || "0"}"></td>
        <td><button type="button" class="row-remove">×</button></td>
      `;
    } else {
      // Estrutura padrão (Anexo I)
      tr.innerHTML = `
        <td><input type="text" name="disciplina[]" value="${data.disciplina || ""}"></td>
        <td><input type="number" name="carga[]" step="0.5" value="${data.carga || ""}"></td>
        <td><input type="text" name="turno[]" value="${data.turno || ""}"></td>
        <td><input type="text" name="curso[]" value="${data.curso || ""}"></td>
        <td><input type="text" name="fatec[]" value="${data.fatec || ""}"></td>
        <td><button type="button" class="row-remove">×</button></td>
      `;
      tr.querySelector('input[name="carga[]"]').addEventListener(
        "input",
        updateTotal,
      );
    }

    tr.querySelector(".row-remove").addEventListener("click", () => {
      tr.remove();
      if (isAnexoV) refreshRankings();
      updateTotal();
    });

    tableRows.appendChild(tr);
    updateTotal();
  }

  function refreshRankings() {
    Array.from(tableRows.children).forEach((tr, i) => {
      tr.cells[0].textContent = `${i + 1}º`;
    });
  }

  // Lista de Indeferidos (Anexo V)
  function addIndeferido(rg = "") {
    if (!indeferidosList) return;
    const div = document.createElement("div");
    div.className = "indeferido-item";
    div.innerHTML = `
      <input type="text" name="indeferido_rg[]" placeholder="RG do Candidato" value="${rg}">
      <button type="button" class="row-remove">×</button>
    `;
    div
      .querySelector(".row-remove")
      .addEventListener("click", () => div.remove());
    indeferidosList.appendChild(div);
  }

  function updateTotal() {
    const totalHours = document.getElementById("totalHours");
    if (!totalHours) return;
    let total = 0;
    tableRows.querySelectorAll('input[name="carga[]"]').forEach((input) => {
      total += parseFloat(input.value || 0);
    });
    totalHours.textContent = total;
  }

  // Eventos de Botões
  if (btnAddRow) btnAddRow.addEventListener("click", () => addRow());
  if (btnAddIndeferido)
    btnAddIndeferido.addEventListener("click", () => addIndeferido());

  // Submit e LocalStorage (Mantido e adaptado)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (key.endsWith("[]")) {
        if (!data[key]) data[key] = [];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });
    localStorage.setItem(`pdforms-${document.title}`, JSON.stringify(data));
    alert("Salvo com sucesso!");
  });

  // Inicialização
  if (tableRows && tableRows.children.length === 0) addRow();
  if (indeferidosList && indeferidosList.children.length === 0) addIndeferido();

  btnBack?.addEventListener("click", () => window.history.back());
});
