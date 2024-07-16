const themeToggle = document.getElementById('theme-toggle');
const lightThemeIcon = document.getElementById('light-theme-icon');
const darkThemeIcon = document.getElementById('dark-theme-icon');
const addEventBtn = document.getElementById('add-event-btn');
const modalContainer = document.querySelector('.modal-container');
const backdrop = document.querySelector('.backdrop');
const submitEventBtn = document.getElementById('submit-event-btn');
const eventTitleInput = document.getElementById('event-title-input');
const eventTimeInput = document.getElementById('event-time-input');
const futureEventsContainer = document.getElementById('future-events');
const pastEventsContainer = document.getElementById('past-events');

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

let storedTheme = new StoredValue(
    'theme',
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    (self) => {
        if (self._value === 'dark') {
            lightThemeIcon.classList.add('hide');
            darkThemeIcon.classList.remove('hide');
        }
        else {
            lightThemeIcon.classList.remove('hide');
            darkThemeIcon.classList.add('hide');
        }
        document.documentElement.setAttribute('data-theme', self._value);
    }
)

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
    const difference = targetDate - currentDate;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    let arr = days.toString().padStart(4, ' ').split('');
    arr = arr.concat(hours.toString().padStart(2, '0').split(''));
    arr = arr.concat(minutes.toString().padStart(2, '0').split(''));
    arr = arr.concat(seconds.toString().padStart(2, '0').split(''));

    return arr;
}

let futureEventsArr = new StoredArray('futureEvents');
let pastEventsArr = new StoredArray('pastEvents');

console.log(futureEventsArr.arr);
console.log(pastEventsArr.arr);

function getPastPanel() {
    let element = document.createElement('div');
    element.classList.add('time-panel', 'sub')
    element.innerHTML = `
    <h4 class="time-panel-title"></h4>
    <button class="svg-btn time-panel-delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
            <path fill="currentColor"
                d="m232.49 80.49l-128 128a12 12 0 0 1-17 0l-56-56a12 12 0 1 1 17-17L96 183L215.51 63.51a12 12 0 0 1 17 17Z" />
        </svg>
    </button>
    `
    return element;
}

function getFuturePanel() {
    let element = document.createElement('div');
    element.classList.add('time-panel', 'sub')
    element.innerHTML = `
    <h4 class="time-panel-title"></h4>
    <div class="time-panel-content clock-digit-container">
        <div class="digit">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
        <div class="digit">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
        <div class="digit">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
        <div class="digit">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
        <div class="digit gap">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
        <div class="digit">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
        <p>:</p>
        <div class="digit">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
        <div class="digit">
            <p class="current">-</p>
            <p>0</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
        </div>
    </div>
    <button class="svg-btn time-panel-delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
            <path fill="currentColor"
                d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
        </svg>
    </button>
    `
    return element;
}

function updatePanels() {
    // sort and transfer events
    let currentTime = new Date().getTime();
    futureEventsArr.arr = futureEventsArr.arr.sort((a, b) => a.time - b.time);
    for (let i = 0; i < futureEventsArr.arr.length; i++) {
        const event = futureEventsArr.arr[i];
        if (event.time < currentTime) {
            futureEventsArr.arr.splice(i, 1);
            pastEventsArr.push(event);
        } else {
            break;
        }
    }
    pastEventsArr.arr = pastEventsArr.arr.sort((a, b) => a.time - b.time);
    futureEventsArr.update();
    pastEventsArr.update();

    // fix element count
    let futureDiff = futureEventsArr.arr.length - futureEventsContainer.childElementCount - 1;
    if (futureDiff > 0) {
        for (let i = 0; i < futureDiff; i++) {
            futureEventsContainer.appendChild(getFuturePanel());
        }
    } else if (futureDiff < 0) {
        let children = futureEventsContainer.children
        for (let i = 0; i < Math.abs(futureDiff); i++) {
            futureEventsContainer.removeChild(children[i]);
        }
    }
    let pastDiff = pastEventsArr.arr.length - pastEventsContainer.childElementCount;
    if (pastDiff > 0) {
        for (let i = 0; i < pastDiff; i++) {
            pastEventsContainer.appendChild(getPastPanel());
        }
    } else if (pastDiff < 0) {
        let children = pastEventsContainer.children
        for (let i = 0; i < Math.abs(pastDiff); i++) {
            pastEventsContainer.removeChild(children[i]);
        }
    }

    // update time time, title, time
    futureEventsArr.arr.forEach((event, index) => {
        if (index == 0) {
            document.querySelector('.time-panel.main .time-panel-title').textContent = event.title;
            document.querySelector('.time-panel.main .time-panel-delete').onclick = () => {
                futureEventsArr.remove(
                    futureEventsArr.arr.find(obj => obj.id === event.id));
                updatePanels();
            };
            setClock(
                document.querySelectorAll('.time-panel.main .time-panel-content .digit'),
                getRemainingTime(currentTime, event.time)
            );
        } else {
            document.querySelectorAll('#future-events .time-panel.sub .time-panel-title')[index - 1].textContent = event.title;
            document.querySelectorAll('#future-events .time-panel.sub .time-panel-delete')[index - 1].onclick = () => {
                futureEventsArr.remove(futureEventsArr.arr.find(obj => obj.id === event.id));
                updatePanels();
            };
            setClock(
                document.querySelectorAll('#future-events .time-panel.sub')[index - 1]
                    .querySelectorAll('.time-panel-content .digit'),
                getRemainingTime(currentTime, event.time)
            );
        }
    });
    pastEventsArr.arr.forEach((event, index) => {
        document.querySelectorAll('#past-events .time-panel.sub .time-panel-title')[index].textContent = event.title;
        document.querySelectorAll('#past-events .time-panel.sub .time-panel-delete')[index].onclick = () => {
            pastEventsArr.remove(pastEventsArr.arr.find(obj => obj.id === event.id));
            updatePanels();
        };
    });
}

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
        let eventTime = Date.parse(eventTimeInput.value);
        if (new Date().getTime() < eventTime) {
            futureEventsArr.push({
                id: Math.round(Math.random() * 10000).toString().padStart(5, 0),
                title: eventTitleInput.value,
                time: eventTime
            })
        } else {
            pastEventsArr.push({
                id: Math.round(Math.random() * 10000).toString().padStart(5, 0),
                title: eventTitleInput.value,
                time: eventTime
            })
        }
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

updatePanels();
// main run