"use strict";

// A word guessing game inspired by Wordle
// Copyright (C) 2022  Amir Livne Bar-on
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


function get_date() {
    return new Date().toLocaleDateString('he-IL', {timeZone: 'Asia/Jerusalem'});
}

const HEBREW_KEYMAP = {
    'e': 'ק', 'ק': 'ק', 'r': 'ר', 'ר': 'ר', 't': 'א', 'א': 'א', 'y': 'ט', 'ט': 'ט',
    'u': 'ו', 'ו': 'ו', 'i': 'נ', 'ן': 'נ', 'o': 'מ', 'ם': 'מ', 'p': 'פ', 'פ': 'פ',
    'a': 'ש', 'ש': 'ש', 's': 'ד', 'ד': 'ד', 'd': 'ג', 'ג': 'ג', 'f': 'כ', 'כ': 'כ',
    'g': 'ע', 'ע': 'ע', 'h': 'י', 'י': 'י', 'j': 'ח', 'ח': 'ח', 'k': 'ל', 'ל': 'ל',
    'l': 'כ', 'ך': 'כ', ';': 'פ', 'ף': 'פ', 'z': 'ז', 'ז': 'ז', 'x': 'ס', 'ס': 'ס',
    'c': 'ב', 'ב': 'ב', 'v': 'ה', 'ה': 'ה', 'b': 'נ', 'נ': 'נ', 'n': 'מ', 'מ': 'מ',
    'm': 'צ', 'צ': 'צ', ',': 'ת', 'ת': 'ת', '.': 'צ', 'ץ': 'צ'
};
const FINAL_LETTERS = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'};
const FINALED_LETTERS = {'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ'};
const today = get_date();
const word_of_the_day = calculate_meduyeket(today);
let guesses = [];


function un_finalize(word) {
    return Array.from(word).map(function(letter) {
        if (FINAL_LETTERS.hasOwnProperty(letter))
            return FINAL_LETTERS[letter];
        else
            return letter;
    }).join('');
}

function get_matches(guess, truth) {
    guess = un_finalize(guess);
    truth = un_finalize(truth);

    const not_exact_matches = [];
    for (let i = 0; i < 5; i++)
        if (guess[i] !== truth[i])
            not_exact_matches.push(truth[i]);

    const matches = [];
    for (let i = 0; i < 5; i++) {
        if (guess[i] === truth[i]) {
            matches.push('exact');
            continue;
        }
        const index = not_exact_matches.indexOf(guess[i]);
        if (index === -1) {
            matches.push('wrong');
        } else {
            not_exact_matches.splice(index, 1);
            matches.push('other');
        }
    }
    return matches;
}

function create_result() {
    const RTL_MARK = '\u200f';
    const rows = guesses.map(function(guess) {
        return RTL_MARK + get_matches(guess, word_of_the_day).map(function(match) {
            return {exact: '🟩', other: '🟨', wrong: '⬜'}[match];
        }).join('');
    });
    return `מדויקת ${today} - ${guesses[guesses.length - 1] === word_of_the_day ? guesses.length : 'X'}/6\n\n` + rows.join('\n');
}

function set_modal_state() {
    switch (history.state) {
        case 'help':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.remove('hidden');
            document.getElementById('help-screen').scrollTop = 0;
            document.getElementById('success-screen').classList.add('hidden');
            document.getElementById('popup').classList.add('hidden');
            break;

        case 'success':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.add('hidden');
            document.getElementById('success-screen').classList.remove('hidden');
            if (guesses[guesses.length - 1] === word_of_the_day) {
                document.getElementById('success-header').innerText = 'כל הכבוד!';
            } else {
                document.getElementById('success-header').innerText = 'לא הצליח הפעם';
                document.getElementById('popup').innerText = word_of_the_day;
                document.getElementById('popup').classList.remove('hidden');
            }

            document.getElementById('result').innerHTML = create_result();
            countdown();
            break;

        default:
            document.getElementById('modal').classList.add('hidden');
    }
}

function show_help() {
    if (history.state !== 'help') {
        if (history.state === 'success')
            history.replaceState('help', '');
        else
            history.pushState('help', '');
    }
    set_modal_state();
}

function show_success_screen() {
    if (history.state !== 'success') {
        if (history.state === 'help')
            history.replaceState('success', '');
        else
            history.pushState('success', '');
    }
    set_modal_state();
}

function switch_colorblind_mode() {
    if (document.body.classList.contains('colorblind'))
        document.body.classList.remove('colorblind');
    else
        document.body.classList.add('colorblind');
    save_to_local_storage();
}

let showed_failure_popup = false;
function copy_result(event) {
    event.stopPropagation();
    navigator.clipboard.writeText(create_result())
        .then(function() {popup('התוצאה הועתקה, אפשר להדביק עם Ctrl+V');})
        .catch(function() {
            if (!showed_failure_popup || event.target.id !== 'result') {
                showed_failure_popup = true;
                popup('לא עבד, נסו לסמן את הטקסט ולהעתיק ידנית');
            }
        });
}

function countdown() {
    if (document.getElementById('modal').classList.contains('hidden'))
        return;
    if (document.getElementById('success-screen').classList.contains('hidden'))
        return;

    if (get_date() !== today) {
        document.getElementById('countdown').innerText = '0:00:00';
        return;
    }

    const time_str = new Date().toLocaleTimeString('he-IL', {timeZone: 'Asia/Jerusalem', hourCycle: 'h23'});
    const [hours, minutes, seconds] = time_str.split(':').map(function(x) {return parseInt(x);});
    const since_midnight = 3600 * hours + 60 * minutes + seconds;
    const to_midnight = 3600 * 24 - since_midnight;
    document.getElementById('countdown').innerText =
        `${Math.trunc(to_midnight / 3600)}:${two_digits((to_midnight % 3600) / 60)}:${two_digits(to_midnight % 60)}`;
    window.setTimeout(countdown, 1000 - new Date().getMilliseconds());
}

function two_digits(x) {
    x = Math.trunc(x);
    if (x < 10)
        return '0' + x.toString();
    else
        return x.toString();
}

function hide_modal() {
    if (history.state === 'help' || history.state === 'success')
        history.back();
    set_modal_state();
}

function popup(text) {
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('popup').innerText = text;
    window.setTimeout(function() {
        document.getElementById('popup').classList.add('hidden');
    }, 1500);
}

function type_letter(letter) {
    const row = guesses.length + 1;
    for (let i = 1; i <= 5; i++) {
        const elt = document.getElementById(`letter-${row}-${i}`);
        if (elt.innerText === '') {
            elt.classList.add('typed');
            if (i === 5 && FINALED_LETTERS.hasOwnProperty(letter)) {
                let previous = '';
                for (let j = 1; j <= 4; j++)
                    previous += document.getElementById(`letter-${row}-${j}`).innerText;
                if (WORDS.has(previous + letter))
                    elt.innerText = letter;
                else
                    elt.innerText = FINALED_LETTERS[letter];
            }
            else
                elt.innerText = letter;
            break;
        }
    }
}

function erase_letter() {
    const row = guesses.length + 1;
    for (let i = 5; i >= 1; i--) {
        const elt = document.getElementById(`letter-${row}-${i}`);
        if (elt.innerText !== '') {
            elt.classList.remove('typed');
            elt.innerText = '';
            break;
        }
    }
}

function make_guess() {
    const row = guesses.length + 1;
    let guess = '';
    for (let i = 1; i <= 5; i++) {
        const elt = document.getElementById(`letter-${row}-${i}`);
        guess += elt.innerText;
    }

    if (guess.length < 5) {
        const row_elt = document.getElementById(`guess-${row}`);
        row_elt.classList.add('jiggle');
        window.setTimeout(function() {row_elt.classList.remove('jiggle');}, 2000);
        popup('אין מספיק אותיות');
        return;
    }
    if (!WORDS.has(guess)) {
        const row_elt = document.getElementById(`guess-${row}`);
        row_elt.classList.add('jiggle');
        window.setTimeout(function() {row_elt.classList.remove('jiggle');}, 2000);
        popup('לא ברשימת המילים');
        return;
    }

    const matches = get_matches(guess, word_of_the_day);
    for (let i = 1; i <= 5; i++) {
        const elt = document.getElementById(`letter-${row}-${i}`);
        elt.classList.remove('typed');
        elt.setAttribute('match', matches[i-1]);
    }
    guesses.push(guess);
    save_to_local_storage();
    if (guess === word_of_the_day) {
        add_result_to_local_storage();
        const row_elt = document.getElementById(`guess-${row}`);
        row_elt.classList.add('win');
        const CONGRATULATIONS = ['גאוני', 'מדהים', 'נפלא', 'סחתיין', 'נהדר', 'מקסים'];
        popup(CONGRATULATIONS[guesses.length - 1]);
        window.setTimeout(show_success_screen, 3600);
    } else {
        window.setTimeout(set_keyboard_key_colors, 100);
        if (guesses.length === 6) {
            add_result_to_local_storage();
            document.getElementById('popup').classList.remove('hidden');
            document.getElementById('popup').innerText = word_of_the_day;
            window.setTimeout(show_success_screen, 2000);
        }
    }
}

function set_keyboard_key_colors() {
    let letter_states = {};
    for (const guess of guesses) {
        if (guess !== word_of_the_day) {
            const matches = get_matches(guess, word_of_the_day);
            for (let i = 0; i < 5; i++) {
                let letter = guess[i];
                if (FINAL_LETTERS.hasOwnProperty(letter))
                    letter = FINAL_LETTERS[letter];

                if (matches[i] === 'exact')
                    letter_states[letter] = 'exact';
                else if (matches[i] === 'other' && letter_states[letter] !== 'exact')
                    letter_states[letter] = 'other';
                else if (matches[i] === 'wrong' && !letter_states.hasOwnProperty(letter))
                    letter_states[letter] = 'wrong';
            }
        }
    }
    for (const elt of document.getElementsByClassName('key'))
        if (letter_states.hasOwnProperty(elt.innerText))
            elt.setAttribute('match', letter_states[elt.innerText]);
}

function handle_key(key) {
    if (guesses.length === 6)
        return;
    if (guesses.length > 0 && guesses[guesses.length - 1] === word_of_the_day)
        return;

    else if (key === 'Backspace')
        erase_letter();
    else if (key === 'Enter')
        make_guess();
    else if (HEBREW_KEYMAP.hasOwnProperty(key))
        type_letter(HEBREW_KEYMAP[key]);
}

function handle_on_screen_keyboard_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_key(event.currentTarget.getAttribute('value'));
    else
        handle_key(event.currentTarget.innerText);
}

function save_to_local_storage() {
    localStorage.setItem('date', today);
    localStorage.setItem('guesses', JSON.stringify(guesses));
    localStorage.setItem('colorblind', document.body.classList.contains('colorblind') ? 'yes' : 'no');
}

function add_result_to_local_storage() {
    let results = localStorage.getItem('results');
    if (results)
        results = JSON.parse(results);
    else
        results = [];
    results.push(guesses[guesses.length - 1] === word_of_the_day ? guesses.length : 'X');
    localStorage.setItem('results', JSON.stringify(results));
}

function load_from_local_storage() {
    if (localStorage.getItem('colorblind') === 'yes')
        document.body.classList.add('colorblind');
    const date = localStorage.getItem('date');
    if (!date) {
        show_help();
        return;
    }
    if (date !== today) {
        localStorage.removeItem('date');
        localStorage.removeItem('guesses');
        if (history.state === 'success')
            history.back();
        return;
    }
    guesses = JSON.parse(localStorage.getItem('guesses'));
    for (let i = 0; i < guesses.length; i++) {
        const guess = guesses[i];
        const matches = get_matches(guess, word_of_the_day);
        for (let j = 0; j < 5; j++) {
            const elt = document.getElementById(`letter-${i+1}-${j+1}`);
            elt.setAttribute('match', matches[j]);
            elt.innerText = guess[j];
        }
    }
    if (guesses[guesses.length - 1] === word_of_the_day || guesses.length === 6) {
        window.setTimeout(show_success_screen, 500);
    }
    set_keyboard_key_colors();
}

let previous_adapt_ts = null;
function adapt_to_window_size() {
    window.requestAnimationFrame(function (ts) {
        if (ts === previous_adapt_ts)
            return;

        const unit = Math.min(0.01 * window.innerWidth, 0.006 * window.innerHeight);
        document.documentElement.style.setProperty('--unit', `${unit}px`);
        previous_adapt_ts = ts;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    load_from_local_storage();
    save_to_local_storage();
    document.getElementById('help-button').addEventListener('click', show_help);
    document.getElementById('colorblind-switch').addEventListener('click', switch_colorblind_mode);
    document.getElementById('share-button').addEventListener('click', copy_result);
    document.getElementById('modal').addEventListener('click', hide_modal);
    document.body.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.altKey || event.metaKey)
            return;

        if (event.key === '?')
            show_help();
        else if (event.key === 'Escape')
            hide_modal();
        else
            handle_key(event.key);
    });
    for (const elt of document.getElementsByClassName('key'))
        elt.addEventListener('click', handle_on_screen_keyboard_click);
    set_modal_state();
    window.addEventListener('popstate', set_modal_state);
    adapt_to_window_size();
    window.addEventListener('resize', adapt_to_window_size);
});
