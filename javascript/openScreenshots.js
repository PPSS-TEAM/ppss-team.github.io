function openScreenshot(imageSrc) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    modal.style.display = 'block';
    modalImg.src = imageSrc;
}

// Закрытие модального окна
function closeScreenshot() {
    document.getElementById('modal').style.display = 'none';
}

// Закрытие при клике вне изображения
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}