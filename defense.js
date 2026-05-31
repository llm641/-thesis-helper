/* ===== Defense Preparation ===== */
const DefenseModule = {
    faqs: [
        {
            q: '为什么选择这个题目？',
            a: '从个人兴趣、学术价值、社会需求三个角度回答。说明该选题填补了什么研究空白，有什么实际应用价值。',
        },
        {
            q: '你的研究有什么创新点？',
            a: '明确指出1-3个创新之处，可以是理论创新、方法创新、应用创新。用"首次"、"新的"、"不同于"等词凸显差异性。',
        },
        {
            q: '你的研究方法有什么优势？为什么不用其他方法？',
            a: '对比你所选方法与其他可选方法的优劣，说明你的选择是基于研究目标和条件的合理决策。',
        },
        {
            q: '你的数据和样本是否具有代表性？',
            a: '说明数据来源、样本量、抽样方法，以及你如何确保数据的可靠性和有效性。承认局限性并说明已采取的控制措施。',
        },
        {
            q: '你的研究有什么局限性？',
            a: '诚实但不自卑。列举2-3个局限性，并说明你已经如何尽量控制，以及未来可以如何改进。不要否认，也不要说"没有局限"。',
        },
        {
            q: '这篇论文的结论可以推广吗？',
            a: '说明你结论的适用范围和边界条件。不要过度宣称，保持学术严谨。',
        },
        {
            q: '你后续打算如何深入这个研究？',
            a: '提出1-2个具体可行的后续研究方向，展示你对这个领域的深入思考和长期规划。',
        },
        {
            q: '你的论文和已有研究最大的区别是什么？',
            a: '清晰指出你的研究与最相关的2-3篇文献的差异，用具体细节而不是笼统描述。',
        },
    ],

    init() {
        this.renderFaqs();
    },

    renderFaqs() {
        const list = document.getElementById('faqList');
        list.innerHTML = this.faqs.map((faq, i) => `
            <div class="faq-item" data-idx="${i}">
                <div class="faq-q">
                    <span>${faq.q}</span>
                </div>
                <div class="faq-a">${faq.a}</div>
            </div>
        `).join('');

        // Toggle FAQ items
        list.querySelectorAll('.faq-q').forEach(q => {
            q.addEventListener('click', () => {
                const item = q.parentElement;
                const wasOpen = item.classList.contains('open');
                // Close all
                list.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
                // Toggle clicked
                if (!wasOpen) item.classList.add('open');
            });
        });
    },
};
