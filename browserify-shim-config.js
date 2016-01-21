 module.exports = {
        "three": { exports: "global:THREE" },
        "./assets/lib/OrbitControls.js": { depends: {"three": null}, exports: "global:THREE.OrbitControls" }
    };