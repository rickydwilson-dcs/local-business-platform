'use client';

/**
 * Ports the r9 prototype's imperative `paint()` function (inline `<script>`
 * in `r9-kota-level.html`) to React state. Renders BOTH the desktop
 * two-pane tablist (`.tiers` + `.detail`) and the mobile `.tiercards` — the
 * CSS in `home-r9.css` decides which is visible via media queries, exactly
 * as the prototype does. No viewport branching in JS.
 *
 * Two art-directed behaviours preserved exactly:
 * 1. Selecting the `ecom` tier while `mode === 'monthly'` switches the mode
 *    to `'upfront'` — there is no monthly e-commerce price, so a dead N/A
 *    panel would look broken. (prototype: `if (TIERS[tier].upfrontOnly &&
 *    mode === 'monthly') mode = 'upfront';`)
 * 2. The `.detail` pane replays its `swap` CSS animation on every state
 *    change unless `prefers-reduced-motion` is set. The prototype does this
 *    by stripping and re-adding the `swap` class with a forced reflow; here
 *    a changing `key` forces React to remount the node, which restarts the
 *    CSS animation the same way.
 *
 * Trap 10 (CLAUDE.md): comma'd tier figures (£1,495, £2,995) must render in
 * Archivo (the `--f` stack), never a mono face, and never with
 * `tabular-nums`. The classes below (`.tier__f`, `.tcard__f`) are the
 * already-ported, verified CSS — no numeric font-variant styling is added
 * here.
 */

import { useEffect, useRef, useState } from 'react';
import { TIERS, type TierKey } from './home-data';

type Mode = 'monthly' | 'upfront';

function getTier(key: TierKey) {
  const tier = TIERS.find((t) => t.key === key);
  if (!tier) {
    throw new Error(`Unknown pricing tier key: ${key}`);
  }
  return tier;
}

const CHECK_PATH = 'M3 8.4 6.4 12 13 4.6';

function CheckIcon({ hidden }: { hidden?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden={hidden}>
      <path
        d={CHECK_PATH}
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pricing() {
  const [mode, setMode] = useState<Mode>('monthly');
  const [tier, setTier] = useState<TierKey>('starter');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [swapKey, setSwapKey] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    // Client-safe read of prefers-reduced-motion; SSR default is false
    // (motion armed), corrected on hydration — matches the prototype's own
    // `var reduce = matchMedia(...).matches` read at script-execution time.
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setSwapKey((k) => k + 1);
  }, [mode, tier]);

  function selectTier(key: TierKey) {
    setTier(key);
    // Behaviour 1: selecting ecom while on monthly forces upfront — there is
    // no monthly store price, so a dead N/A panel would read as broken.
    if (getTier(key).upfrontOnly && mode === 'monthly') {
      setMode('upfront');
    }
  }

  function selectMode(next: Mode) {
    setMode(next);
  }

  const activeTier = getTier(tier);
  const activeDetail = activeTier[mode];

  return (
    <>
      <div className="payhead">
        <div className="paytoggle" role="group" aria-label="How you'd like to pay">
          <button
            type="button"
            data-mode="monthly"
            aria-pressed={mode === 'monthly'}
            onClick={() => selectMode('monthly')}
          >
            Pay monthly
          </button>
          <button
            type="button"
            data-mode="upfront"
            aria-pressed={mode === 'upfront'}
            onClick={() => selectMode('upfront')}
          >
            Pay upfront
          </button>
        </div>
      </div>
      <div className="price">
        <div className="tiers" role="tablist" aria-label="Plans">
          {TIERS.map((t) => {
            const d = t[mode];
            return (
              <button
                key={t.key}
                className="tier"
                role="tab"
                aria-selected={tier === t.key}
                data-k={t.key}
                onClick={() => selectTier(t.key)}
              >
                <span>
                  <span className="tier__n">{t.name}</span>
                  <span className="tier__s">{t.subtitle}</span>
                </span>
                <span className="tier__f">
                  {d.fig}
                  <small>{d.sub}</small>
                </span>
              </button>
            );
          })}
        </div>
        <div
          key={swapKey}
          id="detail"
          role="tabpanel"
          className={reducedMotion ? 'detail' : 'detail swap'}
        >
          <div className="detail__h">{activeDetail.head}</div>
          <p className="detail__p">{activeTier.description}</p>
          <div className="detail__l">
            {activeTier.bullets.map((bullet) => (
              <div key={bullet}>
                <CheckIcon />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
          <a className="btn" href="#end">
            Get a free quote
          </a>
        </div>
        {/*
          Mobile pricing. Same TIERS data, same shared mode/tier state;
          rendered as whole cards because the desktop picker's detail pane
          lands off-screen in one column and a tap looks like it did nothing.
          The CSS hides `.tiers`/`.detail` and shows this below 901px.
        */}
        <div className="tiercards" id="tiercards">
          {TIERS.map((t) => {
            const d = t[mode];
            const rec = t.key === 'pro';
            const upOnly = t.upfrontOnly && mode === 'monthly';
            return (
              <article key={t.key} className={rec ? 'tcard tcard--rec' : 'tcard'}>
                {rec && <span className="tcard__b">Most popular</span>}
                <div className="tcard__h">
                  <span>
                    <span className="tcard__n">{t.name}</span>
                    <span className="tcard__s">{t.subtitle}</span>
                  </span>
                  <span className="tcard__f">
                    {d.fig}
                    <small>{d.sub}</small>
                  </span>
                </div>
                <p className="tcard__p">{t.description}</p>
                <ul className="tcard__l">
                  {t.bullets.map((bullet) => (
                    <li key={bullet}>
                      <CheckIcon hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {upOnly ? (
                  <button
                    type="button"
                    className="btn"
                    data-switch="upfront"
                    onClick={() => selectMode('upfront')}
                  >
                    See upfront pricing
                  </button>
                ) : (
                  <a className="btn" href="#end">
                    Get a free quote
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
