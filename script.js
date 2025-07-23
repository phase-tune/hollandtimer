class CountdownTimer {
    constructor() {
        this.targetDate = new Date('2025-09-14T13:00:00');
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.previousValues = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        this.hasInitialized = false;
        
        this.init();
    }

    init() {
        // Berechne sofort die echten Werte
        const realTime = this.calculateTimeLeft();
        
        // Initiale Slot-Machine Animation mit echten Zielwerten
        this.playSlotMachineAnimation(realTime);
        
        // Starte den Countdown nach der initialen Animation
        setTimeout(() => {
            this.hasInitialized = true;
            this.previousValues = { ...realTime }; // Setze die aktuellen Werte als "previous"
            this.updateCountdown();
            setInterval(() => this.updateCountdown(), 1000);
        }, 3000);
    }

    playSlotMachineAnimation(targetValues) {
        Object.keys(this.elements).forEach((key, index) => {
            const element = this.elements[key];
            const targetValue = targetValues[key];
            
            // Verzögere jede Animation leicht
            setTimeout(() => {
                this.animateSlotMachine(element, targetValue);
            }, index * 150);
        });
    }

    animateSlotMachine(element, targetValue) {
        // Erstelle separate Spans für Zehner und Einer
        const tensSpan = document.createElement('span');
        const onesSpan = document.createElement('span');
        
        tensSpan.style.display = 'inline-block';
        onesSpan.style.display = 'inline-block';
        tensSpan.style.transition = 'transform 0.1s ease';
        onesSpan.style.transition = 'transform 0.1s ease';
        
        element.innerHTML = '';
        element.appendChild(tensSpan);
        element.appendChild(onesSpan);
        
        const targetStr = this.formatNumber(targetValue);
        const targetTens = parseInt(targetStr[0]);
        const targetOnes = parseInt(targetStr[1]);
        
        // Animation für Zehner
        this.animateDigitSlot(tensSpan, targetTens, 0);
        
        // Animation für Einer (leicht verzögert)
        setTimeout(() => {
            this.animateDigitSlot(onesSpan, targetOnes, 100);
        }, 200);
    }

    animateDigitSlot(span, targetDigit, delay) {
        let currentDigit = 9; // Starte von 9 und gehe runter
        const duration = 1800; // Gesamtdauer der Animation
        const steps = 25; // Anzahl der Schritte
        const stepDuration = duration / steps;
        
        // Berechne die Geschwindigkeit basierend auf der Distanz zum Ziel
        const distance = currentDigit - targetDigit;
        const slowdownPoint = Math.max(5, distance - 3); // Punkt, an dem wir langsamer werden
        
        span.textContent = currentDigit;
        
        setTimeout(() => {
            const interval = setInterval(() => {
                if (currentDigit > targetDigit) {
                    currentDigit--;
                    span.textContent = currentDigit;
                    
                    // Verlangsame die Animation, wenn wir uns dem Ziel nähern
                    if (currentDigit <= slowdownPoint) {
                        // Verdopple das Intervall für die letzten Schritte
                        clearInterval(interval);
                        this.slowAnimation(span, currentDigit, targetDigit, stepDuration * 2);
                    }
                } else {
                    clearInterval(interval);
                }
            }, stepDuration);
        }, delay);
    }

    slowAnimation(span, currentDigit, targetDigit, stepDuration) {
        if (currentDigit > targetDigit) {
            setTimeout(() => {
                currentDigit--;
                span.textContent = currentDigit;
                
                // Füge einen kleinen Bounce-Effekt hinzu
                span.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    span.style.transform = 'scale(1)';
                }, 100);
                
                if (currentDigit > targetDigit) {
                    this.slowAnimation(span, currentDigit, targetDigit, stepDuration * 1.3);
                } else {
                    // Finaler Bounce-Effekt
                    span.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        span.style.transform = 'scale(1)';
                    }, 150);
                }
            }, stepDuration);
        }
    }

    calculateTimeLeft() {
        const now = new Date().getTime();
        const difference = this.targetDate.getTime() - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    formatNumber(num) {
        return num.toString().padStart(2, '0');
    }

    // Intelligente Animation für normale Updates
    animateDigitChange(element, oldValue, newValue) {
        const oldStr = this.formatNumber(oldValue);
        const newStr = this.formatNumber(newValue);
        
        const oldTens = oldStr[0];
        const oldOnes = oldStr[1];
        const newTens = newStr[0];
        const newOnes = newStr[1];
        
        // Erstelle Container für Zehner und Einer
        const tensSpan = document.createElement('span');
        const onesSpan = document.createElement('span');
        
        tensSpan.textContent = newTens;
        onesSpan.textContent = newOnes;
        
        tensSpan.style.display = 'inline-block';
        onesSpan.style.display = 'inline-block';
        
        // Wenn sich der Zehner ändert, animiere ihn
        if (oldTens !== newTens) {
            tensSpan.classList.add('digit-change');
        }
        
        // Wenn sich der Einer ändert, animiere ihn
        if (oldOnes !== newOnes) {
            onesSpan.classList.add('digit-change');
        }
        
        // Ersetze den Inhalt
        element.innerHTML = '';
        element.appendChild(tensSpan);
        element.appendChild(onesSpan);
        
        // Entferne die Animationsklassen nach der Animation
        setTimeout(() => {
            tensSpan.classList.remove('digit-change');
            onesSpan.classList.remove('digit-change');
        }, 600);
    }

    updateCountdown() {
        if (!this.hasInitialized) return;

        const timeLeft = this.calculateTimeLeft();

        Object.keys(timeLeft).forEach(key => {
            const newValue = timeLeft[key];
            const element = this.elements[key];

            if (newValue !== this.previousValues[key]) {
                // Verwende die intelligente Animation für normale Updates
                this.animateDigitChange(element, this.previousValues[key], newValue);
                this.previousValues[key] = newValue;
            }
        });
    }
}

// Starte den Countdown wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

// Smooth scroll und andere Performance-Optimierungen
document.addEventListener('DOMContentLoaded', () => {
    // Preload der Hintergrundbilder
    const preloadImages = () => {
        const images = [
            'assets/images/desktop_wallpaper.jpg',
            'assets/images/phone_wallpaper.jpg'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    preloadImages();
});
