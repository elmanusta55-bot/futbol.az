// Transfer News - Futbol.az
'use strict';

const transfers = [
    {
        player: "Kylian Mbappé",
        from: "PSG",
        to: "Real Madrid",
        fee: "Pulsuz keçid",
        type: "confirmed",
        date: "2025-07-01",
        position: "Hücumçu"
    },
    {
        player: "Florian Wirtz",
        from: "Bayer Leverkusen",
        to: "Manchester City",
        fee: "€120M",
        type: "rumor",
        date: "2026-05-15",
        position: "Yarımmüdafiəçi"
    },
    {
        player: "Lamine Yamal",
        from: "Barcelona",
        to: "Barcelona (yeni müqavilə)",
        fee: "Müqavilə uzadılması",
        type: "confirmed",
        date: "2026-04-20",
        position: "Qanadçı"
    },
    {
        player: "Jamal Musiala",
        from: "Bayern Munich",
        to: "Manchester City",
        fee: "€100M+",
        type: "rumor",
        date: "2026-05-10",
        position: "Yarımmüdafiəçi"
    },
    {
        player: "Victor Osimhen",
        from: "Galatasaray (icarə)",
        to: "Chelsea",
        fee: "€75M",
        type: "rumor",
        date: "2026-05-12",
        position: "Hücumçu"
    },
    {
        player: "Arda Güler",
        from: "Real Madrid",
        to: "Real Betis",
        fee: "İcarə",
        type: "loan",
        date: "2026-01-15",
        position: "Yarımmüdafiəçi"
    },
    {
        player: "Raheem Sterling",
        from: "Chelsea",
        to: "Arsenal",
        fee: "İcarə + alış opsiyonu",
        type: "loan",
        date: "2026-01-20",
        position: "Qanadçı"
    },
    {
        player: "Mahir Emreli",
        from: "Dinamo Zagreb",
        to: "Qarabağ FK",
        fee: "€2M",
        type: "confirmed",
        date: "2026-02-01",
        position: "Hücumçu"
    },
    {
        player: "Emin Mahmudov",
        from: "Neftçi PFK",
        to: "Zirə FK",
        fee: "Pulsuz keçid",
        type: "confirmed",
        date: "2026-01-10",
        position: "Yarımmüdafiəçi"
    },
    {
        player: "Jude Bellingham",
        from: "Real Madrid",
        to: "Real Madrid (yeni müqavilə)",
        fee: "Müqavilə uzadılması",
        type: "confirmed",
        date: "2026-03-15",
        position: "Yarımmüdafiəçi"
    },
    {
        player: "Khvicha Kvaratskhelia",
        from: "PSG",
        to: "Barcelona",
        fee: "€80M",
        type: "rumor",
        date: "2026-05-18",
        position: "Qanadçı"
    },
    {
        player: "Renat Dadaşov",
        from: "Erzgebirge Aue",
        to: "Sabah FK",
        fee: "€500K",
        type: "confirmed",
        date: "2026-01-25",
        position: "Hücumçu"
    },
    {
        player: "Alexander Isak",
        from: "Newcastle",
        to: "Arsenal",
        fee: "€95M",
        type: "rumor",
        date: "2026-05-16",
        position: "Hücumçu"
    },
    {
        player: "Pedri",
        from: "Barcelona",
        to: "Manchester City",
        fee: "€90M",
        type: "rumor",
        date: "2026-05-14",
        position: "Yarımmüdafiəçi"
    },
    {
        player: "Ramil Şeydayev",
        from: "Qarabağ FK",
        to: "Neftçi PFK",
        fee: "İcarə",
        type: "loan",
        date: "2026-02-05",
        position: "Hücumçu"
    }
];

let currentFilter = 'all';

// DOM
const transferList = document.getElementById('transfer-list');
const noResults = document.getElementById('no-results');
const themeToggle = document.getElementById('theme-toggle');

// Theme
function initTheme() {
    const saved = localStorage.getItem('futbol-theme');
    if (saved === 'light') {
        document.body.classList.add('light');
        themeToggle.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('futbol-theme', isLight ? 'light' : 'dark');
});

// Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTransfers();
    });
});

// Get icon for position
function getPositionIcon(position) {
    switch (position) {
        case 'Hücumçu': return '⚡';
        case 'Yarımmüdafiəçi': return '🎯';
        case 'Müdafiəçi': return '🛡️';
        case 'Qapıçı': return '🧤';
        case 'Qanadçı': return '🏃';
        default: return '⚽';
    }
}

// Get badge
function getBadge(type) {
    switch (type) {
        case 'confirmed': return '<span class="transfer-badge badge-confirmed">✅ Rəsmi</span>';
        case 'rumor': return '<span class="transfer-badge badge-rumor">🔥 Şayiə</span>';
        case 'loan': return '<span class="transfer-badge badge-loan">🔁 İcarə</span>';
        default: return '';
    }
}

// Format date
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Render
function renderTransfers() {
    const filtered = currentFilter === 'all' 
        ? transfers 
        : transfers.filter(t => t.type === currentFilter);

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        transferList.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');

    transferList.innerHTML = filtered.map(t => `
        <div class="transfer-card" data-type="${t.type}">
            <div class="transfer-icon">${getPositionIcon(t.position)}</div>
            <div class="transfer-info">
                <div class="transfer-player">${t.player}</div>
                <div class="transfer-clubs">
                    <span>${t.from}</span>
                    <span class="arrow">→</span>
                    <span>${t.to}</span>
                </div>
                <div class="transfer-meta">
                    ${getBadge(t.type)}
                    <span class="transfer-fee">${t.fee}</span>
                    <span>${formatDate(t.date)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Init
initTheme();
renderTransfers();
