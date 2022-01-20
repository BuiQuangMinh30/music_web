const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORE_KEY  = 'BUI MINH'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlistBtn = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:  {},
    songs:[
    {
      name: "Bước Qua Nhau",
      singer: "Vũ",
      path: "./assets/music/BuocQuaNhau-Vu-7120388.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
    {
      name: "Bước Qua Nhau",
      singer: "Vũ",
      path: "../assets/music/BuocQuaNhau-Vu-7120388.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Sài Gòn đau lòng quá",
      singer: "Hứa Kim Tuyền",
      path: "./assets/music/SaiGondaulongqua.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Sài Gòn đau lòng quá",
      singer: "Hứa Kim Tuyền",
      path: "./assets/music/SaiGondaulongqua.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Thói Quen",
      singer: "Vũ & GDucky",
      path:
        "./assets/music/ThoiQuen.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "TinyLove",
      singer: "Thinh Suy",
      path: "./assets/music/TinyLove-ThinhSuy.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },   
    ],
    setConfig: function (key, val) {
        this.config[key] = val;
        localStorage.setItem(PLAYER_STORE_KEY,JSON.stringify(this.config))
    },
    //render ra cái view
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`    
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // xử lý cd quay và dừng
        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(360deg)'
        }, {
            duration: 10000, //10s
            itearations: Infinity,
        })
        cdThumbAnimate.pause()

        // xử lý phóng to|| thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;

        }
        // xử lý khi click playlist
        playBtn.onclick = function () {
            if (_this.isPlaying)
            {  
                audio.pause();
            } else {
                audio.play();
            }
           
        }
        //khi song play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

         //khi song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
             cdThumbAnimate.pause();
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
        if (audio.duration) {
            const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
            );
            progress.value = progressPercent;
        }
        }

        // Xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }

        // Khi next bài hát

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()    
            } else {
                _this.nextSong()
            }
            
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()    
            } else {
                _this.prevSong()
               
            }
             audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // xử lý random bật tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        //xử lý repeat
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }    
        }

        //lắng nghe hành vi click vào playlist
        playlistBtn.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            if ( songNode || e.target.closest('.option')) {
                //xử lý khi click vào song
               if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
               }

                //xử lý khi click vào option
            } 
        }

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex <0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image} ')`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    playRandomSong: function () {
        let newIndex = this.currentIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        //gán cấu hình từ localstoregae vào ứng dụng
        this.loadConfig()
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //Lắng nghe các sự kiện Dom Events
        this.handleEvents()
        //Tải thông tin bài hát đầu tiên vào UI khi load ứng dụng
        this.loadCurrentSong()
        //render lại ds bài hát
        this.render()

        //hiển hị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()