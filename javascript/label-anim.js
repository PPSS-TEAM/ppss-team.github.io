
window.addEventListener('DOMContentLoaded', () => {
    // Получаем холст и его 2D-контекст
    const canvas = document.getElementById('labelCanvas');
    const ctx = canvas.getContext('2d');

    // Определяем текстовое содержимое и стили
    const defaultText = "Политика - дело не человеческое";
    const hoverText = "Но человеку близкое";
    const baseFontSize = 32; // Базовый размер шрифта, который будет масштабироваться
    // NOTE: Используем имя нового шрифта
    const fontFamily = 'Veda, sans-serif';
    // NOTE: Теперь эти переменные влияют на цвет текста
    const defaultColor = '#6f407e';
    const hoverColor = '#331933';
    const textPadding = 50; // Увеличиваем отступ вокруг текста для более широкой области наведения

    // NOTE: Новые переменные для автоматической смены текста на устройствах без курсора
    const defaultTextDisplayTime = 4000; // Время отображения первого текста (в миллисекундах)
    const hoverTextDisplayTime = 2000;   // Время отображения второго текста (в миллисекундах)

    // Переменные состояния
    let mouseX = -1;
    let mouseY = -1;
    let isHovering = false;
    let currentAlpha = 0; // Значение прозрачности для текста при наведении (от 0 до 1)
    const alphaSpeed = 0.05; // Скорость анимации появления/исчезновения
    let isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    let autoChangeActive = isTouchDevice;
    let lastSwitchTime = Date.now();
    let isDefaultTextVisible = true;

    // NOTE: Вспомогательная функция для преобразования HEX в RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    }

    // Функция для динамического изменения размера холста
    function resizeCanvas() {
        // Устанавливаем атрибуты width и height холста равными его реальному размеру на странице
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Масштабируем размер шрифта в зависимости от ширины холста
        const newFontSize = Math.max(16, baseFontSize * (canvas.width / 600));
        ctx.font = `${newFontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Перерисовываем содержимое
        draw();
    }

    // Функция для отрисовки текста на холсте
    function draw() {
        // Очищаем весь холст
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Вычисляем центр холста
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Измеряем размеры текста для создания области наведения
        const textMetrics = ctx.measureText(defaultText);
        const textWidth = textMetrics.width;
        const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

        // Вычисляем границы прямоугольной области наведения вокруг текста с отступом
        const hoverRect = {
            x: centerX - textWidth / 2 - textPadding,
            y: centerY - textHeight / 2 - textPadding,
            width: textWidth + textPadding * 2,
            height: textHeight + textPadding * 2
        };

        // Проверяем, находится ли курсор мыши внутри этой области
        isHovering = mouseX > hoverRect.x &&
            mouseX < hoverRect.x + hoverRect.width &&
            mouseY > hoverRect.y &&
            mouseY < hoverRect.y + hoverRect.height;

        if (autoChangeActive) {
            // Логика автоматической смены текста
            const currentTime = Date.now();
            const textDuration = isDefaultTextVisible ? defaultTextDisplayTime : hoverTextDisplayTime;

            if (currentTime - lastSwitchTime > textDuration) {
                isDefaultTextVisible = !isDefaultTextVisible;
                lastSwitchTime = currentTime;
            }

            // Плавно меняем прозрачность
            if (isDefaultTextVisible) {
                currentAlpha = Math.max(currentAlpha - alphaSpeed, 0);
            } else {
                currentAlpha = Math.min(currentAlpha + alphaSpeed, 1);
            }
        } else {
            // Исходная логика при наведении курсора
            if (isHovering) {
                currentAlpha = Math.min(currentAlpha + alphaSpeed, 1);
            } else {
                currentAlpha = Math.max(currentAlpha - alphaSpeed, 0);
            }
        }

        // Отрисовываем исходный текст с прозрачностью, которая уменьшается
        ctx.fillStyle = `rgba(${hexToRgb(defaultColor)}, ${1 - currentAlpha})`;
        ctx.fillText(defaultText, centerX, centerY);

        // Отрисовываем текст при наведении с его текущей прозрачностью
        ctx.fillStyle = `rgba(${hexToRgb(hoverColor)}, ${currentAlpha})`;
        ctx.fillText(hoverText, centerX, centerY);
    }

    // Добавляем обработчик события для движения мыши по холсту
    canvas.addEventListener('mousemove', (event) => {
        // Если мышь движется, отключаем автоматическую смену текста
        if (autoChangeActive) {
            autoChangeActive = false;
        }
        // Получаем границы холста
        const rect = canvas.getBoundingClientRect();
        // Вычисляем позицию мыши относительно холста
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    });

    // Добавляем обработчик события, когда мышь покидает холст
    canvas.addEventListener('mouseleave', () => {
        // Сбрасываем позицию мыши за пределы холста
        mouseX = -1;
        mouseY = -1;
    });

    // NOTE: Добавляем обработчик для сенсорного ввода
    canvas.addEventListener('touchstart', (event) => {
        // Если произошло сенсорное касание, включаем автоматическую смену текста
        autoChangeActive = true;
        isTouchDevice = true;
    });

    // Цикл анимации
    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    // Запускаем анимацию при загрузке окна и при изменении его размера
    window.onload = function () {
        resizeCanvas();
        animate();
    };

    window.onresize = function () {
        resizeCanvas();
    };

})
