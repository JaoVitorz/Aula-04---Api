const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para rodar JSON
app.use(express.json());

// Banco de dados em memória (array)
let alunos = [];

//Rotas

// POST - Adicionar aluno
app.post("/alunos", (req, res) => {
  const { RA, nome, turma } = req.body;

  if (alunos.find(a => a.RA === RA)) {
    return res.status(400).json({ message: "RA já cadastrado" });
  }

  alunos.push({ RA, nome, turma, cursos: [] });
  res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
});

// POST - Adicionar curso a um aluno
app.post("/alunos/:RA/cursos", (req, res) => {
  const { RA } = req.params;
  const { curso } = req.body; 

  const aluno = alunos.find(a => a.RA === RA);
  if (!aluno) return res.status(404).json({ message: "Aluno não encontrado" });

 
  aluno.cursos.push(curso);
  res.json({ message: "Curso adicionado com sucesso", aluno });
});

// PUT - Alterar dados do aluno
app.put("/alunos/:RA", (req, res) => {
  const { RA } = req.params;
  const { nome, turma } = req.body;

  const aluno = alunos.find(a => a.RA === RA);
  if (!aluno) return res.status(404).json({ message: "Aluno não encontrado" });

  if (nome) aluno.nome = nome;
  if (turma) aluno.turma = turma;

  res.json({ message: "Dados atualizados", aluno });
});

// PUT - Alterar curso do aluno
app.put("/alunos/:RA/cursos/:index", (req, res) => {
  const { RA, index } = req.params;
  const { curso } = req.body;

  const aluno = alunos.find(a => a.RA === RA);
  if (!aluno) return res.status(404).json({ message: "Aluno não encontrado" });

  if (!aluno.cursos[index]) {
    return res.status(404).json({ message: "Curso não encontrado" });
  }

  aluno.cursos[index] = curso;
  res.json({ message: "Curso atualizado", aluno });
});

// DELETE - Remover aluno
app.delete("/alunos/:RA", (req, res) => {
  const { RA } = req.params;

  const index = alunos.findIndex(a => a.RA === RA);
  if (index === -1) return res.status(404).json({ message: "Aluno não encontrado" });

  alunos.splice(index, 1);
  res.json({ message: "Aluno removido com sucesso" });
});

// DELETE - Remover curso do aluno
app.delete("/alunos/:RA/cursos/:index", (req, res) => {
  const { RA, index } = req.params;

  const aluno = alunos.find(a => a.RA === RA);
  if (!aluno) return res.status(404).json({ message: "Aluno não encontrado" });

  if (!aluno.cursos[index]) {
    return res.status(404).json({ message: "Curso não encontrado" });
  }

  aluno.cursos.splice(index, 1);
  res.json({ message: "Curso removido", aluno });
});

// GET - Listar todos os alunos
app.get("/alunos", (req, res) => {
  const lista = alunos.map(a => ({
    RA: a.RA,
    nome: a.nome,
    turma: a.turma
  }));
  res.json(lista);
});

// GET - Listar aluno pelo RA
app.get("/alunos/:RA", (req, res) => {
  const { RA } = req.params;
  const aluno = alunos.find(a => a.RA === RA);
  if (!aluno) return res.status(404).json({ message: "Aluno não encontrado" });
  res.json(aluno);
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${3000}`);
});
