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
    const isTableRanking =
      document.title.includes("Anexo V") ||
      document.title.includes("Anexo VII");

    if (isTableRanking) {
      // Estrutura específica Anexo V
      const count = tableRows.children.length + 1;
      tr.innerHTML = `
        <td>${count}º</td>
        <td><input type="text" name="candidato_nome[]" value="${data.nome || ""}"></td>
        <td><input type="text" name="candidato_rg[]" value="${data.rg || ""}"></td>
        <td><input type="checkbox" name="aulas_fatec[]" ${data.aulas ? "checked" : ""}></td>
        <td>
          <select name="contrato[]" required>
            <option value="" disabled selected>selecionar</option>
            <option value="DETERMINADO" ${data.contrato === "Determinado" ? "selected" : ""}>Determinado</option>
            <option value="INDETERMINADO" ${data.contrato === "Indeterminado" ? "selected" : ""}>Indeterminado</option>
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
      if (isTableRanking) refreshRankings();
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

    // Determinar qual função de validação usar baseada no título da página
    let validationResult = { isValid: true, message: "Formulário válido" };

    if (document.title.includes("Anexo I")) {
      validationResult = window.validateAnexoI
        ? window.validateAnexoI()
        : validationResult;
    } else if (document.title.includes("Anexo II")) {
      validationResult = window.validateAnexoII
        ? window.validateAnexoII()
        : validationResult;
    } else if (document.title.includes("Anexo III")) {
      validationResult = window.validateAnexoIII
        ? window.validateAnexoIII()
        : validationResult;
    } else if (document.title.includes("Anexo V")) {
      validationResult = window.validateAnexoV
        ? window.validateAnexoV()
        : validationResult;
    } else if (document.title.includes("Anexo VII")) {
      validationResult = window.validateAnexoVII
        ? window.validateAnexoVII()
        : validationResult;
    } else if (document.title.includes("Anexo VIII")) {
      validationResult = window.validateAnexoVIII
        ? window.validateAnexoVIII()
        : validationResult;
    } else if (document.title.includes("Anexo IX")) {
      validationResult = window.validateAnexoIX
        ? window.validateAnexoIX()
        : validationResult;
    } else if (document.title.includes("Anexo X")) {
      validationResult = window.validateAnexoX
        ? window.validateAnexoX()
        : validationResult;
    }

    if (!validationResult.isValid) {
      alert(`Erro na validação: ${validationResult.message}`);
      return;
    }

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

  // Anexo III: Tabela de Indeferimento
  const indeferimentoRows = document.getElementById("indeferimentoRows");
  const btnAddIndeferimento = document.getElementById("btnAddIndeferimento");

  function addIndeferimentoRow(data = {}) {
    if (!indeferimentoRows) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" name="indf_exame[]" placeholder="Exame" value="${data.exame || ""}"></td>
      <td><input type="text" name="indf_pontuacao[]" placeholder="Pontuação mínima" value="${data.pontuacao || ""}"></td>
      <td><input type="text" name="indf_validade[]" placeholder="Validade" value="${data.validade || "5 anos"}"></td>
      <td><button type="button" class="row-remove">×</button></td>
    `;
    tr.querySelector(".row-remove").addEventListener("click", () =>
      tr.remove(),
    );
    indeferimentoRows.appendChild(tr);
  }

  if (btnAddIndeferimento) {
    btnAddIndeferimento.addEventListener("click", () => addIndeferimentoRow());
    // Inicializa com uma linha se estiver vazia
    if (indeferimentoRows && indeferimentoRows.children.length === 0) {
      addIndeferimentoRow({ validade: "5 anos" });
    }
  }

  // Botão Limpar Formulário
  const btnClear = document.getElementById("btnClear");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (
        confirm(
          "Tem certeza que deseja limpar todo o formulário? Esta ação não pode ser desfeita.",
        )
      ) {
        // Determinar qual função de limpeza usar baseada no título da página
        if (document.title.includes("Anexo I") && window.clearAnexoIForm) {
          window.clearAnexoIForm();
        } else if (
          document.title.includes("Anexo II") &&
          window.clearAnexoIIForm
        ) {
          window.clearAnexoIIForm();
        } else if (
          document.title.includes("Anexo III") &&
          window.clearAnexoIIIForm
        ) {
          window.clearAnexoIIIForm();
        } else if (
          document.title.includes("Anexo V") &&
          window.clearAnexoVForm
        ) {
          window.clearAnexoVForm();
        } else if (
          document.title.includes("Anexo VII") &&
          window.clearAnexoVIIForm
        ) {
          window.clearAnexoVIIForm();
        } else if (
          document.title.includes("Anexo VIII") &&
          window.clearAnexoVIIIForm
        ) {
          window.clearAnexoVIIIForm();
        } else if (
          document.title.includes("Anexo IX") &&
          window.clearAnexoIXForm
        ) {
          window.clearAnexoIXForm();
        } else if (
          document.title.includes("Anexo X") &&
          window.clearAnexoXForm
        ) {
          window.clearAnexoXForm();
        } else {
          // Fallback genérico
          form.reset();
          const tableRows = document.getElementById("tableRows");
          if (tableRows) tableRows.innerHTML = "";
          const indeferimentoRows =
            document.getElementById("indeferimentoRows");
          if (indeferimentoRows) indeferimentoRows.innerHTML = "";
          const indeferidosList = document.getElementById("indeferidosList");
          if (indeferidosList) indeferidosList.innerHTML = "";
        }
      }
    });
  }

  btnBack?.addEventListener(
    "click",
    () => (window.location.href = "../index.html"),
  );
});
