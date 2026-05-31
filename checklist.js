/* ===== Thesis Format Checklist ===== */
const ChecklistModule = {
    categories: [
        {
            title: '📄 封面与声明',
            items: [
                '论文题目与教务系统一致',
                '学院、专业、学号、姓名准确无误',
                '指导教师姓名、职称正确',
                '原创性声明已签字（如需要）',
                '中英文封面信息一致',
            ]
        },
        {
            title: '📑 摘要与关键词',
            items: [
                '中文摘要 300-500 字',
                '英文摘要（Abstract）对应中文内容',
                '关键词 3-5 个，中英文对应',
                '摘要中不包含图表、公式、参考文献引用',
                '中英文摘要各占一页',
            ]
        },
        {
            title: '📖 目录',
            items: [
                '目录自动生成（非手动输入）',
                '页码与正文一致',
                '目录层级不超过三级',
                '各级标题格式统一',
            ]
        },
        {
            title: '📝 正文格式',
            items: [
                '正文字体：宋体小四 / Times New Roman 12pt',
                '行距：1.5倍或固定值22磅',
                '一级标题：黑体三号，居中',
                '二级标题：黑体四号，左对齐',
                '三级标题：黑体小四，左对齐',
                '页边距：上2.5cm 下2.5cm 左3cm 右2.5cm',
                '每段首行缩进2字符',
                '图表编号连续（图1、图2... 表1、表2...）',
                '图表标题位置正确（图标题在下，表标题在上）',
            ]
        },
        {
            title: '📚 参考文献',
            items: [
                '参考文献格式符合 GB/T 7714-2015',
                '引用编号连续 [1][2][3]...',
                '正文引用与文献列表一一对应',
                '参考文献数量满足要求（本科≥15篇，硕士≥40篇）',
                '外文文献占比符合要求',
                '近五年文献占比符合要求',
            ]
        },
        {
            title: '📎 附录与致谢',
            items: [
                '附录编号正确（附录A、附录B...）',
                '致谢内容得体，无错别字',
                '攻读学位期间成果列表完整',
            ]
        },
    ],

    checkedItems: {},

    init() {
        this.checkedItems = App.safeLoad('thesis_checks', {});
        this.render();
    },

    saveToStorage() {
        App.safeSave('thesis_checks', this.checkedItems);
    },

    toggleCheck(catIdx, itemIdx) {
        const key = `${catIdx}-${itemIdx}`;
        this.checkedItems[key] = !this.checkedItems[key];
        this.saveToStorage();
        this.render();
    },

    getStats() {
        let total = 0, checked = 0;
        this.categories.forEach((cat, ci) => {
            cat.items.forEach((_, ii) => {
                total++;
                if (this.checkedItems[`${ci}-${ii}`]) checked++;
            });
        });
        return { total, checked };
    },

    render() {
        const stats = this.getStats();
        document.getElementById('checkedCount').textContent = stats.checked;
        document.getElementById('totalChecks').textContent = stats.total;
        document.getElementById('checkPercent').textContent =
            stats.total > 0 ? Math.round(stats.checked / stats.total * 100) + '%' : '0%';

        const container = document.getElementById('checklistCategories');
        container.innerHTML = this.categories.map((cat, ci) => {
            const catChecked = cat.items.filter((_, ii) => this.checkedItems[`${ci}-${ii}`]).length;
            return `
                <div class="checklist-category">
                    <div class="category-header">
                        <h3>${cat.title}</h3>
                        <span class="category-progress">${catChecked}/${cat.items.length}</span>
                    </div>
                    <div class="check-items">
                        ${cat.items.map((item, ii) => {
                            const isChecked = this.checkedItems[`${ci}-${ii}`];
                            return `
                                <div class="check-item ${isChecked ? 'checked' : ''}" data-cat="${ci}" data-item="${ii}">
                                    <div class="check-box">${isChecked ? '✓' : ''}</div>
                                    <span class="check-text">${item}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Bind clicks
        container.querySelectorAll('.check-item').forEach(item => {
            item.addEventListener('click', () => {
                const ci = parseInt(item.dataset.cat);
                const ii = parseInt(item.dataset.item);
                this.toggleCheck(ci, ii);
            });
        });
    },
};
