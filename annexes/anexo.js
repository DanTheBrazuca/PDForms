document.addEventListener("DOMContentLoaded", () => {
  const btnBack = document.getElementById("btnBack");
  const form = document.getElementById("annexForm");
  if (!form) return;

  const tableRows = document.getElementById("tableRows");
  const miniTableRows = document.getElementById("miniTableRows");
  const btnAddRow = document.getElementById("btnAddRow");
  const btnAddMiniRow = document.getElementById("btnAddMiniRow");
  const indeferidosList = document.getElementById("indeferidosList");
  const btnAddIndeferido = document.getElementById("btnAddIndeferido");

  function restoreCheckedGroup(name, values) {
    if (!Array.isArray(values)) return;
    const inputs = form.querySelectorAll(`[name="${name}"]`);
    if (!inputs.length) return;

    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = values.includes(input.value);
      }
    });
  }

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
            <option value="DETERMINADO" ${data.contrato === "DETERMINADO" ? "selected" : ""}>Determinado</option>
            <option value="INDETERMINADO" ${data.contrato === "INDETERMINADO" ? "selected" : ""}>Indeterminado</option>
          </select>
        </td>
        <td><input type="number" name="pontos[]" value="${data.pontos || "0"}"></td>
        <td><button type="button" class="row-remove">×</button></td>
      `;
    } else {
      // Estrutura padrão (Anexo I)
      tr.innerHTML = `
        <td><input type="text" name="disciplina[]" value="${data.disciplina || ""}"></td>
        <td><input type="number" name="carga[]" step="0.5" value="${data.carga || ""}" data-numeric></td>
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

  //tabela de indeferimento do anexo VII
  function addMiniRow(data = {}) {
  if (!miniTableRows) return;

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="text" name="rg_candidato_indeferimento[]" value="${data.rg_indeferimento || ""}"></td>
    <td><textarea name="justificativa_indeferimento[]">${data.justificativa_indeferimento || ""}</textarea></td>
    <td><button type="button" class="row-remove">×</button></td>
  `;

  tr.querySelector(".row-remove").addEventListener("click", () => {
    tr.remove();
  });

  miniTableRows.appendChild(tr);
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

  function loadSavedData() {
    const saved = localStorage.getItem(`pdforms-${document.title}`);
    if (!saved) return false;

    let data;
    try {
      data = JSON.parse(saved);
    } catch (error) {
      return false;
    }

    for (const [key, value] of Object.entries(data)) {
      if (key.endsWith("[]")) continue;
      const elements = form.querySelectorAll(`[name="${key}"]`);
      elements.forEach((input) => {
        if (input.type === "checkbox" || input.type === "radio") {
          input.checked = Array.isArray(value)
            ? value.includes(input.value)
            : input.value === value;
        } else {
          input.value = value;
        }
      });
    }

    if (document.title.includes("Anexo III")) {
      restoreCheckedGroup("virtude[]", data["virtude[]"]);
      restoreCheckedGroup("dias[]", data["dias[]"]);
    }

    if (tableRows) {
      const isTableRanking =
        document.title.includes("Anexo V") ||
        document.title.includes("Anexo VII");
      const rowKeys = isTableRanking
        ? [
            "candidato_nome[]",
            "candidato_rg[]",
            "aulas_fatec[]",
            "contrato[]",
            "pontos[]",
          ]
        : ["disciplina[]", "carga[]", "turno[]", "curso[]", "fatec[]"];
      const rowCount = Array.isArray(data[rowKeys[0]])
        ? data[rowKeys[0]].length
        : 0;

      if (rowCount > 0) {
        tableRows.innerHTML = "";
        for (let i = 0; i < rowCount; i += 1) {
          if (isTableRanking) {
            addRow({
              nome: data["candidato_nome[]"]?.[i] || "",
              rg: data["candidato_rg[]"]?.[i] || "",
              aulas: data["aulas_fatec[]"]?.[i] || "",
              contrato: data["contrato[]"]?.[i] || "",
              pontos: data["pontos[]"]?.[i] || "0",
            });
          } else {
            addRow({
              disciplina: data["disciplina[]"]?.[i] || "",
              carga: data["carga[]"]?.[i] || "",
              turno: data["turno[]"]?.[i] || "",
              curso: data["curso[]"]?.[i] || "",
              fatec: data["fatec[]"]?.[i] || "",
            });
          }
        }
      }
    }

    if (miniTableRows) {
      const rgList = Array.isArray(data["rg_candidato_indeferimento[]"])
        ? data["rg_candidato_indeferimento[]"]
        : [];

      const justificativas = Array.isArray(
        data["justificativa_indeferimento[]"],
      )
        ? data["justificativa_indeferimento[]"]
        : [];

      const rowCount = Math.max(rgList.length, justificativas.length);

      if (rowCount > 0) {
        miniTableRows.innerHTML = "";

        for (let i = 0; i < rowCount; i += 1) {
          addMiniRow({
            rg_indeferimento: rgList[i] || "",
            justificativa_indeferimento: justificativas[i] || "",
          });
        }
      }
    }

    if (indeferidosList) {
      const rgList = Array.isArray(data["indeferido_rg[]"])
        ? data["indeferido_rg[]"]
        : [];
      if (rgList.length > 0) {
        indeferidosList.innerHTML = "";
        rgList.forEach((rg) => addIndeferido(rg || ""));
      }
    }

    return true;
  }

  function clearValidationErrors(form) {
    form.querySelectorAll(".error-message").forEach((error) => error.remove());
    form
      .querySelectorAll(".input-error")
      .forEach((input) => input.classList.remove("input-error"));
  }

  function showValidationError(input, message) {
    input.classList.add("input-error");
    const parent = input.parentElement || input.closest("td") || input;
    const existing = parent.querySelector(".error-message");
    if (existing) {
      existing.textContent = message;
      return;
    }

    const span = document.createElement("span");
    span.className = "error error-message";
    span.textContent = message;
    parent.appendChild(span);
  }

  function validateNumericFields(form) {
    const numericFields = Array.from(
      form.querySelectorAll("input[type=number], input[data-numeric]"),
    );

    for (const input of numericFields) {
      const value = input.value.toString().trim();
      if (!value) continue;

      const isBadNumber =
        input.type === "number"
          ? input.validity.badInput || Number.isNaN(Number(value))
          : Number.isNaN(Number(value));

      if (isBadNumber) {
        showValidationError(input, "Apenas números são permitidos");
        return { isValid: false, message: "Campo numérico inválido" };
      }
    }

    return { isValid: true, message: "" };
  }

  async function validateRequiredFields(form) {
    clearValidationErrors(form);
    const requiredFields = Array.from(form.querySelectorAll("[data-required]"));
    const validatedNames = new Set();

    for (const field of requiredFields) {
      const name = field.name || field.id || field.type;
      if (validatedNames.has(name)) continue;
      validatedNames.add(name);

      if (field.type === "checkbox") {
        const checkboxes = form.querySelectorAll(`input[name="${field.name}"]`);
        if (!Array.from(checkboxes).some((checkbox) => checkbox.checked)) {
          return { isValid: false, message: `Campo "${name}" é obrigatório` };
        }
        continue;
      }

      if (field.type === "radio") {
        const radios = form.querySelectorAll(
          `input[name="${field.name}"]:checked`,
        );
        if (radios.length === 0) {
          return { isValid: false, message: `Campo "${name}" é obrigatório` };
        }
        continue;
      }

      if (field.tagName === "SELECT") {
        if (!field.value) {
          return { isValid: false, message: `Campo "${name}" é obrigatório` };
        }
        continue;
      }

      if (!field.value || !field.value.toString().trim()) {
        return { isValid: false, message: `Campo "${name}" é obrigatório` };
      }
    }

    return { isValid: true, message: "Formulário válido" };
  }

  // Eventos de Botões
  if (btnAddRow) btnAddRow.addEventListener("click", () => addRow());
  if (btnAddMiniRow) btnAddMiniRow.addEventListener("click", () => addMiniRow());
  if (btnAddIndeferido)
    btnAddIndeferido.addEventListener("click", () => addIndeferido());

  async function runFormValidations(form) {
    let validationResult = { isValid: true, message: "Formulário válido" };
    const title = document.title;
  
    // 1. Run specific Anexo validations
    if (title.includes("Anexo I")) {
      validationResult = window.validateAnexoI ? await window.validateAnexoI() : validationResult;
    } else if (title.includes("Anexo II")) {
      validationResult = window.validateAnexoII ? await window.validateAnexoII() : validationResult;
    } else if (title.includes("Anexo III")) {
      validationResult = window.validateAnexoIII ? await window.validateAnexoIII() : validationResult;
    } else if (title.includes("Anexo V")) {
      validationResult = window.validateAnexoV ? await window.validateAnexoV() : validationResult;
    } else if (title.includes("Anexo VII")) {
      validationResult = window.validateAnexoVII ? await window.validateAnexoVII() : validationResult;
    } else if (title.includes("Anexo VIII")) {
      validationResult = window.validateAnexoVIII ? await window.validateAnexoVIII() : validationResult;
    } else if (title.includes("Anexo IX")) {
      validationResult = window.validateAnexoIX ? await window.validateAnexoIX() : validationResult;
    } else if (title.includes("Anexo X")) {
      validationResult = window.validateAnexoX ? await window.validateAnexoX() : validationResult;
    }
  
    // If the specific validation failed, return immediately
    if (!validationResult.isValid) {
      return validationResult;
    }
  
    // 2. Run Generic Required Fields Validation
    // (Adding await here just in case you ever make it async)
    const genericResult = await validateRequiredFields(form);
    if (!genericResult.isValid) {
      return genericResult;
    }
  
    // 3. Run Generic Numeric Fields Validation
    const numericResult = await validateNumericFields(form);
    if (!numericResult.isValid) {
      return numericResult;
    }
  
    return { isValid: true, message: "Sucesso" };
  }

  async function generatePDF(data, anexoNumber) {
    const response = await fetch(`https://pdforms-backend.onrender.com/api/pdf/gerar/${anexoNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response;
  }

  // Submit e LocalStorage (Mantido e adaptado)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const validationResult = await runFormValidations(form);
    if (!validationResult.isValid) {
      alert(validationResult.message);
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

    if (
      tableRows &&
      (document.title.includes("Anexo V") ||
        document.title.includes("Anexo VII"))
    ) {
      const rows = Array.from(tableRows.children);
      data["candidato_nome[]"] = [];
      data["candidato_rg[]"] = [];
      data["aulas_fatec[]"] = [];
      data["contrato[]"] = [];
      data["pontos[]"] = [];

      rows.forEach((tr) => {
        const nome = tr.querySelector('input[name="candidato_nome[]"]');
        const rg = tr.querySelector('input[name="candidato_rg[]"]');
        const aula = tr.querySelector('input[name="aulas_fatec[]"]');
        const contrato = tr.querySelector('select[name="contrato[]"]');
        const pontos = tr.querySelector('input[name="pontos[]"]');

        data["candidato_nome[]"].push(nome?.value || "");
        data["candidato_rg[]"].push(rg?.value || "");
        data["aulas_fatec[]"].push(aula?.checked ? "1" : "");
        data["contrato[]"].push(contrato?.value || "");
        data["pontos[]"].push(pontos?.value || "");
      });
    }

    localStorage.setItem(`pdforms-${document.title}`, JSON.stringify(data));
    const submitButton = document.getElementById("btnDownloadPDF");
    submitButton.disabled = true;
    submitButton.innerHTML = "Gerando PDF...";
    submitButton.classList.add("disabled");
    const anexoNumber = submitButton.getAttribute("data-anexo-number");

    const response = await generatePDF(data, anexoNumber);

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.title}.pdf`;

      submitButton.disabled = false;
      submitButton.classList.remove("disabled");
      submitButton.innerHTML = "Baixar PDF";
      a.click();
    } else {
      submitButton.disabled = false;
      submitButton.classList.remove("disabled");
      submitButton.innerHTML = "Baixar PDF";
      alert("Erro ao gerar o PDF");
    }
  });

  function showGeneratePopup() {
    const popup = document.createElement("div");
    popup.className = "save-popup-overlay";
    popup.innerHTML = `<div class="save-popup"><h2>Gerar formulário?</h2><div class="popup-buttons"><button class="generate-btn">Gerar ✓</button><button class="view-btn">Visualizar 👁</button></div><button class="cancel-btn">Cancelar</button></div>`;
    document.body.appendChild(popup);
    const style = document.createElement("style");
    style.textContent = `.save-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999}.save-popup{background:#eee;padding:40px;border-radius:25px;width:700px;max-width:90%;text-align:center}.popup-buttons{display:flex;gap:15px;justify-content:center;margin:25px 0}.generate-btn,.view-btn,.cancel-btn{border:none;padding:15px 30px;border-radius:10px;font-size:22px;cursor:pointer}.generate-btn{background:#11b56b;color:#fff}.view-btn{background:#55636d;color:#fff}.cancel-btn{background:#c80018;color:#fff;width:63%}`;
    document.head.appendChild(style);
    popup.querySelector(".cancel-btn").onclick = () => popup.remove();
    popup.querySelector(".generate-btn").onclick = () =>
      alert("Função gerar pode ser conectada aqui");
    popup.querySelector(".view-btn").onclick = () =>
      alert("Função visualizar pode ser conectada aqui");
  }

  // Inicialização
const hasLoadedSavedData = loadSavedData();
if (!hasLoadedSavedData) {
  if (tableRows && tableRows.children.length === 0) addRow();
  if (miniTableRows && miniTableRows.children.length === 0) {
    addMiniRow({
      rg_indeferimento: "",
      justificativa_indeferimento: "5 anos"
    });
  }
  if (indeferidosList && indeferidosList.children.length === 0) {
    addIndeferido();
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
          const miniTableRows = document.getElementById("miniTableRows");
          if (miniTableRows) miniTableRows.innerHTML = "";
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
