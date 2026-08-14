document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".step");
    let currentStep = 0;

    function showStep(index, pushHistory = true) {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });
        currentStep = index;
        if (pushHistory) {
            history.pushState({ step: index }, "", `#step${index}`);
        }
    }

    const bgMusic = document.getElementById("bgMusic");
    const audioToggleBtn = document.getElementById("audioToggleBtn");
    let isPlaying = false;

    audioToggleBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            audioToggleBtn.textContent = "🔇";
        } else {
            bgMusic.play().catch(() => {});
            audioToggleBtn.textContent = "🎵";
        }
        isPlaying = !isPlaying;
    });

    const btnStartIntro = document.getElementById("btnStartIntro");
    if (btnStartIntro) {
        btnStartIntro.addEventListener("click", () => {
            showStep(1);
            startTypingIntro();
        });
    }

    const introText = "Aujourd'hui est un jour pas comme les autres...\nUne personne extraordinaire célèbre une année de plus.\nPrépare-toi à découvrir ce petit bout d'attention préparé rien que pour toi. ✨";
    const typedMessageEl = document.getElementById("typedMessage");
    const bottomButtonContainer = document.getElementById("bottomButtonContainer");

    function startTypingIntro() {
        if (!typedMessageEl) return;
        typedMessageEl.textContent = "";
        let i = 0;
        function typeWriter() {
            if (i < introText.length) {
                typedMessageEl.textContent += introText.charAt(i);
                i++;
                setTimeout(typeWriter, 35);
            } else {
                if (bottomButtonContainer) bottomButtonContainer.style.display = "block";
            }
        }
        typeWriter();
    }

    const toStep1Btn = document.getElementById("toStep1Btn");
    if (toStep1Btn) toStep1Btn.addEventListener("click", () => showStep(2));

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");

    if (yesBtn) {
        yesBtn.addEventListener("click", () => {
            showStep(3);
            if (bgMusic && !isPlaying) {
                bgMusic.play().then(() => { isPlaying = true; audioToggleBtn.textContent = "🎵"; });
            }
            if (typeof confetti === "function") confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        });
    }

    if (noBtn) {
        noBtn.addEventListener("mouseover", () => {
            noBtn.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px)`;
        });
        noBtn.addEventListener("click", () => alert("Interdit de cliquer sur Non ! 😜"));
    }

    const photosData = [
        { src: "1.jpg", caption: "Souvenir magique ✨", message: "Il y a des regards qui marquent une vie entière. ✨" },
        { src: "2.jpg", caption: "Douceur infinie 💖", message: "Une complicité silencieuse et tellement forte. 💖" },
        { src: "3.jpg", caption: "Éclat de rire 🥰", message: "La spontanéité de ce moment est magnifique. 🌸" },
        { src: "4.jpg", caption: "Princesse 👑", message: "Une élégance naturelle qui captive tout le monde. 👑" },
        { src: "5.jpg", caption: "Belle lumière 🌟", message: "Chaque souvenir à tes côtés est précieux. 🌟" },
        { src: "6.jpg", caption: "Pour toujours 💫", message: "Que cette année t'offre autant de joie que tu en donnes. 💫" }
    ];

    let currentPhotoIndex = 0;
    
    const enterAnimations = [
        'anim-from-left', 'anim-from-right', 'anim-from-top', 'anim-from-bottom', 
        'anim-from-top-left', 'anim-from-top-right', 'anim-from-bottom-left', 'anim-from-bottom-right',
        'anim-zoom-from-back', 'anim-overlay-screen'
    ];
    
    const exitAnimations = [
        'anim-to-right', 'anim-to-left', 'anim-to-top', 'anim-to-bottom',
        'anim-zoom-to-back', 'anim-fade-out'
    ];

    const carouselStage = document.getElementById("carouselStage");
    const prevPhotoBtn = document.getElementById("prevPhotoBtn");
    const nextPhotoBtn = document.getElementById("nextPhotoBtn");

    function updateCarousel() {
        const oldCard = carouselStage.querySelector(".free-photo-card");

        const randomExit = exitAnimations[Math.floor(Math.random() * exitAnimations.length)];
        const randomEnter = enterAnimations[Math.floor(Math.random() * enterAnimations.length)];

        if (oldCard) {
            oldCard.classList.add(randomExit);
            // Délai augmenté à 1300ms pour bien voir l'ancienne photo se faire chasser
            setTimeout(() => {
                oldCard.remove();
            }, 1300);
        }

        const newCard = document.createElement("div");
        newCard.className = `free-photo-card ${randomEnter}`;
        newCard.innerHTML = `
            <img src="${photosData[currentPhotoIndex].src}" alt="Souvenir">
            <div class="photo-caption">${photosData[currentPhotoIndex].caption}</div>
        `;

        newCard.addEventListener("click", () => {
            openModal(photosData[currentPhotoIndex]);
        });

        carouselStage.appendChild(newCard);
    }

    if (nextPhotoBtn) {
        nextPhotoBtn.addEventListener("click", () => {
            currentPhotoIndex = (currentPhotoIndex + 1) % photosData.length;
            updateCarousel();
        });
    }

    if (prevPhotoBtn) {
        prevPhotoBtn.addEventListener("click", () => {
            currentPhotoIndex = (currentPhotoIndex - 1 + photosData.length) % photosData.length;
            updateCarousel();
        });
    }

    const initialCard = document.getElementById("carouselCard");
    if (initialCard) {
        initialCard.addEventListener("click", () => {
            openModal(photosData[currentPhotoIndex]);
        });
    }

    const photoModal = document.getElementById("photoModal");
    const modalImg = document.getElementById("modalImg");
    const modalMessageEl = document.getElementById("modalMessage");
    let typingTimer = null;

    function openModal(data) {
        modalImg.className = "";
        void modalImg.offsetWidth;
        modalImg.classList.add('anim-from-top');

        modalImg.src = data.src;
        modalMessageEl.textContent = "";
        photoModal.style.display = "flex";

        if (typingTimer) clearTimeout(typingTimer);
        let charIndex = 0;
        function typeModal() {
            if (charIndex < data.message.length) {
                modalMessageEl.textContent += data.message.charAt(charIndex++);
                typingTimer = setTimeout(typeModal, 35);
            }
        }
        typeModal();
    }

    if (photoModal) {
        photoModal.addEventListener("click", () => { 
            photoModal.style.display = "none"; 
            clearTimeout(typingTimer); 
        });
    }

    const finalBtn = document.getElementById("finalBtn");
    if (finalBtn) {
        finalBtn.addEventListener("click", () => {
            showStep(4);
            startBirthdaySequence();
        });
    }

    const poemText = `Une étoile a choisi de briller sur la colline.
Gbedea deuh Ruth, ton sourire est un doux poème,
Une douce mélodie qui résonne et que l'on aime.

Ton élégance naturelle et ta joie communicative,
Font de chaque instant une grâce incisive.
Puisse cette nouvelle année t'apporter mille bonheurs,
Et réaliser les plus grands rêves de ton cœur.

Tu es entrée dans mon monde avec tant de lumière,
Chassant loin de mes jours les ombres et la poussière.
Tu représentes ce rayon qui vient tout réchauffer,
Une présence si belle qu'on ne peut qu'admirer.

Aujourd'hui je le sais, et mon cœur le confesse,
Je ferai tout pour garder ta douce tendresse.
Ta présence est devenue mon plus bel appui,
Une force inestimable qui m'inspire et me conduit.

Je te souhaite un joyeux anniversaire à toi qui m'es si spéciale,
Que la route soit douce et ton éclat total ma très chère fleur. 💖`;

    function startBirthdaySequence() {
        const introBirthday = document.getElementById("introBirthday");
        const topBirthdayTitle = document.getElementById("topBirthdayTitle");
        const typedPoomEl = document.getElementById("typedPoom");
        
        introBirthday.style.display = "flex";
        setTimeout(() => {
            introBirthday.style.display = "none";
            topBirthdayTitle.classList.remove("hidden");
            
            let i = 0;
            typedPoomEl.textContent = "";
            function typePoem() {
                if (i < poemText.length) {
                    typedPoomEl.textContent += poemText.charAt(i++);
                    setTimeout(typePoem, 30);
                } else {
                    document.getElementById("endMessageArea").style.display = "block";
                    confetti({ particleCount: 200, spread: 150, origin: { y: 0.6 } });
                }
            }
            typePoem();
        }, 2500);
    }

    const btnFinalHeart = document.getElementById("btnFinalHeart");
    if (btnFinalHeart) {
        btnFinalHeart.addEventListener("click", () => {
            const end = Date.now() + 3000;
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff0000', '#ff69b4'] });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff0000', '#ff69b4'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
            btnFinalHeart.textContent = "Merci mon cœur ! 💖✨";
            btnFinalHeart.disabled = true;
        });
    }
});