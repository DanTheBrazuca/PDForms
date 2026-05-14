/**
 * Validação para Anexo III
 * Verifica se todos os campos obrigatórios estão preenchidos
 */
function validateAnexoIII() {
  const form = document.getElementById("annexForm");
  if (!form) return { isValid: false, message: "Formulário não encontrado" };

  const requiredFields = [
    { name: "faculdade", label: "Faculdade" },
    { name: "edital_num", label: "Número do Edital" },
    { name: "edital_ano", label: "Ano do Edital" },
    { name: "edital_tempo", label: "Tempo" },
    { name: "data_inicio", label: "Data de Início" },
    { name: "area_geral", label: "Área" },
    { name: "versao", label: "Versão" },
    { name: "versao_ano", label: "Ano da Versão" },
    { name: "curso", label: "Curso" },
    { name: "turno", label: "Turno" },
    { name: "disciplina_nome", label: "Nome da Disciplina" },
    { name: "disciplina_area", label: "Área da Disciplina" },
    { name: "disciplina_carga", label: "Carga Horária da Disciplina" },
    { name: "horario_inicio", label: "Horário de Início" },
    { name: "horario_fim", label: "Horário de Fim" },
    { name: "objetivo", label: "Objetivo" },
    { name: "ementa_versao_ano", label: "Ano da Versão da Ementa" },
    { name: "ementa", label: "Ementa" },
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

  // Verificar radio buttons obrigatórios
  const radioGroups = ["graduacao", "ams", "natureza", "sendo", "bem_como"];
  for (const group of radioGroups) {
    const radios = form.querySelectorAll(`input[name="${group}"]:checked`);
    if (radios.length === 0) {
      return {
        isValid: false,
        message: `Selecione uma opção para "${group}"`,
      };
    }
  }

  // Verificar checkboxes obrigatórios (virtude)
  const virtudeCheckboxes = form.querySelectorAll(
    'input[name="virtude[]"]:checked',
  );
  if (virtudeCheckboxes.length === 0) {
    return {
      isValid: false,
      message: 'Selecione pelo menos uma opção em "Em virtude de"',
    };
  }

  // Verificar se pelo menos um dia da semana foi selecionado
  const diasCheckboxes = form.querySelectorAll('input[name="dias[]"]:checked');
  if (diasCheckboxes.length === 0) {
    return {
      isValid: false,
      message: "Selecione pelo menos um dia da semana",
    };
  }

  // Verificar formato das aulas (pelo menos um valor > 0)
  const pctPresencial = form.querySelector('[name="pct_presencial"]');
  const pctRemotoSincrono = form.querySelector('[name="pct_remoto_sincrono"]');
  const pctRemotoAssincrono = form.querySelector(
    '[name="pct_remoto_assincrono"]',
  );

  const totalPct =
    parseInt(pctPresencial?.value || 0) +
    parseInt(pctRemotoSincrono?.value || 0) +
    parseInt(pctRemotoAssincrono?.value || 0);

  if (totalPct === 0) {
    return {
      isValid: false,
      message:
        "Configure o formato das aulas (pelo menos uma porcentagem deve ser maior que 0)",
    };
  }

  // Verificar se há pelo menos uma linha na tabela de indeferimento
  const indeferimentoRows = document.getElementById("indeferimentoRows");
  if (!indeferimentoRows || indeferimentoRows.children.length === 0) {
    return {
      isValid: false,
      message:
        "É necessário adicionar pelo menos um exame na tabela de indeferimento",
    };
  }

  // Verificar se todas as linhas da tabela de indeferimento estão preenchidas
  const rows = indeferimentoRows.querySelectorAll("tr");
  for (let i = 0; i < rows.length; i++) {
    const inputs = rows[i].querySelectorAll("input");
    for (const input of inputs) {
      if (!input.value.trim()) {
        return {
          isValid: false,
          message: `Linha ${i + 1} da tabela de indeferimento: todos os campos devem ser preenchidos`,
        };
      }
    }
  }

  // Verificar datas do processo seletivo
  const dateFields = [
    "inscricoes_inicio",
    "inscricoes_fim",
    "deferimento_inicio",
    "deferimento_fim",
    "recursos_inicio",
    "recursos_fim",
    "analise_inicio",
    "analise_fim",
  ];

  for (const field of dateFields) {
    const input = form.querySelector(`[name="${field}"]`);
    if (!input || !input.value.trim()) {
      return {
        isValid: false,
        message: `Campo "${field.replace("_", " ")}" é obrigatório`,
      };
    }
  }

  return { isValid: true, message: "Formulário válido" };
}

// Função para limpar o formulário
function clearAnexoIIIForm() {
  const form = document.getElementById("annexForm");
  if (!form) return;

  // Limpar campos de input
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.type === "date" || input.type === "time") {
      input.value = "";
    } else if (input.type === "number") {
      input.value = "0";
    } else if (input.type === "checkbox" || input.type === "radio") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });

  // Limpar textareas
  const textareas = form.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.value = "";
  });

  // Limpar selects
  const selects = form.querySelectorAll("select");
  selects.forEach((select) => {
    select.selectedIndex = 0;
  });

  // Limpar tabela de indeferimento
  const indeferimentoRows = document.getElementById("indeferimentoRows");
  if (indeferimentoRows) {
    indeferimentoRows.innerHTML = "";
    // Adicionar uma linha vazia
    if (window.addIndeferimentoRow) {
      window.addIndeferimentoRow({ validade: "5 anos" });
    }
  }
}

// Exportar funções para uso global
window.validateAnexoIII = validateAnexoIII;
window.clearAnexoIIIForm = clearAnexoIIIForm;
