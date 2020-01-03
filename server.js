const express = require("express");
const si = require("systeminformation");
const exphbs = require("express-handlebars");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(require("express-status-monitor")());
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/general", (req, res) => {
  const version = si.version();
  const time = si.time();
  time.current = new Date(time.current).toLocaleString();
  time.uptime = new Date(time.uptime).toLocaleTimeString();
  res.render("general", { version, time });
});
app.get("/system-hw", async (req, res) => {
  const sysHardware = await si.system();
  const bios = await si.bios();
  const baseboard = await si.baseboard();
  const chassis = await si.chassis();
  res.render("system-hw", { sysHardware, bios, baseboard });
});
app.get("/cpu", async (req, res) => {
  const cpus = await si.cpu();
  res.render("cpu", { cpus });
});
app.get("/memory", async (req, res) => {
  const memory = await si.mem();
  memory.total = (memory.total / 1073741824).toString().slice(0, 4);
  memory.free = (memory.free / 1073741824).toString().slice(0, 4);
  memory.used = (memory.used / 1073741824).toString().slice(0, 4);
  memory.active = (memory.active / 1073741824).toString().slice(0, 4);
  memory.available = (memory.available / 1073741824).toString().slice(0, 4);
  memory.swaptotal = (memory.swaptotal / 1073741824).toString().slice(0, 4);
  memory.swapused = (memory.swapused / 1073741824).toString().slice(0, 4);
  memory.swapfree = (memory.swapfree / 1073741824).toString().slice(0, 4);
  res.render("memory", { memory });
});
app.get("/battery", async (req, res) => {
  const battery = await si.battery();
  res.render("battery", { battery });
});
app.get("/os", async (req, res) => {
  const os = await si.osInfo();
  res.render("os", { os });
});
app.get("/processes", async (req, res) => {
  const processes = await si.processes();
  const { list } = processes;
  list.map(item => {
    item.pcpu = item.pcpu.toString().slice(0, 5);
    item.pmem = item.pmem.toString().slice(0, 5);
  });
  const total = list.length;
  res.render("processes", { list, total });
});

app.get("/network", async (req, res) => {
  const ni = await si.networkInterfaces();
  res.render("network", { ni });
});
app.get("/wifi", async (req, res) => {
  const wifi = await si.wifiNetworks();
  res.render("wifi", { wifi });
});

app.get("/docker", async (req, res) => {
  const dockerInfo = await si.dockerInfo();
  res.render("docker", { dockerInfo });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
