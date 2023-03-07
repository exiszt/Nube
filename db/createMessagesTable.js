const { optionsSQLiteCreate } = require("./options.js");
const knex = require("knex")(optionsSQLiteCreate);

knex.schema.createTable("messages", (table) => {
    table.increments("id");
    table.string("email");
    table.string("text");
    table.string("date");
  })
  .then(() => console.log("Tabla mensajes creada."))
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => knex.destroy());