var body = document.body;
var playPause = document.getElementsByClassName('playPause')[0];
var audio = document.getElementById('audioTag');
var recordImg = document.getElementById('record-img');
var beforeMusic = document.getElementsByClassName('beforeMusic')[0];
var nextMusic = document.getElementsByClassName('nextMusic')[0];
var musicTitle = document.getElementsByClassName('music-title')[0];
var authorName = document.getElementsByClassName('author-name')[0];
var playedTime = document.getElementsByClassName('played-time')[0];
var totalTime = document.getElementsByClassName('audio-time')[0];
var progressBar = document.getElementsByClassName('progress')[0];
var playMode = document.getElementsByClassName('playMode')[0];
var volumn = document.getElementsByClassName('volumn')[0];
var volumnTogger = document.getElementById('volumn-togger');
var speed = document.getElementById('speed');
var closeContainer = document.getElementsByClassName('close-container')[0];
var ListContainer = document.getElementsByClassName('list-container')[0];
var listIcon = document.getElementById('list');
var musicLists = document.getElementsByClassName('musicLists')[0];

var musicData = [
    ['李丹琦', '25216950601'],
    ['洛春馥', '云溪'],
    ['You', 'Sih'],
    ['He', 'Man']
];
var musicId = 0;

nextMusic.addEventListener('click', function () {
    musicId++;
    if (musicId >= musicData.length) {
        musicId = 0;
    }
    initAndPlay();
});

// 时间格式化
function formatTime(value) {
    var hour = parseInt(value / 3600);
    var minutes = parseInt((value % 3600) / 60);
    var seconds = parseInt(value % 60);

    if (hour > 0) {
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

var modeId = 1;
playMode.addEventListener('click', function () {
    modeId++;
    if (modeId > 3) {
        modeId = 1;
    }
    playMode.style.backgroundImage = `url('./img/mode${modeId}.png')`;
});

// 更新进度条
audio.addEventListener('timeupdate', updateProgress);
function updateProgress() {
    playedTime.innerText = formatTime(audio.currentTime);

    if (audio.duration && !isNaN(audio.duration)) {
        totalTime.innerText = formatTime(audio.duration);
        var value = audio.currentTime / audio.duration;
        var progressPlay = document.querySelector('.progress-play');
        if (progressPlay) {
            progressPlay.style.width = value * 100 + '%';
        }
    }
}

beforeMusic.addEventListener('click', function () {
    musicId--;
    if (musicId < 0) {
        musicId = musicData.length - 1;
    }
    initAndPlay();
});

function initMusic() {
    audio.src = `./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.onloadedmetadata = function () {
        recordImg.style.backgroundImage = `url('./img/record${musicId}.jpg')`;
        body.style.backgroundImage = `url('./img/bg${musicId}.png')`;
        musicTitle.innerHTML = musicData[musicId][0];
        authorName.innerHTML = musicData[musicId][1] || '';
        refreshROtate();

        if (audio.duration && !isNaN(audio.duration)) {
            totalTime.innerText = formatTime(audio.duration);
        } else {
            totalTime.innerText = "00:00";
        }
        audio.currentTime = 0;
    };
}

// 初始加载第一首音乐
initMusic();

function initAndPlay() {
    initMusic();
    audio.onloadedmetadata = function () {
        recordImg.style.backgroundImage = `url('./img/record${musicId}.jpg')`;
        body.style.backgroundImage = `url('./img/bg${musicId}.png')`
        musicTitle.innerHTML = musicData[musicId][0];
        authorName.innerHTML = musicData[musicId][1] || '';
        refreshROtate();

        if (audio.duration && !isNaN(audio.duration)) {
            totalTime.innerText = formatTime(audio.duration);
        } else {
            totalTime.innerText = "00:00";
        }

        // 播放音乐
        audio.play().then(() => {
            rotateRecord();
            playPause.classList.remove('icon-play');
            playPause.classList.add('icon-pause');
        }).catch(error => {
            console.error("播放错误:", error);
        });
    };
}

// 点击播放按钮
playPause.addEventListener('click', function () {
    if (audio.paused) {
        audio.play().then(() => {
            rotateRecord();
            playPause.classList.remove('icon-play');
            playPause.classList.add('icon-pause');
        }).catch(error => {
            console.error("播放错误:", error);
        });
    }
    else {
        audio.pause();
        rotateRecordStop();
        playPause.classList.remove('icon-pause');
        playPause.classList.add('icon-play');
    }
});

function rotateRecord() {
    recordImg.style.animationPlayState = 'running';
}

function rotateRecordStop() {
    recordImg.style.animationPlayState = 'paused';
}

function refreshROtate() {
    recordImg.classList.add('rotate-play');
}

// 音乐播放结束事件
audio.addEventListener('ended', function () {
    if (modeId == 2) {
        musicId = (musicId + 1) % musicData.length;
    }
    else if (modeId == 3) {
        var oldid = musicId;
        while (true) {
            musicId = Math.floor(Math.random() * musicData.length);
            if (musicId != oldid) {
                break;
            }
        }
    }
    initAndPlay();
});

// 音量控制
var lastVolumn = 70;
audio.volume = lastVolumn / 100;

volumn.addEventListener('click', setvolume);

function setvolume() {
    if (audio.muted || audio.volume == 0) {
        audio.muted = false;
        audio.volume = lastVolumn / 100;
        volumnTogger.value = lastVolumn;
    }
    else {
        audio.muted = true;
        lastVolumn = volumnTogger.value;
        volumnTogger.value = 0;
    }
    updateVolumeIcon();
}

volumnTogger.addEventListener('input', updateVolume);

function updateVolume() {
    const volumnValue = volumnTogger.value / 100;
    audio.volume = volumnValue;
    if (volumnValue > 0) {
        audio.muted = false;
    }
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (audio.muted || audio.volume == 0) {
        volumn.style.backgroundImage = `url('./img/静音.png')`;
    }
    else {
        volumn.style.backgroundImage = `url('./img/音量.png')`;
    }
}

// 倍速播放
speed.addEventListener('click', function () {
    var speedText = speed.innerText;
    if (speedText == '1.0X') {
        audio.playbackRate = 1.5;
        speed.innerText = '1.5X';
    }
    else if (speedText == '1.5X') {
        audio.playbackRate = 2;
        speed.innerText = '2.0X';
    }
    else if (speedText == '2.0X') {
        audio.playbackRate = 1;
        speed.innerText = '1.0X';
    }
    else {
        audio.playbackRate = 1;
        speed.innerText = '1.0X';
    }
});

// 播放列表控制
listIcon.addEventListener('click', function () {
    ListContainer.classList.remove('list-hide');
    ListContainer.classList.add('list-show');
    ListContainer.style.display = 'block';
    closeContainer.style.display = 'block';
});

closeContainer.addEventListener('click', function () {
    ListContainer.classList.remove('list-show');
    ListContainer.classList.add('list-hide');
    setTimeout(() => {
        ListContainer.style.display = 'none';
    }, 1000);
    closeContainer.style.display = 'none';
});

// 创建播放列表
function createMusic() {
    for (let i = 0; i < musicData.length; i++) {
        let div = document.createElement('div');
        div.innerHTML = `${musicData[i][0]}`;
        musicLists.appendChild(div);
        div.addEventListener('click', function () {
            musicId = i;
            initAndPlay();
            // 关闭播放列表
            ListContainer.classList.remove('list-show');
            ListContainer.classList.add('list-hide');
            setTimeout(() => {
                ListContainer.style.display = 'none';
            }, 1000);
            closeContainer.style.display = 'none';
        });
    }
}

// 初始化播放列表
createMusic();

// 初始化进度条
function initProgressBar() {
    // 移除现有的进度条播放部分
    var existingProgress = document.querySelector('.progress-play');
    if (existingProgress) {
        existingProgress.remove();
    }

    // 创建新的进度条播放部分
    var progressPlay = document.createElement('div');
    progressPlay.className = 'progress-play';
    progressBar.appendChild(progressPlay);
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    initProgressBar();
});