/**
 * Validação para Anexo II
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function validateAnexoII() {
  const form = document.getElementById("annexForm");
  if (!form) return { isValid: false, message: "Formulário não encontrado" };

  const requiredFields = [
    { name: "faculdade", label: "Faculdade" },
    { name: "data", label: "Data" },
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

  return { isValid: true, message: "Formulário válido" };
}

// Função para limpar o formulário
function clearAnexoIIForm() {
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
window.validateAnexoII = validateAnexoII;
window.clearAnexoIIForm = clearAnexoIIForm;
