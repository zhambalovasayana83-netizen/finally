// ====================================================
// 1. АКТУАЛЬНЫЙ ГОД В ПОДВАЛЕ
// ====================================================
const yearEl = document.querySelector('#year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}


// ====================================================
// 2. ПЕРЕКЛЮЧЕНИЕ ТЁМНОЙ ТЕМЫ
// ====================================================
const themeBtn = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('#theme-icon');

function updateThemeButton() {
    const isDark = document.documentElement.classList.contains('dark');
    themeBtn.setAttribute('aria-pressed', String(isDark));
    themeBtn.setAttribute('aria-label', isDark ? 'Светлая тема' : 'Тёмная тема');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
}

updateThemeButton();

themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    updateThemeButton();
});


// ====================================================
// 3. ОТПРАВКА ФОРМЫ БЕЗ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ
// ====================================================
const form = document.querySelector('#contacts form');
const statusMsg = document.querySelector('#form-status');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();

    // Сначала очищаем — чтобы скринридер «заметил» новое сообщение
    statusMsg.classList.remove('visible');
    statusMsg.textContent = '';

    window.setTimeout(() => {
        statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
        statusMsg.classList.add('visible');
    }, 10);

    form.reset();
});


// ====================================================
// 4. КНОПКА «НАВЕРХ» ПРИ ПРОКРУТКЕ
// ====================================================
const upBtn = document.querySelector('#to-top');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

window.addEventListener('scroll', () => {
    upBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

upBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
});


// ====================================================
// 5. ОЗВУЧИВАНИЕ САЙТА (Web Speech API)
// ====================================================
const readBtn = document.querySelector('#read-aloud');
const readBtnText = readBtn.querySelector('span:not([aria-hidden])');
const synth = window.speechSynthesis;
let utterance = null;

function getReadableText() {
    const main = document.querySelector('#main');
    if (!main) return '';

    // Клонируем и вырезаем скрытые элементы
    const clone = main.cloneNode(true);
    clone.querySelectorAll('[hidden], [aria-hidden="true"]').forEach(el => el.remove());

    return clone.textContent.replace(/\s+/g, ' ').trim();
}

function stopReading() {
    synth.cancel();
    utterance = null;
    readBtnText.textContent = 'Прочитать';
    readBtn.setAttribute('aria-label', 'Прочитать сайт вслух');
    readBtn.classList.remove('reading');
}

function startReading() {
    const text = getReadableText();
    if (!text) return;

    synth.cancel(); // остановить предыдущее чтение, если было

    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1;
    utterance.pitch = 1;

    // Если есть русский голос — используем его
    const voices = synth.getVoices();
    const ruVoice = voices.find(v => v.lang && v.lang.startsWith('ru'));
    if (ruVoice) utterance.voice = ruVoice;

    utterance.onend = stopReading;
    utterance.onerror = stopReading;

    readBtnText.textContent = 'Остановить';
    readBtn.setAttribute('aria-label', 'Остановить чтение');
    readBtn.classList.add('reading');

    synth.speak(utterance);
}

readBtn.addEventListener('click', () => {
    if (synth.speaking || synth.pending) {
        stopReading();
    } else {
        startReading();
    }
});

// На всякий случай обновляем голоса, когда браузер их загрузит
if (typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = () => { /* голоса доступны */ };
}

// Останавливаем чтение при уходе со страницы
window.addEventListener('beforeunload', () => synth.cancel());