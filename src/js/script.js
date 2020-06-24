const menuBtn = document.getElementById('burger-menu');
menuBtn.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('menu').classList.toggle("show");
})
