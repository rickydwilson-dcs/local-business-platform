/**
 * The r9 prototype's process chapter — "A quick chat. I do the rest." — sat
 * between `#services` and `#pricing`. Ported class-name for class-name from
 * lines 947-957 of
 * `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`:
 *
 *   <div class="cornerfill cf--magenta" aria-hidden="true"></div>
 *   <section class="panel p--ink" data-ground="ink">
 *     <h2 class="res">A quick chat.<br>I do the rest.</h2>
 *     <div class="steps">
 *       <div class="step"><span class="step__r"></span><span class="step__k">01</span>
 *         <div><div class="step__t">We talk</div><p class="step__b">...</p></div></div>
 *       ...
 *     </div>
 *   </section>
 *
 * This section carries NO `id` in the prototype — confirmed above — and the
 * Phase 5 gate's required section id set (`{top, work, work-1..5, services,
 * pricing, faq, end}`) deliberately omits "process", so none is added here.
 *
 * Cornerfill/panel pairing (see `chapter-panel.tsx`'s boundary table): the
 * pane above this boundary is `#services`' `.svcstack`, which is magenta, so
 * `cornerfillColor="magenta"`; this panel itself is ink.
 */

import { ChapterPanel } from './chapter-panel';
import { STEPS } from './home-data';

export function StepsSection() {
  return (
    <ChapterPanel cornerfillColor="magenta" panelBg="ink" dataGround="ink">
      <h2 className="res">
        A quick chat.
        <br />I do the rest.
      </h2>
      <div className="steps">
        {STEPS.map((step) => (
          <div className="step" key={step.key}>
            <span className="step__r" />
            <span className="step__k">{step.key}</span>
            <div>
              <div className="step__t">{step.title}</div>
              <p className="step__b">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </ChapterPanel>
  );
}
