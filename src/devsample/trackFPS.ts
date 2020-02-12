/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import "../common/scrollToShim";

let frames = 0;
let start;
let fps = 45;

let scrollVelocity = 800;
function autoscroll() {
    if (autoscrollContainer) {
        const newTop = autoscrollContainer.scrollTop + scrollVelocity;
        if (newTop <= 0 || newTop > autoscrollContainer.scrollHeight - autoscrollContainer.clientHeight) {
            scrollVelocity = -scrollVelocity;
        }
        autoscrollContainer.scrollTo({ top: newTop, behavior: "smooth" });
        setTimeout(() => {
            autoscroll();
        }, 300)
        updateFPS();
    }

    // update fps
    // console.log("FPS: " + Math.round(fps));
    // (document as any).getElementById("fps").innerText = Math.round(fps);
}
let autoscrollContainer;

let rafId;
function updateFPS() {
    if (rafId == null) {
        rafId = requestAnimationFrame(rafCallback);
    }
}

function rafCallback() {
    rafId = null;
    trackFPS();
    if (autoscrollContainer) {
        updateFPS();
    }
}


export function setAutoscroll(container) {
    autoscrollContainer = autoscrollContainer === container ? null : container;
    autoscroll();
}

export default function trackFPS() {
    frames++;
    let time = Date.now()
    if (start == null) {
        start = time;
    }
    let seconds = (time - start) / 1000;
    if (seconds > 1) {
        let currentFPS = Math.round(frames / seconds);
        let ratio = 0.8;
        fps = fps * ratio + currentFPS * (1 - ratio);
        console.log(`FPS: ${Math.round(fps)}`)
        start = time;
        frames = 0;
    }
}