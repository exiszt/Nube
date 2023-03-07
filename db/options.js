const optionsSQLite = {
  client: "sqlite3",
  connection: {
    filename: "./db/ecommerce.sqlite",
  },
  useNullAsDefault: true,
};

const optionsSQLiteCreate = {
  client: "sqlite3",
  connection: {
    filename: "./ecommerce.sqlite",
  },
  useNullAsDefault: true,
};

const optionsMaria = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "products",
  },
};

module.exports = { optionsMaria, optionsSQLite, optionsSQLiteCreate };