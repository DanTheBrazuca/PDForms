document.addEventListener("DOMContentLoaded", () => {
  const btnVoltar = document.getElementById("btnVoltar");
  const form = document.getElementById("anexoIForm");
  const disciplinasBody = document.getElementById("disciplinasBody");
  const totalCargaHoraria = document.getElementById("totalCargaHoraria");
  const btnAdicionarLinha = document.getElementById("btnAdicionarLinha");

  /* Cria célula da tabela */
  function createInputCell(name, placeholder, type = "text") {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    td.appendChild(input);
    return td;
  }

  function addRow(data = {}) {
    /* Insere nova linha disciplina */
    const tr = document.createElement("tr");

    const disciplinaTd = createInputCell("disciplina[]", "Disciplina", "text");
    disciplinaTd.querySelector("input").value = data.disciplina || "";

    const cargaTd = createInputCell("carga[]", "Carga horária", "number");
    const cargaInput = cargaTd.querySelector("input");
    /* Configurações input de carga */
    cargaInput.min = "0";
    cargaInput.step = "0.5";
    cargaInput.value = data.carga || "";

    const turnoTd = createInputCell("turno[]", "Turno", "text");
    turnoTd.querySelector("input").value = data.turno || "";

    const cursoTd = createInputCell("curso[]", "Curso ou Departamento", "text");
    cursoTd.querySelector("input").value = data.curso || "";

    const fatecTd = createInputCell("fatec[]", "Fatec", "text");
    fatecTd.querySelector("input").value = data.fatec || "";

    const actionTd = document.createElement("td");
    /* Botão para remover linha */
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "row-remove";
    removeBtn.textContent = "×";
    actionTd.appendChild(removeBtn);

    tr.append(disciplinaTd, cargaTd, turnoTd, cursoTd, fatecTd, actionTd);

    disciplinasBody.appendChild(tr);

    cargaInput.addEventListener("input", updateTotal);
    /* Remover linha e recalcular */
    removeBtn.addEventListener("click", () => {
      tr.remove();
      if (disciplinasBody.children.length === 0) {
        addRow();
      }
      updateTotal();
    });

    updateTotal();
  }

  function updateTotal() {
    /* Recalcula total horas */
    const rows = Array.from(disciplinasBody.querySelectorAll("tr"));
    let total = 0;

    rows.forEach((row) => {
      const cargaInput = row.querySelector('input[name="carga[]"]');
      const value = parseFloat(cargaInput?.value || "0");
      if (!Number.isNaN(value)) total += value;
    });

    totalCargaHoraria.textContent = total.toString();
  }

  function gatherFormData() {
    /* Coleta dados do formulário */
    const rows = Array.from(disciplinasBody.querySelectorAll("tr"));

    return {
      faculdade: document.getElementById("faculdade").value.trim(),
      docente: document.getElementById("docente").value.trim(),
      matricula: document.getElementById("matricula").value.trim(),
      categoria: document.getElementById("categoria").value.trim(),
      horaAula: document.getElementById("horaAula").value.trim(),
      regimeTrabalho: document.getElementById("regimeTrabalho").value.trim(),
      local: document.getElementById("local").value.trim(),
      data: document.getElementById("data").value,
      disciplinas: rows.map((row) => ({
        disciplina: row
          .querySelector('input[name="disciplina[]"]')
          .value.trim(),
        carga: row.querySelector('input[name="carga[]"]').value.trim(),
        turno: row.querySelector('input[name="turno[]"]').value.trim(),
        curso: row.querySelector('input[name="curso[]"]').value.trim(),
        fatec: row.querySelector('input[name="fatec[]"]').value.trim(),
      })),
      totalCargaHoraria: totalCargaHoraria.textContent,
    };
  }

  btnVoltar.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  btnAdicionarLinha.addEventListener("click", () => addRow());

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = gatherFormData();

    /* Valida campos obrigatórios */
    if (!data.faculdade || !data.docente || !data.local || !data.data) {
      alert("Preencha os campos obrigatórios antes de salvar.");
      return;
    }

    /* Verifica disciplina preenchida */
    const hasAtLeastOneDisciplina = data.disciplinas.some(
      (item) =>
        item.disciplina || item.carga || item.turno || item.curso || item.fatec,
    );

    if (!hasAtLeastOneDisciplina) {
      alert("Adicione pelo menos uma disciplina.");
      return;
    }

    localStorage.setItem("pdforms-anexo-i-draft", JSON.stringify(data));
    /* Salva rascunho em cache */
    alert("Formulário salvo com sucesso!");
    console.log("Anexo I salvo:", data);
  });

  addRow();
});
