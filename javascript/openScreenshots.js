/**
 * Открывает модальное окно со скриншотом.
 * @param {string} imageSrc - URL полноразмерного изображения.
 * @param {number} [scaleFactor=1] - Коэффициент масштабирования (1 = без увеличения).
 * @param {string} [renderingType='auto'] - Тип рендеринга ('auto' или 'pixelated').
 */
function openScreenshot(imageSrc, scaleFactor = 1, renderingType = 'auto') {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');

    // Установка источника изображения
    modalImg.src = imageSrc;

    // Применяем CSS-переменную для масштаба после загрузки изображения
    modalImg.onload = function () {
        // Вычисляем безопасный коэффициент масштабирования, чтобы изображение не выходило за пределы экрана
        const viewportWidth = window.innerWidth * 0.9;
        const viewportHeight = window.innerHeight * 0.9;
        const naturalWidth = modalImg.naturalWidth;
        const naturalHeight = modalImg.naturalHeight;

        const maxScaleByWidth = viewportWidth / naturalWidth;
        const maxScaleByHeight = viewportHeight / naturalHeight;
        const maxSafeScale = Math.min(maxScaleByWidth, maxScaleByHeight);

        // Используем наименьшее значение: либо заданный, либо безопасный максимум
        const effectiveScale = Math.min(scaleFactor, maxSafeScale);

        modalImg.style.setProperty('--scale-factor', effectiveScale);
        modalImg.style.imageRendering = renderingType;
        modalImg.onload = null; // Удаляем обработчик
    };

    // Если изображение уже в кэше, событие onload может не сработать, 
    // поэтому применяем переменную сразу, если изображение уже загружено.
    if (modalImg.complete) {
        // Вычисляем безопасный коэффициент масштабирования
        const viewportWidth = window.innerWidth * 0.9;
        const viewportHeight = window.innerHeight * 0.9;
        const naturalWidth = modalImg.naturalWidth;
        const naturalHeight = modalImg.naturalHeight;

        const maxScaleByWidth = viewportWidth / naturalWidth;
        const maxScaleByHeight = viewportHeight / naturalHeight;
        const maxSafeScale = Math.min(maxScaleByWidth, maxScaleByHeight);

        const effectiveScale = Math.min(scaleFactor, maxSafeScale);

        modalImg.style.setProperty('--scale-factor', effectiveScale);
        modalImg.style.imageRendering = renderingType;
    }

    // Показываем модальное окно, добавляя класс 'show'
    modal.classList.add('show');
}

/**
 * Закрывает модальное окно.
 */
function closeScreenshot() {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    // Сбрасываем масштаб
    modalImg.style.setProperty('--scale-factor', 1);
    // Удаляем свойство рендеринга
    modalImg.style.removeProperty('image-rendering');
    // Очищаем источник изображения для предотвращения утечек памяти
    modalImg.src = '';
    // Скрываем модальное окно, удаляя класс 'show'
    modal.classList.remove('show');
}

/**
 * Закрывает модальное окно при клике вне изображения.
 */
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeScreenshot();
    }
}