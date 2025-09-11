// import module with the name blessed
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const { getCpuUsage,getMemoryUsage,getDiskUsage,getStaticInfo } = require('./metric');


// UI setup
const screen = blessed.screen({
	smartCSR: true,
	title: 'System Monitor Dashboard'
});

// Main grid Layout
const grid = new contrib.grid({
	rows: 12,
	cols: 12,
	screen: screen
});

// static info widget
const staticInfoBox = grid.set(0,0,2,12,blessed.text, {
	label: ' System Info',
	content: 'Loading...',
	border: { type: 'line' },
	style: { border: { fg: 'cyan' }}
});
// CPU widget (no change needed here)
const cpuBox = grid.set(2, 0, 4, 12, blessed.log, {
  label: ' CPU Usage ',
  border: { type: 'line' },
  style: { border: { fg: 'cyan' } }
});

// memory widgets
const memBox = grid.set(6,0,3,12,blessed.log, {
	label: ' Memory Usage',
	border: { type: 'line' },
	style: { border: { fg: 'cyan' }}
});

// disk widget
const diskBox = grid.set(9,0,3,12,blessed.log,{
	label : ' Disk Usage',
	border: { type: 'line' },
	style: { border: { fg: 'cyan' }}
});

// Data Update Logic
function createProgressBar(percent) {
	const filledLength = Math.round((percent /100)*30);
	const emptyLength = 30 - filledLength;
	return `[${'|'.repeat(filledLength)}${' '.repeat(emptyLength)}] ${percent}%`;
}
async function updateData() {
	try {
		// clear previous logs before adding new ones
		cpuBox.setContent('');
		memBox.setContent('');
		diskBox.setContent('');

		// cpu
		const cpu = await getCpuUsage();
		cpuBox.log('Overall: ' + createProgressBar(cpu.overall));
		cpu.cores.forEach((core,i) => {
			cpuBox.log(`Core ${i}: ` + createProgressBar(core));
		});

		// Memory
 		const mem = await getMemoryUsage();
    		memBox.log(`RAM:     ${createProgressBar(mem.percent)} (${mem.used} / ${mem.total} GB)`);

    		// Disk
    		const disk = await getDiskUsage();
    		diskBox.log(`Space:   ${createProgressBar(disk.percent)} (${disk.used} / ${disk.total} GB)`);

    		// Re-render the screen
    		screen.render();
  		} catch (err) {
    		// Log errors to a file or display them if needed
    		console.error(err);
  	}
}

// --- Initial Load & Interval ---

async function initialize() {
    // Fetch static info once
    const staticInfo = await getStaticInfo();
    staticInfoBox.setContent(`Hostname: ${staticInfo.hostname}\nUptime:   ${staticInfo.uptime}`);

    // Initial data load
    await updateData();

    // Update data every 2 seconds
    setInterval(updateData, 2000);
}

// --- Event Handlers & Start ---

screen.key(['q', 'C-c'], (ch, key) => {
  return process.exit(0);
});

initialize();

