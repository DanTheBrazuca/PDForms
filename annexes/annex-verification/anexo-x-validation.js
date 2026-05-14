/**
 * Validação para Anexo X
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function validateAnexoX() {
  const form = document.getElementById("annexForm");
  if (!form) return { isValid: false, message: "Formulário não encontrado" };

  const requiredFields = [
    { name: "faculdade", label: "Faculdade" },
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

  // Verificar se há pelo menos uma linha na tabela
  const tableRows = document.getElementById("tableRows");
  if (!tableRows || tableRows.children.length === 0) {
    return {
      isValid: false,
      message: "É necessário adicionar pelo menos um item na tabela",
    };
  }

  // Verificar se todas as linhas da tabela estão preenchidas
  const rows = tableRows.querySelectorAll("tr");
  for (let i = 0; i < rows.length; i++) {
    const inputs = rows[i].querySelectorAll("input");
    for (const input of inputs) {
      if (!input.value.trim()) {
        return {
          isValid: false,
          message: `Linha ${i + 1} da tabela: todos os campos devem ser preenchidos`,
        };
      }
    }
  }

  return { isValid: true, message: "Formulário válido" };
}

// Função para limpar o formulário
function clearAnexoXForm() {
  const form = document.getElementById("annexForm");
  if (!form) return;

  // Limpar campos de input
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.type === "date") {
      input.value = "";
    } else {
      input.value = "";
    }
  });

  // Limpar tabela
  const tableRows = document.getElementById("tableRows");
  if (tableRows) {
    tableRows.innerHTML = "";
  }

  // Adicionar uma linha vazia na tabela
  if (window.addRow) {
    window.addRow();
  }
}

// Exportar funções para uso global
window.validateAnexoX = validateAnexoX;
window.clearAnexoXForm = clearAnexoXForm;
