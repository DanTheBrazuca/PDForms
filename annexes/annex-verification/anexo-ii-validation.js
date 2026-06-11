/**
 * Validação para Anexo II
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function validateAnexoII() {
  const form = document.getElementById("annexForm");
  if (!form) return { isValid: false, message: "Formulário não encontrado" };

  const requiredFields = [
    { name: "faculdade", label: "Faculdade" },
    { name: "portaria_num", label: "Numero da portaria"},
    { name: "portaria_ano", label: "Ano da portaria"},
    { name: "portaria_data", label: "Data da portaria"},
    { name: "coordenador_genero", label: "Genero do coordenador"},
    { name: "edital_num", label: "Numero do edital"},
    { name: "edital_ano", label: "Ano do edital"},
    { name: "curso", label: "Curso"},
    { name: "membro1", label: "Membro 1"},
    { name: "membro1_rg", label: "RG do membro 1"},
    { name: "membro2", label: "Membro 2"},
    { name: "membro2_rg", label: "RG do membro 2"},
    { name: "membro3", label: "Membro 3"},
    { name: "membro3_rg", label: "RG do membro 3"},
    { name: "suplente_docente", label: "Suplente docente"},
    { name: "suplente_tecnico", label: "Suplente tecnico"},
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
