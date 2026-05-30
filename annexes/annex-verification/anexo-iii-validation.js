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

  for (const field of requiredFields) {
    const input = form.querySelector(`[name="${field.name}"]`);
    if (!input || !input.value.trim()) {
      return {
        isValid: false,
        message: `Campo "${field.label}" é obrigatório`,
      };
    }
  }

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

  const virtudeCheckboxes = form.querySelectorAll(
    'input[name="virtude[]"]:checked',
  );
  if (virtudeCheckboxes.length === 0) {
    return {
      isValid: false,
      message: 'Selecione pelo menos uma opção em "Em virtude de"',
    };
  }

  const diasCheckboxes = form.querySelectorAll('input[name="dias[]"]:checked');
  if (diasCheckboxes.length === 0) {
    return {
      isValid: false,
      message: "Selecione pelo menos um dia da semana",
    };
  }

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

  const licencaCheckbox = form.querySelector("#chk_licenca");
  const licencaEspecificacao = form.querySelector(
    '[name="licenca_especificacao"]',
  );
  if (licencaCheckbox?.checked && !licencaEspecificacao?.value.trim()) {
    return {
      isValid: false,
      message: 'Especifique a opção marcada em "Licença"',
    };
  }

  const outrosCheckbox = form.querySelector("#chk_outros");
  const outrosEspecificacao = form.querySelector(
    '[name="outros_especificacao"]',
  );
  if (outrosCheckbox?.checked && !outrosEspecificacao?.value.trim()) {
    return {
      isValid: false,
      message: 'Especifique a opção marcada em "Outros"',
    };
  }

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

function clearAnexoIIIForm() {
  const form = document.getElementById("annexForm");
  if (!form) return;

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

  const textareas = form.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.value = "";
  });

  const selects = form.querySelectorAll("select");
  selects.forEach((select) => {
    select.selectedIndex = 0;
  });

  const licenca = document.querySelector('[name="licenca_especificacao"]');
  if (licenca) licenca.value = "";

  const outros = document.querySelector('[name="outros_especificacao"]');
  if (outros) outros.value = "";
}

window.validateAnexoIII = validateAnexoIII;
window.clearAnexoIIIForm = clearAnexoIIIForm;
