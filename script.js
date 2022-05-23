const doc = document.querySelector.bind(document);

const html = {
  links: [...doc(".step-title").children],
  content: [...doc(".formArea").children],
  final: doc(".final"),
  openStep: doc("[data-open]"),
  btn: [...doc(".btn").children],
  btns: [...doc(".btns").children],
};

function isCPF() {
  var cpf = doc("#cpf").value;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf == "") return false;
  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  )
    return false;

  count = 0;
  for (i = 0; i < 9; i++) count += parseInt(cpf.charAt(i)) * (10 - i);
  dig = 11 - (count % 11);
  if (dig == 10 || dig == 11) dig = 0;
  if (dig != parseInt(cpf.charAt(9))) return false;
  count = 0;
  for (i = 0; i < 10; i++) count += parseInt(cpf.charAt(i)) * (11 - i);
  dig = 11 - (count % 11);
  if (dig == 10 || dig == 11) dig = 0;
  if (dig != parseInt(cpf.charAt(10))) return false;
  validateCPF();
  return true;
}

function validateCPF() {
  const cpf = doc("#cpf").value;
  let regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  try {
    if (!regex.test(cpf) || cpf === "") throw new Error();
  } catch (Error) {
    return;
  }
  validateDate();
}

function validateDate() {
  const dtNasc = doc("#dtNasc").value;
  if (dtNasc == "") {
    alert("Insira a data de nascimento");
    return;
  }
  showCurrentStep("adress");
  show();
}

function hideAllStepContent() {
  html.content.forEach((step) => {
    step.style.display = "none";
  });
}

function removeAllActiveStep() {
  html.links.forEach((step) => {
    step.className = step.className.replace("active", "");
  });
}

function showCurrentStep(id) {
  hideAllStepContent();

  const stepContent = doc("#" + id);
  stepContent.style.display = "block";

  id.className += "active";
}

function selectStep(event) {
  removeAllActiveStep();

  const select = event.currentTarget;
  showCurrentStep(select.dataset.id);

  select.className += "active";
}

function listenForChanges() {
  html.links.forEach((step) => {
    step.addEventListener("click", selectStep);
  });

  html.btns.forEach((click) => {
    click.addEventListener("click", selectStep);
  });
}

function mascaraCpf(mascara, input) {
  const vestMask = mascara.split("");
  const numCpf = input.value.replace(/\D/g, "");
  const cursor = input.selectionStart;
  const tecla = window.event ? event.keyCode : event.which;

  for (let i = 0; i < numCpf.length; i++) {
    vestMask.splice(vestMask.indexOf("#"), 1, numCpf[i]);
  }

  input.value = vestMask.join("");

  if (cursor == 3 || cursor == 7 || cursor == 11) {
    input.setSelectionRange(cursor + 1, cursor + 1);
  } else {
    input.setSelectionRange(cursor, cursor);
  }
}

function consultCEP() {
  const cep = doc("#cep").value;

  if (cep.length != 8 || cep === "") {
    alert("CEP inválido");
    return;
  } else var url = "https://viacep.com.br/ws/" + cep + "/json/";
  $.getJSON(url, function (data) {
    $("#rua").val(data.logradouro);
    $("#bairro").val(data.bairro);
    $("#number").val(data.number);

    fetch(url).then(function (response) {
      response.json().then(function (data) {
        showResult(data);
      });
    });
  });
}

function show() {
  let name = doc("#nome").value;
  let dtNasc = doc("#dtNasc").value;
  let cpf = doc("#cpf").value;
  html.final.innerHTML += `<p>Nome: ${name}<\p>
                                <p>Data de Nascimento: ${dtNasc}<\P>
                                <p>CPF: ${cpf}<\P>`;
}
function showResult(data) {
  html.final.innerHTML += `<p>${data.logradouro}<\p>
                                <p>Bairro: ${data.bairro}<\p>
                                <p>Cidade: ${data.localidade}<\p>`;
}

function start() {
  hideAllStepContent();
  listenForChanges();
  html.openStep.click();
}

start();
