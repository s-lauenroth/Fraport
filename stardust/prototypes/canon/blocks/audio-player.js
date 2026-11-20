// audio-player: play/pause toggle and scrubber for the podcast (source attaches the file lazily; see data-source)
(() => {
  document.querySelectorAll('.audio-player').forEach((p) => {
    const audio = p.querySelector('audio');
    const play = p.querySelector('.audio-player__play');
    const pause = p.querySelector('.audio-player__pause');
    const time = p.querySelector('.audio-player__time');
    const slider = p.querySelector('.audio-player__slider');
    const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    play.addEventListener('click', () => {
      if (!audio.src && audio.dataset.source) audio.src = audio.dataset.source;
      p.classList.add('is-playing');
      audio.play().catch(() => {});
    });
    pause.addEventListener('click', () => { audio.pause(); p.classList.remove('is-playing'); });
    audio.addEventListener('pause', () => p.classList.remove('is-playing'));
    audio.addEventListener('timeupdate', () => { time.textContent = fmt(audio.currentTime); slider.value = Math.floor(audio.currentTime); });
    slider.addEventListener('input', () => { if (audio.src) audio.currentTime = slider.value; });
  });
})();
