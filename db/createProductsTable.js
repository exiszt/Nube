const { optionsMaria } = require("./options.js");
const knex = require("knex")(optionsMaria);

knex.schema.createTable("products", (table) => {
    table.increments("id");
    table.string("title");
    table.string("price");
    table.string("thumbnail");
  })
  .then(() => console.log("Tabla productos creada."))
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => knex.destroy());