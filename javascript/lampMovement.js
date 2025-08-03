// Ждем, пока весь DOM будет загружен
window.addEventListener('DOMContentLoaded', () => {

    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        console.log('Сенсорное устройство обнаружено. Анимация ламп отключена.');
        return; // Прекращаем выполнение скрипта
    }

    // Получаем элемент canvas и его 2D контекст
    const canvas = document.getElementById('lampCanvas');
    const ctx = canvas.getContext('2d');

    // Получаем все элементы-якори для ламп
    const lampAnchors = document.querySelectorAll('.shelf-container');

    // --- КОНФИГУРАЦИЯ СВЕТА ---
    const lightConfig = {
        color: { r: 255, g: 25, b: 25 },
        intensity: 0.9,
        radius: 150,
        length: 450,
        width: 120,
        blur: 10,
        animationSpeed: 0.3
    };

    const lamps = [];
    let mouseX = 0;
    let mouseY = 0;

    /**
     * Обновляет позиции ламп на Canvas,
     * используя координаты их якорей в DOM.
     */
    function updatePositions() {
        lampAnchors.forEach((anchor, index) => {
            const lampRect = anchor.querySelector('.lamp').getBoundingClientRect();
            // Координаты getBoundingClientRect уже относительны к окну,
            // поэтому не нужно добавлять window.scrollY
            lamps[index].x = lampRect.left + lampRect.width / 2;
            lamps[index].y = lampRect.top + lampRect.height / 2;
        });
    }

    /**
     * Изменяет размер Canvas, чтобы он соответствовал размеру окна,
     * и обновляет позиции ламп.
     */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updatePositions();
    }

    /**
     * Основная функция отрисовки.
     * Очищает Canvas и перерисовывает все лампы и лучи.
     */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        lamps.forEach(lamp => {
            if (lamp.lightOpacity > 0.01) {
                ctx.save();
                ctx.translate(lamp.x, lamp.y);
                ctx.rotate(lamp.currentAngle);

                const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, lightConfig.radius);
                gradient.addColorStop(0, `rgba(${lightConfig.color.r}, ${lightConfig.color.g}, ${lightConfig.color.b}, ${lamp.lightOpacity * lightConfig.intensity})`);
                gradient.addColorStop(0.7, `rgba(${lightConfig.color.r}, ${lightConfig.color.g}, ${lightConfig.color.b}, ${lamp.lightOpacity * lightConfig.intensity * 0.2})`);
                gradient.addColorStop(1, 'rgba(255, 255, 180, 0)');

                ctx.fillStyle = gradient;

                ctx.shadowColor = `rgba(${lightConfig.color.r}, ${lightConfig.color.g}, ${lightConfig.color.b}, ${lamp.lightOpacity * lightConfig.intensity})`;
                ctx.shadowBlur = lightConfig.blur;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-lightConfig.width, lightConfig.length);
                ctx.lineTo(lightConfig.width, lightConfig.length);
                ctx.closePath();
                ctx.fill();

                ctx.shadowBlur = 0;
                ctx.restore();
            }

            ctx.beginPath();
            ctx.fillStyle = '#444';
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#444';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 4;
            ctx.ellipse(lamp.x, lamp.y + 10, 40, 30, 0, Math.PI, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.restore();
        });
    }

    /**
     * Главный цикл анимации.
     * Обновляет состояние ламп и перерисовывает Canvas.
     */
    function animate() {
        lamps.forEach(lamp => {
            // Плавное изменение прозрачности света
            lamp.lightOpacity += (lamp.targetOpacity - lamp.lightOpacity) * lightConfig.animationSpeed;
            // Плавное изменение угла луча
            const targetAngle = Math.atan2(mouseY - (lamp.y + 40), mouseX - lamp.x) + Math.PI * 3 / 2;
            lamp.currentAngle += (targetAngle - lamp.currentAngle) * lightConfig.animationSpeed;
        });

        draw();
        requestAnimationFrame(animate);
    }

    // Обработчик для отслеживания движения мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Инициализация ламп при загрузке DOM
    lampAnchors.forEach((anchor, index) => {
        const lampRect = anchor.querySelector('.lamp').getBoundingClientRect();
        lamps.push({
            x: lampRect.left + lampRect.width / 2,
            y: lampRect.top + lampRect.height / 2,
            currentAngle: Math.PI / 2,
            lightOpacity: 0,
            targetOpacity: 0,
        });

        anchor.addEventListener('mouseenter', () => {
            lamps[index].targetOpacity = 1;
        });

        anchor.addEventListener('mouseleave', () => {
            lamps[index].targetOpacity = 0;
        });
    });

    // Обработчики событий для изменения размера окна и прокрутки
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', updatePositions);

    // Первоначальный вызов функций
    resizeCanvas();
    animate();
});