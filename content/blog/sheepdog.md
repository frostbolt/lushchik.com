---
title: Sheepdog — I shipped a WoW addon.
date: 2026-10-21
excerpt: "Built on a short nostalgia trip: a WoW TBCC addon, because the existing solutions weren't good enough."
tags:
  - engineering
  - projects
  - lua
---
A bout of nostalgia pulled me back into WoW for a bit — TBCC specifically, where I'd always enjoyed the PvP. Arena is the fun part for me: small teams, fast decisions, high ceiling. But the default UI makes it harder than it needs to be — the thing you need to see most (what the enemy is doing right now) is the thing the game shows least.

So I built an addon.

## The Problem

Arena is a 2v2 or 3v3 PvP mode. To make decisions you need to answer, continuously:

- Who is casting what, and can I interrupt it?
- Who's sitting in CC, and when do they break out?
- Which CC categories have diminishing returns left — can I still land a Polymorph, or will it last two seconds?
- Who still has their PvP trinket?

The default enemy frames show health bars. That's it. Everything else lives in combat log scrollback, scattered unit frames, or your head.

## What Sheepdog Does

Each enemy gets a square frame. The portrait in the middle is a priority slot: by default it shows the 3D model, but a cast replaces it with the spell icon and a cast bar, and a breakable CC replaces *that* with a big red countdown. A column on the right tracks diminishing returns per category — green border means a fresh CC lasts full duration, yellow is half, orange is quarter, red is immune. Trinket cooldown sits at the bottom.

Click casting is built in. Left click targets, right click casts your main CC, middle click interrupts, Shift+right click your instant CC. Every binding is editable.

<div style="overflow-x: auto; contain: inline-size; margin: 1.5rem 0;">
<svg viewBox="0 0 760 660" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Annotated sketch of one Sheepdog enemy frame: health bar, portrait, power bar, the diminishing-returns column with the trinket slot, the click-cast bindings, and how a cast or a CC takes over the portrait" style="width: 100%; min-width: 600px; height: auto; display: block; font-family: 'Caveat', 'Comic Sans MS', cursive;">
  <defs>
    <filter id="sd-rough" x="-4%" y="-4%" width="108%" height="108%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="sd-rough2" x="-4%" y="-4%" width="108%" height="108%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="23" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <pattern id="sd-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" stroke-width="1.1" opacity="0.5"/>
    </pattern>
    <pattern id="sd-hatch-cast" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#e0a92e" stroke-width="1.4" opacity="0.85"/>
    </pattern>
  </defs>
  <!-- ===== section A: one enemy frame ===== -->
  <g fill="currentColor" font-size="22" font-weight="600">
    <text x="50" y="40">one enemy frame</text>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" filter="url(#sd-rough2)" opacity="0.55">
    <path d="M 50 46 C 90 50, 130 42, 196 47"/>
  </g>
  <!-- trinket flash halo -->
  <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="6 5" stroke-linecap="round" opacity="0.3" filter="url(#sd-rough2)">
    <path d="M 43 49 L 340 49 L 340 283 L 43 283 Z"/>
  </g>
  <g fill="currentColor" font-size="13" opacity="0.55">
    <text x="292" y="45">flash ⑤</text>
  </g>
  <!-- hatch fills: health 63%, power 58% -->
  <g filter="url(#sd-rough)">
    <rect x="50" y="56" width="138" height="44" fill="url(#sd-hatch)"/>
    <rect x="50" y="232" width="128" height="44" fill="url(#sd-hatch)"/>
  </g>
  <!-- main block, double stroke -->
  <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough)">
    <path d="M 50 56 L 270 56 L 270 276 L 50 276 Z"/>
    <path d="M 50 100 L 270 100"/>
    <path d="M 50 232 L 270 232"/>
    <path d="M 188 56 L 188 100"/>
    <path d="M 178 232 L 178 276"/>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough2)" opacity="0.45">
    <path d="M 51 57 L 269 55 L 271 277 L 49 275 Z"/>
    <path d="M 49 101 L 271 99"/>
    <path d="M 51 231 L 269 233"/>
  </g>
  <!-- portrait: 3D model silhouette + name -->
  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" filter="url(#sd-rough)">
    <circle cx="160" cy="146" r="20"/>
    <path d="M 116 208 C 122 178, 198 178, 204 208"/>
  </g>
  <g fill="currentColor">
    <text x="58" y="85" font-size="20" font-weight="600">63%</text>
    <text x="58" y="261" font-size="20" font-weight="600">58%</text>
    <text x="160" y="226" font-size="15" text-anchor="middle">Shivv</text>
  </g>
  <!-- markers 1-3 on the left edge -->
  <g fill="none" stroke="currentColor" stroke-width="1.8" filter="url(#sd-rough2)">
    <circle cx="30" cy="78" r="12"/>
    <circle cx="30" cy="166" r="12"/>
    <circle cx="30" cy="254" r="12"/>
    <path d="M 42 78 L 50 78"/>
    <path d="M 42 166 L 50 166"/>
    <path d="M 42 254 L 50 254"/>
  </g>
  <g fill="currentColor" font-size="16" font-weight="700" text-anchor="middle">
    <text x="30" y="84">1</text>
    <text x="30" y="172">2</text>
    <text x="30" y="260">3</text>
  </g>
  <!-- DR column: 4 DR slots + trinket, equal height, tiny gaps -->
  <g filter="url(#sd-rough)">
    <rect x="282" y="60" width="47" height="34" fill="url(#sd-hatch)" opacity="0.5"/>
    <rect x="282" y="104" width="47" height="34" fill="url(#sd-hatch)" opacity="0.2"/>
    <rect x="282" y="149" width="47" height="34" fill="url(#sd-hatch)" opacity="0.5"/>
    <rect x="282" y="194" width="47" height="34" fill="url(#sd-hatch)" opacity="0.5"/>
    <rect x="282" y="238" width="47" height="34" fill="url(#sd-hatch)" opacity="0.5"/>
  </g>
  <g fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough)">
    <path d="M 278 56 L 333 56 L 333 98 L 278 98 Z" stroke="#f0c23a"/>
    <path d="M 278 101 L 333 101 L 333 142 L 278 142 Z" stroke="#3fd26a"/>
    <path d="M 278 145 L 333 145 L 333 187 L 278 187 Z" stroke="#ff8a3d"/>
    <path d="M 278 190 L 333 190 L 333 231 L 278 231 Z" stroke="#ff3b3b"/>
    <path d="M 278 234 L 333 234 L 333 276 L 278 276 Z" stroke="#ff3b3b"/>
  </g>
  <g fill="currentColor" text-anchor="middle" font-weight="600">
    <text x="305" y="82" font-size="15">12</text>
    <text x="305" y="171" font-size="15">8</text>
    <text x="305" y="216" font-size="15">15</text>
    <text x="305" y="260" font-size="13">1:42</text>
  </g>
  <g fill="currentColor" text-anchor="end" font-size="11" font-weight="700">
    <text x="330" y="95">½</text>
    <text x="330" y="184">¼</text>
    <text x="330" y="228">X</text>
  </g>
  <g fill="currentColor" font-size="15" opacity="0.85">
    <text x="341" y="82">incap</text>
    <text x="341" y="126">root</text>
    <text x="341" y="171">stun</text>
    <text x="341" y="215">fear</text>
    <text x="341" y="260">trinket</text>
  </g>
  <!-- brace + markers 4-5 -->
  <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" filter="url(#sd-rough2)">
    <path d="M 392 60 C 402 60, 400 70, 400 100 L 400 136 C 400 142, 404 143, 410 144 C 404 145, 400 146, 400 152 L 400 190 C 400 220, 402 228, 392 228"/>
    <path d="M 398 255 L 412 255"/>
    <circle cx="426" cy="144" r="12"/>
    <circle cx="426" cy="255" r="12"/>
  </g>
  <g fill="currentColor" font-size="16" font-weight="700" text-anchor="middle">
    <text x="426" y="150">4</text>
    <text x="426" y="261">5</text>
  </g>
  <!-- legend -->
  <g fill="none" stroke="currentColor" stroke-width="1.6" filter="url(#sd-rough2)">
    <circle cx="462" cy="68" r="11"/>
    <circle cx="462" cy="118" r="11"/>
    <circle cx="462" cy="186" r="11"/>
    <circle cx="462" cy="236" r="11"/>
    <circle cx="462" cy="340" r="11"/>
  </g>
  <g fill="currentColor" font-size="14" font-weight="700" text-anchor="middle">
    <text x="462" y="73">1</text>
    <text x="462" y="123">2</text>
    <text x="462" y="191">3</text>
    <text x="462" y="241">4</text>
    <text x="462" y="345">5</text>
  </g>
  <g fill="currentColor" font-size="20" font-weight="600">
    <text x="480" y="74">health</text>
    <text x="480" y="124">portrait</text>
    <text x="480" y="192">power</text>
    <text x="480" y="242">DR column</text>
    <text x="480" y="346">trinket</text>
  </g>
  <g fill="currentColor" font-size="15.5" opacity="0.8">
    <text x="480" y="93">class-colored bar, percent on the left</text>
    <text x="480" y="143">live 3D model, name at the bottom —</text>
    <text x="480" y="162">casts and CC take it over (see below)</text>
    <text x="480" y="211">mana / rage / energy, percent</text>
    <text x="480" y="261">one slot per CC category, top to bottom:</text>
    <text x="480" y="280">incapacitate · root · stun · fear</text>
    <text x="480" y="299">border = DR tier, number = seconds to reset,</text>
    <text x="480" y="318">corner badge ½ ¼ X</text>
    <text x="480" y="365">PvP trinket cooldown, border red until ready —</text>
    <text x="480" y="384">the whole frame flashes when it pops</text>
  </g>
  <!-- click-cast box -->
  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough)">
    <path d="M 50 308 L 432 308 L 432 400 L 50 400 Z"/>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough2)" opacity="0.45">
    <path d="M 51 309 L 431 307 L 433 401 L 49 399 Z"/>
  </g>
  <g fill="currentColor">
    <text x="62" y="332" font-size="18" font-weight="600">the whole frame is a secure button — click-cast:</text>
    <text x="70" y="358" font-size="15.5" opacity="0.85">left click → target</text>
    <text x="70" y="381" font-size="15.5" opacity="0.85">middle → Counterspell</text>
    <text x="250" y="358" font-size="15.5" opacity="0.85">right → Polymorph</text>
    <text x="250" y="381" font-size="15.5" opacity="0.85">shift + right → Frost Nova</text>
  </g>
  <!-- ===== section B: portrait takeover ===== -->
  <g fill="currentColor" font-size="22" font-weight="600">
    <text x="50" y="446">portrait takeover</text>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" filter="url(#sd-rough2)" opacity="0.55">
    <path d="M 50 452 C 100 456, 150 448, 212 453"/>
  </g>
  <!-- mini frame fills -->
  <g filter="url(#sd-rough)">
    <rect x="50" y="462" width="69" height="22" fill="url(#sd-hatch)"/>
    <rect x="50" y="550" width="64" height="22" fill="url(#sd-hatch)"/>
    <rect x="250" y="462" width="69" height="22" fill="url(#sd-hatch)"/>
    <rect x="250" y="550" width="64" height="22" fill="url(#sd-hatch)"/>
    <rect x="250" y="528" width="66" height="22" fill="url(#sd-hatch-cast)"/>
    <rect x="450" y="462" width="69" height="22" fill="url(#sd-hatch)"/>
    <rect x="450" y="550" width="64" height="22" fill="url(#sd-hatch)"/>
    <rect x="450" y="484" width="110" height="66" fill="url(#sd-hatch)" opacity="0.45"/>
  </g>
  <!-- mini frame outlines -->
  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough)">
    <path d="M 50 462 L 160 462 L 160 572 L 50 572 Z"/>
    <path d="M 50 484 L 160 484"/>
    <path d="M 50 550 L 160 550"/>
    <path d="M 250 462 L 360 462 L 360 572 L 250 572 Z"/>
    <path d="M 250 484 L 360 484"/>
    <path d="M 250 550 L 360 550"/>
    <path d="M 250 528 L 360 528"/>
    <path d="M 316 528 L 316 550"/>
    <path d="M 450 462 L 560 462 L 560 572 L 450 572 Z"/>
    <path d="M 450 484 L 560 484"/>
    <path d="M 450 550 L 560 550"/>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough2)" opacity="0.45">
    <path d="M 51 463 L 159 461 L 161 573 L 49 571 Z"/>
    <path d="M 251 463 L 359 461 L 361 573 L 249 571 Z"/>
    <path d="M 451 463 L 559 461 L 561 573 L 449 571 Z"/>
  </g>
  <!-- mini 1: idle -->
  <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" filter="url(#sd-rough)">
    <circle cx="105" cy="508" r="11"/>
    <path d="M 82 542 C 86 526, 124 526, 128 542"/>
  </g>
  <g fill="currentColor" text-anchor="middle">
    <text x="105" y="547" font-size="11.5">Shivv</text>
  </g>
  <!-- mini 2: casting -->
  <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" filter="url(#sd-rough)" opacity="0.4">
    <circle cx="305" cy="503" r="10"/>
    <path d="M 284 526 C 288 512, 322 512, 326 526"/>
  </g>
  <g fill="currentColor">
    <text x="254" y="544" font-size="12">Polymorph</text>
    <text x="356" y="544" font-size="13" font-weight="600" text-anchor="end">1.4</text>
  </g>
  <!-- mini 3: in CC -->
  <g fill="currentColor" text-anchor="middle">
    <text x="505" y="530" font-size="38" font-weight="700" fill="#ff2e2e">4</text>
    <text x="505" y="546" font-size="11.5">Polymorph</text>
  </g>
  <!-- arrows between minis -->
  <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#sd-rough2)">
    <path d="M 168 517 C 190 513, 215 520, 242 517"/>
    <path d="M 234 511 L 243 517 L 234 523"/>
    <path d="M 368 517 C 390 513, 415 520, 442 517"/>
    <path d="M 434 511 L 443 517 L 434 523"/>
  </g>
  <g fill="currentColor" font-size="14" text-anchor="middle" opacity="0.8">
    <text x="205" y="506">cast starts</text>
    <text x="405" y="506">CC lands</text>
  </g>
  <g fill="currentColor" font-size="16" text-anchor="middle">
    <text x="105" y="594">nothing going on</text>
    <text x="305" y="594">casting</text>
    <text x="505" y="594">sitting in CC</text>
  </g>
  <g fill="currentColor" font-size="15.5" opacity="0.8">
    <text x="50" y="628">priority: breakable CC (prio ≥ 7)  &gt;  active cast  &gt;  root · silence · disarm (prio 5–5.5)  &gt;  model</text>
    <text x="50" y="648">a cast bar turns red and reads "Interrupted" for a moment when you kick it</text>
  </g>
  <!-- DR tier key -->
  <g fill="currentColor" font-size="18" font-weight="600">
    <text x="610" y="478">DR tier</text>
  </g>
  <g fill="none" stroke-width="2.6" stroke-linejoin="round" filter="url(#sd-rough)">
    <path d="M 610 488 L 636 488 L 636 514 L 610 514 Z" stroke="#3fd26a"/>
    <path d="M 610 522 L 636 522 L 636 548 L 610 548 Z" stroke="#f0c23a"/>
    <path d="M 610 556 L 636 556 L 636 582 L 610 582 Z" stroke="#ff8a3d"/>
    <path d="M 610 590 L 636 590 L 636 616 L 610 616 Z" stroke="#ff3b3b"/>
  </g>
  <g fill="currentColor" font-size="15" opacity="0.85">
    <text x="646" y="506">fresh · full</text>
    <text x="646" y="540">½ duration</text>
    <text x="646" y="574">¼ duration</text>
    <text x="646" y="608">immune</text>
  </g>
</svg>
</div>

## The Tech

The whole thing is Lua, inside the WoW client. No external process, no network — the game dispatches events, you react.

- **Event-driven everything.** `COMBAT_LOG_EVENT_UNFILTERED`, `UNIT_SPELLCAST_START`, `ARENA_OPPONENT_UPDATE`. The addon is essentially a reducer over a stream of game events.
- **No targeting required.** You don't have to click an enemy to see their state — DR tracking and trinket detection run off the combat log, so the frames stay accurate for enemies you never target.
- **Click-cast rebinding** uses WoW's secure action button system — the only way to cast spells from an addon without tripping the taint system.
- **Saved variables** persist settings across sessions in a per-character Lua table the client serializes on logout.
- **Test mode** fakes a full arena with configurable opponent counts, so you can tweak layout without queueing.

## Shipping

Published on [CurseForge](https://www.curseforge.com/wow/addons/sheepdog-arena-frames). Source on [GitHub](https://github.com/frostbolt/Sheepdog). The CurseForge pipeline auto-packages tagged releases from the repo.

---

*A couple of hours. I now win more arena games. Worth it.*
