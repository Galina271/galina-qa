const elements = document.querySelectorAll(".hero, .section, .card, .photo-box, .text, .tags span");
elements.forEach((el, index) => {
    el.classList.add("hidden");

    el.style.transitionDelay = `${index * 80}ms`;
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

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
