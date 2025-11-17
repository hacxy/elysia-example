import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";

// 多核运行服务器
if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
} else {
  await import("./app");
  console.log(`Worker ${process.pid} started`);
}
