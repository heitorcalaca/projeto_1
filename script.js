document.addEventListener("DOMContentLoaded", function () {
  fillTable("./data.json", "tBody");
});

document
  .getElementById("formNova")
  .addEventListener("submit", handleFormSubmit);

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
            <button class="btn btn-editar">
              <span class="material-icons">edit</span>
            </button>
          </a>
          <a>
            <button class="btn btn-excluir">
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

  const response = await sendDataToServer(data);

  if (response.ok) {
    console.log("Registro adicionado com sucesso!");
    alert("Registro adicionado com sucesso!");
    window.location.reload();
  } else {
    alert("Erro ao adicionar registro!");
  }
}

//função para enviar os dados para o servidor
async function sendDataToServer(data) {
  return await fetch("http://localhost:3000/data.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
