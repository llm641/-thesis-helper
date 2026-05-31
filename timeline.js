/* ===== Thesis Timeline / Progress Tracker ===== */
const TimelineModule = {
    phases: [
        { id: 'proposal', title: '选题与开题', desc: '确定研究方向，完成开题报告', icon: '💡' },
        { id: 'litreview', title: '文献综述', desc: '查阅文献，撰写文献综述章节', icon: '📚' },
        { id: 'method', title: '研究方法/实验', desc: '设计研究方案，进行实验或数据收集', icon: '🔬' },
        { id: 'draft', title: '初稿撰写', desc: '完成论文初稿', icon: '✍️' },
        { id: 'revise', title: '修改完善', desc: '根据导师意见修改论文', icon: '🔧' },
        { id: 'plagiarism', title: '查重降重', desc: '提交查重，控制在要求范围内', icon: '🔍' },
        { id: 'blind', title: '盲审/外审', desc: '提交盲审，等待评审结果', icon: '📋' },
        { id: 'defense', title: '论文答辩', desc: '准备答辩PPT，完成答辩', icon: '🎤' },
        { id: 'final', title: '终稿提交', desc: '根据答辩意见修改，提交终稿', icon: '✅' },
    ],

    completedPhases: {},
    defenseDate: null,

    init() {
        document.getElementById('saveDefenseDate').addEventListener('click', () => this.saveDefenseDate());

        this.loadFromStorage();
        this.render();
        this.startCountdown();
    },

    loadFromStorage() {
        this.completedPhases = App.safeLoad('thesis_phases', {});
        this.defenseDate = App.safeLoad('thesis_defense_date', null);
        if (this.defenseDate && typeof this.defenseDate === 'string') {
            document.getElementById('defenseDate').value = this.defenseDate;
        }
    },

    saveToStorage() {
        App.safeSave('thesis_phases', this.completedPhases);
        App.safeSave('thesis_defense_date', this.defenseDate || '');
    },

    togglePhase(id) {
        this.completedPhases[id] = !this.completedPhases[id];
        this.saveToStorage();
        this.render();
    },

    saveDefenseDate() {
        this.defenseDate = document.getElementById('defenseDate').value;
        this.saveToStorage();
        this.startCountdown();
        App.toast('答辩日期已设置');
    },

    getProgress() {
        const total = this.phases.length;
        const done = this.phases.filter(p => this.completedPhases[p.id]).length;
        return Math.round(done / total * 100);
    },

    getCurrentPhase() {
        for (const phase of this.phases) {
            if (!this.completedPhases[phase.id]) return phase.id;
        }
        return this.phases[this.phases.length - 1].id;
    },

    render() {
        const progress = this.getProgress();
        const current = this.getCurrentPhase();

        document.getElementById('overallProgress').style.width = progress + '%';
        document.getElementById('overallProgressText').textContent = progress + '%';

        const container = document.getElementById('timelinePhases');
        container.innerHTML = this.phases.map((phase, i) => {
            const isCompleted = this.completedPhases[phase.id];
            const isCurrent = phase.id === current && !isCompleted;
            let cls = '';
            let statusHtml = '';

            if (isCompleted) {
                cls = 'completed';
                statusHtml = '<span class="phase-status done">✓ 已完成</span>';
            } else if (isCurrent) {
                cls = 'current';
                statusHtml = '<span class="phase-status active">● 进行中</span>';
            } else {
                statusHtml = '<span class="phase-status pending">待完成</span>';
            }

            return `
                <div class="timeline-phase ${cls}">
                    <div class="phase-dot"></div>
                    <div class="phase-content" data-phase="${phase.id}">
                        <h4>${phase.icon} ${phase.title}</h4>
                        <p>${phase.desc}</p>
                        ${statusHtml}
                    </div>
                </div>
            `;
        }).join('');

        // Click to toggle
        container.querySelectorAll('.phase-content').forEach(el => {
            el.addEventListener('click', () => {
                this.togglePhase(el.dataset.phase);
            });
        });
    },

    startCountdown() {
        const update = () => {
            const el = document.getElementById('deadlineCountdown');
            if (!this.defenseDate) {
                el.innerHTML = '请设置答辩日期';
                return;
            }

            const now = new Date();
            const target = new Date(this.defenseDate + 'T00:00:00');
            const diff = target - now;

            if (diff < 0) {
                el.innerHTML = '🎉 答辩日期已过，祝你顺利通过！';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            el.innerHTML = `距离答辩还有 <strong>${days}</strong> 天`;

            // Also update defense timer
            const dEl = document.getElementById('defenseDays');
            const hEl = document.getElementById('defenseHours');
            const mEl = document.getElementById('defenseMins');
            if (dEl) {
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                dEl.textContent = days;
                hEl.textContent = hours;
                mEl.textContent = mins;
            }
        };

        update();
        setInterval(update, 60000);
    },
};
