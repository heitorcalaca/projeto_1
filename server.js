const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

app.get("/data.json", (req, res) => {
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erro ao ler o arquivo");
    } else {
      res.send(JSON.parse(data));
    }
  });
});

app.get("/data.json/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erro ao ler o arquivo");
    } else {
      res.send(JSON.parse(data).find((item) => item.id === id));
    }
  });
});

app.post("/data.json", (req, res) => {
  // Verifique se os dados enviados são um objeto e não um array
  if (typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).send("Dados inválidos");
  }

  fs.readFile("./data.json", "utf8", (readErr, data) => {
    if (readErr) {
      console.log("Error reading file:", readErr);
      return res.status(500).send("Erro ao ler o arquivo");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send("Erro ao analisar o arquivo JSON");
    }

    // Adicione os novos dados ao array existente
    jsonData.push(req.body);

    const newData = JSON.stringify(jsonData, null, 2);

    fs.writeFile("./data.json", newData, "utf8", (writeErr) => {
      if (writeErr) {
        console.log("Error writing file:", writeErr);
        return res.status(500).send("Erro ao atualizar o arquivo");
      }

      res.send("Arquivo atualizado com sucesso");
    });
  });
});

//falta terminar
app.put("/data.json/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data.json", "utf8", (readErr, data) => {
    if (readErr) {
      console.log("Error reading file:", readErr);
      return res.status(500).send("Erro ao ler o arquivo");
    }

    let jsonData;

    try {
      jsonData = JSON.parse(data);
    } catch (jsonErr) {
      return res.status(500).send("Erro ao analisar o arquivo JSON");
    }
    // Encontre o índice do item com o id fornecido
    const index = jsonData.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(400).send("Item não encontrado");
    }

    // Atualize o item no array
    console.log(jsonData[index]);
    jsonData[index] = req.body;
    console.log(jsonData[index]);
  });
});

app.delete("/data.json/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data.json", "utf8", (readErr, data) => {
    if (readErr) {
      console.log("Error reading file:", readErr);
      return res.status(500).send("Erro ao ler o arquivo");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send("Erro ao analisar o arquivo JSON");
    }

    // Encontre o índice do item com o id fornecido
    const index = jsonData.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(400).send("Item não encontrado");
    }

    // Remova o item do array
    jsonData.splice(index, 1);

    const newData = JSON.stringify(jsonData, null, 2);

    fs.writeFile("./data.json", newData, "utf8", (writeErr) => {
      if (writeErr) {
        console.log("Error writing file:", writeErr);
        return res.status(500).send("Erro ao atualizar o arquivo");
      }

      res.send("Item excluído com sucesso");
    });
  });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
