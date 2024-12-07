import express from "express";
const app = express();
app.listen;
app.listen(3000, console.log("Server ON"));

import {
  obtenerMedicamentos,
  obtenerPersonal,
  obtenerMedicamentosPorFiltros,
  obtenerPersonalPorFiltros,
  prepararHATEOAS,
  prepararHATEOASPersonal,
} from "./consultas.js";

// app.get("/medicamentos", async (req, res) => {
//   const medicamentos = await obtenerMedicamentos(req.query);
//   res.json(medicamentos);
// });

app.get("/medicamentos", async (req, res) => {
  const queryStrings = req.query;
  const medicamentos = await obtenerMedicamentos(queryStrings);
  const HATEOAS = await prepararHATEOAS(medicamentos);
  res.json(HATEOAS);
});

app.get("/personal", async (req, res) => {
  const personal = await obtenerPersonal(req.query);
  const HATEOAS = await prepararHATEOASPersonal(personal);
  res.json(HATEOAS);
});

app.get("/medicamentos/filtros", async (req, res) => {
  const queryStrings = req.query;
  const medicamentos = await obtenerMedicamentosPorFiltros(queryStrings);
  res.json(medicamentos);
});

app.get("/personal/filtros", async (req, res) => {
  const queryStrings = req.query;
  const medicamentos = await obtenerPersonalPorFiltros(queryStrings);
  res.json(medicamentos);
});

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});
