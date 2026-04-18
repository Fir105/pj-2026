const STORAGE_KEY = "industry-dashboard-state-v1";
const AUTO_REFRESH_MS = 5 * 60 * 1000;

let ChartLibrary = null;
let readExcelFileModule = null;

const DEMO_ROWS = [
    { date: "2026-01", production: 1180, target: 1250, downtime: 32, efficiency: 87, quality: 96, energy: 420, inventory: 610, demand: 1210, safety: 1, lineA: 430, lineB: 390, lineC: 360 },
    { date: "2026-02", production: 1245, target: 1280, downtime: 28, efficiency: 89, quality: 97, energy: 428, inventory: 640, demand: 1260, safety: 0, lineA: 450, lineB: 412, lineC: 383 },
    { date: "2026-03", production: 1290, target: 1300, downtime: 24, efficiency: 92, quality: 97, energy: 436, inventory: 660, demand: 1290, safety: 0, lineA: 468, lineB: 423, lineC: 399 },
    { date: "2026-04", production: 1348, target: 1360, downtime: 22, efficiency: 94, quality: 98, energy: 445, inventory: 680, demand: 1335, safety: 1, lineA: 489, lineB: 441, lineC: 418 },
    { date: "2026-05", production: 1385, target: 1400, downtime: 20, efficiency: 95, quality: 98, energy: 454, inventory: 702, demand: 1372, safety: 0, lineA: 502, lineB: 454, lineC: 429 },
    { date: "2026-06", production: 1418, target: 1430, downtime: 19, efficiency: 96, quality: 98, energy: 460, inventory: 720, demand: 1400, safety: 0, lineA: 517, lineB: 464, lineC: 437 },
    { date: "2026-07", production: 1392, target: 1440, downtime: 27, efficiency: 91, quality: 96, energy: 470, inventory: 688, demand: 1450, safety: 2, lineA: 505, lineB: 453, lineC: 434 },
    { date: "2026-08", production: 1460, target: 1475, downtime: 21, efficiency: 96, quality: 98, energy: 476, inventory: 735, demand: 1440, safety: 0, lineA: 528, lineB: 476, lineC: 456 },
    { date: "2026-09", production: 1495, target: 1500, downtime: 18, efficiency: 97, quality: 98, energy: 482, inventory: 748, demand: 1480, safety: 0, lineA: 540, lineB: 490, lineC: 465 },
    { date: "2026-10", production: 1528, target: 1535, downtime: 17, efficiency: 98, quality: 99, energy: 489, inventory: 760, demand: 1515, safety: 0, lineA: 553, lineB: 501, lineC: 474 },
    { date: "2026-11", production: 1566, target: 1580, downtime: 16, efficiency: 99, quality: 99, energy: 496, inventory: 775, demand: 1548, safety: 0, lineA: 567, lineB: 512, lineC: 487 },
    { date: "2026-12", production: 1608, target: 1615, downtime: 14, efficiency: 100, quality: 99, energy: 504, inventory: 790, demand: 1585, safety: 0, lineA: 582, lineB: 525, lineC: 501 },
];

const FIELD_ALIASES = normalizeAliasGroups({
    date: ["date", "tanggal", "periode", "period", "bulan", "month"],
    production: ["production", "produksi", "output", "aktual", "actual", "pdbindustriadhb", "pdbadhb"],
    target: ["target", "plan", "rencana", "budget", "pdbindustriadhk", "pdbadhk"],
    downtime: ["downtime", "stoptime", "jamdowntime", "stop"],
    efficiency: ["efficiency", "efisiensi", "utilization", "oee", "indekspdbadhk", "indekspdbadhb", "lajupertumbuhanqtoq", "pertindibs", "pertindimk"],
    quality: ["quality", "kualitas", "yield", "goodrate", "indeksibs", "indeksimk"],
    energy: ["energy", "energi", "kwh", "power", "consumption"],
    inventory: ["inventory", "stok", "stock", "persediaan", "buffer"],
    demand: ["demand", "permintaan", "order", "request"],
    safety: ["safety", "insiden", "incident", "accident", "kecelakaan"],
    lineA: ["linea", "line1", "lini1", "mesin1", "unit1"],
    lineB: ["lineb", "line2", "lini2", "mesin2", "unit2"],
    lineC: ["linec", "line3", "lini3", "mesin3", "unit3"],
});

const chartColors = {
    cyan: "#22d3ee",
    cyanSoft: "rgba(34, 211, 238, 0.18)",
    orange: "#fb923c",
    orangeSoft: "rgba(251, 146, 60, 0.2)",
    emerald: "#34d399",
    emeraldSoft: "rgba(52, 211, 153, 0.2)",
    rose: "#fb7185",
    roseSoft: "rgba(251, 113, 133, 0.18)",
    amber: "#fbbf24",
    amberSoft: "rgba(251, 191, 36, 0.18)",
    violet: "#a78bfa",
    violetSoft: "rgba(167, 139, 250, 0.18)",
    slate: "#94a3b8",
    text: "#e2e8f0",
    ticks: "#94a3b8",
    grid: "rgba(148, 163, 184, 0.14)",
    tooltip: "rgba(15, 23, 42, 0.94)",
};

const wholeNumberFormatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
});

const dashboardRoot = document.querySelector("[data-dashboard-root]");

if (dashboardRoot) {
    initializeDashboard(dashboardRoot);
}

async function initializeDashboard(root) {
    const elements = {
        fileInput: root.querySelector("[data-file-input]"),
        sheetUrl: root.querySelector("[data-sheet-url]"),
        syncUrl: root.querySelector("[data-sync-url]"),
        loadDemo: root.querySelector("[data-load-demo]"),
        status: root.querySelector("[data-sync-status]"),
        sourceName: root.querySelector("[data-source-name]"),
        lastSync: root.querySelector("[data-last-sync]"),
        previewBody: root.querySelector("[data-preview-body]"),
        metrics: {
            totalProduction: root.querySelector("[data-metric='total-production']"),
            averageEfficiency: root.querySelector("[data-metric='average-efficiency']"),
            demandFulfillment: root.querySelector("[data-metric='demand-fulfillment']"),
            totalDowntime: root.querySelector("[data-metric='total-downtime']"),
        },
        hero: {
            output: root.querySelector("[data-hero='output']"),
            efficiency: root.querySelector("[data-hero='efficiency']"),
            accuracy: root.querySelector("[data-hero='accuracy']"),
        },
        charts: {
            productionTrend: root.querySelector("[data-chart='productionTrend']"),
            downtimeEnergy: root.querySelector("[data-chart='downtimeEnergy']"),
            efficiencyArea: root.querySelector("[data-chart='efficiencyArea']"),
            lineDistribution: root.querySelector("[data-chart='lineDistribution']"),
            operationalRadar: root.querySelector("[data-chart='operationalRadar']"),
            riskPolar: root.querySelector("[data-chart='riskPolar']"),
            energyPie: root.querySelector("[data-chart='energyPie']"),
            performanceBubble: root.querySelector("[data-chart='performanceBubble']"),
        },
    };

    const state = {
        charts: {},
        rows: [],
        source: {
            type: "demo",
            label: "Data demo 12 bulan",
        },
        lastSync: null,
        refreshTimer: null,
    };

    elements.fileInput?.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        await importFromFile(file);
    });

    elements.syncUrl?.addEventListener("click", async () => {
        await syncFromUrl(elements.sheetUrl?.value?.trim() ?? "");
    });

    elements.sheetUrl?.addEventListener("keydown", async (event) => {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();
        await syncFromUrl(elements.sheetUrl?.value?.trim() ?? "");
    });

    elements.loadDemo?.addEventListener("click", () => {
        if (elements.fileInput) {
            elements.fileInput.value = "";
        }

        if (elements.sheetUrl) {
            elements.sheetUrl.value = "";
        }

        loadDemoData("Data demo aktif. Upload file atau tempel URL spreadsheet publik untuk mengganti semua grafik.");
    });

    try {
        await getChartLibrary();
    } catch (error) {
        setStatus(resolveErrorMessage(error, "Library grafik gagal dimuat."), "error");
        return;
    }

    if (!restoreStoredState()) {
        loadDemoData("Data demo aktif. Upload file atau tempel URL spreadsheet publik untuk mengganti semua grafik.");
    }

    async function importFromFile(file) {
        setStatus(`Membaca file ${file.name}...`, "neutral");

        try {
            const fileName = file.name.toLowerCase();
            let rawRows = [];

            if (fileName.endsWith(".csv")) {
                rawRows = parseCsvText(await file.text());
            } else if (fileName.endsWith(".xlsx")) {
                const readExcelFile = await getSpreadsheetReader();
                rawRows = rowsFromWorksheet(await readExcelFile(file));
            } else {
                throw new Error("Format file yang didukung saat ini adalah .xlsx dan .csv.");
            }

            const rows = prepareRows(rawRows);

            applyRows(rows, {
                type: "file",
                label: file.name,
            });

            setStatus(`File ${file.name} berhasil disinkronkan ke dashboard.`, "success");
        } catch (error) {
            setStatus(resolveErrorMessage(error, "File tidak bisa dibaca. Pastikan formatnya xlsx atau csv."), "error");
        }
    }

    async function syncFromUrl(url, options = {}) {
        if (!url) {
            setStatus("Masukkan URL Google Sheets atau CSV publik terlebih dahulu.", "error");
            return;
        }

        const fetchUrl = normalizeSheetUrl(url);

        setStatus(options.auto ? "Memperbarui data dari spreadsheet publik..." : "Menghubungkan spreadsheet publik...", "neutral");

        try {
            const response = await fetch(fetchUrl, {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("URL spreadsheet tidak dapat diakses. Pastikan file sudah dipublikasikan untuk publik.");
            }

            const text = await response.text();
            const rows = prepareRows(parseCsvText(text));

            applyRows(rows, {
                type: "sheet",
                label: summarizeUrl(url),
                url,
                refreshUrl: fetchUrl,
            });

            setStatus(options.auto ? "Spreadsheet publik berhasil diperbarui otomatis." : "Spreadsheet publik berhasil disinkronkan.", "success");
        } catch (error) {
            setStatus(resolveErrorMessage(error, "Sinkronisasi URL gagal. Cek kembali tautan spreadsheet publik atau CSV Anda."), "error");
        }
    }

    function loadDemoData(message) {
        applyRows(prepareRows(DEMO_ROWS, { canonical: true }), {
            type: "demo",
            label: "Data demo 12 bulan",
        });
        setStatus(message, "neutral");
    }

    function applyRows(rows, source) {
        state.rows = rows;
        state.source = source;
        state.lastSync = new Date().toISOString();

        persistState();
        renderDashboard();
        scheduleAutoRefresh();
    }

    function renderDashboard() {
        const summary = buildSummary(state.rows);

        updateMetrics(summary);
        updateMeta(summary);
        renderPreviewTable(summary.rows);
        renderCharts(summary);
    }

    function updateMetrics(summary) {
        writeText(elements.metrics.totalProduction, `${formatWhole(summary.totalProduction)} unit`);
        writeText(elements.metrics.averageEfficiency, formatPercent(summary.averageEfficiency));
        writeText(elements.metrics.demandFulfillment, formatPercent(summary.demandFulfillment));
        writeText(elements.metrics.totalDowntime, `${formatWhole(summary.totalDowntime)} jam`);

        writeText(elements.hero.output, `${formatWhole(summary.totalProduction)} unit`);
        writeText(elements.hero.efficiency, formatPercent(summary.averageEfficiency));
        writeText(elements.hero.accuracy, formatPercent(summary.targetAchievement));
    }

    function updateMeta() {
        writeText(elements.sourceName, state.source.label);
        writeText(elements.lastSync, state.lastSync ? dateTimeFormatter.format(new Date(state.lastSync)) : "-");

        if (state.source.type === "sheet" && state.source.url && elements.sheetUrl) {
            elements.sheetUrl.value = state.source.url;
        }
    }

    function renderPreviewTable(rows) {
        if (!elements.previewBody) {
            return;
        }

        const previewRows = rows.slice(0, 8);

        if (!previewRows.length) {
            elements.previewBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-4 py-5 text-center text-slate-400">Belum ada data untuk ditampilkan.</td>
                </tr>
            `;
            return;
        }

        elements.previewBody.innerHTML = previewRows
            .map(
                (row) => `
                    <tr class="odd:bg-white/[0.02]">
                        <td class="px-4 py-3 font-medium text-white">${escapeHtml(formatPeriodLabel(row.date))}</td>
                        <td class="px-4 py-3 text-slate-300">${formatWhole(row.production)}</td>
                        <td class="px-4 py-3 text-slate-300">${formatWhole(row.target)}</td>
                        <td class="px-4 py-3 text-slate-300">${formatPercent(row.efficiency)}</td>
                        <td class="px-4 py-3 text-slate-300">${formatPercent(row.quality)}</td>
                        <td class="px-4 py-3 text-slate-300">${formatWhole(row.energy)}</td>
                        <td class="px-4 py-3 text-slate-300">${formatWhole(row.downtime)}</td>
                    </tr>
                `,
            )
            .join("");
    }

    function renderCharts(summary) {
        destroyCharts();

        mountChart("productionTrend", (canvas) => {
            const gradient = createGradient(canvas, "rgba(34, 211, 238, 0.42)", "rgba(34, 211, 238, 0.02)");

            return {
                type: "line",
                data: {
                    labels: summary.labels,
                    datasets: [
                        {
                            label: "Produksi",
                            data: summary.rows.map((row) => row.production),
                            borderColor: chartColors.cyan,
                            backgroundColor: gradient,
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                            pointHoverRadius: 5,
                        },
                        {
                            label: "Target",
                            data: summary.rows.map((row) => row.target),
                            borderColor: chartColors.orange,
                            borderDash: [8, 6],
                            pointRadius: 0,
                            tension: 0.3,
                        },
                    ],
                },
                options: cartesianOptions(),
            };
        });

        mountChart("downtimeEnergy", () => ({
            type: "bar",
            data: {
                labels: summary.labels,
                datasets: [
                    {
                        label: "Downtime (jam)",
                        data: summary.rows.map((row) => row.downtime),
                        backgroundColor: chartColors.roseSoft,
                        borderColor: chartColors.rose,
                        borderWidth: 1.2,
                        borderRadius: 12,
                    },
                    {
                        type: "line",
                        label: "Energi (kWh)",
                        data: summary.rows.map((row) => row.energy),
                        borderColor: chartColors.amber,
                        backgroundColor: chartColors.amberSoft,
                        yAxisID: "y1",
                        tension: 0.35,
                        pointRadius: 3,
                    },
                ],
            },
            options: cartesianOptions({
                scales: {
                    y: makeLinearScale("Jam"),
                    y1: {
                        position: "right",
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: chartColors.ticks,
                        },
                        title: {
                            display: true,
                            text: "kWh",
                            color: chartColors.ticks,
                        },
                    },
                },
            }),
        }));

        mountChart("efficiencyArea", (canvas) => {
            const efficiencyGradient = createGradient(canvas, "rgba(52, 211, 153, 0.4)", "rgba(52, 211, 153, 0.03)");
            const qualityGradient = createGradient(canvas, "rgba(167, 139, 250, 0.3)", "rgba(167, 139, 250, 0.02)");

            return {
                type: "line",
                data: {
                    labels: summary.labels,
                    datasets: [
                        {
                            label: "Efisiensi",
                            data: summary.rows.map((row) => row.efficiency),
                            borderColor: chartColors.emerald,
                            backgroundColor: efficiencyGradient,
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                        },
                        {
                            label: "Kualitas",
                            data: summary.rows.map((row) => row.quality),
                            borderColor: chartColors.violet,
                            backgroundColor: qualityGradient,
                            fill: true,
                            tension: 0.35,
                            pointRadius: 3,
                        },
                    ],
                },
                options: cartesianOptions({
                    scales: {
                        y: makePercentScale("Persentase", 120),
                    },
                }),
            };
        });

        mountChart("lineDistribution", () => ({
            type: "doughnut",
            data: {
                labels: ["Line A", "Line B", "Line C"],
                datasets: [
                    {
                        data: summary.lineTotals,
                        backgroundColor: [chartColors.cyan, chartColors.orange, chartColors.emerald],
                        borderColor: "rgba(2, 6, 23, 0.6)",
                        borderWidth: 3,
                    },
                ],
            },
            options: circularOptions(),
        }));

        mountChart("operationalRadar", () => ({
            type: "radar",
            data: {
                labels: ["Efisiensi", "Kualitas", "Demand", "Stok", "Safety", "Energi"],
                datasets: [
                    {
                        label: "Skor Operasi",
                        data: summary.radarScores,
                        backgroundColor: "rgba(34, 211, 238, 0.18)",
                        borderColor: chartColors.cyan,
                        pointBackgroundColor: chartColors.cyan,
                        pointBorderColor: "#082f49",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: circularPlugins(),
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            backdropColor: "transparent",
                            color: chartColors.ticks,
                            stepSize: 20,
                        },
                        angleLines: {
                            color: chartColors.grid,
                        },
                        grid: {
                            color: chartColors.grid,
                        },
                        pointLabels: {
                            color: chartColors.text,
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
            },
        }));

        mountChart("riskPolar", () => ({
            type: "polarArea",
            data: {
                labels: ["Gap Target", "Downtime", "Loss Kualitas", "Safety", "Intensitas Energi"],
                datasets: [
                    {
                        data: summary.riskScores,
                        backgroundColor: [
                            "rgba(251, 146, 60, 0.34)",
                            "rgba(251, 113, 133, 0.34)",
                            "rgba(167, 139, 250, 0.34)",
                            "rgba(248, 113, 113, 0.34)",
                            "rgba(250, 204, 21, 0.34)",
                        ],
                        borderColor: [
                            chartColors.orange,
                            chartColors.rose,
                            chartColors.violet,
                            "#f87171",
                            chartColors.amber,
                        ],
                        borderWidth: 1.4,
                    },
                ],
            },
            options: circularOptions(),
        }));

        mountChart("energyPie", () => ({
            type: "pie",
            data: {
                labels: ["Line A", "Line B", "Line C"],
                datasets: [
                    {
                        data: summary.energyByLine,
                        backgroundColor: [chartColors.amber, chartColors.cyan, chartColors.violet],
                        borderColor: "rgba(2, 6, 23, 0.72)",
                        borderWidth: 3,
                    },
                ],
            },
            options: circularOptions(),
        }));

        mountChart("performanceBubble", () => ({
            type: "bubble",
            data: {
                datasets: [
                    {
                        label: "Periode",
                        data: summary.bubbleData,
                        backgroundColor: [
                            "rgba(34, 211, 238, 0.55)",
                            "rgba(251, 146, 60, 0.55)",
                            "rgba(52, 211, 153, 0.55)",
                            "rgba(251, 113, 133, 0.55)",
                            "rgba(167, 139, 250, 0.55)",
                            "rgba(251, 191, 36, 0.55)",
                            "rgba(56, 189, 248, 0.55)",
                            "rgba(45, 212, 191, 0.55)",
                            "rgba(248, 113, 113, 0.55)",
                            "rgba(129, 140, 248, 0.55)",
                            "rgba(16, 185, 129, 0.55)",
                            "rgba(251, 146, 60, 0.55)",
                        ],
                        borderColor: "rgba(255, 255, 255, 0.18)",
                        borderWidth: 1.2,
                    },
                ],
            },
            options: {
                ...cartesianOptions({
                    scales: {
                        x: makePercentScale("Efisiensi", 120),
                        y: makePercentScale("Kualitas", 100),
                    },
                }),
                plugins: {
                    ...commonPlugins(),
                    tooltip: {
                        ...tooltipDefaults(),
                        callbacks: {
                            label(context) {
                                const point = context.raw ?? {};
                                return `${point.label}: efisiensi ${formatPercent(point.x ?? 0)}, kualitas ${formatPercent(point.y ?? 0)}, produksi ${formatWhole(point.production ?? 0)}`;
                            },
                        },
                    },
                },
            },
        }));
    }

    function destroyCharts() {
        Object.values(state.charts).forEach((chart) => chart.destroy());
        state.charts = {};
    }

    function mountChart(key, createConfig) {
        const canvas = elements.charts[key];

        if (!canvas) {
            return;
        }

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        state.charts[key] = new ChartLibrary(context, createConfig(canvas));
    }

    function scheduleAutoRefresh() {
        if (state.refreshTimer) {
            window.clearInterval(state.refreshTimer);
            state.refreshTimer = null;
        }

        if (state.source.type !== "sheet" || !state.source.url) {
            return;
        }

        state.refreshTimer = window.setInterval(async () => {
            await syncFromUrl(state.source.url, { auto: true });
        }, AUTO_REFRESH_MS);
    }

    function restoreStoredState() {
        try {
            const rawState = window.localStorage.getItem(STORAGE_KEY);

            if (!rawState) {
                return false;
            }

            const parsedState = JSON.parse(rawState);

            if (!Array.isArray(parsedState.rows) || !parsedState.rows.length) {
                return false;
            }

            state.rows = prepareRows(parsedState.rows, { canonical: true });
            state.source = parsedState.source ?? state.source;
            state.lastSync = parsedState.lastSync ?? new Date().toISOString();

            renderDashboard();
            scheduleAutoRefresh();
            setStatus("Data terakhir dipulihkan dari browser ini.", "neutral");

            if (state.source.type === "sheet" && state.source.url && elements.sheetUrl) {
                elements.sheetUrl.value = state.source.url;
            }

            return true;
        } catch {
            return false;
        }
    }

    function persistState() {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    rows: state.rows,
                    source: state.source,
                    lastSync: state.lastSync,
                }),
            );
        } catch {
            // Browser privacy mode can disable localStorage. The dashboard still works without persistence.
        }
    }

    function setStatus(message, tone) {
        if (!elements.status) {
            return;
        }

        elements.status.textContent = message;
        elements.status.dataset.tone = tone;
    }
}

function prepareRows(rows, options = {}) {
    const mappedRows = options.canonical ? rows : rows.map((row, index) => mapRawRow(row, index));

    if (
        !options.canonical &&
        !mappedRows.some((row) => row.production !== undefined || row.target !== undefined || row.efficiency !== undefined)
    ) {
        throw new Error("Header spreadsheet belum cocok. Gunakan template atau pakai kolom date/tanggal dan production/produksi.");
    }

    const hydratedRows = mappedRows.map((row, index) => hydrateRow(row, index)).filter(Boolean);

    if (!hydratedRows.length) {
        throw new Error("Sheet pertama kosong atau tidak memiliki data yang bisa dipakai.");
    }

    return hydratedRows;
}

function mapRawRow(rawRow, index) {
    const lookup = new Map(
        Object.entries(rawRow).map(([key, value]) => [normalizeHeader(key), value]),
    );

    const mappedRow = {};

    Object.entries(FIELD_ALIASES).forEach(([field, aliases]) => {
        const matchedAlias = aliases.find((alias) => lookup.has(alias));

        if (matchedAlias) {
            mappedRow[field] = lookup.get(matchedAlias);
        }
    });

    if (!mappedRow.date) {
        mappedRow.date = `Periode ${index + 1}`;
    }

    return mappedRow;
}

function hydrateRow(row, index) {
    const isEmptyRow =
        Object.values(row).filter((value) => value !== undefined && value !== null).length === 0;

    if (isEmptyRow) {
        return null;
    }

    const date = normalizeDateValue(row.date ?? `Periode ${index + 1}`);
    let production = parseNumber(row.production);
    let target = parseNumber(row.target);
    const downtime = parseNumber(row.downtime);
    let efficiency = parseNumber(row.efficiency);
    let quality = parseNumber(row.quality);
    let energy = parseNumber(row.energy);
    let inventory = parseNumber(row.inventory);
    let demand = parseNumber(row.demand);
    const safety = parseNumber(row.safety);

    let lineA = parseNumber(row.lineA);
    let lineB = parseNumber(row.lineB);
    let lineC = parseNumber(row.lineC);
    const lineTotal = lineA + lineB + lineC;

    if (!production && lineTotal) {
        production = lineTotal;
    }

    if (!lineTotal && production) {
        lineA = Math.round(production * 0.36);
        lineB = Math.round(production * 0.33);
        lineC = Math.max(production - lineA - lineB, 0);
    }

    if (!target) {
        target = Math.round(Math.max(production * 1.04, production + 25));
    }

    if (!efficiency && target) {
        efficiency = (production / target) * 100;
    }

    if (!quality) {
        quality = 94;
    }

    if (!energy && production) {
        energy = Math.round(production * 0.33);
    }

    if (!inventory && production) {
        inventory = Math.round(production * 0.5);
    }

    if (!demand) {
        demand = target;
    }

    return {
        date,
        production,
        target,
        downtime,
        efficiency: clamp(efficiency, 0, 125),
        quality: clamp(quality, 0, 100),
        energy,
        inventory,
        demand,
        safety: Math.max(safety, 0),
        lineA,
        lineB,
        lineC,
    };
}

function buildSummary(rows) {
    const labels = rows.map((row) => formatPeriodLabel(row.date));
    const totalProduction = sum(rows.map((row) => row.production));
    const totalTarget = sum(rows.map((row) => row.target));
    const totalDowntime = sum(rows.map((row) => row.downtime));
    const totalEnergy = sum(rows.map((row) => row.energy));
    const totalDemand = sum(rows.map((row) => row.demand));
    const totalSafety = sum(rows.map((row) => row.safety));
    const averageEfficiency = average(rows.map((row) => row.efficiency));
    const averageQuality = average(rows.map((row) => row.quality));
    const averageInventory = average(rows.map((row) => row.inventory));
    const averageDemand = average(rows.map((row) => row.demand));
    const lineTotals = [
        sum(rows.map((row) => row.lineA)),
        sum(rows.map((row) => row.lineB)),
        sum(rows.map((row) => row.lineC)),
    ];
    const demandFulfillment = totalDemand ? (totalProduction / totalDemand) * 100 : 0;
    const targetAchievement = totalTarget ? (totalProduction / totalTarget) * 100 : 0;
    const energyIntensity = totalProduction ? totalEnergy / totalProduction : 0;
    const stockScore = averageDemand ? clamp((averageInventory / averageDemand) * 100, 0, 100) : 0;
    const safetyScore = clamp(100 - totalSafety * 8, 0, 100);
    const energyScore = clamp(120 - energyIntensity * 100, 0, 100);
    const lineEnergy = lineTotals.map((lineOutput) =>
        totalProduction ? Number(((lineOutput / totalProduction) * totalEnergy).toFixed(1)) : 0,
    );

    return {
        rows,
        labels,
        totalProduction,
        totalDowntime,
        totalEnergy,
        totalDemand,
        averageEfficiency,
        averageQuality,
        demandFulfillment: clamp(demandFulfillment, 0, 140),
        targetAchievement: clamp(targetAchievement, 0, 140),
        lineTotals,
        energyByLine: lineEnergy,
        radarScores: [
            clamp(averageEfficiency, 0, 100),
            clamp(averageQuality, 0, 100),
            clamp(demandFulfillment, 0, 100),
            stockScore,
            safetyScore,
            energyScore,
        ],
        riskScores: [
            clamp(100 - targetAchievement, 0, 100),
            clamp((totalDowntime / Math.max(rows.length, 1)) * 2.4, 0, 100),
            clamp(100 - averageQuality, 0, 100),
            clamp(totalSafety * 12, 0, 100),
            clamp(energyIntensity * 120, 0, 100),
        ],
        bubbleData: rows.map((row) => ({
            x: row.efficiency,
            y: row.quality,
            r: clamp(row.production / 60, 8, 22),
            label: formatPeriodLabel(row.date),
            production: row.production,
        })),
    };
}

function cartesianOptions(overrides = {}) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: commonPlugins(),
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: chartColors.ticks,
                },
            },
            y: makeLinearScale(),
        },
        ...overrides,
        plugins: {
            ...commonPlugins(),
            ...(overrides.plugins ?? {}),
        },
    };
}

function circularOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: circularPlugins(),
    };
}

function commonPlugins() {
    return {
        legend: {
            labels: {
                color: chartColors.text,
                usePointStyle: true,
                boxWidth: 10,
                padding: 16,
            },
        },
        tooltip: tooltipDefaults(),
    };
}

function circularPlugins() {
    return {
        ...commonPlugins(),
        legend: {
            position: "bottom",
            labels: {
                color: chartColors.text,
                usePointStyle: true,
                boxWidth: 10,
                padding: 18,
            },
        },
    };
}

function tooltipDefaults() {
    return {
        backgroundColor: chartColors.tooltip,
        borderColor: "rgba(148, 163, 184, 0.18)",
        borderWidth: 1,
        titleColor: "#f8fafc",
        bodyColor: chartColors.text,
        padding: 12,
        cornerRadius: 14,
    };
}

function makeLinearScale(title) {
    return {
        beginAtZero: true,
        grid: {
            color: chartColors.grid,
        },
        ticks: {
            color: chartColors.ticks,
        },
        title: title
            ? {
                  display: true,
                  text: title,
                  color: chartColors.ticks,
              }
            : undefined,
    };
}

function makePercentScale(title = "Persentase", maxValue = 100) {
    return {
        min: 0,
        max: maxValue,
        grid: {
            color: chartColors.grid,
        },
        ticks: {
            color: chartColors.ticks,
            callback(value) {
                return `${value}%`;
            },
        },
        title: {
            display: true,
            text: title,
            color: chartColors.ticks,
        },
    };
}

function createGradient(canvas, startColor, endColor) {
    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 0, canvas.clientHeight || 320);

    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);

    return gradient;
}

function normalizeAliasGroups(groups) {
    return Object.fromEntries(
        Object.entries(groups).map(([field, aliases]) => [field, aliases.map((alias) => normalizeHeader(alias))]),
    );
}

function normalizeHeader(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

function normalizeDateValue(value) {
    if (typeof value === "number" && value >= 20000 && value <= 80000) {
        const serialDate = excelSerialToDate(value);

        if (serialDate) {
            return serialDate;
        }
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
    }

    return String(value ?? "").trim() || "Periode";
}

function normalizeSheetUrl(url) {
    const cleanUrl = url.trim();

    if (!cleanUrl.includes("docs.google.com/spreadsheets")) {
        return cleanUrl;
    }

    const spreadsheetId = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    const gid = cleanUrl.match(/[?&#]gid=([0-9]+)/)?.[1];

    if (!spreadsheetId) {
        return cleanUrl;
    }

    const query = gid ? `&gid=${gid}` : "";

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${query}`;
}

function summarizeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

function parseNumber(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    const rawValue = String(value ?? "").trim();

    if (!rawValue) {
        return 0;
    }

    let normalized = rawValue.replace(/[^0-9,.-]+/g, "");

    if (normalized.includes(",") && normalized.includes(".")) {
        if (normalized.lastIndexOf(",") > normalized.lastIndexOf(".")) {
            normalized = normalized.replace(/\./g, "").replace(",", ".");
        } else {
            normalized = normalized.replace(/,/g, "");
        }
    } else if (normalized.includes(",")) {
        const pieces = normalized.split(",");
        normalized =
            pieces.length === 2 && pieces[1].length <= 2
                ? `${pieces[0].replace(/\./g, "")}.${pieces[1]}`
                : normalized.replace(/,/g, "");
    }

    const parsedValue = Number(normalized);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatPeriodLabel(value) {
    if (/^\d{4}-\d{2}$/.test(value)) {
        const date = new Date(`${value}-01T00:00:00`);
        return new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(date);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const date = new Date(`${value}T00:00:00`);
        return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short" }).format(date);
    }

    return value;
}

function sum(values) {
    return values.reduce((total, value) => total + value, 0);
}

function average(values) {
    return values.length ? sum(values) / values.length : 0;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function formatWhole(value) {
    return wholeNumberFormatter.format(Math.round(value));
}

function formatPercent(value) {
    return `${decimalFormatter.format(value)}%`;
}

function writeText(node, value) {
    if (node) {
        node.textContent = value;
    }
}

function resolveErrorMessage(error, fallbackMessage) {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallbackMessage;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

async function getChartLibrary() {
    if (!ChartLibrary) {
        ChartLibrary = (await import("chart.js/auto")).default;
    }

    return ChartLibrary;
}

async function getSpreadsheetReader() {
    if (!readExcelFileModule) {
        const module = await import("read-excel-file/browser");
        readExcelFileModule = module.default ?? module;
    }

    return readExcelFileModule;
}

function rowsFromWorksheet(sheetRows) {
    if (!Array.isArray(sheetRows) || sheetRows.length < 2) {
        throw new Error("File Excel kosong atau belum memiliki baris header.");
    }

    const [headerRow, ...dataRows] = sheetRows;
    const headers = headerRow.map((cell, index) => {
        const value = String(cell ?? "").trim();
        return value || `column_${index + 1}`;
    });

    return dataRows
        .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
        .map((row) =>
            Object.fromEntries(headers.map((header, index) => [header, normalizeSpreadsheetCell(row[index])])),
        );
}

function normalizeSpreadsheetCell(value) {
    if (value instanceof Date) {
        return value;
    }

    return value ?? "";
}

function parseCsvText(text) {
    const rows = [];
    let currentRow = [];
    let currentValue = "";
    let insideQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        const nextCharacter = text[index + 1];

        if (character === '"') {
            if (insideQuotes && nextCharacter === '"') {
                currentValue += '"';
                index += 1;
            } else {
                insideQuotes = !insideQuotes;
            }

            continue;
        }

        if (character === "," && !insideQuotes) {
            currentRow.push(currentValue);
            currentValue = "";
            continue;
        }

        if ((character === "\n" || character === "\r") && !insideQuotes) {
            if (character === "\r" && nextCharacter === "\n") {
                index += 1;
            }

            currentRow.push(currentValue);
            rows.push(currentRow);
            currentRow = [];
            currentValue = "";
            continue;
        }

        currentValue += character;
    }

    currentRow.push(currentValue);

    if (currentRow.some((cell) => cell !== "")) {
        rows.push(currentRow);
    }

    if (rows.length < 2) {
        throw new Error("CSV publik kosong atau belum memiliki header.");
    }

    const [headerRow, ...dataRows] = rows;
    const headers = headerRow.map((header, index) => header.trim() || `column_${index + 1}`);

    return dataRows
        .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
        .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
}

function excelSerialToDate(serial) {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);

    if (Number.isNaN(dateInfo.getTime())) {
        return "";
    }

    return `${dateInfo.getUTCFullYear()}-${String(dateInfo.getUTCMonth() + 1).padStart(2, "0")}-${String(dateInfo.getUTCDate()).padStart(2, "0")}`;
}
