'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class GSAPManager {
    constructor() {
        this.triggers = new Set();
    }

    createScrollTrigger(config) {
        const trigger = ScrollTrigger.create({
            ...config,
            onEnter: () => {
                if (config.onEnter) config.onEnter();
            },
            onLeave: () => {
                if (config.onLeave) config.onLeave();
            },
            onEnterBack: () => {
                if (config.onEnterBack) config.onEnterBack();
            },
            onLeaveBack: () => {
                if (config.onLeaveBack) config.onLeaveBack();
            }
        });
        this.triggers.add(trigger);
        return trigger;
    }

    killAll() {
        this.triggers.forEach(trigger => {
            if (trigger && !trigger.killed) {
                trigger.kill();
            }
        });
        this.triggers.clear();
        ScrollTrigger.refresh();
    }

    refresh() {
        ScrollTrigger.refresh();
    }
}

// Create a singleton instance
const gsapManager = new GSAPManager();

export default gsapManager; 