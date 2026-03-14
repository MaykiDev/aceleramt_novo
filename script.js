// script.js - com controle inteligente de autoplay (somente desktop)
document.addEventListener('DOMContentLoaded', function() {
    // --- Detecção de desktop (breakpoint >= 992px) ---
    function isDesktop() {
        return window.innerWidth >= 992;
    }

    // --- Inicialização do Swiper de vídeo com preview lateral ---
    const swiperElement = document.querySelector('.video-swiper');
    if (!swiperElement) return;

    // Configuração base
    const swiperConfig = {
        loop: true,
        pagination: {
            el: '.video-swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.video-swiper .swiper-button-next',
            prevEl: '.video-swiper .swiper-button-prev',
        },
        on: {
            slideChange: function () {
                // Pausa todos os vídeos ao mudar de slide
                document.querySelectorAll('.testimonial-video').forEach(video => video.pause());
            }
        },
        breakpoints: {
            // Configuração para mobile (< 992px)
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: false,
            },
            // Configuração para desktop (>= 992px)
            992: {
                slidesPerView: 1.5,        // Mostra 1 slide inteiro + partes dos laterais
                spaceBetween: 20,
                centeredSlides: true,       // Centraliza o slide atual
            }
        }
    };

    // Se for desktop, adiciona autoplay (inicialmente ativo)
    if (isDesktop()) {
        swiperConfig.autoplay = {
            delay: 5000,
            disableOnInteraction: false,
        };
    }

    const videoSwiper = new Swiper('.video-swiper', swiperConfig);

    // --- Controle de autoplay baseado na reprodução dos vídeos (apenas desktop) ---
    if (isDesktop()) {
        const videos = document.querySelectorAll('.testimonial-video');
        
        function isAnyVideoPlaying() {
            return Array.from(videos).some(video => !video.paused && !video.ended);
        }

        function updateAutoplay() {
            if (isAnyVideoPlaying()) {
                if (videoSwiper.autoplay.running) {
                    videoSwiper.autoplay.stop();
                }
            } else {
                if (!videoSwiper.autoplay.running) {
                    videoSwiper.autoplay.start();
                }
            }
        }

        videos.forEach(video => {
            video.addEventListener('play', updateAutoplay);
            video.addEventListener('pause', updateAutoplay);
            video.addEventListener('ended', updateAutoplay);
        });

        videoSwiper.on('slideChange', function() {
            setTimeout(updateAutoplay, 50);
        });

        // Inicializa o estado correto
        updateAutoplay();
    }

    // --- Countdown Timer ---
    const targetDate = new Date('April 10, 2026 13:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Botão de mute/unmute do vídeo principal ---
    const heroVideo = document.querySelector('.hero-video');
    const muteToggle = document.querySelector('.mute-toggle');

    if (heroVideo && muteToggle) {
        const updateMuteIcon = () => {
            const icon = muteToggle.querySelector('i');
            if (heroVideo.muted) {
                icon.className = 'fas fa-volume-mute';
                muteToggle.setAttribute('aria-label', 'Ativar som');
                muteToggle.setAttribute('title', 'Ativar som');
            } else {
                icon.className = 'fas fa-volume-up';
                muteToggle.setAttribute('aria-label', 'Desativar som');
                muteToggle.setAttribute('title', 'Desativar som');
            }
        };

        muteToggle.addEventListener('click', () => {
            heroVideo.muted = !heroVideo.muted;
            updateMuteIcon();
        });

        heroVideo.addEventListener('volumechange', updateMuteIcon);
    }

    // --- Rolagem suave para âncoras (se houver) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});