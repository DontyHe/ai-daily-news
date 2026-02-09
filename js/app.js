// AI Daily News - Main Application JavaScript

// API Configuration (Placeholder - Replace with actual APIs)
const API_CONFIG = {
    newsApi: 'YOUR_NEWS_API_KEY',
    papersApi: 'https://api.semanticscholar.org/graph/v1/paper/search',
    arxivApi: 'http://export.arxiv.org/api/query'
};

// State Management
let state = {
    news: [],
    papers: [],
    filteredNews: [],
    filteredPapers: [],
    currentPage: {
        news: 1,
        papers: 1
    },
    itemsPerPage: 6,
    activeFilter: 'all',
    darkMode: false
};

// DOM Elements
const elements = {
    newsGrid: document.getElementById('newsGrid'),
    papersGrid: document.getElementById('papersGrid'),
    toolsGrid: document.getElementById('toolsGrid'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    loadMoreNews: document.getElementById('loadMoreNews'),
    loadMorePapers: document.getElementById('loadMorePapers'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    backToTop: document.getElementById('backToTop'),
    currentDate: document.getElementById('currentDate'),
    newsFilters: document.getElementById('newsFilters'),
    paperSort: document.getElementById('paperSort'),
    subscribeForm: document.getElementById('subscribeForm')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    displayCurrentDate();
    await loadNews();
    await loadPapers();
    initEventListeners();
    checkDarkMode();
}

// Display Current Date
function displayCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Shanghai'
    };
    elements.currentDate.textContent = now.toLocaleDateString('zh-CN', options);
}

// News Data (Placeholder - Replace with real API)
async function loadNews() {
    try {
        // Simulated news data - Replace with actual API call
        const mockNews = generateMockNews();
        state.news = mockNews;
        state.filteredNews = mockNews;
        renderNews();
    } catch (error) {
        console.error('Error loading news:', error);
        elements.newsGrid.innerHTML = '<p class="error-message">Failed to load news. Please try again later.</p>';
    }
}

function generateMockNews() {
    const categories = ['llm', 'robotics', 'cv', 'nlp', 'general'];
    const newsData = [];

    for (let i = 1; i <= 12; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        newsData.push({
            id: i,
            title: getNewsTitle(i, category),
            summary: getNewsSummary(i, category),
            category: category,
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            tags: getNewsTags(category),
            url: '#'
        });
    }

    return newsData.sort((a, b) => b.date - a.date);
}

function getNewsTitle(index, category) {
    const titles = {
        llm: [
            'OpenAI发布GPT-5最新进展，性能提升显著',
            'Anthropic推出Claude 3.5，支持100K token上下文',
            'Google DeepMind展示Gemini 2.0多模态能力',
            'Meta开源LLaMA 4，性能超越闭源模型'
        ],
        robotics: [
            '波士顿动力发布新版Atlas机器人，动作更流畅',
            '特斯拉Optimus Gen 2首次在工厂实际工作',
            'MIT研发出新型软体机器人，可变形执行任务',
            'OpenAI展示机器人通过VLA模型自主学习'
        ],
        cv: [
            'Vision Transformer在ImageNet上达到新SOTA',
            'Stable Diffusion 3发布，图像质量大幅提升',
            'SAM 2发布，支持视频 segmentation',
            'YOLO v10发布，推理速度提升50%'
        ],
        nlp: [
            '多语言大模型支持100+语言，性能提升显著',
            '上下文窗口扩展到1M token的新方法',
            '知识蒸馏技术使小模型也能达到大模型效果',
            '新型Tokenizer减少token数量40%'
        ],
        general: [
            'AI芯片新突破：能效比提升10倍',
            'NVIDIA发布新一代Blackwell架构GPU',
            '欧盟通过AI法案，规范AI发展',
            'AI在科学研究中取得重大突破'
        ]
    };

    const categoryTitles = titles[category] || titles.general;
    return categoryTitles[index % categoryTitles.length];
}

function getNewsSummary(index, category) {
    const summaries = {
        llm: [
            'OpenAI在其开发者大会上展示了GPT-5的最新进展，新模型在推理能力和多模态理解方面都有显著提升。',
            'Anthropic发布了Claude 3.5系列模型，最大支持100K token上下文窗口，在长文本理解任务中表现优异。',
            'Google DeepMind展示了Gemini 2.0的全新多模态能力，能够同时处理文本、图像、音频和视频。',
            'Meta发布了LLaMA 4开源模型，在多项基准测试中超越了同等规模的闭源模型。'
        ],
        robotics: [
            '波士顿动力展示了新一代Atlas机器人，新版本动作更加流畅自然，能够完成复杂的体操动作。',
            '特斯拉Optimus Gen 2人形机器人首次在工厂环境中执行实际工作任务，包括电池搬运和质检。',
            'MIT研究人员开发出一种新型软体机器人，可以通过改变形状来适应不同环境和执行不同任务。',
            'OpenAI展示了使用VLA模型的机器人能够通过观看人类演示自主学习新任务。'
        ],
        cv: [
            'Vision Transformer团队发布了新的模型变体，在ImageNet分类任务上达到了新的SOTA。',
            'Stability AI发布了Stable Diffusion 3，新模型采用新型架构，图像质量和生成速度都有大幅提升。',
            'Meta发布SAM 2，这是Segment Anything Model的视频版本，支持视频中的实时物体分割。',
            'YOLO v10发布，新版本在保持高精度的同时，推理速度比上一代提升了50%。'
        ],
        nlp: [
            '研究人员开发出一种多语言大模型，能够支持100多种语言的理解和生成任务。',
            '新型上下文窗口扩展技术使模型能够处理超过100万token的文本。',
            '知识蒸馏技术的最新进展使得小型模型也能达到大型模型90%以上的性能。',
            '研究人员提出了一种新型Tokenizer，能够将文本压缩40%以上而不损失信息。'
        ],
        general: [
            'AI芯片领域传来重大突破，新型芯片在能效比上提升了10倍。',
            'NVIDIA发布了新一代Blackwell架构GPU，AI训练性能提升数倍。',
            '欧盟通过了AI法案，为人工智能的发展设定了新的规范和标准。',
            'AI在科学研究中取得重大突破，在蛋白质结构预测和材料发现等领域有重要进展。'
        ]
    };

    const categorySummaries = summaries[category] || summaries.general;
    return categorySummaries[index % categorySummaries.length];
}

function getNewsTags(category) {
    const tagMap = {
        llm: ['大语言模型', 'OpenAI', 'Anthropic', '多模态'],
        robotics: ['机器人', '波士顿动力', '特斯拉', '人形机器人'],
        cv: ['计算机视觉', 'Diffusion', 'SAM', '目标检测'],
        nlp: ['自然语言处理', 'Transformer', 'Tokenizer', '知识蒸馏'],
        general: ['AI芯片', '行业动态', '政策监管', '科研突破']
    };

    return tagMap[category] || ['AI', '技术', '新闻'];
}

// Papers Data (Placeholder)
async function loadPapers() {
    try {
        const mockPapers = generateMockPapers();
        state.papers = mockPapers;
        state.filteredPapers = mockPapers;
        renderPapers();
    } catch (error) {
        console.error('Error loading papers:', error);
        elements.papersGrid.innerHTML = '<p class="error-message">Failed to load papers. Please try again later.</p>';
    }
}

function generateMockPapers() {
    const papersData = [];

    for (let i = 1; i <= 12; i++) {
        papersData.push({
            id: i,
            title: getPaperTitle(i),
            authors: getPaperAuthors(i),
            abstract: getPaperAbstract(i),
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            citations: Math.floor(Math.random() * 1000),
            arxivId: `2401.${String(10000 + i).padStart(4, '0')}`,
            categories: ['cs.AI', 'cs.LG']
        });
    }

    return papersData.sort((a, b) => b.date - a.date);
}

function getPaperTitle(index) {
    const titles = [
        'Attention Is All You Need: Revisited for Language Model Scaling',
        'Diffusion Models Beat GANs on Image Synthesis: A Comprehensive Study',
        'Large Language Models Are Effective Cross-Modal Transfer Learners',
        'Self-Supervised Learning for Robot Manipulation: A New Perspective',
        'Vision-Language Models for Embodied AI: Bridging Perception and Action',
        'Scaling Laws for Neural Language Models: Empirical Analysis and Theoretical Foundation',
        'Reinforcement Learning with World Models: From Model-Based to Model-Free',
        'Multi-Modal Learning: Unifying Vision, Language and Action',
        'Efficient Fine-Tuning Methods for Large-Scale Pretrained Models',
        'Interpretability in Deep Learning: Understanding Neural Network Decisions',
        'Zero-Shot Learning with Large Language Models: A New Paradigm',
        'Generative AI for Scientific Discovery: Methods and Applications'
    ];

    return titles[index % titles.length];
}

function getPaperAuthors(index) {
    const authors = [
        'Vaswani et al.',
        'Ho et al.',
        'Radford et al.',
        'Levine et al.',
        'Shen et al.',
        'Kaplan et al.',
        'Ha and Schmidhuber',
        'Baltrusaitis et al.',
        'Hu et al.',
        'Ribeiro et al.',
        'Brown et al.',
        'Jumper et al.'
    ];

    return authors[index % authors.length];
}

function getPaperAbstract(index) {
    const abstracts = [
        'We revisit the transformer architecture and propose improvements for better scaling in large language models.',
        'A comprehensive study comparing diffusion models and GANs on various image synthesis tasks.',
        'Exploring how large language models can be effectively used as cross-modal transfer learners.',
        'A new perspective on self-supervised learning for robot manipulation tasks.',
        'Bridging vision, language and action for embodied AI systems through multimodal learning.'
    ];

    return abstracts[index % abstracts.length];
}

// Render Functions
function renderNews() {
    const startIndex = (state.currentPage.news - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const newsToRender = state.filteredNews.slice(0, endIndex);

    elements.newsGrid.innerHTML = newsToRender.map(news => createNewsCard(news)).join('');

    // Hide load more button if all items loaded
    if (endIndex >= state.filteredNews.length) {
        elements.loadMoreNews.style.display = 'none';
    } else {
        elements.loadMoreNews.style.display = 'inline-block';
    }
}

function createNewsCard(news) {
    const formattedDate = news.date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
    });

    const categoryNames = {
        llm: '大语言模型',
        robotics: '机器人',
        cv: '计算机视觉',
        nlp: '自然语言处理',
        general: '综合新闻'
    };

    return `
        <article class="news-card">
            <div class="news-card-header">
                <span class="news-category">${categoryNames[news.category] || news.category}</span>
                <span class="news-date">${formattedDate}</span>
            </div>
            <h4><a href="${news.url}">${news.title}</a></h4>
            <p>${news.summary}</p>
            <div class="news-tags">
                ${news.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `;
}

function renderPapers() {
    const startIndex = (state.currentPage.papers - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const papersToRender = state.filteredPapers.slice(0, endIndex);

    elements.papersGrid.innerHTML = papersToRender.map(paper => createPaperCard(paper)).join('');

    if (endIndex >= state.filteredPapers.length) {
        elements.loadMorePapers.style.display = 'none';
    } else {
        elements.loadMorePapers.style.display = 'inline-block';
    }
}

function createPaperCard(paper) {
    const formattedDate = paper.date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <article class="paper-card">
            <div class="paper-meta">
                <span class="paper-date">📅 ${formattedDate}</span>
                <span class="paper-citations">📊 ${paper.citations} citations</span>
            </div>
            <h4>${paper.title}</h4>
            <p class="paper-authors">👥 ${paper.authors}</p>
            <p>${paper.abstract}</p>
            <div class="paper-links">
                <a href="https://arxiv.org/abs/${paper.arxivId}" target="_blank" class="paper-link">arXiv</a>
                <a href="https://arxiv.org/pdf/${paper.arxivId}.pdf" target="_blank" class="paper-link secondary">PDF</a>
            </div>
        </article>
    `;
}

// Event Listeners
function initEventListeners() {
    // Search
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filter Tags
    elements.newsFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
            document.querySelectorAll('.filter-tag').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            handleFilter(e.target.dataset.category);
        }
    });

    // Sort Papers
    elements.paperSort.addEventListener('change', handleSort);

    // Load More
    elements.loadMoreNews.addEventListener('click', () => {
        state.currentPage.news++;
        renderNews();
    });

    elements.loadMorePapers.addEventListener('click', () => {
        state.currentPage.papers++;
        renderPapers();
    });

    // Dark Mode
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);

    // Back to Top
    window.addEventListener('scroll', handleScroll);
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Subscribe Form
    if (elements.subscribeForm) {
        elements.subscribeForm.addEventListener('submit', handleSubscribe);
    }
}

// Handlers
function handleSearch() {
    const query = elements.searchInput.value.toLowerCase().trim();

    if (!query) {
        state.filteredNews = state.news;
        state.filteredPapers = state.papers;
    } else {
        state.filteredNews = state.news.filter(news =>
            news.title.toLowerCase().includes(query) ||
            news.summary.toLowerCase().includes(query) ||
            news.tags.some(tag => tag.toLowerCase().includes(query))
        );

        state.filteredPapers = state.papers.filter(paper =>
            paper.title.toLowerCase().includes(query) ||
            paper.authors.toLowerCase().includes(query) ||
            paper.abstract.toLowerCase().includes(query)
        );
    }

    state.currentPage = { news: 1, papers: 1 };
    renderNews();
    renderPapers();
}

function handleFilter(category) {
    state.activeFilter = category;

    if (category === 'all') {
        state.filteredNews = state.news;
    } else {
        state.filteredNews = state.news.filter(news => news.category === category);
    }

    state.currentPage.news = 1;
    renderNews();
}

function handleSort() {
    const sortBy = elements.paperSort.value;

    switch (sortBy) {
        case 'date':
            state.filteredPapers.sort((a, b) => b.date - a.date);
            break;
        case 'citations':
            state.filteredPapers.sort((a, b) => b.citations - a.citations);
            break;
        case 'trending':
            // Implement trending logic based on recency and citations
            state.filteredPapers.sort((a, b) => {
                const recencyWeight = 0.7;
                const citationWeight = 0.3;
                const now = Date.now();
                const aRecency = Math.exp(-0.001 * (now - a.date));
                const bRecency = Math.exp(-0.001 * (now - b.date));
                return (b.citations * citationWeight + bRecency * 1000 * recencyWeight) -
                       (a.citations * citationWeight + aRecency * 1000 * recencyWeight);
            });
            break;
    }

    renderPapers();
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', state.darkMode);
    elements.darkModeToggle.textContent = state.darkMode ? '☀️' : '🌙';
}

function checkDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        state.darkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.darkModeToggle.textContent = '☀️';
    }
}

function handleScroll() {
    if (window.scrollY > 500) {
        elements.backToTop.classList.add('visible');
    } else {
        elements.backToTop.classList.remove('visible');
    }
}

function handleSubscribe(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    alert(`感谢订阅！我们会向 ${email} 发送每日AI新闻更新。`);
    e.target.reset();
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
