document.addEventListener("DOMContentLoaded", function () {
  fillTable("http://localhost:3000/data.json", "tBody");
});

document
  .getElementById("formNova")
  .addEventListener("submit", handleFormSubmit);

document
  .getElementById("formEdita")
  .addEventListener("submit", handleEditSubmmit);

document.addEventListener(
  "click",
  async function (event) {
    if (event.target.closest(".btn-excluir")) {
      const id = event.target.closest(".btn-excluir").getAttribute("data-id");
      await deleteData(id);
    }
  },
  false
);

document.addEventListener("click", async function (event) {
  if (event.target.closest(".btn-editar")) {
    const id = event.target.closest(".btn-editar").getAttribute("data-id");
    await fillEditForm(id);
  }
});

document.getElementById("numero").addEventListener("input", function (e) {
  if (e.target.value.length < 3) {
    e.target.setCustomValidity("Por favor, insira pelo menos 3 dígitos.");
  } else {
    e.target.setCustomValidity("");
  }
});

//função para preencher formulário de edição
async function fillEditForm(id) {
  const response = await fetch(`http://localhost:3000/data.json/${id}`);
  const data = await response.json();

  const form = document.getElementById("formEdita");

  form.elements["id"].value = data.id;
  form.elements["numero"].value = data.numero;
  form.elements["nome"].value = data.nome;
  form.elements["proprietario"].value = data.proprietario;

  const situacaoSelect = form.elements["situacao"];
  const situacaoOption = Array.from(situacaoSelect.options).find(
    (option) => option.text === data.situacao
  );
  if (situacaoOption) {
    situacaoSelect.value = situacaoOption.value;
  }
  const caracteristicasSelect = form.elements["caracteristicas"];
  const caracteristicasOption = Array.from(caracteristicasSelect.options).find(
    (option) => option.text === data.caracteristicas
  );
  if (caracteristicasOption) {
    caracteristicasSelect.value = caracteristicasOption.value;
  }
  const situacaoMaeSelect = form.elements["situacaoMae"];
  const situacaoMaeOption = Array.from(situacaoMaeSelect.options).find(
    (option) => option.text === data.situacaoMae
  );
  if (situacaoMaeOption) {
    situacaoMaeSelect.value = situacaoMaeOption.value;
  }

  form.elements["dataNascimento"].value = data.dataNascimento;
  form.elements["nomeMae"].value = data.nomeMae;
  form.elements["nomePai"].value = data.nomePai;
}

//função para preencher a tabela
async function fillTable(url, tableId) {
  const response = await fetch(url);
  const data = await response.json();

  var tbody = document.getElementById(tableId);

  data.forEach(function (obj, i) {
    var tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${obj.numero || "Unknown"}</td>
            <td>${obj.nome || "Unknown"}</td>
            <td>${obj.proprietario || "Unknown"}</td>
            <td>${obj.situacao || "Unknown"}</td>
            <td class="row-acao">
            <a href="#modalEdicao">
            <button class="btn btn-editar" data-id="${obj.id}">
              <span class="material-icons">edit</span>
            </button>
          </a>
          <a>
            <button class="btn btn-excluir" data-id="${obj.id}">
              <span class="material-icons">delete</span>
            </button>
          </a>`;
    tbody.appendChild(tr);
  });
}

//função para adicionar um novo registro
async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  // Adicione um ID único ao objeto de dados
  data.id = "id_" + Math.random().toString(36).substr(2, 9);

  const selectElement = document.getElementById("situacao");
  data.situacao = selectElement.options[selectElement.selectedIndex].text;
  const selectElement2 = document.getElementById("caracteristicas");
  data.caracteristicas =
    selectElement2.options[selectElement2.selectedIndex].text;
  const selectElement3 = document.getElementById("situacaoMae");
  data.situacaoMae = selectElement3.options[selectElement3.selectedIndex].text;

  const response = await newData(data);

  if (response.ok) {
    console.log("Registro adicionado com sucesso!");
    alert("Registro adicionado com sucesso!");
    window.location.href = "#";
  } else {
    alert("Erro ao adicionar registro!");
  }
}

//função para editar um registro
async function handleEditSubmmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  const selectElement = document.getElementById("situacao");
  data.situacao = selectElement.options[selectElement.selectedIndex].text;
  const selectElement2 = document.getElementById("caracteristicas");
  data.caracteristicas =
    selectElement2.options[selectElement2.selectedIndex].text;
  const selectElement3 = document.getElementById("situacaoMae");
  data.situacaoMae = selectElement3.options[selectElement3.selectedIndex].text;

  const response = await editData(data.id, data);

  if (response.ok) {
    console.log("Registro editado com sucesso!");
    alert("Registro editado com sucesso!");
    window.location.href = "#";
  } else {
    alert("Erro ao editar registro!");
  }
}

async function editData(id, data) {
  return await fetch(`http://localhost:3000/data.json/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function newData(data) {
  return await fetch("http://localhost:3000/data.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
//função para excluir um registro
async function deleteData(id) {
  const response = await fetch(`http://localhost:3000/data.json/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Registro excluído com sucesso!");
    window.location.href = "#";
  } else {
    alert("Erro ao excluir registro!");
  }
}
