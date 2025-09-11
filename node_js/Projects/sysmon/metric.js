// metrics.js : this file will gather metrics and display on screen
const si = require('systeminformation');

async function getCpuUsage() {
	// si.currentLoad() gives overal load and per-core load
	const load = await si.currentLoad();
	return {
		overall: load.currentLoad.toFixed(2),
		cores: load.cpus.map(cpu => cpu.load.toFixed(2))
	};
}
async function getMemoryUsage() {
	const mem = await si.mem();
	return {
		total: (mem.total / 1024 / 1024 / 1024).toFixed(2),
		used: (mem.used /1024 /1024 / 1024).toFixed(2),
		percent: ((mem.used /mem.total) * 100).toFixed(2)
	};
}
async function getDiskUsage() {
	// we'll monitor the main filesystem si.fsSize() returs an array
	const fs = await si.fsSize();
	const mainFs = fs[0];
	return {
		total: (mainFs.size / 1024 /1024 /1024).toFixed(2),
		used: (mainFs.used / 1024 /1024 /1024).toFixed(2),
		percent: mainFs.use.toFixed(2)
	};
}

    async function getStaticInfo() {
    const os = await si.osInfo();
    const time = si.time();
    return {
        hostname: os.hostname,
        uptime: formatUptime(time.uptime)
    };
}

function formatUptime(seconds) {
	const d = Math.floor(seconds / (3600*24));
	const h = Math.floor(seconds % (3600*24)/3600);
	const m = Math.floor(seconds % 3600/60);
	return `${d} days, ${h} hours, ${m} mins`;
}
module.exports = {
	getCpuUsage,
	getMemoryUsage,
	getDiskUsage,
	getStaticInfo
};


