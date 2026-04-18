<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Dashboard Industri Sinkron Spreadsheet</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=dm-sans:400,500,700,800|space-grotesk:500,700" rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen overflow-x-hidden bg-slate-950 text-slate-50 selection:bg-cyan-300 selection:text-slate-950">
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div class="absolute inset-0 bg-[linear-gradient(135deg,#020617_0%,#0f172a_48%,#111827_100%)]"></div>
        <div class="absolute inset-0 opacity-30" style="background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px); background-size: 92px 92px;"></div>
        <div class="absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[140px]"></div>
        <div class="absolute right-[-10%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-orange-400/15 blur-[120px]"></div>
        <div class="absolute bottom-[-12%] left-[2%] h-[24rem] w-[24rem] rounded-full bg-emerald-400/10 blur-[120px]"></div>
    </div>

    <div data-dashboard-root class="relative">
        <header class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-6 pt-5 sm:px-6 lg:px-8 lg:pt-8">
            <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-black text-cyan-200 shadow-[0_18px_50px_-28px_rgba(34,211,238,0.7)]">
                    PI
                </div>
                <div>
                    <p class="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Plant Intelligence</p>
                    <h1 class="dashboard-heading text-lg font-bold text-white sm:text-xl">Dashboard Industri Sinkron Spreadsheet</h1>
                </div>
            </div>

            <div class="flex flex-wrap items-center justify-end gap-3">
                <a
                    href="{{ asset('dashboard-template.csv') }}"
                    class="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
                >
                    Unduh Template CSV
                </a>

                @if (Route::has('filament.admin.auth.login'))
                    <a
                        href="{{ route('filament.admin.auth.login') }}"
                        class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                    >
                        Admin Panel
                    </a>
                @endif
            </div>
        </header>

        <main class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <section class="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                <div class="dashboard-panel rounded-[30px] p-6 sm:p-8">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                            Dashboard Live
                        </span>
                        <span class="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-100">
                            Excel + Google Sheets
                        </span>
                    </div>

                    <div class="mt-6 max-w-3xl">
                        <h2 class="dashboard-heading text-4xl font-black leading-tight text-white sm:text-5xl">
                            Pusat kontrol produksi, energi, kualitas, dan downtime dalam satu layar.
                        </h2>
                        <p class="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                            Website ini menampilkan KPI industri dan banyak tipe grafik sekaligus. Data bisa diganti langsung dari file
                            <span class="font-semibold text-white">Excel (XLSX) dan CSV</span> atau
                            <span class="font-semibold text-white">Google Sheets publik</span>, lalu semua kartu KPI dan grafik akan ikut terbarui otomatis.
                        </p>
                    </div>

                    <div class="mt-7 flex flex-wrap gap-3 text-sm text-slate-200">
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Line chart</span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Bar chart</span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Area chart</span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Doughnut</span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Radar</span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Polar area</span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Pie</span>
                        <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2">Bubble</span>
                    </div>

                    <div class="mt-8 grid gap-4 md:grid-cols-3">
                        <div class="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                            <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Output Terkini</p>
                            <p data-hero="output" class="dashboard-heading mt-3 text-3xl font-black text-white">0 unit</p>
                            <p class="mt-2 text-sm text-slate-400">Akumulasi produksi dari sumber data aktif.</p>
                        </div>

                        <div class="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                            <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Efisiensi Rata-rata</p>
                            <p data-hero="efficiency" class="dashboard-heading mt-3 text-3xl font-black text-white">0%</p>
                            <p class="mt-2 text-sm text-slate-400">Dipakai untuk radar performa dan bubble chart.</p>
                        </div>

                        <div class="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                            <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Akurasi Target</p>
                            <p data-hero="accuracy" class="dashboard-heading mt-3 text-3xl font-black text-white">0%</p>
                            <p class="mt-2 text-sm text-slate-400">Rasio antara output aktual dan target.</p>
                        </div>
                    </div>
                </div>

                <aside class="dashboard-panel rounded-[30px] p-6 sm:p-7">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Sync Center</p>
                            <h3 class="dashboard-heading mt-3 text-2xl font-bold text-white">Hubungkan data industri</h3>
                        </div>
                        <div class="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                            Auto refresh 5m
                        </div>
                    </div>

                    <div class="mt-6 space-y-5">
                        <label class="block">
                            <span class="text-sm font-semibold text-slate-200">Upload file Excel (XLSX) atau CSV</span>
                            <input
                                type="file"
                                accept=".xlsx,.csv"
                                data-file-input
                                class="mt-3 block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/15 file:px-4 file:py-2 file:font-semibold file:text-cyan-100 focus:border-cyan-300/50 focus:outline-none focus:ring-0"
                            />
                        </label>

                        <label class="block">
                            <span class="text-sm font-semibold text-slate-200">URL Google Sheets atau CSV publik</span>
                            <input
                                type="url"
                                data-sheet-url
                                placeholder="https://docs.google.com/spreadsheets/... atau https://domain.com/data.csv"
                                class="mt-3 block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-0"
                            />
                        </label>

                        <div class="flex flex-wrap gap-3">
                            <button
                                type="button"
                                data-sync-url
                                class="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
                            >
                                Sinkronkan URL
                            </button>

                            <button
                                type="button"
                                data-load-demo
                                class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                            >
                                Gunakan Data Demo
                            </button>
                        </div>

                        <div class="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                            <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Status Sinkronisasi</p>
                            <p data-sync-status data-tone="neutral" class="sync-status mt-3">Menyiapkan dashboard...</p>
                            <div class="mt-5 grid gap-3 sm:grid-cols-2">
                                <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Sumber Aktif</p>
                                    <p data-source-name class="mt-2 text-sm font-semibold text-white">Data demo 12 bulan</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Sinkron Terakhir</p>
                                    <p data-last-sync class="mt-2 text-sm font-semibold text-white">-</p>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-[24px] border border-orange-300/20 bg-orange-300/10 p-5">
                            <p class="text-sm font-semibold text-orange-100">Header spreadsheet yang didukung</p>
                            <p class="mt-2 text-sm leading-6 text-orange-50/80">
                                date/tanggal, production/produksi, target, downtime, efficiency/efisiensi, quality/kualitas, energy/energi,
                                inventory/stok, demand/permintaan, safety, lineA, lineB, lineC.
                            </p>
                        </div>
                    </div>
                </aside>
            </section>

            <section class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <article class="dashboard-panel kpi-glow rounded-[26px] p-5">
                    <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Total Produksi</p>
                    <p data-metric="total-production" class="dashboard-heading mt-4 text-3xl font-black text-white">0 unit</p>
                    <p class="mt-3 text-sm text-slate-400">Total output dari semua periode pada sumber data aktif.</p>
                </article>

                <article class="dashboard-panel kpi-glow rounded-[26px] p-5">
                    <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Rata-rata Efisiensi</p>
                    <p data-metric="average-efficiency" class="dashboard-heading mt-4 text-3xl font-black text-white">0%</p>
                    <p class="mt-3 text-sm text-slate-400">Menjadi sinyal utama pada radar, bubble, dan area chart.</p>
                </article>

                <article class="dashboard-panel kpi-glow rounded-[26px] p-5">
                    <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Pemenuhan Permintaan</p>
                    <p data-metric="demand-fulfillment" class="dashboard-heading mt-4 text-3xl font-black text-white">0%</p>
                    <p class="mt-3 text-sm text-slate-400">Membandingkan total output aktual dengan permintaan pasar.</p>
                </article>

                <article class="dashboard-panel kpi-glow rounded-[26px] p-5">
                    <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Downtime Total</p>
                    <p data-metric="total-downtime" class="dashboard-heading mt-4 text-3xl font-black text-white">0 jam</p>
                    <p class="mt-3 text-sm text-slate-400">Acuan utama untuk memantau loss produksi dan risiko operasi.</p>
                </article>
            </section>

            <section class="mt-8 grid gap-6 lg:grid-cols-2">
                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Line Chart</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Produksi vs Target</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Output
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Melihat seberapa rapat output aktual mengikuti target tiap periode.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="productionTrend"></canvas>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-rose-200/80">Mixed Chart</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Downtime dan Energi</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Loss
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Bar menunjukkan downtime, sementara garis menunjukkan konsumsi energi.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="downtimeEnergy"></canvas>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Area Chart</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Efisiensi dan Kualitas</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Quality
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Membandingkan dua indikator mutu utama dalam bentuk area chart yang mudah dibaca.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="efficiencyArea"></canvas>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-amber-200/80">Doughnut</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Distribusi Output per Lini</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Lini
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Memecah total output menjadi kontribusi Line A, B, dan C.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="lineDistribution"></canvas>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-violet-200/80">Radar</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Radar Kinerja Operasi</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Health
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Skor gabungan untuk efisiensi, kualitas, demand, stok, safety, dan energi.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="operationalRadar"></canvas>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-orange-200/80">Polar Area</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Eksposur Risiko Operasi</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Risk
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Menyorot gap target, downtime, kualitas, safety, dan intensitas energi secara seimbang.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="riskPolar"></canvas>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Pie</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Komposisi Energi per Lini</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Energy
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Estimasi distribusi energi berdasarkan porsi output tiap lini produksi.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="energyPie"></canvas>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Bubble</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Peta Produktivitas per Periode</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Trend
                        </span>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-slate-400">Sumbu X menunjukkan efisiensi, sumbu Y kualitas, dan ukuran bubble mewakili output.</p>
                    <div class="chart-shell mt-6">
                        <canvas data-chart="performanceBubble"></canvas>
                    </div>
                </article>
            </section>

            <section class="mt-8 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
                <article class="dashboard-panel rounded-[28px] p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Preview</p>
                            <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Data Tersinkron</h3>
                        </div>
                        <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                            8 baris awal
                        </span>
                    </div>

                    <div class="mt-6 overflow-hidden rounded-[24px] border border-white/10">
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-left text-sm text-slate-200">
                                <thead class="bg-white/[0.03] text-xs uppercase tracking-[0.22em] text-slate-400">
                                    <tr>
                                        <th class="px-4 py-4">Periode</th>
                                        <th class="px-4 py-4">Produksi</th>
                                        <th class="px-4 py-4">Target</th>
                                        <th class="px-4 py-4">Efisiensi</th>
                                        <th class="px-4 py-4">Kualitas</th>
                                        <th class="px-4 py-4">Energi</th>
                                        <th class="px-4 py-4">Downtime</th>
                                    </tr>
                                </thead>
                                <tbody data-preview-body class="divide-y divide-white/10 bg-slate-950/45">
                                    <tr>
                                        <td colspan="7" class="px-4 py-5 text-center text-slate-400">Menunggu data...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </article>

                <article class="dashboard-panel rounded-[28px] p-6">
                    <p class="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Panduan</p>
                    <h3 class="dashboard-heading mt-2 text-2xl font-bold text-white">Struktur data yang direkomendasikan</h3>

                    <div class="mt-6 space-y-4">
                        <div class="rounded-[24px] border border-white/10 bg-slate-950/55 p-5">
                            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Header contoh</p>
                            <code class="mt-3 block whitespace-pre-wrap break-words text-sm leading-7 text-cyan-100">date,production,target,downtime,efficiency,quality,energy,inventory,demand,safety,lineA,lineB,lineC</code>
                        </div>

                        <div class="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                            <p class="text-sm font-semibold text-white">Cara pakai cepat</p>
                            <ul class="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                                <li>Upload file Excel XLSX atau CSV jika data berasal dari export ERP, MES, atau spreadsheet lokal.</li>
                                <li>Tempel URL Google Sheets publik jika ingin dashboard bisa diperbarui ulang tanpa upload file baru.</li>
                                <li>Jika beberapa kolom tidak ada, dashboard akan mengisi nilai turunan sederhana agar visual tetap hidup.</li>
                            </ul>
                        </div>

                        <div class="rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 p-5">
                            <p class="text-sm font-semibold text-emerald-100">Catatan sinkronisasi</p>
                            <p class="mt-2 text-sm leading-6 text-emerald-50/80">
                                Versi ini menyinkronkan data di browser secara instan dan menyimpan dataset terakhir di browser yang sama. Kalau nanti Anda ingin versi multi-user dengan import ke database, kita bisa lanjutkan ke tahap backend upload dan histori sinkronisasi.
                            </p>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    </div>
</body>
</html>
