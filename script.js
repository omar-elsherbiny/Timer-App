const lightThemeIcon = document.getElementById('light-theme-icon');
const darkThemeIcon = document.getElementById('dark-theme-icon');

let themeToggle = document.getElementById('theme-toggle');
let storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme)
    if (storedTheme === 'dark') {
        lightThemeIcon.classList.add('hide');
        darkThemeIcon.classList.remove('hide');
    }
    else {
        lightThemeIcon.classList.remove('hide');
        darkThemeIcon.classList.add('hide');
    }
}
themeToggle.addEventListener('click', function () {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = 'light';
    if (currentTheme === 'light') {
        targetTheme = 'dark';
    }
    lightThemeIcon.classList.toggle('hide');
    darkThemeIcon.classList.toggle('hide');
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
});
// theme switch

function setClock(digits, arr) {
    digits.forEach((digit, dIndex) => {
        let options = digit.children;
        let target = arr[dIndex].toString();
        let currentNode = null;
        if (target != null) {
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                option.classList.remove('current');
                option.classList.remove('out');
                if (option.textContent < target) {
                    option.classList.add('out');
                } else if (option.textContent == target) {
                    option.classList.add('current');
                    currentNode = option;
                }
            }
            digit.style.width = currentNode == null ? 0 : currentNode.getBoundingClientRect().width + 'px';
        }
    });
}
// clock digits
function getRemainingTime(currentDate, targetDate) {
    if (targetDate < currentDate) {
        return null;
    }
    const difference = targetDate.getTime() - currentDate.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
}

const nEvents = localStorage.getItem('nEvents') || 0;
for (let i = 0; i < nEvents; i++) {

}
// time management

if (navigator.userAgent.includes('Firefox')) {
    document.querySelectorAll('.scroll').forEach(element => {
        element.classList.add('scroll-moz');
    });
}
// main run