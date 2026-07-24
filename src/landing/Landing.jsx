/*
  RADAR DE CANDIDATOS · Landing page promocional (/landing)
  Página independiente de la plataforma (entrada Vite propia: landing.html).
  Todo el contenido es estático/promocional; el login es SIMULADO y redirige a "/".
  Diseño: ADN de marca (dorado/carbón, índigo solo para IA), fondos oscuros alternados
  con claros, tipografía display serif del sistema, reveal-on-scroll y micro-animaciones.
*/
import React, { useState, useEffect, useRef } from "react";
import {
  Menu, X, Search, Users, FileSignature, Bot, Sparkles, Calendar, Star,
  Filter, Heart, FolderPlus, Archive, MapPin, Video, Bell, CheckCircle2,
  ChevronRight, ArrowRight, MessageSquare, ShieldCheck, Clock, Send,
} from "lucide-react";

/* ============================== ESTILOS ============================== */
const CSS = `
:root{
  --gold:#FFB81C; --gold-dark:#8A6400; --gold-soft:#FFF3D6;
  --ink:#131313; --ink-2:#1E1D1A; --paper:#FFFFFF; --bone:#F6F5F1;
  --line:#E5E2D9; --line-dark:#33312C;
  --txt:#20201D; --txt-2:#5C5950; --txt-inv:#F2EFE7; --txt-inv-2:#B9B3A6;
  --ai:#4338CA; --ai-soft:#EEF0FE; --ai-line:#C7CBF5; --ai-light:#A5B4FC;
  --ok:#1E7A3C; --ok-2:#3E9B5F; --extra:#8B5E34;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --serif:ui-serif,Georgia,Cambria,"Times New Roman",Times,serif;
  --sp-1:8px; --sp-2:16px; --sp-3:24px; --sp-4:32px; --sp-5:48px; --sp-6:72px;
  --r-2:10px; --r-3:14px; --r-4:20px; --pill:999px;
}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:var(--sans);color:var(--txt);background:var(--paper);font-size:16.5px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
img,svg{max-width:100%;}
button{font:inherit;cursor:pointer;}
a{color:inherit;}
h1,h2,h3{line-height:1.12;font-weight:800;letter-spacing:-0.015em;}
.serif{font-family:var(--serif);font-weight:700;letter-spacing:-0.01em;}
section{scroll-margin-top:84px;}
.wrap{max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,44px);}
:focus-visible{outline:3px solid var(--gold);outline-offset:2px;border-radius:4px;}
.on-light :focus-visible, .lt :focus-visible{outline-color:var(--gold-dark);}

/* ---------- Botones ---------- */
.b{display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:var(--pill);
  padding:13px 26px;min-height:48px;font-size:15.5px;font-weight:700;border:1.5px solid transparent;
  text-decoration:none;transition:transform .18s ease-out,background .18s ease-out,border-color .18s ease-out,color .18s ease-out;}
.b:active{transform:scale(0.97);}
.b-gold{background:var(--gold);color:#131313;}
.b-gold:hover{background:#F0AC12;transform:translateY(-2px);}
.b-line-inv{background:transparent;color:var(--txt-inv);border-color:#4A463E;}
.b-line-inv:hover{border-color:var(--gold);color:var(--gold);}
.b-line{background:transparent;color:var(--txt);border-color:#C9C5BA;}
.b-line:hover{border-color:var(--ink);}
.b-ink{background:var(--ink);color:#fff;}
.b-ink:hover{background:#000;transform:translateY(-2px);}
.b-sm{padding:9px 18px;min-height:44px;font-size:14px;}

/* ---------- Chips / etiquetas ---------- */
.tag{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:800;letter-spacing:0.14em;
  text-transform:uppercase;padding:7px 14px;border-radius:var(--pill);}
.tag-gold{background:var(--gold-soft);color:var(--gold-dark);border:1px solid #F0DCA4;}
.tag-gold-dk{background:rgba(255,184,28,0.12);color:var(--gold);border:1px solid rgba(255,184,28,0.35);}
.tag-ai{background:var(--ai-soft);color:var(--ai);border:1px solid var(--ai-line);}
.tag-ai-dk{background:rgba(99,102,241,0.14);color:var(--ai-light);border:1px solid rgba(165,180,252,0.35);}

/* ---------- Reveal on scroll ---------- */
.rv{opacity:0;transform:translateY(20px);transition:opacity .38s ease-out,transform .38s ease-out;transition-delay:calc(var(--i,0)*45ms);}
.rv.in{opacity:1;transform:none;}

/* ---------- Header ---------- */
.hd{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(19,19,19,0.72);backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);border-bottom:1px solid transparent;transition:border-color .2s ease-out,background .2s ease-out;}
.hd.scrolled{background:rgba(19,19,19,0.92);border-bottom-color:var(--line-dark);}
.hd-in{max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,44px);height:72px;display:flex;align-items:center;gap:18px;}
.logo{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--txt-inv);min-width:0;}
.logo .mk{width:38px;height:38px;border-radius:10px;background:var(--gold);color:#131313;display:grid;place-items:center;
  font-weight:800;font-size:18px;font-family:var(--serif);flex:0 0 auto;}
.logo b{font-size:18px;letter-spacing:0.01em;white-space:nowrap;}
.logo span{display:block;font-size:9px;color:var(--txt-inv-2);letter-spacing:0.2em;white-space:nowrap;}
.hd-nav{display:flex;align-items:center;gap:4px;margin-left:auto;}
.hd-nav a{color:var(--txt-inv-2);text-decoration:none;font-size:14px;font-weight:600;padding:10px 13px;border-radius:var(--pill);transition:color .18s ease-out;}
.hd-nav a:hover{color:var(--gold);}
.hd-cta{margin-left:6px;}
.hd-burger{display:none;margin-left:auto;background:none;border:1.5px solid #4A463E;color:var(--txt-inv);
  width:46px;height:46px;border-radius:12px;align-items:center;justify-content:center;flex:0 0 auto;}
.hd-burger:hover{border-color:var(--gold);color:var(--gold);}

/* Menú móvil */
.mnav-bg{position:fixed;inset:0;z-index:110;background:rgba(10,9,7,0.6);opacity:0;pointer-events:none;transition:opacity .22s ease-out;}
.mnav-bg.open{opacity:1;pointer-events:auto;}
.mnav{position:fixed;top:0;right:0;bottom:0;z-index:120;width:300px;max-width:84vw;background:var(--ink);color:var(--txt-inv);
  padding:24px;display:flex;flex-direction:column;gap:6px;transform:translateX(100%);transition:transform .24s ease-out;}
.mnav.open{transform:translateX(0);}
.mnav a{color:var(--txt-inv);text-decoration:none;font-size:17px;font-weight:700;padding:13px 12px;border-radius:12px;display:flex;align-items:center;gap:10px;}
.mnav a:hover{background:#242220;color:var(--gold);}
.mnav-x{align-self:flex-end;background:none;border:none;color:var(--txt-inv-2);width:46px;height:46px;display:grid;place-items:center;border-radius:12px;}
.mnav-x:hover{color:#fff;}
.mnav .b{margin-top:auto;}

/* ---------- Hero ---------- */
.hero{background:radial-gradient(1200px 620px at 78% -10%,rgba(255,184,28,0.14),transparent 60%),
  radial-gradient(700px 420px at -10% 110%,rgba(255,184,28,0.07),transparent 60%),var(--ink);
  color:var(--txt-inv);position:relative;overflow:hidden;padding:calc(72px + clamp(40px,6.5vw,72px)) 0 clamp(56px,8vw,96px);}
.hero-r{position:absolute;right:-4%;top:-12%;font-family:var(--serif);font-weight:700;font-size:clamp(340px,52vw,720px);
  line-height:1;color:transparent;-webkit-text-stroke:1.5px rgba(255,184,28,0.13);user-select:none;pointer-events:none;}
.hero-in{position:relative;display:grid;grid-template-columns:1.04fr 0.96fr;gap:clamp(32px,5vw,64px);align-items:center;}
.hero h1{font-family:var(--serif);font-size:clamp(2.15rem,4.6vw,3.4rem);margin:18px 0 16px;max-width:15em;}
.hero h1 em{font-style:normal;color:var(--gold);}
.hero p.sub{font-size:clamp(1.05rem,1.6vw,1.22rem);color:var(--txt-inv-2);max-width:34em;}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:28px;}
.hero-meta{display:flex;gap:22px;flex-wrap:wrap;margin-top:30px;color:var(--txt-inv-2);font-size:13.5px;}
.hero-meta span{display:inline-flex;align-items:center;gap:8px;}
.hero-meta svg{color:var(--gold);}

/* Composición visual del hero (mockups CSS de la UI real) */
.hv{position:relative;min-height:420px;}
.hv-card{position:absolute;background:#FFFFFF;color:var(--txt);border-radius:var(--r-3);padding:14px 16px;
  box-shadow:0 24px 60px rgba(0,0,0,0.42);display:flex;align-items:center;gap:12px;}
.hv-cand{top:6%;left:4%;width:min(310px,84%);}
.hv-cand .av{width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--gold);display:grid;place-items:center;font-weight:800;font-size:14px;flex-shrink:0;}
.hv-cand b{display:block;font-size:14.5px;}
.hv-cand span{font-size:12px;color:var(--txt-2);}
.ring{--v:94;--c:var(--ok);width:48px;height:48px;border-radius:50%;flex-shrink:0;margin-left:auto;
  background:conic-gradient(var(--c) calc(var(--v)*1%),#EDEAE0 0);display:grid;place-items:center;}
.ring i{width:35px;height:35px;border-radius:50%;background:#fff;display:grid;place-items:center;font-style:normal;font-weight:800;font-size:11px;}
.hv-fases{top:38%;right:0;width:min(330px,88%);flex-direction:column;align-items:stretch;gap:9px;}
.hv-fases small{font-size:10.5px;font-weight:800;letter-spacing:0.14em;color:var(--txt-2);}
.hv-fase-row{display:flex;gap:6px;}
.hv-fase{flex:1;height:9px;border-radius:99px;background:#EDEAE0;position:relative;overflow:hidden;}
.hv-fase.done{background:var(--gold);}
.hv-fase.cur::after{content:"";position:absolute;inset:0;width:55%;background:var(--gold);border-radius:99px;}
.hv-fase-lbl{display:flex;justify-content:space-between;font-size:10.5px;color:var(--txt-2);font-weight:600;}
.hv-ia{bottom:16%;left:8%;width:min(280px,80%);background:var(--ai);color:#fff;font-size:13px;font-weight:600;box-shadow:0 24px 60px rgba(67,56,202,0.45);}
.hv-ia svg{flex-shrink:0;}
.hv-chat{bottom:-2%;right:6%;width:min(250px,72%);border:1px solid var(--line);font-size:13px;font-weight:600;}
.hv-chat .bot-ic{width:38px;height:38px;border-radius:50%;background:var(--ink);color:var(--gold);display:grid;place-items:center;flex-shrink:0;}
.float-1,.float-2,.float-3,.float-4{animation:float 7s ease-in-out infinite;}
.float-2{animation-duration:8.5s;animation-delay:.8s;}
.float-3{animation-duration:7.6s;animation-delay:1.6s;}
.float-4{animation-duration:9s;animation-delay:.4s;}
@keyframes float{0%,100%{translate:0 0;}50%{translate:0 -10px;}}

/* ---------- Secciones ---------- */
.sec{padding:clamp(68px,9vw,116px) 0;}
.sec-bone{background:var(--bone);}
.sec-dark{background:linear-gradient(180deg,#161513,#131313);color:var(--txt-inv);}
.sec-head{max-width:720px;margin-bottom:clamp(36px,5vw,56px);}
.sec-head h2{font-family:var(--serif);font-size:clamp(1.9rem,3.6vw,2.7rem);margin:18px 0 14px;}
.sec-dark .sec-head p{color:var(--txt-inv-2);}
.sec-head p{color:var(--txt-2);font-size:1.06rem;max-width:38em;}

/* Beneficios */
.ben-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.ben{background:var(--paper);border:1px solid var(--line);border-radius:var(--r-4);padding:28px 26px;position:relative;overflow:hidden;
  transition:transform .2s ease-out,box-shadow .2s ease-out,border-color .2s ease-out;}
.ben:hover{transform:translateY(-5px);box-shadow:0 18px 44px rgba(30,28,20,0.10);border-color:#D8D3C5;}
.ben .n{font-family:var(--serif);font-weight:700;font-size:15px;color:var(--gold-dark);letter-spacing:0.06em;}
.ben h3{font-size:1.35rem;margin:10px 0 10px;}
.ben p{font-size:14.5px;color:var(--txt-2);}
.ben .ic{width:52px;height:52px;border-radius:16px;background:var(--ink);color:var(--gold);display:grid;place-items:center;margin-bottom:18px;}
.ben-wide{grid-column:1 / -1;display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center;background:var(--ink);color:var(--txt-inv);border-color:var(--ink);}
.ben-wide:hover{border-color:var(--gold);}
.ben-wide .ic{margin:0;background:rgba(255,184,28,0.14);border:1px solid rgba(255,184,28,0.3);}
.ben-wide h3{margin:0 0 6px;}
.ben-wide p{color:var(--txt-inv-2);max-width:52em;}

/* Pasos (layout alternado) */
.paso{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,76px);align-items:center;}
.paso.flip .paso-txt{order:2;}
.paso h2{font-family:var(--serif);font-size:clamp(1.8rem,3.2vw,2.45rem);margin:18px 0 16px;}
.paso p.lead{color:var(--txt-2);font-size:1.05rem;margin-bottom:22px;}
.sec-dark .paso p.lead{color:var(--txt-inv-2);}
.feat{list-style:none;display:flex;flex-direction:column;gap:14px;}
.feat li{display:flex;gap:13px;align-items:flex-start;font-size:15px;}
.feat li svg{flex-shrink:0;margin-top:2px;color:var(--gold-dark);}
.sec-dark .feat li svg{color:var(--gold);}
.feat li b{display:block;}
.feat li span{color:var(--txt-2);font-size:14px;}
.sec-dark .feat li span{color:var(--txt-inv-2);}
.feat li.ai svg{color:var(--ai);}
.sec-dark .feat li.ai svg{color:var(--ai-light);}

/* Panel visual de los pasos */
.panel{background:var(--paper);border:1px solid var(--line);border-radius:var(--r-4);padding:22px;box-shadow:0 22px 54px rgba(30,28,20,0.10);}
.sec-dark .panel{border-color:var(--line-dark);box-shadow:0 26px 64px rgba(0,0,0,0.5);}
.panel small{display:block;font-size:10.5px;font-weight:800;letter-spacing:0.14em;color:var(--txt-2);margin-bottom:14px;text-transform:uppercase;}
.rk-row{display:flex;align-items:center;gap:13px;padding:11px 12px;border:1px solid var(--line);border-radius:var(--r-3);background:#FCFBF8;}
.rk-row + .rk-row{margin-top:10px;}
.rk-row b{font-size:14px;}
.rk-row span{display:block;font-size:11.5px;color:var(--txt-2);}
.rk-band{margin-left:auto;font-size:10.5px;font-weight:800;letter-spacing:0.06em;padding:4px 10px;border-radius:var(--pill);}
.band-a{background:#E7F3EA;color:var(--ok);}
.band-b{background:#EDF6EF;color:var(--ok-2);}
.band-c{background:#F4ECE3;color:var(--extra);}
.rk-div{display:flex;align-items:center;gap:10px;margin:12px 0 10px;font-size:10.5px;font-weight:800;letter-spacing:0.1em;color:var(--txt-2);}
.rk-div::before,.rk-div::after{content:"";flex:1;height:1px;background:var(--line);}
.rk-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;}
.rk-tool{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--txt-2);
  background:var(--bone);border:1px solid var(--line);border-radius:var(--pill);padding:6px 12px;}

/* Panel entrevista (paso 2, sección oscura) */
.ent{color:var(--txt);}
.ent-top{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--line);}
.ent-top .cam{width:44px;height:44px;border-radius:12px;background:var(--ink);color:#fff;display:grid;place-items:center;flex-shrink:0;}
.ent-top b{font-size:14.5px;display:block;}
.ent-top span{font-size:12px;color:var(--txt-2);}
.ent-live{margin-left:auto;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:var(--ok);}
.ent-live::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--ok);}
.ent-note{margin-top:14px;background:var(--ai-soft);border:1px solid var(--ai-line);border-radius:var(--r-3);padding:13px 15px;font-size:13.5px;color:var(--ai);display:flex;gap:10px;}
.ent-note svg{flex-shrink:0;margin-top:1px;}
.ent-stars{display:flex;align-items:center;gap:4px;margin-top:14px;color:var(--gold);}
.ent-stars span{font-size:12.5px;color:var(--txt-2);margin-left:8px;font-weight:600;}
.ent-remind{margin-top:14px;display:flex;gap:10px;align-items:center;font-size:13px;color:var(--txt-2);background:#FCFBF8;border:1px dashed #D8D3C5;border-radius:var(--r-3);padding:11px 14px;}

/* Panel oferta (paso 3) */
.of-head{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.of-head .mk{width:40px;height:40px;border-radius:10px;background:var(--gold);color:#131313;display:grid;place-items:center;font-family:var(--serif);font-weight:800;}
.of-line{display:flex;justify-content:space-between;gap:14px;font-size:14px;padding:11px 2px;border-bottom:1px solid var(--line);}
.of-line span{color:var(--txt-2);}
.of-line b{text-align:right;}
.of-ok{margin-top:16px;display:flex;gap:10px;align-items:center;background:#E7F3EA;color:var(--ok);border-radius:var(--r-3);padding:12px 14px;font-size:13.5px;font-weight:700;}

/* Chatbot */
.chatp{max-width:420px;margin:0 auto;}
.chat-bub{border-radius:16px;padding:11px 15px;font-size:13.5px;max-width:88%;border:1px solid var(--line);}
.chat-bub + .chat-bub{margin-top:10px;}
.chat-bot{background:var(--bone);border-bottom-left-radius:5px;}
.chat-me{background:var(--gold-soft);border-color:#F0DCA4;margin-left:auto;border-bottom-right-radius:5px;}
.chat-sup{display:flex;align-items:center;gap:9px;margin-top:14px;font-size:12.5px;font-weight:700;color:var(--ai);
  background:var(--ai-soft);border:1px solid var(--ai-line);border-radius:var(--pill);padding:9px 15px;width:fit-content;}
.chat-in{display:flex;gap:9px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line);}
.chat-in i{flex:1;border:1px solid var(--line);border-radius:var(--pill);padding:11px 16px;font-size:13px;color:var(--txt-2);font-style:normal;}
.chat-in u{width:44px;height:44px;border-radius:50%;background:var(--gold);color:#131313;display:grid;place-items:center;text-decoration:none;flex-shrink:0;}

/* CTA final */
.cta-fin{position:relative;overflow:hidden;text-align:center;}
.cta-fin .hero-r{right:auto;left:-8%;top:-30%;font-size:clamp(300px,44vw,560px);}
.cta-fin h2{font-family:var(--serif);font-size:clamp(2.1rem,4.4vw,3.3rem);max-width:17em;margin:20px auto 18px;}
.cta-fin p{color:var(--txt-inv-2);max-width:36em;margin:0 auto 34px;}

/* Footer */
.ft{background:#0E0D0C;color:var(--txt-inv-2);padding:34px 0;}
.ft-in{display:flex;align-items:center;gap:18px;flex-wrap:wrap;}
.ft p{font-size:12.5px;margin-left:auto;max-width:34em;text-align:right;}

/* ---------- Modal de login (simulado) ---------- */
.lg-bg{position:fixed;inset:0;z-index:200;background:rgba(12,11,9,0.62);display:flex;align-items:center;justify-content:center;padding:20px;}
.lg{background:var(--paper);border-radius:22px;width:100%;max-width:420px;padding:34px 32px;position:relative;
  box-shadow:0 40px 90px rgba(0,0,0,0.4);animation:lgin .24s ease-out;}
@keyframes lgin{from{opacity:0;transform:translateY(14px) scale(0.98);}to{opacity:1;transform:none;}}
.lg-x{position:absolute;top:14px;right:14px;background:none;border:none;color:var(--txt-2);width:44px;height:44px;display:grid;place-items:center;border-radius:12px;}
.lg-x:hover{color:var(--ink);background:var(--bone);}
.lg .mk{width:46px;height:46px;border-radius:12px;background:var(--gold);color:#131313;display:grid;place-items:center;font-family:var(--serif);font-weight:800;font-size:20px;margin-bottom:16px;}
.lg h3{font-family:var(--serif);font-size:1.5rem;margin-bottom:6px;}
.lg > p{font-size:13.5px;color:var(--txt-2);margin-bottom:22px;}
.lg label{display:block;font-size:13px;font-weight:700;margin:14px 0 6px;}
.lg input{width:100%;border:1.5px solid #D8D3C5;border-radius:12px;padding:12px 15px;font-size:16px;font-family:var(--sans);background:#FCFBF8;color:var(--txt);}
.lg input:focus{outline:none;border-color:var(--gold-dark);}
.lg .b{width:100%;margin-top:22px;}
.lg-sep{display:flex;align-items:center;gap:12px;margin:18px 0;color:var(--txt-2);font-size:12px;font-weight:700;}
.lg-sep::before,.lg-sep::after{content:"";flex:1;height:1px;background:var(--line);}
.lg-ms{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:1.5px solid #D8D3C5;background:#fff;
  border-radius:12px;padding:12px;min-height:48px;font-size:14.5px;font-weight:700;color:var(--txt);transition:border-color .18s ease-out;}
.lg-ms:hover{border-color:var(--ink);}
.lg-note{font-size:11.5px;color:var(--txt-2);text-align:center;margin-top:16px;}

/* ---------- Responsive ---------- */
/* El nav completo deja de caber antes que el resto del layout: el nombre de marca
   es largo, así que la hamburguesa entra a 1080px y no a 960px. */
@media(max-width:1080px){
  .hd-nav{display:none;}
  .hd-burger{display:flex;}
}
@media(max-width:960px){
  .hero-in{grid-template-columns:1fr;}
  .hv{min-height:400px;margin-top:8px;}
  .ben-grid{grid-template-columns:1fr;}
  .ben-wide{grid-template-columns:auto 1fr;}
  .ben-wide .b{grid-column:1 / -1;justify-self:start;}
  .paso{grid-template-columns:1fr;}
  .paso.flip .paso-txt{order:0;}
  .ft p{margin-left:0;text-align:left;}
}
@media(max-width:420px){
  .hv{min-height:440px;}
  .hero-cta .b{width:100%;}
  /* En pantallas angostas el nombre completo compite con la hamburguesa. */
  .hd-in{gap:10px;}
  .logo{gap:9px;}
  .logo .mk{width:34px;height:34px;font-size:16px;}
  .logo b{font-size:15px;}
  .logo span{font-size:8px;letter-spacing:0.14em;}
}
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto;}
  .rv{opacity:1;transform:none;transition:none;}
  .float-1,.float-2,.float-3,.float-4{animation:none;}
  .mnav,.mnav-bg,.b,.ben{transition:none;}
  .lg{animation:none;}
}
`;

/* ============================== UTILIDADES ============================== */
/* Reveal on scroll: observa [data-rv] y agrega .in al entrar al viewport */
function useReveal(){
  useEffect(()=>{
    const els=document.querySelectorAll("[data-rv]");
    if(!("IntersectionObserver" in window)){ els.forEach(el=>el.classList.add("in")); return; }
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    }),{threshold:0.14,rootMargin:"0px 0px -6% 0px"});
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[]);
}
/* Parallax ligero del motivo "R" del hero (respeta prefers-reduced-motion) */
function useParallax(ref){
  useEffect(()=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el=ref.current; if(!el) return;
    let raf=0;
    const onScroll=()=>{ cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{ el.style.transform="translateY("+(window.scrollY*0.14)+"px)"; }); };
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>{ window.removeEventListener("scroll",onScroll); cancelAnimationFrame(raf); };
  },[ref]);
}
/* Logo de Microsoft (4 cuadros, SVG inline) */
const MSLogo=()=>(
  <svg width="17" height="17" viewBox="0 0 21 21" aria-hidden="true">
    <rect x="0" y="0" width="10" height="10" fill="#F25022"/>
    <rect x="11" y="0" width="10" height="10" fill="#7FBA00"/>
    <rect x="0" y="11" width="10" height="10" fill="#00A4EF"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
);

/* ============================== LOGIN SIMULADO ============================== */
function LoginModal({onClose, onIngresar}){
  const firstRef=useRef(null);
  useEffect(()=>{
    firstRef.current?.focus();
    const onKey=(e)=>{ if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown",onKey);
    document.body.style.overflow="hidden";
    return ()=>{ document.removeEventListener("keydown",onKey); document.body.style.overflow=""; };
  },[onClose]);
  return (
    <div className="lg-bg" onClick={onClose}>
      <div className="lg on-light" role="dialog" aria-modal="true" aria-labelledby="lg-title" onClick={e=>e.stopPropagation()}>
        <button className="lg-x" onClick={onClose} aria-label="Cerrar"><X size={20}/></button>
        <div className="mk" aria-hidden="true">R</div>
        <h3 id="lg-title">Ingresar a Radar de Candidatos</h3>
        <p>Accede con tus credenciales corporativas para gestionar tus vacantes.</p>
        <form onSubmit={(e)=>{ e.preventDefault(); onIngresar(); }}>
          <label htmlFor="lg-emp">Número de empleado</label>
          <input id="lg-emp" ref={firstRef} name="empleado" inputMode="numeric" autoComplete="username" placeholder="Ej. 1149816"/>
          <label htmlFor="lg-pass">Contraseña</label>
          <input id="lg-pass" name="password" type="password" autoComplete="current-password" placeholder="Tu contraseña"/>
          <button type="submit" className="b b-gold">Ingresar <ArrowRight size={17}/></button>
        </form>
        <div className="lg-sep">O BIEN</div>
        <button className="lg-ms" onClick={onIngresar}><MSLogo/> Ingresar con cuenta Microsoft</button>
        <p className="lg-note">Demo de validación: cualquier valor te llevará a la plataforma.</p>
      </div>
    </div>
  );
}

/* ============================== SECCIONES ============================== */
const ANCLAS=[
  {href:"#beneficios",  txt:"Beneficios"},
  {href:"#busqueda",    txt:"Búsqueda"},
  {href:"#seleccion",   txt:"Selección"},
  {href:"#contratacion",txt:"Contratación"},
  {href:"#chatbot",     txt:"Chatbot"},
];

function Header({onLogin}){
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const on=()=>setScrolled(window.scrollY>10);
    on(); window.addEventListener("scroll",on,{passive:true});
    return ()=>window.removeEventListener("scroll",on);
  },[]);
  return (<>
    <header className={"hd"+(scrolled?" scrolled":"")}>
      <div className="hd-in">
        <a className="logo" href="#inicio" aria-label="Radar de Candidatos — inicio">
          <span className="mk" aria-hidden="true">R</span>
          <span><b>Radar de Candidatos</b><span>COBERTURA DE VACANTES</span></span>
        </a>
        <nav className="hd-nav" aria-label="Secciones">
          {ANCLAS.map(a=><a key={a.href} href={a.href}>{a.txt}</a>)}
          <button className="b b-gold b-sm hd-cta" onClick={onLogin}>Ingresar a la plataforma</button>
        </nav>
        <button className="hd-burger" onClick={()=>setOpen(true)} aria-label="Abrir menú"><Menu size={21}/></button>
      </div>
    </header>
    <div className={"mnav-bg"+(open?" open":"")} onClick={()=>setOpen(false)}/>
    <nav className={"mnav"+(open?" open":"")} aria-hidden={!open} aria-label="Menú">
      <button className="mnav-x" onClick={()=>setOpen(false)} aria-label="Cerrar menú"><X size={22}/></button>
      {ANCLAS.map(a=><a key={a.href} href={a.href} onClick={()=>setOpen(false)}>{a.txt}<ChevronRight size={16} style={{marginLeft:"auto",opacity:.5}}/></a>)}
      <button className="b b-gold" onClick={()=>{ setOpen(false); onLogin(); }}>Ingresar a la plataforma</button>
    </nav>
  </>);
}

function Hero({onLogin}){
  const rRef=useRef(null);
  useParallax(rRef);
  return (
    <section className="hero" id="inicio">
      <div className="hero-r" ref={rRef} aria-hidden="true">R</div>
      <div className="wrap hero-in">
        <div>
          <span className="tag tag-gold-dk" data-rv><Sparkles size={13}/> El nuevo proceso de reclutamiento</span>
          <h1 data-rv style={{"--i":1}}>Automatiza y gestiona tu búsqueda de talento en <em>3 simples pasos</em></h1>
          <p className="sub" data-rv style={{"--i":2}}>
            Radar de Candidatos pone el proceso completo en manos del formador directo: la IA busca, filtra y
            entrevista; tú exploras, decides y contratas. Sin triangulaciones, sin esperas y con
            apoyo en cada paso.
          </p>
          <div className="hero-cta" data-rv style={{"--i":3}}>
            <button className="b b-gold" onClick={onLogin}>Comenzar ahora <ArrowRight size={17}/></button>
            <a className="b b-line-inv" href="#beneficios">Conoce los beneficios</a>
          </div>
          <div className="hero-meta" data-rv style={{"--i":4}}>
            <span><CheckCircle2 size={15}/> Auto-gestionable</span>
            <span><Sparkles size={15}/> IA en búsqueda y entrevistas</span>
            <span><MessageSquare size={15}/> Soporte transversal</span>
          </div>
        </div>
        <div className="hv" aria-hidden="true">
          <div className="hv-card hv-cand float-1">
            <div className="av">VO</div>
            <div><b>Valeria O.</b><span>Ejecutiva de ventas · CDMX</span></div>
            <div className="ring" style={{"--v":94}}><i>94%</i></div>
          </div>
          <div className="hv-card hv-fases float-2">
            <small>Tu proceso en 3 etapas</small>
            <div className="hv-fase-row">
              <div className="hv-fase done"/><div className="hv-fase cur"/><div className="hv-fase"/>
            </div>
            <div className="hv-fase-lbl"><span>Búsqueda</span><span>Selección</span><span>Contratación</span></div>
          </div>
          <div className="hv-card hv-ia float-3">
            <Sparkles size={17}/> La IA está entrevistando a 8 candidatos…
          </div>
          <div className="hv-card hv-chat float-4">
            <span className="bot-ic"><Bot size={18}/></span> ¿Te apoyo con tu vacante?
          </div>
        </div>
      </div>
    </section>
  );
}

function Beneficios({onLogin}){
  return (
    <section className="sec sec-bone on-light" id="beneficios">
      <div className="wrap">
        <div className="sec-head">
          <span className="tag tag-gold" data-rv>Beneficios principales</span>
          <h2 data-rv style={{"--i":1}}>Tres etapas para cubrir tu vacante. Un solo responsable: tú.</h2>
          <p data-rv style={{"--i":2}}>El proceso completo vive en una sola plataforma, dividido en tres
            etapas claras que avanzas a tu ritmo, con la IA haciendo el trabajo pesado.</p>
        </div>
        <div className="ben-grid">
          <article className="ben" data-rv>
            <div className="ic"><Search size={23}/></div>
            <div className="n">ETAPA 1</div>
            <h3>Búsqueda</h3>
            <p>Revisa y ajusta el descriptivo de tu vacante y apruébalo para que la IA busque, filtre
              y ranquee candidatos en un pool de talento tipo marketplace, listo para explorar.</p>
          </article>
          <article className="ben" data-rv style={{"--i":1}}>
            <div className="ic"><Users size={23}/></div>
            <div className="n">ETAPA 2</div>
            <h3>Selección</h3>
            <p>Compara a tus top candidatos con entrevistas de IA, CV y filtros; agenda entrevistas
              vinculadas a tu calendario y elige al ideal con toda la evidencia a la vista.</p>
          </article>
          <article className="ben" data-rv style={{"--i":2}}>
            <div className="ic"><FileSignature size={23}/></div>
            <div className="n">ETAPA 3</div>
            <h3>Contratación</h3>
            <p>Genera la carta oferta desde el tabulador, define día de entrada y ubicación de
              presentación, y recibe a tu nuevo colaborador con kit de inducción y bienvenida.</p>
          </article>
          <article className="ben ben-wide" data-rv style={{"--i":3}}>
            <div className="ic"><Bot size={24}/></div>
            <div>
              <h3>Un chatbot que te acompaña todo el camino</h3>
              <p>El asistente transversal resuelve tus dudas en cada paso del proceso y te permite
                contactar directamente a los involucrados —candidatos, formadores y administradores—
                para resolver dudas y coordinarse sin intermediarios.</p>
            </div>
            <button className="b b-gold b-sm" onClick={onLogin}>Probarlo ahora</button>
          </article>
        </div>
      </div>
    </section>
  );
}

function PasoBusqueda(){
  return (
    <section className="sec on-light" id="busqueda">
      <div className="wrap paso">
        <div className="paso-txt">
          <span className="tag tag-gold" data-rv>Paso 1 · Búsqueda</span>
          <h2 data-rv style={{"--i":1}}>Un marketplace de talento que trabaja para ti.</h2>
          <p className="lead" data-rv style={{"--i":2}}>Revisa el descriptivo de tu vacante y solicita cambios
            con facilidad, campo por campo. Al aprobarla, la IA llena tu pool con candidatos rankeados,
            fáciles de explorar y organizar.</p>
          <ul className="feat">
            <li data-rv style={{"--i":3}}><Filter size={18}/><div><b>Explora, filtra y organiza</b>
              <span>Filtros por habilidades, favoritos, categorías, archivado, revisión rápida de
              perfiles e invitación directa a tu proceso.</span></div></li>
            <li className="ai" data-rv style={{"--i":4}}><Sparkles size={18}/><div><b>La IA valida por ti</b>
              <span>Filtra por historiales y realiza entrevistas autónomas en video para validar
              cada perfil antes de que llegue a tus manos.</span></div></li>
            <li data-rv style={{"--i":5}}><Star size={18}/><div><b>Rankings que se entienden</b>
              <span>Bandas claras: ideales (≥90%), adecuados (70–89%) y adicionales (&lt;70%),
              actualizadas con cada evaluación.</span></div></li>
          </ul>
        </div>
        <div className="panel" data-rv style={{"--i":2}} aria-hidden="true">
          <small>Pool de talento · Ranking</small>
          <div className="rk-row">
            <div className="ring" style={{"--v":94,"--c":"var(--ok)",marginLeft:0}}><i>94%</i></div>
            <div><b>Valeria O.</b><span>Ejecutiva de ventas · 5 años</span></div>
            <span className="rk-band band-a">IDEAL</span>
          </div>
          <div className="rk-row">
            <div className="ring" style={{"--v":91,"--c":"var(--ok)",marginLeft:0}}><i>91%</i></div>
            <div><b>Mariana G.</b><span>Key Account Manager · 8 años</span></div>
            <span className="rk-band band-a">IDEAL</span>
          </div>
          <div className="rk-div">ADECUADOS · 70–89%</div>
          <div className="rk-row">
            <div className="ring" style={{"--v":82,"--c":"var(--ok-2)",marginLeft:0}}><i>82%</i></div>
            <div><b>Jorge Luis P.</b><span>Asesor comercial · 2 años</span></div>
            <span className="rk-band band-b">ADECUADO</span>
          </div>
          <div className="rk-div">ADICIONALES · &lt;70%</div>
          <div className="rk-row">
            <div className="ring" style={{"--v":61,"--c":"var(--extra)",marginLeft:0}}><i>61%</i></div>
            <div><b>Ricardo A.</b><span>Vendedor de campo · 3 años</span></div>
            <span className="rk-band band-c">ADICIONAL</span>
          </div>
          <div className="rk-tools">
            <span className="rk-tool"><Heart size={13}/> Favoritos</span>
            <span className="rk-tool"><FolderPlus size={13}/> Categorías</span>
            <span className="rk-tool"><Archive size={13}/> Archivar</span>
            <span className="rk-tool"><Filter size={13}/> Filtros</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PasoSeleccion(){
  return (
    <section className="sec sec-dark" id="seleccion">
      <div className="wrap paso flip">
        <div className="paso-txt">
          <span className="tag tag-gold-dk" data-rv>Paso 2 · Selección</span>
          <h2 data-rv style={{"--i":1}}>Decide con evidencia, no con corazonadas.</h2>
          <p className="lead" data-rv style={{"--i":2}}>Visualiza a tus top candidatos según sus entrevistas
            con IA, su CV y los filtros de buró y empleos previos. Toda la información en un solo lugar
            para comparar y elegir.</p>
          <ul className="feat">
            <li data-rv style={{"--i":3}}><Calendar size={18}/><div><b>Entrevistas sin fricción</b>
              <span>Agendadas en la plataforma y vinculadas a Outlook/Teams: propones horarios,
              el candidato confirma y la reunión se genera sola.</span></div></li>
            <li className="ai" data-rv style={{"--i":4}}><Sparkles size={18}/><div><b>IA como copiloto</b>
              <span>Toma notas durante la entrevista y facilita tu retroalimentación y la decisión
              final con resúmenes claros.</span></div></li>
            <li data-rv style={{"--i":5}}><Bell size={18}/><div><b>Recordatorios automáticos</b>
              <span>Seleccionas al ideal y la plataforma le recuerda al candidato subir sus
              documentos, sin que tú persigas a nadie.</span></div></li>
          </ul>
        </div>
        <div className="panel ent" data-rv style={{"--i":2}} aria-hidden="true">
          <div className="ent-top">
            <span className="cam"><Video size={20}/></span>
            <div><b>Entrevista · Mariana G.</b><span>Hoy 11:00 · Microsoft Teams</span></div>
            <span className="ent-live">EN CURSO</span>
          </div>
          <div className="ent-note"><Sparkles size={16}/> La IA está tomando notas: "Amplia experiencia
            en cuentas clave; destaca su manejo de cartera de $40M anuales…"</div>
          <div className="ent-stars">
            <Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/>
            <Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/>
            <Star size={18}/><span>Tu calificación: 8/10</span>
          </div>
          <div className="ent-remind"><Bell size={15}/> Recordatorio enviado: documentos de contratación pendientes.</div>
        </div>
      </div>
    </section>
  );
}

function PasoContratacion(){
  return (
    <section className="sec on-light" id="contratacion">
      <div className="wrap paso">
        <div className="paso-txt">
          <span className="tag tag-gold" data-rv>Paso 3 · Contratación</span>
          <h2 data-rv style={{"--i":1}}>De la oferta al primer día, sin cabos sueltos.</h2>
          <p className="lead" data-rv style={{"--i":2}}>Genera la carta oferta directamente desde el tabulador
            de la vacante, agenda el día de entrada y define la ubicación de presentación del primer día.</p>
          <ul className="feat">
            <li data-rv style={{"--i":3}}><FileSignature size={18}/><div><b>Carta oferta en minutos</b>
              <span>Sueldo desde el tabulador, fecha de ingreso y ubicación con mapa. El candidato
              la recibe y confirma en la plataforma.</span></div></li>
            <li data-rv style={{"--i":4}}><CheckCircle2 size={18}/><div><b>Confirmación completa</b>
              <span>Correos habilitados, kit de inducción y guía de bienvenida listos desde
              el primer momento.</span></div></li>
            <li data-rv style={{"--i":5}}><MapPin size={18}/><div><b>Firma el primer día</b>
              <span>La firma del contrato es directa en la ubicación acordada, el primer día
              de trabajo. Sin vueltas previas.</span></div></li>
          </ul>
        </div>
        <div className="panel" data-rv style={{"--i":2}} aria-hidden="true">
          <div className="of-head">
            <span className="mk">R</span>
            <div><b style={{fontSize:14.5}}>Carta oferta</b><br/><span style={{fontSize:12,color:"var(--txt-2)"}}>Ejecutivo de Ventas Digitales</span></div>
          </div>
          <div className="of-line"><span>Candidata</span><b>Valeria Ortiz Camacho</b></div>
          <div className="of-line"><span>Sueldo mensual</span><b>$18,500 MXN</b></div>
          <div className="of-line"><span>Fecha de ingreso</span><b>Lunes 03 de agosto</b></div>
          <div className="of-line"><span>Presentación</span><b>Corporativo Insurgentes · 9:00 h</b></div>
          <div className="of-ok"><CheckCircle2 size={17}/> Oferta aceptada · kit de inducción enviado</div>
        </div>
      </div>
    </section>
  );
}

function ChatbotSec(){
  return (
    <section className="sec sec-bone on-light" id="chatbot">
      <div className="wrap paso flip">
        <div className="paso-txt">
          <span className="tag tag-ai" data-rv><Bot size={13}/> Chatbot transversal</span>
          <h2 data-rv style={{"--i":1}}>Nunca estás solo en el proceso.</h2>
          <p className="lead" data-rv style={{"--i":2}}>El asistente de Radar de Candidatos te guía paso a paso y
            resuelve dudas generales al momento, en cualquier pantalla y para cualquier rol.</p>
          <ul className="feat">
            <li data-rv style={{"--i":3}}><MessageSquare size={18}/><div><b>Respuestas del momento exacto</b>
              <span>Las preguntas frecuentes cambian según el paso en el que estás: siempre
              pertinentes, nunca genéricas.</span></div></li>
            <li data-rv style={{"--i":4}}><ShieldCheck size={18}/><div><b>Soporte humano a un clic</b>
              <span>Si el bot no basta, te vincula con personal de soporte especializado y mantiene
              el historial de conversaciones y solicitudes.</span></div></li>
            <li data-rv style={{"--i":5}}><Users size={18}/><div><b>Contacto directo, sin triangular</b>
              <span>Escríbele directamente a las personas del proceso —formador, candidato o
              administrador— y agiliza las respuestas.</span></div></li>
          </ul>
        </div>
        <div className="panel chatp" data-rv style={{"--i":2}} aria-hidden="true">
          <small>Asistente Radar de Candidatos</small>
          <div className="chat-bub chat-bot">¡Hola! Veo que estás en la etapa de <b>Selección</b>. ¿Te apoyo con tus entrevistas?</div>
          <div className="chat-bub chat-me">¿Cómo agendo la entrevista con mi candidata?</div>
          <div className="chat-bub chat-bot">Propón 3 horarios desde su ficha: se vinculan a tu Outlook/Teams y ella confirma uno. La reunión se genera automáticamente.</div>
          <div className="chat-sup"><MessageSquare size={14}/> Conectar con soporte</div>
          <div className="chat-in"><i>Escribe un mensaje…</i><u aria-hidden="true"><Send size={16}/></u></div>
        </div>
      </div>
    </section>
  );
}

function CtaFinal({onLogin}){
  return (
    <section className="sec sec-dark cta-fin">
      <div className="hero-r" aria-hidden="true">R</div>
      <div className="wrap" style={{position:"relative"}}>
        <span className="tag tag-gold-dk" data-rv><Clock size={13}/> Tu vacante no puede esperar</span>
        <h2 data-rv style={{"--i":1}}>El mejor equipo no se espera: se forma. Empieza hoy.</h2>
        <p data-rv style={{"--i":2}}>Entra a la plataforma, revisa tu vacante y deja que la IA te acerque
          al talento correcto. Tú tomas las decisiones; Radar de Candidatos hace el resto.</p>
        <div data-rv style={{"--i":3}}>
          <button className="b b-gold" onClick={onLogin}>Ingresar a la plataforma <ArrowRight size={17}/></button>
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer className="ft">
      <div className="wrap ft-in">
        <span className="logo" style={{color:"var(--txt-inv)"}}>
          <span className="mk" aria-hidden="true">R</span>
          <span><b>Radar de Candidatos</b><span>COBERTURA DE VACANTES</span></span>
        </span>
        <p>Prototipo navegable de validación. Las integraciones e inteligencia artificial mostradas
          son simuladas con fines de demostración.</p>
      </div>
    </footer>
  );
}

/* ============================== LANDING ============================== */
export default function Landing({onIngresar}){
  const [login,setLogin]=useState(false);
  useReveal();
  const abrirLogin=()=>setLogin(true);
  const ingresar=onIngresar || (()=>{ window.location.href="/"; });
  return (
    <div>
      <style>{CSS}</style>
      <Header onLogin={abrirLogin}/>
      <main>
        <Hero onLogin={abrirLogin}/>
        <Beneficios onLogin={abrirLogin}/>
        <PasoBusqueda/>
        <PasoSeleccion/>
        <PasoContratacion/>
        <ChatbotSec/>
        <CtaFinal onLogin={abrirLogin}/>
      </main>
      <Footer/>
      {login && <LoginModal onClose={()=>setLogin(false)} onIngresar={ingresar}/>}
    </div>
  );
}
