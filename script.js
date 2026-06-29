const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const elements = document.querySelectorAll(".hero, .section, .card, .photo-box, .text, .tags span");
elements.forEach((el) => {
    el.classList.add("reveal");
    if (!prefersReduced) {
        el.classList.add("hidden");
    }
});

let revealLastY = window.scrollY;
let revealDir = "down";
window.addEventListener("scroll", () => {
    const y = window.scrollY;
    revealDir = y >= revealLastY ? "down" : "up";
    revealLastY = y;
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
    if (prefersReduced) {
        entries.forEach(entry => entry.target.classList.add("show"));
        return;
    }
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove("from-top");
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
            if (entry.boundingClientRect.top > 0) {
                entry.target.classList.add("from-top");
            } else {
                entry.target.classList.remove("from-top");
            }
        }
    });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

elements.forEach(el => {
    observer.observe(el);
});

const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }

    let current = "top";

    document.querySelectorAll("section[id], header[id]").forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

const progressBar = document.querySelector(".progress-bar");
let typingTimeout = null; 
function typeWriter(text) {
    const typingElement = document.querySelector(".typing");
    
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    typingElement.textContent = "";
    typingElement.style.borderRight = "3px solid rgba(255,255,255,0.75)";
    let i = 0;
    function typing() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
i++;
            typingTimeout = setTimeout(typing, 100);
        } else {
            typingElement.style.borderRight = "none";
        }
    }

    typing();
}

emailjs.init("lRjPzH-bH8Pt9H0dS");

const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");
const inputs = form.querySelectorAll("input, textarea");

inputs.forEach(input => {
    input.addEventListener("input", () => {
        input.classList.remove("input-error");
        const next = input.nextElementSibling;
        if (next && next.classList.contains("error-text")) {
            next.remove();
        }
    });
});

function getCurrentLang() {
    return localStorage.getItem("lang") || "en";
}
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const company = form.company;
    const email = form.email;
    const message = form.message;
    let hasError = false;
    clearErrors();
    const lang = getCurrentLang();
    const t = translations[lang];

    if (company.value.trim().length < 2) {
        showError(company, t.errors.company);
        hasError = true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        showError(email, t.errors.email);
        hasError = true;
    }

    if (message.value.trim().length < 10) {
        showError(message, t.errors.message);
        hasError = true;
    }

    if (hasError) return;
    statusText.textContent = "Sending...";
    emailjs.sendForm(
        "service_ti19orl",
        "template_dttkpka",
        form
    )
    .then(() => {
        statusText.textContent =
            "Invitation sent successfully ✨";

        form.reset();
    })
    .catch((error) => {
        statusText.textContent =
            "Something went wrong";
        console.error(error);
    });
});

function showError(input, text) {
    input.classList.add("input-error");
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error-text")) {
        return;
    }
    const error = document.createElement("div");
    error.className = "error-text show";
    error.textContent = text;
    input.parentNode.insertBefore(error, input.nextSibling);
}

function clearErrors() {
    document.querySelectorAll(".input-error")
        .forEach(el => {
            el.classList.remove("input-error");
        });
    document.querySelectorAll(".error-text")
        .forEach(el => {
            el.remove();
        });
}

const translations = {
    ru: {
        heroTitle: "Привет, я Галя!",
        heroSubtitle: "Веб • API • Интеграционное тестирование",

        downloadCV: "Открыть CV",
        hh: "HH профиль",

        aboutTitle: "Обо мне",
        aboutText: "Я QA инженер, специализируюсь на Web, API и интеграционном тестировании.",

        bringTitle: "Обо мне",
        bringText: "Я специализируюсь на обеспечении качества продукта с помощью структурированного тест-дизайна, анализа дефектов и взаимодействия с командами разработки, аналитики и дизайна. Имею опыт работы с тестированием сложных backend-задач, анализом логов и написанием тестовой документации. Проявляю внимание к деталям при анализе дефектов, работаю с API. Провожу интеграционное тестирование с банковскими продуктами, государственными сервисами и маркетплейсами.",

        expTitle: "Опыт",
        certTitle: "Сертификаты",
        contactTitle: "Контакты",

        timelinedate: "2025 - Настоящее время",
        company1: "Российский экспортный центр",
        role1: "QA инженер",
        exp1desc: "Web, API тестирование, Swagger, Postman, SQL, Camunda, Graylog, Figma, Pixso, Jira, Confluence",

        company2: "Обучение и практика QA",
        role2: "Mobile / Web-тестирование",
        exp2desc: "Практика работы с Postman, Swagger, Charles Proxy, мобильным тестированием, отладкой backend и проектированием тестов.",

        cert1: "VK Digital Camp",
        cert2: "Основы тестирования ПО",

        heroSubtitle: "Web • API • Интеграционное тестирование",

        heroRole: "QA инженер",
navHome: "Главная",
        navAbout: "Обо мне",
        navExp: "Опыт",
        navCerts: "Сертификаты",
        navContacts: "Контакты",

        certificate: "Практический курс по ручному тестированию: Web, API, мобильное тестирование. Повышение навыков локализации дефектов с применением Postman. Написание полноценных сценариев usability-тестирования, проведение и анализ результатов. Участие в воркшопах, быстрая работа в команде и планирование.",
        certificate2: "Практическая работа с API на уровне языка: JSON-структур, HTTP-методов, статус-кодов, параметров запросов, механизмов авторизации, а также переменными, структурой данных, функциями и модулями. Углубленная работа с backend-логикой приложений. Изучение сложных структур и оптимизации работы приложений.",
        OpenCert: "Открыть сертификат",

        errors: {
            company: "Введите название компании",
            email: "Введите корректный email",
            message: "Сообщение слишком короткое"
        },

        contactLabel: "КОНТАКТЫ",

        contactHeading:
        "Обсудим\nпроект\nвместе",
        contactText:
            "Открыта к предложениям, сотрудничеству и интересным проектам!",
        contactName:
            "Ваше имя",
        contactEmail:
            "Email",
        contactMessage:
            "Расскажите о проекте",
        contactButton:
            "Отправить сообщение",
        emailLabel:
            "Email",
        telegramLabel:
            "Telegram",
        githubLabel:
            "GitHub",

        qaManifesto: "Качество —<br>это не баги.<br>Это уверенность<br>в продукте",

        feature1Title: "Анализ дефектов",
        feature1Text: "Глубокое исследование ошибок с использованием backend-логов, трассировки запросов и воспроизводимых сценариев.",

        feature2Title: "API-тестирование",
        feature2Text: "Проверка REST API через Postman, Swagger, JSON-структуры и механизмы авторизации.",

        feature3Title: "Анализ логов",
        feature3Text: "Работа с Graylog, мониторинг и локализация проблем на стороне backend.",

        navPlayground: "API",

        metricsEyebrow: "РЕЗУЛЬТАТЫ",
        metricsTitle: "В цифрах",
        metric1Label: "багов задокументировано",
        metric2Label: "тест-кейсов написано",
        metric3Label: "API-методов проверено",
        metric4Label: "интеграций протестировано",

        pgEyebrow: "LIVE · РЕАЛЬНЫЕ ЗАПРОСЫ",
        playgroundTitle: "Живой набор API-тестов",
        playgroundSubtitle: "Это не «дёрнуть URL», а мини-набор автотестов: реальные запросы к публичному API, позитивные и негативный сценарии, и проверка не только статус-кода, но и содержимого ответа. Нажми «Запустить всё».",
        pgSuiteTitle: "Набор тестов",
        pgRunAll: "Запустить всё",
        pgRunning: "Выполняю…",
        pgIdle: "// Выбери тест слева или нажми «Запустить всё»",
        pgPass: "PASS",
        pgFail: "FAIL",
        pgNetwork: "API временно недоступна — проверь соединение",
        pgSummaryLabel: "Пройдено",
        chkStatus: "Статус-код",
        chkField: "Поле в ответе",
        chkListNotEmpty: "Список товаров не пустой",
        chkEcho: "Отправленное название вернулось в ответе",
        chkErrMsg: "Есть сообщение об ошибке",
        pgTest1: "Товар возвращается по ID",
        pgTest2: "Поиск находит товары",
        pgTest3: "Создание товара (POST)",
        pgTest4: "Несуществующий товар → 404",
    },

    en:{
        heroTitle: "Hi, I'm Galya!",
        heroSubtitle: "Web • API • Integration Testing",

        downloadCV: "Open CV",
        hh: "HH profile",

        aboutTitle: "About Me",
        aboutText: "I am a QA Engineer focused on Web, API and Integration testing.",

        bringTitle: "About me",
        bringText: "I specialize in product quality assurance through structured test design, defect analysis, and close collaboration with development, analytics, and design teams. I have experience testing complex backend tasks, analyzing logs, and writing test documentation. I pay strong attention to detail when analyzing defects and work with APIs. I conduct integration testing with banking products, government services, and marketplaces.",

        expTitle: "Experience",
        certTitle: "Certificates",
        contactTitle: "Contacts",

        timelinedate: "2025 - Present",
        company1: "Russian Export Center",
        role1: "QA Engineer",
        exp1desc: "Web, API testing, Swagger, Postman, SQL, Camunda, Graylog, Figma, Pixso, Jira, Confluence",
        
        company2: "QA Training & Practice",
        role2: "Mobile / Web Testing",
        exp2desc: "Hands-on practice with Postman, Swagger, Charles Proxy, mobile testing, backend debugging, and test design.",

        cert1: "VK Digital Camp",
        cert2: "Software Testing Foundations",

        heroSubtitle: "Web • API • Integration Testing",

        heroRole: "QA Engineer",

        navHome: "Home",
        navAbout: "About",
        navExp: "Experience",
        navCerts: "Certificates",
        navContacts: "Contacts",

        certificate: "Practical course in manual testing: Web, API, and mobile testing. Improving bug localization skills using Postman. Writing complete usability testing scenarios, conducting tests, and analyzing results. Participation in workshops, fast-paced teamwork, and planning.",
        certificate2: "Practical work with APIs at the language level: JSON structures, HTTP methods, status codes, request parameters, authorization mechanisms, as well as variables, data structures, functions, and modules. In-depth work with backend application logic. Study of complex structures and application performance optimization.",
        OpenCert: "Open Certificate",

        errors: {
            company: "Enter company name",
            email: "Enter valid email",
            message: "Message is too short"
        },

        contactLabel: "CONTACT",

        contactHeading:
            "Let's build\nsomething\ngreat together",

        contactText:
            "Open to QA opportunities, collaborations and interesting projects!",

        contactName:
            "Your name",

        contactEmail:
            "Email",

        contactMessage:
            "Tell me about your project",

        contactButton:
            "Send Message",

        emailLabel:
            "Email",

        telegramLabel:
            "Telegram",

        githubLabel:
            "GitHub",

        qaManifesto: "Quality is not<br>about bugs.<br>It's confidence<br>in the product",
        feature1Title: "Bug Investigation",
        feature1Text: "Deep defect analysis using backend logs, request tracing, and reproducible scenarios.",

        feature2Title: "API Testing",
        feature2Text: "REST API validation with Postman, Swagger, JSON structures, and authentication flows.",

        feature3Title: "Log Analysis",
        feature3Text: "Graylog analysis, monitoring, and backend issue localization.",

        navPlayground: "API",

        metricsEyebrow: "RESULTS",
        metricsTitle: "By the numbers",
        metric1Label: "bugs documented",
        metric2Label: "test cases written",
        metric3Label: "API methods tested",
        metric4Label: "integrations tested",

        pgEyebrow: "LIVE · REAL REQUESTS",
        playgroundTitle: "Live API test suite",
        playgroundSubtitle: "Not just pinging a URL — a tiny automated test suite: real requests to a public API, positive and negative cases, asserting both the status code and the response body. Hit Run all.",
        pgSuiteTitle: "Test suite",
        pgRunAll: "Run all",
        pgRunning: "Running…",
        pgIdle: "// Pick a test on the left or hit Run all",
        pgPass: "PASS",
        pgFail: "FAIL",
        pgNetwork: "API temporarily unavailable — check the connection",
        pgSummaryLabel: "Passed",
        chkStatus: "Status code",
        chkField: "Field in response",
        chkListNotEmpty: "Products list is not empty",
        chkEcho: "Sent title is returned in the response",
        chkErrMsg: "Error message is present",
        pgTest1: "Product is returned by ID",
        pgTest2: "Search returns products",
        pgTest3: "Create a product (POST)",
        pgTest4: "Missing product → 404",
    }    
};

function setLang(lang) {
    const translationsLang = translations[lang];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translationsLang[key]) {
            el.innerHTML = translationsLang[key];
        }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translationsLang[key]) {
            el.placeholder = translationsLang[key];
        }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    const langSwitch = document.querySelector('.lang-switch');
    langSwitch.setAttribute('data-lang', lang);
    typeWriter(translationsLang.heroTitle);
    localStorage.setItem("lang", lang);

    if (window.__pgReady) {
        renderPgList(lang);
        renderPgDetail(lang);
    }
}

const savedLang = localStorage.getItem("lang") || "en";
setLang(savedLang);
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scroll / (maxScroll * 0.6), 1);
    const hue = 35 - (progress * 25);
    document.documentElement.style.setProperty('--accent', `hsl(${hue}, 25%, 45%)`);
    lastScroll = scroll;
});

const certificates = document.querySelectorAll(".certificate");
certificates.forEach(cert => {
    const top = cert.querySelector(".cert-top");
    top.addEventListener("click", () => {
        cert.classList.toggle("active");

    });

});
function animateCounter(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target + suffix;
        }
    }
    requestAnimationFrame(tick);
}

const metricNumbers = document.querySelectorAll(".metric-number");
metricNumbers.forEach(el => {
    el.textContent = "0" + (el.dataset.suffix || "");
});

const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
            entry.target.dataset.done = "1";
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.4 });

metricNumbers.forEach(el => metricObserver.observe(el));
const API = "https://dummyjson.com";

const pgSuite = [
    {
        nameKey: "pgTest1",
        method: "GET",
        url: API + "/products/1",
        checks: (s, b) => [
            { kind: "status", arg: 200, pass: s === 200 },
            { kind: "field", arg: "id", pass: !!b && b.id === 1 },
            { kind: "field", arg: "title", pass: !!b && typeof b.title === "string" && b.title.length > 0 },
            { kind: "gt0", arg: "price", pass: !!b && b.price > 0 }
        ]
    },
    {
        nameKey: "pgTest2",
        method: "GET",
        url: API + "/products/search?q=phone",
        checks: (s, b) => [
            { kind: "status", arg: 200, pass: s === 200 },
            { kind: "listNotEmpty", pass: !!b && Array.isArray(b.products) && b.products.length > 0 }
        ]
    },
    {
        nameKey: "pgTest3",
        method: "POST",
        url: API + "/products/add",
        body: { title: "QA Test Product" },
        checks: (s, b) => [
            { kind: "status2xx", pass: s >= 200 && s < 300 },
            { kind: "echo", pass: !!b && b.title === "QA Test Product" },
            { kind: "field", arg: "id", pass: !!b && typeof b.id === "number" }
        ]
    },
    {
        nameKey: "pgTest4",
        method: "GET",
        url: API + "/products/9999",
        negative: true,
        checks: (s, b) => [
            { kind: "status", arg: 404, pass: s === 404 },
            { kind: "errMsg", pass: !!b && !!b.message }
        ]
    }
];

let pgActive = 0;
const pgResults = {};

const pgTestsEl   = document.getElementById("pg-tests");
const pgRunAllEl  = document.getElementById("pg-run-all");
const pgSummaryEl = document.getElementById("pg-summary");
const pgMethodEl  = document.getElementById("pg-method");
const pgUrlEl     = document.getElementById("pg-url");
const pgStatusRow = document.getElementById("pg-status-row");
const pgStatusEl  = document.getElementById("pg-status");
const pgTimeEl    = document.getElementById("pg-time");
const pgAssertsEl = document.getElementById("pg-asserts");
const pgBodyEl    = document.getElementById("pg-body");

const STATUS_TEXT = {
    200: "OK", 201: "Created", 204: "No Content",
    400: "Bad Request", 401: "Unauthorized", 403: "Forbidden",
    404: "Not Found", 500: "Internal Server Error"
};

function statusClass(code) {
    if (code >= 200 && code < 300) return "ok";
    if (code >= 300 && code < 400) return "warn";
    return "err";
}

function checkLabel(c, t) {
    switch (c.kind) {
        case "status":       return `${t.chkStatus} = ${c.arg}`;
        case "status2xx":    return `${t.chkStatus} 2xx`;
        case "field":        return `${t.chkField}: ${c.arg}`;
        case "gt0":          return `${c.arg} > 0`;
        case "listNotEmpty": return t.chkListNotEmpty;
        case "echo":         return t.chkEcho;
        case "errMsg":       return t.chkErrMsg;
        default:             return c.kind;
    }
}

function stateIcon(state) {
    if (state === "pass") return "✓";
    if (state === "fail") return "✗";
    if (state === "net")  return "!";
    if (state === "run")  return "◌";
    return "•";
}

function renderPgList(lang) {
    if (!pgTestsEl) return;
    const t = translations[lang] || translations.en;
    pgTestsEl.innerHTML = "";
    pgSuite.forEach((test, i) => {
        const res = pgResults[i];
        const state = res ? res.state : "idle";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pg-test " + state + (i === pgActive ? " active" : "");
        btn.innerHTML =
            `<span class="pg-test-ico">${stateIcon(state)}</span>` +
            `<span class="pg-test-main">` +
                `<span class="pg-test-name">${t[test.nameKey] || test.nameKey}</span>` +
                `<span class="pg-test-ep"><span class="m">${test.method}</span> ${test.url.replace(API, "")}</span>` +
            `</span>`;
        btn.addEventListener("click", () => {
            pgActive = i;
            renderPgList(getCurrentLang());
            runTest(i);
        });
        pgTestsEl.appendChild(btn);
    });
}

function renderPgDetail(lang) {
    const t = translations[lang] || translations.en;
    const test = pgSuite[pgActive];
    if (pgMethodEl) {
        pgMethodEl.textContent = test.method;
        pgMethodEl.setAttribute("data-m", test.method);
    }
    if (pgUrlEl) pgUrlEl.textContent = test.url;

    const res = pgResults[pgActive];
    if (!res || res.state === "run") {
        pgStatusRow.hidden = true;
        pgAssertsEl.innerHTML = "";
        pgBodyEl.textContent = t.pgIdle;
        return;
    }

    if (res.state === "net") {
        pgStatusRow.hidden = true;
        pgAssertsEl.innerHTML = "";
        pgBodyEl.textContent = t.pgNetwork;
        return;
    }

    pgStatusEl.className = "pg-status " + statusClass(res.status);
    const stext = STATUS_TEXT[res.status] || "";
    pgStatusEl.textContent = res.status + (stext ? " " + stext : "");
    pgTimeEl.textContent = res.ms + " ms";
    pgStatusRow.hidden = false;

    pgAssertsEl.innerHTML = "";
    res.checks.forEach(c => {
        const row = document.createElement("div");
        row.className = "pg-assert-item " + (c.pass ? "pass" : "fail");
        row.innerHTML =
            `<span class="tick">${c.pass ? "✓" : "✗"}</span>` +
            `<span>${checkLabel(c, t)}</span>`;
        pgAssertsEl.appendChild(row);
    });

    pgBodyEl.textContent = res.body;
}

async function runTest(i) {
    const test = pgSuite[i];
    const lang = getCurrentLang();

    pgResults[i] = { state: "run" };
    renderPgList(lang);
    if (i === pgActive) renderPgDetail(lang);

    const t0 = performance.now();
    try {
        const opts = { method: test.method, headers: {} };
        if (test.body) {
            opts.headers["Content-Type"] = "application/json";
            opts.body = JSON.stringify(test.body);
        }
        const res = await fetch(test.url, opts);
        const ms = Math.round(performance.now() - t0);

        let data = null;
        let bodyText = "";
        try {
            data = await res.json();
            bodyText = JSON.stringify(data, null, 2);
        } catch (e) {
            bodyText = "{ }";
        }

        const checks = test.checks(res.status, data);
        const allPass = checks.every(c => c.pass);

        pgResults[i] = {
            state: allPass ? "pass" : "fail",
            status: res.status,
            ms: ms,
            checks: checks,
            body: bodyText
        };
    } catch (err) {
        pgResults[i] = { state: "net" };
    }

    renderPgList(getCurrentLang());
    if (i === pgActive) renderPgDetail(getCurrentLang());
    return pgResults[i].state;
}

async function runAll() {
    const lang = getCurrentLang();
    const t = translations[lang] || translations.en;
    pgRunAllEl.disabled = true;
    pgRunAllEl.textContent = t.pgRunning;
    pgSummaryEl.hidden = true;

    let passed = 0;
    let counted = 0;
    for (let i = 0; i < pgSuite.length; i++) {
        pgActive = i;
        const state = await runTest(i);
        if (state === "pass") passed++;
        if (state === "pass" || state === "fail") counted++;
    }

    pgRunAllEl.disabled = false;
    pgRunAllEl.textContent = t.pgRunAll;

    const total = counted || pgSuite.length;
    pgSummaryEl.className = "pg-summary " + (passed === total ? "ok" : "bad");
    pgSummaryEl.textContent = `${t.pgSummaryLabel}: ${passed}/${total}`;
    pgSummaryEl.hidden = false;
}

if (pgTestsEl && pgRunAllEl) {
    pgRunAllEl.addEventListener("click", runAll);
    window.__pgReady = true;
    renderPgList(getCurrentLang());
    renderPgDetail(getCurrentLang());
}

if (!prefersReduced) {
    const tiltCards = document.querySelectorAll(".qa-feature-card, .metric-card");
    tiltCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transition = "transform 0.08s ease-out";
        });
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            const max = 9;
            card.style.transform =
                `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) ` +
                `rotateY(${(px * max).toFixed(2)}deg) translateY(-6px)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transition = ""; 
            card.style.transform = "";  
        });
    });
}

if (!prefersReduced) {
    const orbEls = [
        { el: document.querySelector(".orb-1"), depth: 26, speed: 0.10, phase: 0 },
        { el: document.querySelector(".orb-2"), depth: 40, speed: 0.16, phase: 2 },
        { el: document.querySelector(".orb-3"), depth: 18, speed: 0.07, phase: 4 }
    ].filter(o => o.el);

    orbEls.forEach(o => { o.el.style.animation = "none"; o.el.style.willChange = "transform"; });

    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    function orbLoop(now) {
        const sc = window.scrollY;
        orbEls.forEach(o => {
            const floatY = Math.sin(now / 1000 + o.phase) * 22;
            const x = mouseX * o.depth;
            const y = mouseY * o.depth + floatY + sc * o.speed;
            o.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        });
        requestAnimationFrame(orbLoop);
    }
    requestAnimationFrame(orbLoop);
}
