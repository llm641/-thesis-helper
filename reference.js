/* ===== Reference Formatter — GB/T 7714-2015 ===== */
const ReferenceModule = {
    currentType: 'J',
    references: [],

    init() {
        document.querySelectorAll('.ref-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.ref-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentType = btn.dataset.type;
                this.renderForm();
            });
        });

        document.getElementById('addReference').addEventListener('click', () => this.addReference());
        document.getElementById('clearRefForm').addEventListener('click', () => this.renderForm());
        document.getElementById('copyAllRefs').addEventListener('click', () => this.copyAll());
        document.getElementById('exportRefs').addEventListener('click', () => this.exportAll());
        document.getElementById('clearAllRefs').addEventListener('click', () => this.clearAll());

        this.references = App.safeLoad('thesis_refs', []);
        if (!Array.isArray(this.references)) this.references = [];
        this.renderForm();
        this.renderList();
    },

    getFormConfig() {
        const common = [
            { key: 'author', label: '作者', placeholder: '多个作者用逗号分隔，如：张三, 李四', required: true, full: true },
        ];

        const typeConfigs = {
            J: [
                { key: 'title', label: '论文题名', placeholder: '论文标题', required: true, full: true },
                { key: 'journal', label: '期刊名', placeholder: '如：软件学报', required: true, full: false },
                { key: 'year', label: '出版年份', placeholder: '如：2024', required: true, full: false },
                { key: 'volume', label: '卷(期)', placeholder: '如：35(2)', required: false, full: false },
                { key: 'pages', label: '起止页码', placeholder: '如：1-20', required: false, full: false },
            ],
            M: [
                { key: 'title', label: '书名', placeholder: '完整书名', required: true, full: true },
                { key: 'publisher', label: '出版社', placeholder: '如：高等教育出版社', required: true, full: false },
                { key: 'place', label: '出版地', placeholder: '如：北京', required: true, full: false },
                { key: 'year', label: '出版年份', placeholder: '如：2024', required: true, full: false },
            ],
            D: [
                { key: 'title', label: '论文题名', placeholder: '学位论文标题', required: true, full: true },
                { key: 'school', label: '授予单位', placeholder: '如：北京大学', required: true, full: false },
                { key: 'place', label: '保存地点', placeholder: '如：北京', required: false, full: false },
                { key: 'year', label: '授予年份', placeholder: '如：2024', required: true, full: false },
            ],
            C: [
                { key: 'title', label: '论文题名', placeholder: '会议论文标题', required: true, full: true },
                { key: 'confName', label: '会议名称', placeholder: '如：第20届中国机器学习大会', required: true, full: false },
                { key: 'confPlace', label: '会议地点', placeholder: '如：上海', required: false, full: false },
                { key: 'confDate', label: '会议日期', placeholder: '如：2024-10-15', required: false, full: false },
            ],
            EB: [
                { key: 'title', label: '题名', placeholder: '网页或资源标题', required: true, full: true },
                { key: 'pubDate', label: '发布日期', placeholder: '如：2024-01-15', required: false, full: false },
                { key: 'accessDate', label: '引用日期', placeholder: '如：2024-06-01', required: true, full: false },
                { key: 'url', label: '网址', placeholder: 'https://...', required: true, full: true },
            ],
            P: [
                { key: 'title', label: '专利题名', placeholder: '专利名称', required: true, full: true },
                { key: 'patentNum', label: '专利号', placeholder: '如：CN202410123456.7', required: true, full: false },
                { key: 'owner', label: '专利权人', placeholder: '如：某某大学', required: false, full: false },
                { key: 'date', label: '公告日期', placeholder: '如：2024-06-01', required: true, full: false },
            ],
        };

        return { common, specific: typeConfigs[this.currentType] || typeConfigs.J };
    },

    renderForm() {
        const form = document.getElementById('refForm');
        const { common, specific } = this.getFormConfig();
        const allFields = [...common, ...specific];

        form.innerHTML = allFields.map(f => {
            const fullClass = f.full ? 'full-width' : '';
            return `<div class="form-group ${fullClass}">
                <label>${f.label}${f.required ? ' *' : ''}</label>
                <input type="text" class="input ref-input" data-key="${f.key}" placeholder="${f.placeholder}">
            </div>`;
        }).join('');
    },

    getFormData() {
        const data = { type: this.currentType };
        document.querySelectorAll('.ref-input').forEach(inp => {
            const val = inp.value.trim();
            if (val) data[inp.dataset.key] = val;
        });
        return data;
    },

    addReference() {
        const data = this.getFormData();
        const config = this.getFormConfig();
        const allFields = [...config.common, ...config.specific];

        const missing = allFields.filter(f => f.required && !data[f.key]);
        if (missing.length > 0) {
            App.toast(`请填写必填字段：${missing.map(m => m.label).join('、')}`, 'error');
            return;
        }

        this.references.push(data);
        this.save();
        this.renderList();
        this.renderForm();
        App.toast('参考文献已添加');
    },

    /* ===== GB/T 7714-2015 Formatting ===== */
    formatReference(ref) {
        const authors = this.formatAuthors(ref.author || '佚名');
        const title = ref.title || '(未知标题)';

        switch (ref.type) {
            case 'J':
                return `${authors}. ${title}[J]. ${ref.journal || '(未知刊名)'}, ${ref.year || '(未知年份)'}${ref.volume ? `, ${ref.volume}` : ''}${ref.pages ? `: ${ref.pages}` : ''}.`;

            case 'M':
                return `${authors}. ${title}[M]. ${ref.place ? ref.place + ': ' : ''}${ref.publisher || '(未知出版社)'}, ${ref.year || '(未知年份)'}.`;

            case 'D':
                return `${authors}. ${title}[D]. ${ref.place ? ref.place + ': ' : ''}${ref.school || '(未知单位)'}, ${ref.year || '(未知年份)'}.`;

            case 'C':
                let c = `${authors}. ${title}[C]. ${ref.confName || '(未知会议)'}`;
                if (ref.confPlace) c += `, ${ref.confPlace}`;
                if (ref.confDate) c += `, ${ref.confDate}`;
                c += '.';
                return c;

            case 'EB':
                let eb = `${authors}. ${title}[EB/OL].`;
                if (ref.pubDate) eb += ` (${ref.pubDate})`;
                eb += ` [${ref.accessDate || App.todayStr()}].`;
                eb += ` ${ref.url || '(未知网址)'}.`;
                return eb;

            case 'P':
                const owner = ref.owner || ref.author || '佚名';
                return `${owner}. ${title}: ${ref.patentNum || '(未知专利号)'}[P]. ${ref.date || '(未知日期)'}.`;

            default:
                return `${authors}. ${title}. ${ref.year || '(未知年份)'}.`;
        }
    },

    formatAuthors(authorStr) {
        if (!authorStr || authorStr === '佚名') return '佚名';
        const authors = authorStr.split(/[,，;；、]/).map(a => a.trim()).filter(Boolean);
        if (authors.length === 0) return '佚名';
        if (authors.length <= 3) return authors.join(', ');
        return `${authors.slice(0, 3).join(', ')}, 等`;
    },

    /* ===== Render List ===== */
    renderList() {
        const list = document.getElementById('refList');
        const actions = document.getElementById('refListActions');
        const count = document.getElementById('refCount');

        count.textContent = `${this.references.length} 条`;

        if (this.references.length === 0) {
            list.innerHTML = `<div class="empty-state">
                <div class="empty-icon">📚</div>
                <p>尚未添加参考文献</p>
                <p class="empty-hint">填写信息后点击"添加到列表"</p>
            </div>`;
            actions.style.display = 'none';
            return;
        }

        actions.style.display = 'flex';

        list.innerHTML = this.references.map((ref, i) => {
            const formatted = this.formatReference(ref);
            const typeLabels = { J: '期刊', M: '专著', D: '学位论文', C: '会议', EB: '网络', P: '专利' };
            return `
                <div class="ref-item">
                    <span class="ref-index">[${i + 1}]</span>
                    <span class="ref-text">${this.escapeHtml(formatted)}</span>
                    <span class="ref-type-tag">${typeLabels[ref.type] || ref.type}</span>
                    <button class="ref-delete" data-idx="${i}" title="删除">×</button>
                </div>
            `;
        }).join('');

        list.querySelectorAll('.ref-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.references.splice(parseInt(btn.dataset.idx), 1);
                this.save();
                this.renderList();
                App.toast('已删除');
            });
        });

        list.querySelectorAll('.ref-item').forEach((item, i) => {
            item.addEventListener('click', () => {
                const text = `[${i + 1}] ${this.formatReference(this.references[i])}`;
                App.copyText(text).then(ok => { if (ok) App.toast('已复制该条引用'); });
            });
            item.style.cursor = 'pointer';
        });
    },

    copyAll() {
        const text = this.references.map((ref, i) =>
            `[${i + 1}] ${this.formatReference(ref)}`
        ).join('\n');
        App.copyText(text).then(ok => { if (ok) App.toast(`已复制 ${this.references.length} 条参考文献`); });
    },

    exportAll() {
        const text = this.references.map((ref, i) =>
            `[${i + 1}] ${this.formatReference(ref)}`
        ).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '参考文献.txt';
        a.click();
        URL.revokeObjectURL(url);
        App.toast('参考文献已导出');
    },

    clearAll() {
        if (this.references.length === 0) return;
        if (confirm(`确定要删除全部 ${this.references.length} 条参考文献吗？`)) {
            this.references = [];
            this.save();
            this.renderList();
            App.toast('已清空全部参考文献');
        }
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    save() {
        App.safeSave('thesis_refs', this.references);
    },
};
