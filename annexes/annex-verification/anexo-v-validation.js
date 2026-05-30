/**
 * Validação para Anexo V
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function validateAnexoV() {
  const form = document.getElementById("annexForm");
  if (!form) return { isValid: false, message: "Formulário não encontrado" };

  const requiredFields = [
    { name: "faculdade", label: "Faculdade" },
    { name: "edital_num", label: "Número do Edital" },
    { name: "edital_ano", label: "Ano do Edital" },
    { name: "docente_nome", label: "Nome do Docente Selecionado" },
    { name: "docente_rg", label: "RG do Docente Selecionado" },
    { name: "data_final", label: "Data Final" },
  ];

  // Verificar campos obrigatórios
  for (const field of requiredFields) {
    const input = form.querySelector(`[name="${field.name}"]`);
    if (!input || !input.value.trim()) {
      return {
        isValid: false,
        message: `Campo "${field.label}" é obrigatório`,
      };
    }
  }

  // Verificar se há pelo menos uma linha na tabela de classificação
  const tableRows = document.getElementById("tableRows");
  if (!tableRows || tableRows.children.length === 0) {
    return {
      isValid: false,
      message:
        "É necessário adicionar pelo menos um candidato na tabela de classificação",
    };
  }

  // Verificar se todas as linhas da tabela estão preenchidas
  const rows = tableRows.querySelectorAll("tr");
  for (let i = 0; i < rows.length; i++) {
    const inputs = rows[i].querySelectorAll("input");
    for (const input of inputs) {
      if (input.type !== "checkbox" && !input.value.trim()) {
        return {
          isValid: false,
          message: `Linha ${i + 1} da tabela de classificação: todos os campos devem ser preenchidos`,
        };
      }
    }
    // Verificar selects
    const selects = rows[i].querySelectorAll("select");
    for (const select of selects) {
      if (!select.value) {
        return {
          isValid: false,
          message: `Linha ${i + 1} da tabela de classificação: selecione o tipo de contrato`,
        };
      }
    }
  }

  return { isValid: true, message: "Formulário válido" };
}

// Função para limpar o formulário
function clearAnexoVForm() {
  const form = document.getElementById("annexForm");
  if (!form) return;

  // Limpar campos de input
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.type === "date") {
      input.value = "";
    } else if (input.type === "checkbox") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });

  // Limpar selects
  const selects = form.querySelectorAll("select");
  selects.forEach((select) => {
    select.selectedIndex = 0;
  });

  // Limpar tabelas
  const tableRows = document.getElementById("tableRows");
  if (tableRows) {
    tableRows.innerHTML = "";
  }

  const indeferidosList = document.getElementById("indeferidosList");
  if (indeferidosList) {
    indeferidosList.innerHTML = "";
  }

  // Adicionar linhas vazias
  if (window.addRow) {
    window.addRow();
  }
  if (window.addIndeferido) {
    window.addIndeferido();
  }
}

// Exportar funções para uso global
window.validateAnexoV = validateAnexoV;
window.clearAnexoVForm = clearAnexoVForm;
