document.addEventListener("DOMContentLoaded", function () {
  fillTable("./data.json", "tBody");
});

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
