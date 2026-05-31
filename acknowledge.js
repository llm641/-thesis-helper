/* ===== Acknowledgment Generator ===== */
const AcknowledgeModule = {
    currentStyle: 'warm',

    init() {
        // Style selector
        document.querySelectorAll('#panel-acknowledge .style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#panel-acknowledge .style-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentStyle = btn.dataset.style;
            });
        });

        document.getElementById('generateAck').addEventListener('click', () => this.generate());
        document.getElementById('copyAck').addEventListener('click', () => this.copy());
        document.getElementById('regenerateAck').addEventListener('click', () => this.generate());
    },

    generate() {
        const name = document.getElementById('ackName').value.trim() || '我';
        const advisor = document.getElementById('ackAdvisor').value.trim() || '导师';
        const title = document.getElementById('ackTitle').value.trim() || '本论文';
        const school = document.getElementById('ackSchool').value.trim() || '母校';
        const major = document.getElementById('ackMajor').value.trim() || '本专业';
        const specialRaw = document.getElementById('ackSpecial').value.trim();
        const specials = specialRaw ? specialRaw.split(/[,，、]/).map(s => s.trim()).filter(Boolean) : [];

        const templates = {
            warm: () => {
                let text = `时光荏苒，白驹过隙。在${school}的求学生涯即将画上句号，回首这段历程，心中充满感激。

首先，我要向我的导师${advisor}老师致以最诚挚的谢意。从选题到定稿，${advisor}老师始终悉心指导，每次与老师的交流都让我受益匪浅。老师严谨的治学态度、深厚的学术造诣，以及平易近人的为人，都深深影响着我。在此，谨向${advisor}老师表示崇高的敬意和衷心的感谢！

感谢${school}${major}的所有老师们，是你们的辛勤教导为我打下了坚实的专业基础。`;
                if (specials.length > 0) {
                    specials.forEach(s => {
                        text += `\n感谢${s}，在我求学路上的陪伴与支持。`;
                    });
                }
                text += `\n感谢我的家人，你们的理解、支持和无私的付出，是我能够安心完成学业的坚强后盾。

感谢所有在百忙之中评阅论文和参加答辩的各位专家、教授。

最后，感谢${school}对我的培养。这段求学时光将是我人生中最宝贵的记忆。

路漫漫其修远兮，吾将上下而求索。`;
                return text;
            },

            formal: () => {
                let text = `本论文的完成得益于${advisor}老师的悉心指导。在论文的选题、研究方法的确定、实验方案的设计以及论文撰写的全过程中，${advisor}老师都给予了大量宝贵的意见和建议。${advisor}老师严谨的治学精神、精益求精的工作作风，深深地感染和激励着我。在此谨向${advisor}老师致以诚挚的谢意。

在${school}${major}学习期间，得到了各位老师的谆谆教导，为本论文的研究工作奠定了坚实的理论基础，在此一并表示感谢。`;
                if (specials.length > 0) {
                    text += `\n同时感谢${specials.join('、')}在本研究过程中提供的帮助与支持。`;
                }
                text += `\n感谢家人长期以来对我学业的理解与支持。

最后，向在百忙中抽出时间对本文进行评审并提出宝贵意见的各位专家表示衷心的感谢。`;
                return text;
            },

            simple: () => {
                let text = `在论文完成之际，感谢${advisor}老师的悉心指导。感谢${school}各位老师的培养。`;
                if (specials.length > 0) {
                    text += `感谢${specials.join('、')}的陪伴与帮助。`;
                }
                text += `感谢家人的支持。感谢所有关心和帮助过我的人。`;
                return text;
            },

            literary: () => {
                let text = `岁月不居，时节如流。站在毕业的门槛上，回首在${school}的点点滴滴，万千思绪涌上心头。

首先，我要将最深的敬意献给我的导师——${advisor}老师。先生之风，山高水长。从论文的选题立意，到最终的逐字推敲，${advisor}老师倾注了大量心血。老师不仅在学术上指明方向，更在为人处世上以身作则。桃李不言，下自成蹊。`;
                if (specials.length > 0) {
                    specials.forEach(s => {
                        text += `\n感谢${s}，人生得一知己足矣，斯世当以同怀视之。`;
                    });
                }
                text += `\n哀哀父母，生我劬劳。感谢父母二十余载的养育之恩，你们的默默付出是我前行路上最温暖的光。

感谢${school}的培育，感谢这段不可复制的青春岁月。

凡是过往，皆为序章。愿我们各自努力，顶峰相见。`;
                return text;
            },
        };

        const text = (templates[this.currentStyle] || templates.warm)();

        const output = document.getElementById('acknowledgeOutput');
        document.getElementById('ackContent').textContent = text;
        output.style.display = 'block';
        output.scrollIntoView({ behavior: 'smooth' });
    },

    copy() {
        const text = document.getElementById('ackContent').textContent;
        if (!text) return;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed'; ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        App.toast('致谢已复制到剪贴板');
    },
};
