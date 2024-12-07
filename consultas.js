import pkg from "pg";
import format from "pg-format";

const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "123123",
  database: "farmacia",
  port: 5432,
  allowExitOnIdle: true,
});

// export const obtenerMedicamentos = async ({ limit = 10, }) => {
//   let consulta = "SELECT * FROM medicamentos LIMIT $1";
//   const { rows: medicamentos } = await pool.query(consulta, [limit]);
//   return medicamentos;
// };

export const obtenerMedicamentos = async ({
  limit = 10,
  order_by = "id_ASC",
  page = 1,
}) => {
  const [columna, orden] = order_by.split("_");
  const offset = Math.abs((page - 1) * limit); //para partir desde pagina 1
  console.log("offset", offset);

  const formattedQuery = format(
    "SELECT * FROM medicamentos ORDER BY %s %s LIMIT %s OFFSET %s",
    columna,
    orden,
    limit,
    offset
  );
  const { rows: medicamentos } = await pool.query(formattedQuery);
  return medicamentos;
};

// export const obtenerPersonal = async ({ limit = 10 }) => {
//   let consulta = "SELECT * FROM personal LIMIT $1";
//   const { rows: personal } = await pool.query(consulta, [limit]);
//   return personal;
// };

export const obtenerPersonal = async ({
  limit = 10,
  order_by = "id_ASC",
  page = 1,
}) => {
  const [columnna, orden] = order_by.split("_");
  const offset = Math.abs((page - 1) * limit); //para partir desde pagina 1
  const formattedQuery = format(
    "SELECT * FROM personal ORDER BY %s %s LIMIT %s OFFSET %s",
    columnna,
    orden,
    limit,
    offset
  );
  const { rows: personal } = await pool.query(formattedQuery);
  return personal;
};

export const obtenerMedicamentosPorFiltros = async ({
  stock_min,
  precio_max,
}) => {
  let filtros = [];
  if (stock_min) {
    filtros.push(`stock >= ${stock_min}`);
  }
  if (precio_max) {
    filtros.push(`precio <= ${precio_max}`);
  }
  let consulta = "SELECT * FROM medicamentos";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }
  const { rows: medicamentos } = await pool.query(consulta);
  return medicamentos;
};

export const obtenerPersonalPorFiltros = async ({
  salario_max,
  salario_min,
  rol,
}) => {
  let filtros = [];
  if (salario_max) {
    filtros.push(`salario <= ${salario_max}`);
  }
  if (salario_min) {
    filtros.push(`salario >= ${salario_min}`);
  }
  if (rol) {
    filtros.push(`rol = '${rol}'`);
  }
  let consulta = "SELECT * FROM personal";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }
  const { rows: personal } = await pool.query(consulta);
  return personal;
};

export const prepararHATEOAS = (medicamentos) => {
  const results = medicamentos
    .map((m) => {
      return {
        name: m.nombre,
        href: `/medicamentos/medicamento/${m.id}`,
      };
    })
    .slice(0, 4);
  console.log(results);
  const total = medicamentos.length;
  const HATEOAS = {
    total,
    medicamentos: results,
  };
  return HATEOAS;
};

export const prepararHATEOASPersonal = (personal) => {
  const results = personal
    .map((p) => {
      return {
        name: p.nombre,
        href: `/personal/personal/${p.id}`,
      };
    })
    .slice(0, 4);
  const total = personal.length;
  const HATEOAS = {
    total,
    personal: results,
  };
  return HATEOAS;
};

export default pool;
