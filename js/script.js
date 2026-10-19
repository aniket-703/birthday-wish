/**
 * BIRTHDAY WISH - ROMANTIC INTERACTIVE CELEBRATION
 * Customized for 7006281212 GPay Payment & "A Story of Two Souls" Video
 * Features:
 *  - Clean hero with scroll-out indicator (no background music)
 *  - Simple, heartfelt cards
 *  - One-tap candle blowout with celebratory smoke & confetti
 *  - Redesigned 3D luxury Gift Box with lid pop
 *  - Payment prank with GPay redirect to 7006281212 for ₹100
 *  - Single-payment persistence via localStorage (never asked twice!)
 *  - Teasing mock modal when "No" is tapped on mobile
 *  - Theater video player with full cross-platform Fullscreen support
 */

// ==========================================================================
// 1. SOUND EFFECTS (Web Audio API - No Background Music)
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Playful boing sound when button runs away
  playBoing() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // Chime when candle is blown
  playExtinguish() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.6);
    });
  }

  // Gift open shimmer
  playGiftOpen() {
    this.init();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    const now = this.ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.7);
    });
  }

  // Cash register chime
  playPaymentSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.25, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.5);
    });
  }
}

const sounds = new SoundFX();

// ==========================================================================
// 2. HERO SCROLL-OUT INDICATOR
// ==========================================================================
function initHeroScrollIndicator() {
  const scrollPrompt = document.getElementById('scroll-prompt');
  if (!scrollPrompt) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      scrollPrompt.classList.add('hidden-on-scroll');
    } else {
      scrollPrompt.classList.remove('hidden-on-scroll');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  scrollPrompt.addEventListener('click', () => {
    const quotesSection = document.getElementById('quotes-section');
    if (quotesSection) {
      quotesSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ==========================================================================
// 3. QUOTES SCROLL ANIMATION
// ==========================================================================
function initQuotesScrollAnimation() {
  const quoteCards = document.querySelectorAll('.quote-card');
  if (!quoteCards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  quoteCards.forEach((card) => observer.observe(card));
}

// ==========================================================================
// 4. CAKE & CANDLE BLOW (ONE-TAP BLOW - NO BREATH/MIC NEEDED)
// ==========================================================================
let candleExtinguished = false;

function extinguishCandles() {
  if (candleExtinguished) return;
  candleExtinguished = true;

  const flames = document.querySelectorAll('.candle-flame');
  flames.forEach((flame) => {
    flame.classList.remove('blowing');
    flame.classList.add('extinguished');
  });

  // Show smoke container
  const smoke = document.getElementById('candle-smoke');
  if (smoke) {
    smoke.classList.remove('hidden');
    smoke.classList.add('flex');
  }

  // Spawn smoke particles
  const candleWrapper = document.getElementById('candle-wrapper');
  if (candleWrapper) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'smoke-particle';
        p.style.left = `${Math.random() * 20 - 10 + 10}px`;
        candleWrapper.appendChild(p);
        setTimeout(() => p.remove(), 2300);
      }, i * 180);
    }
  }

  // Sound & Confetti
  sounds.playExtinguish();
  if (window.confetti) {
    window.confetti.burst();
  }

  // Update prompt and reveal wish banner
  const promptText = document.getElementById('cake-prompt-text');
  if (promptText) {
    promptText.textContent = "✨ Candle blown! May all your wishes come true! 🎉";
  }

  const wishBanner = document.getElementById('wish-banner');
  if (wishBanner) {
    wishBanner.style.opacity = '1';
    wishBanner.style.maxHeight = '120px';
  }

  const blowBtn = document.getElementById('btn-blow-candles');
  if (blowBtn) {
    blowBtn.style.display = 'none';
  }

  // Scroll smoothly to gift section after 1.2s
  setTimeout(() => {
    const giftSection = document.getElementById('gift-section');
    if (giftSection) {
      giftSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (window.confetti) {
        window.confetti.fire({ particleCount: 50, spread: 70, origin: { x: 0.5, y: 0.7 } });
      }
    }
  }, 1200);
}

function initCake() {
  const blowBtn = document.getElementById('btn-blow-candles');
  const cakeStage = document.getElementById('cake-stage');
  const candleWrapper = document.getElementById('candle-wrapper');

  if (blowBtn) blowBtn.addEventListener('click', extinguishCandles);
  if (cakeStage) cakeStage.addEventListener('click', extinguishCandles);
  if (candleWrapper) candleWrapper.addEventListener('click', extinguishCandles);
}

// ==========================================================================
// 5. GIFT BOX & PAYMENT (7006281212 & SINGLE-PAYMENT PERSISTENCE)
// ==========================================================================
const PAYMENT_STORAGE_KEY = 'bday_payment_verified_7006281212';
const UPI_PAY_URL = "upi://pay?pa=7006281212@upi&pn=Birthday%20Love&am=1000&cu=INR&tn=BirthdayLoveTax";

let waitingForPaymentReturn = false;

function initGiftBox() {
  const giftTrigger = document.getElementById('gift-box-trigger');
  const paymentModal = document.getElementById('payment-modal');

  if (!giftTrigger) return;

  giftTrigger.addEventListener('click', () => {
    sounds.playGiftOpen();
    giftTrigger.classList.add('opened');

    if (window.confetti) {
      window.confetti.fire({ particleCount: 65, spread: 90, origin: { x: 0.5, y: 0.5 } });
    }

    // CHECK IF PAYMENT WAS ALREADY DONE:
    const alreadyPaid = localStorage.getItem(PAYMENT_STORAGE_KEY) === 'true';

    setTimeout(() => {
      if (alreadyPaid) {
        // Unlock video directly! Never ask for payment twice!
        unlockVideoDirectly();
      } else {
        // Open payment modal (reset to step 1)
        if (paymentModal) {
          const step1 = document.getElementById('prank-step-1');
          const step2 = document.getElementById('prank-step-2');
          if (step1) step1.classList.remove('hidden');
          if (step2) step2.classList.add('hidden');

          paymentModal.classList.add('active');
          initRunawayButton();
        }
      }
    }, 450);
  });
}

// ==========================================================================
// 6. RUNAWAY "NO" BUTTON & TEASING MOCK MODAL
// ==========================================================================
let currentTeaseIndex = 0;

const teasePunches = [
  {
    emoji: "😜",
    title: "Arey! Did you really think you could avoid the Love Tax? 😂",
    msg: "Caught you red-handed trying to dodge the tax! 📸 The 'No' button is 100% just for decoration! This is a certified birthday prank, my queen — paying the love tax is strictly mandatory! 💸💖",
    pun: "All ₹1000 love tax will strictly be invested in your chocolates, momos & unlimited forehead kisses! 🍫🍟💋"
  },
  {
    emoji: "🏃‍♀️",
    title: "Nice try, sweetheart! 🏃‍♂️💨",
    msg: "Did you seriously think your boyfriend would let you skip the ₹1000 VIP love tax? That's the official girlfriend tax on your birthday! 😜",
    pun: "Rule #1 of our relationship: You can never say no to surprises! 🥰"
  },
  {
    emoji: "🛑",
    title: "Error 404: Tax Exemption Not Found! 🚫",
    msg: "The Love Ministry has permanently rejected your tax exemption form! Click the button and watch your video! 🎬",
    pun: "Tax status: Pending with extreme cuteness! 🥺💖"
  },
  {
    emoji: "🥺",
    title: "Come on, it's just ₹1000 love tax for your man! 🥺❤️",
    msg: "I spent hours making this website for your birthday, the least you can do is pay the ₹1000 love tax to buy a coffee for me! 😂 Now click 'Pay' already!",
    pun: "Coffee + chocolates + you = best combination ever! ☕🍫"
  }
];

function initRunawayButton() {
  const noBtn = document.getElementById('btn-runaway-no');
  const modalContainer = document.getElementById('prank-modal-card');
  const payGpayBtn = document.getElementById('btn-pay-gpay');

  if (!noBtn || !modalContainer) return;

  // 1. Pay with GPay button handler
  if (payGpayBtn && !payGpayBtn.dataset.bound) {
    payGpayBtn.dataset.bound = "true";
    payGpayBtn.addEventListener('click', () => {
      handleGPayPaymentClick();
    });
  }

  const playfulMessages = [
    "Nope, I won't pay the tax 😜",
    "Can't evade love tax! 🏃‍♂️💨",
    "Love tax is 100% mandatory! 💸",
    "Nice try, no tax evasion! 😂",
    "Too slow to skip the tax! 🐢",
    "It's just ₹1000 tax for your man! 🥺❤️",
    "Tax evasion is strictly illegal here! 👑",
    "Error 404: No-Tax option unreachable! 🚫"
  ];

  let messageIndex = 0;

  function relocateButton() {
    sounds.playBoing();
    messageIndex = (messageIndex + 1) % playfulMessages.length;
    noBtn.textContent = playfulMessages[messageIndex];

    const modalRect = modalContainer.getBoundingClientRect();
    const maxMoveX = Math.min(modalRect.width * 0.4, 130);
    const maxMoveY = 60;

    const randomX = (Math.random() - 0.5) * (maxMoveX * 2);
    const randomY = (Math.random() - 0.5) * (maxMoveY * 2);

    noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.95)`;
  }

  // Desktop hover proximity
  function onMouseMove(e) {
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distX = e.clientX - btnCenterX;
    const distY = e.clientY - btnCenterY;
    const distance = Math.hypot(distX, distY);

    if (distance < 70) {
      relocateButton();
    }
  }

  // When "No" button is clicked or tapped on Mobile / Desktop:
  function onNoButtonClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    relocateButton();
    openTeaseModal();
    return false;
  }

  noBtn.onclick = onNoButtonClick;
  noBtn.ontouchstart = onNoButtonClick;

  modalContainer.removeEventListener('mousemove', onMouseMove);
  modalContainer.addEventListener('mousemove', onMouseMove);

  initTeaseModal();
}

function openTeaseModal() {
  const teaseModal = document.getElementById('tease-modal');
  const teaseCard = document.getElementById('tease-card');
  const teaseEmoji = document.getElementById('tease-emoji');
  const teaseTitle = document.getElementById('tease-title');
  const teaseMsg = document.getElementById('tease-msg');
  const teasePunText = document.getElementById('tease-pun-text');

  if (!teaseModal) return;

  const punch = teasePunches[currentTeaseIndex % teasePunches.length];
  if (teaseEmoji) teaseEmoji.textContent = punch.emoji;
  if (teaseTitle) teaseTitle.textContent = punch.title;
  if (teaseMsg) teaseMsg.textContent = punch.msg;
  if (teasePunText) teasePunText.textContent = `"${punch.pun}"`;

  sounds.playBoing();
  teaseModal.classList.add('active');
  if (teaseCard) teaseCard.classList.remove('shake');
}

function initTeaseModal() {
  const teaseModal = document.getElementById('tease-modal');
  const teaseCard = document.getElementById('tease-card');
  const btnTeasePay = document.getElementById('btn-tease-pay');
  const btnTeaseRetry = document.getElementById('btn-tease-retry');

  if (btnTeasePay && !btnTeasePay.dataset.bound) {
    btnTeasePay.dataset.bound = "true";
    btnTeasePay.addEventListener('click', () => {
      if (teaseModal) teaseModal.classList.remove('active');
      handleGPayPaymentClick();
    });
  }

  if (btnTeaseRetry && !btnTeaseRetry.dataset.bound) {
    btnTeaseRetry.dataset.bound = "true";
    btnTeaseRetry.addEventListener('click', () => {
      currentTeaseIndex++;
      const punch = teasePunches[currentTeaseIndex % teasePunches.length];

      const teaseEmoji = document.getElementById('tease-emoji');
      const teaseTitle = document.getElementById('tease-title');
      const teaseMsg = document.getElementById('tease-msg');
      const teasePunText = document.getElementById('tease-pun-text');

      if (teaseEmoji) teaseEmoji.textContent = punch.emoji;
      if (teaseTitle) teaseTitle.textContent = punch.title;
      if (teaseMsg) teaseMsg.textContent = punch.msg;
      if (teasePunText) teasePunText.textContent = `"${punch.pun}"`;

      sounds.playBoing();

      if (teaseCard) {
        teaseCard.classList.remove('shake');
        void teaseCard.offsetWidth;
        teaseCard.classList.add('shake');
      }
    });
  }
}

// ==========================================================================
// 7. GPAY REDIRECTION, 2-MINUTE COUNTDOWN & AUTO-PLAY
// ==========================================================================
let paymentTimerInterval = null;
const PAYMENT_TIMEOUT_SECONDS = 120; // 2-minute timer

function launchGPayApp() {
  try {
    const link = document.createElement('a');
    link.href = UPI_PAY_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => link.remove(), 400);
  } catch (e) {
    console.log("UPI link note:", e);
  }
}

function startPaymentCountdown() {
  if (paymentTimerInterval) {
    clearInterval(paymentTimerInterval);
    paymentTimerInterval = null;
  }

  let remainingSeconds = PAYMENT_TIMEOUT_SECONDS;
  const timerDisplay = document.getElementById('payment-timer-display');
  const circleProgress = document.getElementById('timer-circle-progress');
  const captionText = document.getElementById('timer-caption-text');
  const totalCircumference = 264; // 2 * PI * 42

  function updateDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (timerDisplay) timerDisplay.textContent = formatted;

    if (circleProgress) {
      // Deplete progress ring smoothly as time passes
      const fraction = (PAYMENT_TIMEOUT_SECONDS - seconds) / PAYMENT_TIMEOUT_SECONDS;
      circleProgress.style.strokeDashoffset = totalCircumference * fraction;
    }

    if (captionText) {
      if (seconds > 90) {
        captionText.textContent = "Google Pay opened! Complete ₹1000 payment on GPay... 📲";
      } else if (seconds > 45) {
        captionText.textContent = "Verifying transaction of ₹1000 with bank... 💳";
      } else if (seconds > 15) {
        captionText.textContent = "Almost verified! Getting your birthday video ready... 🎬✨";
      } else if (seconds > 0) {
        captionText.textContent = `Unlocking your surprise video in ${seconds} second${seconds > 1 ? 's' : ''}! 🎉`;
      } else {
        captionText.textContent = "Payment time complete! Unlocking video now... ❤️";
      }
    }
  }

  updateDisplay(remainingSeconds);

  paymentTimerInterval = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      clearInterval(paymentTimerInterval);
      paymentTimerInterval = null;
      updateDisplay(0);
      // When the 2-minute timer ends, verify payment and play video by itself!
      checkAndVerifyPayment();
    } else {
      updateDisplay(remainingSeconds);
    }
  }, 1000);
}

function handleGPayPaymentClick() {
  // Prime sound & video on this user gesture to enable uninterrupted autoplay
  sounds.init();
  const video = document.getElementById('video-html5');
  if (video) {
    video.load();
  }

  // Launch Google Pay app
  launchGPayApp();

  // Switch to Step 2 with 1-Minute Countdown Timer
  const step1 = document.getElementById('prank-step-1');
  const step2 = document.getElementById('prank-step-2');
  if (step1) step1.classList.add('hidden');
  if (step2) step2.classList.remove('hidden');

  // Start the 60-second timer
  startPaymentCountdown();

  // Early unlock button (if she paid immediately and wants to skip the remaining seconds)
  const confirmBtn = document.getElementById('btn-confirm-paid');
  if (confirmBtn && !confirmBtn.dataset.bound) {
    confirmBtn.dataset.bound = "true";
    confirmBtn.addEventListener('click', () => {
      if (paymentTimerInterval) {
        clearInterval(paymentTimerInterval);
        paymentTimerInterval = null;
      }
      checkAndVerifyPayment();
    });
  }

  // Retry/reopen Google Pay button
  const retryBtn = document.getElementById('btn-reopen-gpay');
  if (retryBtn && !retryBtn.dataset.bound) {
    retryBtn.dataset.bound = "true";
    retryBtn.addEventListener('click', () => {
      launchGPayApp();
    });
  }
}

function checkAndVerifyPayment() {
  if (paymentTimerInterval) {
    clearInterval(paymentTimerInterval);
    paymentTimerInterval = null;
  }

  const verificationModal = document.getElementById('verification-modal');
  const paymentModal = document.getElementById('payment-modal');
  const statusText = document.getElementById('verification-status-text');
  const progressFill = document.getElementById('verification-progress-fill');

  if (!verificationModal) {
    unlockVideoDirectly();
    return;
  }

  verificationModal.classList.add('active');
  sounds.init();

  if (statusText) statusText.textContent = "Connecting to Google Pay for ₹1000 Love Tax to 7006281212... 📡";
  if (progressFill) progressFill.style.width = "40%";

  setTimeout(() => {
    if (statusText) statusText.textContent = "Love Tax Verified! 100% Romance & Zero Deductions! ❤️";
    if (progressFill) progressFill.style.width = "100%";
    sounds.playPaymentSuccess();

    // PERSIST PAYMENT SO IT MUST BE DONE ONLY ONCE
    localStorage.setItem(PAYMENT_STORAGE_KEY, 'true');
  }, 1200);

  setTimeout(() => {
    verificationModal.classList.remove('active');
    if (paymentModal) paymentModal.classList.remove('active');

    // Automatically play the video by itself!
    unlockVideoDirectly();
  }, 2000);
}

function unlockVideoDirectly() {
  const paymentModal = document.getElementById('payment-modal');
  if (paymentModal) paymentModal.classList.remove('active');

  const videoSection = document.getElementById('video-section');
  if (videoSection) {
    videoSection.classList.add('revealed');
    videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (window.confetti) {
    window.confetti.burst();
  }

  const video = document.getElementById('video-html5');
  if (video) {
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay with sound restricted by browser, playing muted:", err);
        video.muted = true;
        video.play().catch(e => console.warn("Muted playback fallback:", e));
      });
    }

    video.onended = () => {
      if (window.confetti) {
        window.confetti.fire({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.6 } });
      }
    };
  }
}

// ==========================================================================
// 8. FULLSCREEN VIDEO HANDLER (IOS, ANDROID & DESKTOP)
// ==========================================================================
function initVideoFullscreen() {
  const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
  const video = document.getElementById('video-html5');
  const wrapper = document.getElementById('video-theater-wrapper');

  if (!video) return;

  const triggerFullscreen = () => {
    if (video.webkitEnterFullscreen) {
      // iOS Safari native video fullscreen
      video.webkitEnterFullscreen();
    } else if (wrapper && wrapper.requestFullscreen) {
      wrapper.requestFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', triggerFullscreen);
  }

  // Double click video to toggle fullscreen
  video.addEventListener('dblclick', triggerFullscreen);
}

// ==========================================================================
// 9. INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero scroll-out indicator
  initHeroScrollIndicator();

  // 2. Quotes scroll animation
  initQuotesScrollAnimation();

  // 3. Cake candle one-tap blowout
  initCake();

  // 4. Gift box & payment setup
  initGiftBox();

  // 5. Video fullscreen setup
  initVideoFullscreen();

  // 6. Quick confetti button in header
  const quickConfettiBtn = document.getElementById('quick-confetti-btn');
  if (quickConfettiBtn) {
    quickConfettiBtn.addEventListener('click', () => {
      sounds.playGiftOpen();
      if (window.confetti) {
        window.confetti.fire({ particleCount: 50, spread: 80, origin: { x: 0.9, y: 0.1 } });
      }
    });
  }

  // If already paid, update gift tap prompt
  if (localStorage.getItem(PAYMENT_STORAGE_KEY) === 'true') {
    const giftPrompt = document.querySelector('.gift-tap-prompt');
    if (giftPrompt) {
      giftPrompt.innerHTML = "<span>Tap to watch your unlocked video!</span> 🎬";
    }
  }
});
