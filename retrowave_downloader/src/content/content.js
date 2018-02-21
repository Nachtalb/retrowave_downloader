class TrackDownloader {
    constructor() {
        const self = this;

        self.loader_template = `
<div id="loader-wrapper">
    <span id="loader-text">Loading <span id="loader-percent">0</span>%</span>
    <div id="loader-overlay"></div>
</div>`;
        self.loader_toggle_time = 500;
        self.loader_timeouts = [];

        self.button_template = `<div id="track-download-button"><i></i></div>`;

        self._add_loader_to_dom();
        self._add_event_listeners();
        self._add_download_button_to_dom();
    }

    _add_loader_to_dom () {
        const self = this;

        let body = document.getElementsByTagName('body')[0];
        body.insertAdjacentHTML('beforeend', self.loader_template);

        self.loader_node = document.getElementById('loader-wrapper');
        self.loader_percent = document.getElementById('loader-percent');
    }

    _add_download_button_to_dom () {
        const self = this;

        let display = document.getElementsByClassName('display')[0];
        display.insertAdjacentHTML('beforeend', self.button_template);

        let button = document.getElementById('track-download-button').children[0];
        button.addEventListener('click', function () {
            self.download_current_playing_sound();
        })
    }

    download_current_playing_sound() {
        const self = this;

        let current_playing = self.get_current_playing_sound();

        self.download(current_playing.url, current_playing.name);
    }

    get_current_playing_sound() {
        const self = this;

        for (const sound_name of soundManager.soundIDs) {
            let sound = soundManager.sounds[sound_name];
            if (sound.playState === 1) {
                let sound_url = sound.url.substring(0, sound.url.indexOf('?'));
                let full_url = window.location.protocol + '//' + window.location.hostname + sound_url;
                let name = document.getElementById('display-title').textContent;

                return {
                    sound: sound,
                    url: full_url,
                    name: name
                };
            }
        }
    }

    download(url, filename) {
        const self = this;

        self._show_loader();
        filename += filename.endsWith('.mp3') ? '' : '.mp3';

        let xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = function () {
            let audio_link = document.createElement('a');
            audio_link.href = window.URL.createObjectURL(xhr.response);
            audio_link.download = filename;
            audio_link.style.display = 'none';

            document.body.appendChild(audio_link);

            self._hide_loader();
            audio_link.click();
            audio_link.remove();
        };

        xhr.addEventListener("progress", function (event) {
            if (event.lengthComputable) {
                let percentComplete = event.loaded / event.total;
                percentComplete = parseInt(percentComplete * 100);
                self._set_loader_percent(percentComplete)
            }
        }, false);

        xhr.open('GET', url);
        xhr.send();
    }

    _clear_loader_timeouts() {
        const self = this;

        for (const loaderTimeout of self.loader_timeouts) {
            clearTimeout(loaderTimeout);
        }
        self.loader_timeouts = [];
    }

    _show_loader() {
        const self = this;

        self._clear_loader_timeouts();

        self.loader_node.classList.add('shown');
        self.loader_node.style.opacity = 1;

        self._set_loader_percent(0);
    }

    _hide_loader() {
        const self = this;

        self.loader_node.style.opacity = 0;

        self.loader_timeouts.push(
            setTimeout(function () {
                self.loader_node.classList.remove('shown');
            }, self.loader_toggle_time)
        );
    }

    _set_loader_percent(number) {
        const self = this;

        self.loader_percent.innerText = number
    }

    _add_event_listeners() {
        const self = this;

        window.addEventListener('message', function (event) {
            if (event.data.type && event.data.type === 'downloadCurrentPlaying') {
                self.download_current_playing_sound();
            }
        })
    }
}

const downloader = new TrackDownloader();
