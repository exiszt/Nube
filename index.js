const parseArgs  = require('minimist');
const cluster = require('cluster');
const numCPUs = require("os").cpus().length;
const args = parseArgs(process.argv.slice(2),  { alias: { p: "PORT", m: "MODE"}, default: { PORT: 8080, MODE: "FORK" } });

const initServer = require("./server")
const app = initServer()
const PORT = args.PORT || 8080;

if (args.MODE == 'CLUSTER' && cluster.isPrimary) {
    console.log(numCPUs)
    console.log(`PID MASTER ${process.pid}`)
  
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
  
    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
} else {
    try {
        app.listen();
        console.log(`Server express running on PORT ${PORT}! - PID WORKER ${process.pid}`)
    } catch (error) {
        console.log(error)
    }
}