const knex = require("knex");

class Container {
  constructor(config, table) {
    this.config = config;
    this.table = table;
    this.knex = knex(this.config);
  }

  async save(row) {
    try {
        const newRowId = await this.knex(this.table).insert(row);
        console.log("Registro agregado");
        return newRowId;
      } catch (err) {
        console.log(err);
      }
  };

  async getAll() {
    try {
      let rows = await this.knex.from(this.table).select("*");
      return rows;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

}

module.exports = Container;