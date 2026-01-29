
<?php
/**
 * ECMW GLOBAL FLEET SYSTEMS - PHP CORE
 */

$dataFile = 'packs-data.json';

// Initialize data if not exists
if (!file_exists($dataFile)) {
    // Basic fallback logic
    file_put_contents($dataFile, json_encode([], JSON_PRETTY_PRINT));
}

function getPacks() {
    global $dataFile;
    return json_decode(file_get_contents($dataFile), true) ?: [];
}

function savePacks($packs) {
    global $dataFile;
    file_put_contents($dataFile, json_encode(array_values($packs), JSON_PRETTY_PRINT));
}

// Handle CRUD Actions
$action = $_POST['action'] ?? '';

if ($action === 'save') {
    $packs = getPacks();
    $id = $_POST['id'] ?: uniqid();
    $newPack = [
        'id' => $id,
        'pack' => $_POST['pack'],
        'entity' => $_POST['entity'],
        'entityProd' => $_POST['entityProd'] ?? '',
        'platform' => $_POST['platform'],
        'team' => $_POST['team'] ?? 'Empty',
        'localExternal' => $_POST['localExternal'],
        'server' => $_POST['server'] ?? '',
        'rdps' => $_POST['rdps'] ?? '',
        'password' => $_POST['password'] ?? '',
        'interval' => $_POST['interval'] ?? '',
        'status' => $_POST['status'],
        'disk' => $_POST['disk'],
        'dataSeeds' => $_POST['dataSeeds'] ?? 'non',
        'countProfiles' => $_POST['countProfiles'] ?? 0,
        'notes' => $_POST['notes'] ?? '',
        'browser' => $_POST['browser'] ?? 'Chrome',
        'backup' => $_POST['backup'] ?? 'Non'
    ];

    $found = false;
    foreach ($packs as $index => $p) {
        if ($p['id'] == $id) {
            $packs[$index] = $newPack;
            $found = true;
            break;
        }
    }
    if (!$found) $packs[] = $newPack;
    savePacks($packs);
    header("Location: index.php");
    exit;
}

if ($action === 'delete') {
    $id = $_POST['id'];
    $packs = array_filter(getPacks(), fn($p) => $p['id'] != $id);
    savePacks($packs);
    header("Location: index.php");
    exit;
}

// Filtering Logic
$allPacks = getPacks();
$filters = [
    'search' => $_GET['search'] ?? '',
    'entity' => $_GET['entity'] ?? '',
    'status' => $_GET['status'] ?? '',
    'platform' => $_GET['platform'] ?? '',
    'localExternal' => $_GET['localExternal'] ?? '',
    'team' => $_GET['team'] ?? '',
    'disk' => $_GET['disk'] ?? '',
    'dataSeeds' => $_GET['dataSeeds'] ?? ''
];

$filteredPacks = array_filter($allPacks, function($p) use ($filters) {
    if ($filters['search'] && stripos(json_encode($p), $filters['search']) === false) return false;
    if ($filters['entity'] && $p['entity'] !== $filters['entity']) return false;
    if ($filters['status'] && $p['status'] !== $filters['status']) return false;
    if ($filters['platform'] && $p['platform'] !== $filters['platform']) return false;
    if ($filters['localExternal'] && $p['localExternal'] !== $filters['localExternal']) return false;
    if ($filters['team'] && $p['team'] !== $filters['team']) return false;
    if ($filters['disk'] && $p['disk'] !== $filters['disk']) return false;
    if ($filters['dataSeeds'] && $p['dataSeeds'] !== $filters['dataSeeds']) return false;
    return true;
});

// Stats
$totalPacks = count($filteredPacks);
$totalProfiles = array_sum(array_column($filteredPacks, 'countProfiles'));
$reportingCount = count(array_filter($filteredPacks, fn($p) => stripos($p['status'], 'repot') !== false));
$localCount = count(array_filter($filteredPacks, fn($p) => $p['localExternal'] === 'Local'));
$externalCount = $totalPacks - $localCount;

// Constants for dropdowns
$entities = ["ECM4", "ECM7", "ECM10"];
$platforms = ["ECM_APP", "iMACROS", "WebautoMate"];
$teams = ["A", "B", "C", "Empty"];
$statuses = ["Repo IPs", "Verification", "ADD contact", "Repoting", "EMPTY", "LOGING", "Hold", "DOWN", "Reporting Offer"];
$locations = ["Local", "External"];
$disks = ["E", "G", "F", "H", "I", "D", "STK1", "externe"];
$seeds = ["oui", "non"];
$browsers = ["Chrome", "Chromium", "webview", "palemoon", "Brave"];

?>
<!DOCTYPE html>
<html lang="en" x-data="{ 
    modalOpen: false, 
    editingPack: null,
    expanded: null,
    openModal(pack = null) {
        this.editingPack = pack;
        this.modalOpen = true;
    }
}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECMW Global Fleet Control</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="text-slate-900">
    
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <i class="fas fa-database text-white text-xl"></i>
            </div>
            <div>
                <h1 class="text-xl font-bold text-slate-800 tracking-tight uppercase">ECMW FLEET</h1>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Global Systems Control</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <button @click="openModal()" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold text-sm">
                <i class="fas fa-plus"></i> Add Pack
            </button>
        </div>
    </nav>

    <main class="container mx-auto px-4 mt-8 max-w-[1700px]">
        
        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <span class="text-slate-500 text-sm font-medium">Total Packs</span>
                <div class="text-2xl font-bold text-slate-900 mt-2"><?= $totalPacks ?></div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <span class="text-slate-500 text-sm font-medium">Total Profiles</span>
                <div class="text-2xl font-bold text-slate-900 mt-2"><?= number_format($totalProfiles) ?></div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <span class="text-slate-500 text-sm font-medium">Active Reporting</span>
                <div class="text-2xl font-bold text-slate-900 mt-2"><?= $reportingCount ?></div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <span class="text-slate-500 text-sm font-medium">Hosting Mix</span>
                <div class="flex items-baseline gap-2 mt-2">
                    <span class="text-2xl font-bold text-slate-900"><?= $localCount ?></span> <span class="text-xs text-slate-400 font-bold uppercase tracking-tighter">Local</span>
                    <span class="text-slate-300">/</span>
                    <span class="text-2xl font-bold text-slate-900"><?= $externalCount ?></span> <span class="text-xs text-slate-400 font-bold uppercase tracking-tighter">External</span>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <form method="GET" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div class="lg:col-span-3">
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Search Registry</label>
                    <input type="text" name="search" value="<?= htmlspecialchars($filters['search']) ?>" placeholder="Search packs, servers..." class="w-full px-4 py-2.5 bg-slate-50 border-transparent focus:border-blue-500 rounded-xl text-sm transition-all shadow-inner">
                </div>
                <div class="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    <select name="entity" class="bg-slate-50 border-0 rounded-lg text-xs font-semibold py-2">
                        <option value="">Entities</option>
                        <?php foreach($entities as $e): ?>
                            <option value="<?= $e ?>" <?= $filters['entity'] == $e ? 'selected' : '' ?>><?= $e ?></option>
                        <?php endforeach; ?>
                    </select>
                    <select name="platform" class="bg-slate-50 border-0 rounded-lg text-xs font-semibold py-2">
                        <option value="">Platform</option>
                        <?php foreach($platforms as $p): ?>
                            <option value="<?= $p ?>" <?= $filters['platform'] == $p ? 'selected' : '' ?>><?= $p ?></option>
                        <?php endforeach; ?>
                    </select>
                    <select name="status" class="bg-slate-50 border-0 rounded-lg text-xs font-semibold py-2">
                        <option value="">Statuses</option>
                        <?php foreach($statuses as $s): ?>
                            <option value="<?= $s ?>" <?= $filters['status'] == $s ? 'selected' : '' ?>><?= $s ?></option>
                        <?php endforeach; ?>
                    </select>
                    <select name="localExternal" class="bg-slate-50 border-0 rounded-lg text-xs font-semibold py-2">
                        <option value="">Hosting Mix</option>
                        <?php foreach($locations as $l): ?>
                            <option value="<?= $l ?>" <?= $filters['localExternal'] == $l ? 'selected' : '' ?>><?= $l ?></option>
                        <?php endforeach; ?>
                    </select>
                    <select name="disk" class="bg-slate-50 border-0 rounded-lg text-xs font-semibold py-2">
                        <option value="">Disk</option>
                        <?php foreach($disks as $d): ?>
                            <option value="<?= $d ?>" <?= $filters['disk'] == $d ? 'selected' : '' ?>><?= $d ?></option>
                        <?php endforeach; ?>
                    </select>
                    <div class="flex gap-2 lg:col-span-2">
                        <button type="submit" class="flex-1 bg-blue-600 text-white text-xs font-black uppercase tracking-widest py-2 px-4 rounded-lg shadow-md active:scale-95 transition-all">Filter Scan</button>
                        <a href="index.php" class="flex-1 text-center border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest py-2 px-4 rounded-lg hover:bg-slate-50">Reset</a>
                    </div>
                </div>
            </div>
        </form>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="p-4 w-10"></th>
                            <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Instance</th>
                            <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</th>
                            <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</th>
                            <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Profiles</th>
                            <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</th>
                            <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach($filteredPacks as $pack): ?>
                        <tr class="hover:bg-slate-50/80 transition-colors" :class="expanded === '<?= $pack['id'] ?>' ? 'bg-blue-50/30' : ''">
                            <td class="p-4">
                                <button @click="expanded = (expanded === '<?= $pack['id'] ?>' ? null : '<?= $pack['id'] ?>')" class="w-8 h-8 rounded-lg flex items-center justify-center transition-all" :class="expanded === '<?= $pack['id'] ?>' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'">
                                    <i class="fas" :class="expanded === '<?= $pack['id'] ?>' ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                                </button>
                            </td>
                            <td class="p-4">
                                <div class="font-black text-slate-800 tracking-tight"><?= $pack['pack'] ?></div>
                                <div class="text-[10px] text-slate-400 uppercase font-black tracking-widest"><?= $pack['interval'] ?></div>
                            </td>
                            <td class="p-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black text-slate-700"><?= $pack['entity'] ?></span>
                                    <span class="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-black uppercase"><?= $pack['platform'] ?></span>
                                </div>
                                <div class="text-[9px] text-slate-400 uppercase font-bold mt-1">Team <?= $pack['team'] ?></div>
                            </td>
                            <td class="p-4">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-200 text-blue-700 bg-blue-50">
                                    <?= $pack['status'] ?>
                                </span>
                            </td>
                            <td class="p-4 text-center text-xs font-black text-slate-700"><?= number_format($pack['countProfiles']) ?></td>
                            <td class="p-4">
                                <div class="text-[10px] text-slate-500 italic truncate max-w-[200px]"><?= $pack['notes'] ?: '—' ?></div>
                            </td>
                            <td class="p-4 text-right">
                                <button @click="openModal(<?= htmlspecialchars(json_encode($pack)) ?>)" class="text-slate-400 hover:text-blue-600 p-2 transition-colors"><i class="fas fa-edit"></i></button>
                                <form method="POST" class="inline" onsubmit="return confirm('Confirm deletion?')">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= $pack['id'] ?>">
                                    <button type="submit" class="text-slate-400 hover:text-rose-600 p-2 transition-colors"><i class="fas fa-trash-alt"></i></button>
                                </form>
                            </td>
                        </tr>
                        <!-- Expanded Details -->
                        <tr x-show="expanded === '<?= $pack['id'] ?>'" x-transition x-cloak class="bg-slate-50/40">
                            <td colspan="7" class="p-8 border-b border-slate-200/50 shadow-inner">
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div>
                                        <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Disk Partition</div>
                                        <div class="text-xs font-bold text-slate-700"><?= $pack['disk'] ?></div>
                                    </div>
                                    <div>
                                        <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Access Node</div>
                                        <div class="text-xs font-mono font-black text-blue-600"><?= $pack['server'] ?></div>
                                    </div>
                                    <div>
                                        <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hosting Mix</div>
                                        <div class="text-xs font-black text-slate-700 uppercase"><?= $pack['localExternal'] ?></div>
                                    </div>
                                    <div>
                                        <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Browser Client</div>
                                        <div class="text-xs font-bold text-slate-700"><?= $pack['browser'] ?></div>
                                    </div>
                                    <div class="col-span-full pt-4 border-t border-slate-100">
                                        <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Operational Documentation</div>
                                        <div class="text-sm text-slate-600 leading-relaxed italic bg-white p-4 rounded-xl border border-slate-100"><?= $pack['notes'] ?: 'No system logs provided for this asset.' ?></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if(empty($filteredPacks)): ?>
                        <tr>
                            <td colspan="7" class="p-20 text-center text-slate-300 italic font-black uppercase tracking-widest">Registry scan returned no results</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Modal -->
    <div x-show="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" x-cloak>
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" @click.away="modalOpen = false">
            <div class="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h2 class="text-xl font-black text-slate-800 tracking-tight" x-text="editingPack ? 'Update Fleet Asset' : 'Register New Fleet Asset'"></h2>
                <button @click="modalOpen = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><i class="fas fa-times"></i></button>
            </div>
            
            <form action="index.php" method="POST" class="overflow-y-auto p-8 space-y-8 custom-scrollbar flex-1">
                <input type="hidden" name="action" value="save">
                <input type="hidden" name="id" :value="editingPack ? editingPack.id : ''">
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pack UID</label>
                        <input type="text" name="pack" :value="editingPack ? editingPack.pack : ''" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Entity</label>
                        <select name="entity" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500">
                            <?php foreach($entities as $e): ?>
                                <option value="<?= $e ?>" :selected="editingPack && editingPack.entity == '<?= $e ?>'"><?= $e ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Engine</label>
                        <select name="platform" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500">
                            <?php foreach($platforms as $p): ?>
                                <option value="<?= $p ?>" :selected="editingPack && editingPack.platform == '<?= $p ?>'"><?= $p ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Status</label>
                        <select name="status" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500">
                            <?php foreach($statuses as $s): ?>
                                <option value="<?= $s ?>" :selected="editingPack && editingPack.status == '<?= $s ?>'"><?= $s ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Disk Partition</label>
                        <select name="disk" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500">
                            <?php foreach($disks as $d): ?>
                                <option value="<?= $d ?>" :selected="editingPack && editingPack.disk == '<?= $d ?>'"><?= $d ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hosting Mix</label>
                        <select name="localExternal" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500">
                            <?php foreach($locations as $l): ?>
                                <option value="<?= $l ?>" :selected="editingPack && editingPack.localExternal == '<?= $l ?>'"><?= $l ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Profile Count</label>
                        <input type="number" name="countProfiles" :value="editingPack ? editingPack.countProfiles : 0" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Access IP Node</label>
                        <input type="text" name="server" :value="editingPack ? editingPack.server : ''" class="w-full bg-slate-50 border-0 rounded-xl py-3 px-4 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Notes & Maintenance Log</label>
                    <textarea name="notes" rows="4" class="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-semibold focus:ring-4 focus:ring-blue-50 transition-all resize-none shadow-sm" :value="editingPack ? editingPack.notes : ''" placeholder="Documentation..."></textarea>
                </div>

                <div class="flex justify-end gap-4 pt-6 border-t border-slate-100 bg-white sticky bottom-0">
                    <button type="button" @click="modalOpen = false" class="px-6 py-2.5 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Discard</button>
                    <button type="submit" class="px-10 py-2.5 bg-blue-600 text-white font-black rounded-xl uppercase tracking-widest text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all">Commit Asset</button>
                </div>
            </form>
        </div>
    </div>

    <footer class="mt-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest pb-12 border-t border-slate-100 pt-8">
        ECMW GLOBAL FLEET MANAGEMENT &bull; PHP CORE SYSTEM &copy; <?= date('Y') ?>
    </footer>

</body>
</html>
