const themeToggle = document.getElementById('theme-toggle');
const lightThemeIcon = document.getElementById('light-theme-icon');
const darkThemeIcon = document.getElementById('dark-theme-icon');
const addEventBtn = document.getElementById('add-event-btn');
const modalContainer = document.querySelector('.modal-container');
const backdrop = document.querySelector('.backdrop');
const submitEventBtn = document.getElementById('submit-event-btn');
const eventTitleInput = document.getElementById('event-title-input');
const eventTimeInput = document.getElementById('event-time-input');

class StoredValue {
    constructor(localStorageName, defaultValue = false, updateCallback = (self) => { }) {
        this._name = localStorageName;
        this._callback = updateCallback;
        try {
            this._value = JSON.parse(localStorage.getItem(this._name));
            if (this._value == null) throw new Error('');
        } catch (e) {
            this._value = defaultValue;
            this._callback(this);
        }
    }
    update() {
        localStorage.setItem(this._name, this._value);
        this._callback(this);
    }
    get val() {
        return this._value;
    }
    set val(value) {
        this._value = value;
        localStorage.setItem(this._name, JSON.stringify(this._value));
        this.update();
    }
}

class StoredArray {
    constructor(localStorageName) {
        this._name = localStorageName;
        this._array = JSON.parse(localStorage.getItem(this._name)) || [];
    }
    update() {
        localStorage.setItem(this._name, JSON.stringify(this._array));
    }
    get arr() {
        return this._array;
    }
    set arr(value) {
        this._array = value;
        localStorage.setItem(this._name, JSON.stringify(this._array));
        this.update();
    }
    push(...elements) {
        this.arr.push(...elements);
        this.update();
    }
    remove(element) {
        this._array = this._array.filter(e => { return e !== element });
        this.update();
    }
}

let storedTheme = new StoredValue('theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), (self) => {
    if (self._value === 'dark') {
        lightThemeIcon.classList.add('hide');
        darkThemeIcon.classList.remove('hide');
    }
    else {
        lightThemeIcon.classList.remove('hide');
        darkThemeIcon.classList.add('hide');
    }
    document.documentElement.setAttribute('data-theme', self._value);
})

themeToggle.addEventListener('click', function () {
    storedTheme.val = storedTheme.val == 'dark' ? 'light' : 'dark';
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
// setClock(document.querySelectorAll('#main-time .digit'),['', '','',5,0,1,3,0,5,0])
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

let futureEventsArr = new StoredArray('futureEvents');
let pastEventsArr = new StoredArray('pastEvents');

function checkEventValid() {
    if (eventTitleInput.value && eventTimeInput.value) {
        submitEventBtn.classList.remove('invalid');
        return true
    } else {
        submitEventBtn.classList.add('invalid');
        return false
    }
}

eventTitleInput.addEventListener('input', checkEventValid);
eventTimeInput.addEventListener('input', checkEventValid);

submitEventBtn.addEventListener('click', e => {
    if (checkEventValid()) {
        modalContainer.classList.remove('visible');
        console.log(Date.parse(eventTimeInput.value));
    }
});

// time management

addEventBtn.addEventListener('click', e => {
    modalContainer.classList.add('visible');
});

backdrop.addEventListener('click', e => {
    modalContainer.classList.remove('visible');
});

// add event modal

if (navigator.userAgent.includes('Firefox')) {
    document.querySelectorAll('.scroll').forEach(element => {
        element.classList.add('scroll-moz');
    });
}
// main run