const express = require('express');
const { Router } = express;
const router = Router();
const compression = require('compression')

const { fork } = require('child_process');
const numCPUs = require("os").cpus().length;

router.get('/info', (req, res) => {
  const info = getInfo();
  res.render("pages/info.hbs", {info});
});

router.get('/info-json', (req, res) => {
  //console.log(getInfo());
  res.json(getInfo());
});

router.get('/info-json-gzip', compression(), (req, res) => {
  res.json(getInfo());
});


function getInfo(){
  const systemInfo = {
    argumentos_de_entrada: process.argv.slice(2),
    path_de_ejecucion: process.execPath,
    sistema_operativo: process.platform,
    process_id: process.pid,
    version_node: process.version,
    carpeta_del_proyecto: process.cwd(),
    memoria_total_reservada: process.memoryUsage().rss,
    numero_CPUs: numCPUs
  };
  return systemInfo;
}

router.get('/api/randoms', (req, res) => {
    return res.json("deshabilitado");
});

module.exports = router;