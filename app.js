/* ===== App Controller ===== */
const App = {
    currentTool: 'reference',

    init() {
        // Sidebar navigation
        document.querySelectorAll('.side-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTool(btn.dataset.tool));
        });

        // Mobile navigation
        document.querySelectorAll('.mob-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTool(btn.dataset.tool));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        this.initTheme();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && !e.target.closest('input, textarea')) {
                const shortcuts = { '1': 'reference', '2': 'checklist', '3': 'timeline', '4': 'acknowledge', '5': 'defense' };
                if (shortcuts[e.key]) {
                    e.preventDefault();
                    this.switchTool(shortcuts[e.key]);
                }
            }
        });

        // Init modules
        ReferenceModule.init();
        ChecklistModule.init();
        TimelineModule.init();
        AcknowledgeModule.init();
        DefenseModule.init();

        // Restore from URL
        const toolFromUrl = new URLSearchParams(window.location.search).get('tool');
        const validTools = ['reference', 'checklist', 'timeline', 'acknowledge', 'defense'];
        if (toolFromUrl && validTools.includes(toolFromUrl)) {
            this.switchTool(toolFromUrl);
        }
    },

    switchTool(tool) {
        this.currentTool = tool;

        document.querySelectorAll('.side-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tool === tool);
        });

        document.querySelectorAll('.mob-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tool === tool);
        });

        document.querySelectorAll('.tool-panel').forEach(p => {
            p.classList.toggle('active', p.id === `panel-${tool}`);
        });

        document.querySelector('.main-area').scrollIntoView({ behavior: 'smooth', block: 'start' });

        const url = new URL(window.location);
        url.searchParams.set('tool', tool);
        window.history.replaceState({}, '', url);

        document.getElementById('sidebar')?.classList.remove('open');
    },

    /* ===== Theme ===== */
    initTheme() {
        const saved = localStorage.getItem('thesis_theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        }
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        this.safeSave('thesis_theme', next);
    },

    /* ===== Shared Utilities ===== */

    /** Save to localStorage with error handling */
    safeSave(key, value) {
        try {
            localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
            return true;
        } catch (e) {
            this.toast('存储空间不足，请清理旧数据', 'error');
            console.warn('localStorage save failed:', key, e);
            return false;
        }
    },

    /** Load from localStorage with error handling */
    safeLoad(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            // Try JSON parse, return raw string if it fails
            try { return JSON.parse(raw); } catch { return raw; }
        } catch (e) {
            return fallback;
        }
    },

    /** Copy text to clipboard */
    async copyText(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;left:-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            return true;
        } catch (e) {
            this.toast('复制失败，请手动复制', 'error');
            return false;
        }
    },

    /** Get local date string YYYY-MM-DD */
    todayStr() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    /* ===== Toast ===== */
    toast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 3000);
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
