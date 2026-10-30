"use client";

import { useEffect, useRef } from "react";

const fragment = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform float uImg;
uniform float uScale;
uniform float uMI;
uniform vec2 uRes;
uniform vec2 uPos;
uniform vec2 uMouse;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1.,0.)), u.x), mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), u.x), u.y);
}
vec2 cover(vec2 uv){
  uv = (uv - .5) / uScale + .5;
  float ca = uRes.x / uRes.y;
  vec2 s = ca > uImg ? vec2(1., uImg / ca) : vec2(ca / uImg, 1.);
  return uv * s + (1. - s) * vec2(uPos.x, 1. - uPos.y);
}
void main(){
  vec2 t = cover(vUv);
  float water = smoothstep(.72, .58, t.y);
  vec3 base = texture2D(uTex, t).rgb;
  float blue = smoothstep(.02, .22, base.b - base.r);
  float m = water * blue;
  float depth = mix(.6, 1.4, 1. - t.y);
  float tt = uTime * .35;
  vec2 q = vec2(t.x * 7., t.y * 24.);
  float n1 = noise(q + vec2(tt, tt * .6));
  float n2 = noise(q * 1.9 - vec2(tt * .8, -tt));
  vec2 off = vec2(n1 - .5, n2 - .5) * .0055 * depth * m;
  vec2 d = vUv - uMouse;
  d.x *= uRes.x / max(uRes.y, 1.);
  float dist = length(d);
  float rip = sin(dist * 70. - uTime * 5.) * exp(-dist * 7.) * uMI;
  off += (dist > 0.0001 ? d / dist : vec2(0.)) * rip * .006 * water;
  vec3 col = texture2D(uTex, t + off).rgb;
  float lum = dot(col, vec3(.299,.587,.114));
  float g = pow(noise(q * 2.6 + vec2(tt * 2.4, -tt * 1.7)), 9.) * 2.2;
  col += vec3(1., .86, .55) * g * m * smoothstep(.35, .8, lum) * .55;
  col += vec3(1., .9, .7) * abs(rip) * .05 * water;
  gl_FragColor = vec4(col, 1.);
}
`;

const vertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

export function WaterCanvas({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const hero = canvas?.parentElement?.parentElement;
    if (!canvas || !hero) return;
    let dead = false;
    let frame = 0;
    let renderer: { dispose: () => void } | null = null;

    void (async () => {
      const THREE = await import("three");
      if (dead) return;
      const gl = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
      renderer = gl;
      gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const uniforms = {
        uTex: { value: null as unknown },
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uImg: { value: 4 / 3 },
        uPos: { value: new THREE.Vector2(0.62, 0.5) },
        uScale: { value: 1 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMI: { value: 0 },
      };
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
      const size = () => {
        gl.setSize(hero.clientWidth, hero.clientHeight, false);
        uniforms.uRes.value.set(hero.clientWidth, hero.clientHeight);
      };
      size();
      window.addEventListener("resize", size);
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(
        src,
        (texture) => {
          if (dead) return;
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          uniforms.uTex.value = texture;
          uniforms.uImg.value = texture.image.width / texture.image.height;
          const clock = new THREE.Clock();
          let visible = true;
          const observer = new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? false;
          });
          observer.observe(hero);
          const loop = () => {
            frame = requestAnimationFrame(loop);
            if (!visible || document.hidden) return;
            const pointer = (window as Window & { __sundropHero?: { scale: number; mx: number; my: number; mi: number } }).__sundropHero ?? {
              scale: 1,
              mx: 0.5,
              my: 0.5,
              mi: 0,
            };
            uniforms.uTime.value = clock.getElapsedTime();
            uniforms.uScale.value = pointer.scale;
            uniforms.uMouse.value.x += (pointer.mx - uniforms.uMouse.value.x) * 0.08;
            uniforms.uMouse.value.y += (pointer.my - uniforms.uMouse.value.y) * 0.08;
            uniforms.uMI.value = pointer.mi;
            gl.render(scene, camera);
            canvas.classList.add("on");
          };
          loop();
        },
        undefined,
        () => canvas.remove(),
      );
    })();

    return () => {
      dead = true;
      cancelAnimationFrame(frame);
      renderer?.dispose();
    };
  }, [src]);

  return <canvas id="water" ref={ref} aria-hidden="true" />;
}
