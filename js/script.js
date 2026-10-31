    document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    // 1. РАЗМЕР ШРИФТА
    let currentFontSize = 100;
    document.getElementById('btn-font-increase').addEventListener('click', () => {
        if (currentFontSize < 180) { 
            currentFontSize += 10; 
            document.documentElement.style.fontSize = currentFontSize + '%'; 
        }
    });
    document.getElementById('btn-font-decrease').addEventListener('click', () => {
        if (currentFontSize > 80) { 
            currentFontSize -= 10; 
            document.documentElement.style.fontSize = currentFontSize + '%'; 
        }
    });

    // 2. КОНТРАСТНОСТЬ
    const contrastToggle = document.getElementById('contrast-toggle');
    contrastToggle.addEventListener('click', () => {
        const isPressed = contrastToggle.getAttribute('aria-pressed') === 'true';
        body.classList.toggle('high-contrast');
        contrastToggle.setAttribute('aria-pressed', !isPressed);
        
        if (!isPressed) {
            body.classList.remove('dark-theme');
            document.getElementById('theme-toggle').setAttribute('aria-pressed', 'false');
            document.getElementById('theme-icon').textContent = '🌙';
        }
    });

    // 3. ТЕМНАЯ ТЕМА
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    themeToggle.addEventListener('click', () => {
        const isPressed = themeToggle.getAttribute('aria-pressed') === 'true';
        if (body.classList.contains('high-contrast')) {
            body.classList.remove('high-contrast');
            contrastToggle.setAttribute('aria-pressed', 'false');
        }
        body.classList.toggle('dark-theme');
        themeToggle.setAttribute('aria-pressed', !isPressed);
        themeIcon.textContent = isPressed ? '🌙' : '☀️';
    });

    // 4. ЧТЕНИЕ ВСЛУХ
    const btnRead = document.getElementById('btn-read');
    let isReading = false;
    btnRead.addEventListener('click', () => {
        if (isReading) {
            window.speechSynthesis.cancel();
            isReading = false;
            btnRead.innerHTML = '🔊 Прочитать';
        } else {
            const textToRead = document.getElementById('main-content').innerText;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'ru-RU';
            utterance.onend = () => { 
                isReading = false; 
                btnRead.innerHTML = '🔊 Прочитать'; 
            };
            window.speechSynthesis.speak(utterance);
            isReading = true;
            btnRead.innerHTML = '⏹ Остановить';
        }
    });

    // 5. ОТПРАВКА ФОРМЫ
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = "Формируем письмо... Пожалуйста, подождите.";
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const mailtoLink = `mailto:your-zhambalovasayana83@gmail.com?subject=Сообщение от ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AEmail отправителя: ${encodeURIComponent(email)}`;
            
            setTimeout(() => {
                window.location.href = mailtoLink;
                form.reset();
                formStatus.textContent = "Почтовая программа открыта. Отправьте письмо!";
            }, 1000);
        });
    }
});
        // 5. ОТПРАВКА ФОРМЫ ЧЕРЕЗ FORMSPREE
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            formStatus.textContent = "Отправляем сообщение... Пожалуйста, подождите.";
            formStatus.style.color = "var(--text-color)";

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "Спасибо! Ваше сообщение успешно отправлено.";
                    formStatus.style.color = "green";
                    form.reset(); 
                } else {
                    formStatus.textContent = "Упс! Произошла ошибка при отправке.";
                    formStatus.style.color = "red";
                }
            } catch (error) {
                formStatus.textContent = "Ошибка сети. Проверьте интернет.";
                formStatus.style.color = "red";
            }
        });
    }