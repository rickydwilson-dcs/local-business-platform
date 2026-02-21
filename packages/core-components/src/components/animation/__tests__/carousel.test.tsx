import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { Carousel } from "../carousel";

// ---------------------------------------------------------------------------
// embla-carousel-react mock
// ---------------------------------------------------------------------------

const mockScrollPrev = vi.fn();
const mockScrollNext = vi.fn();
const mockScrollTo = vi.fn();
const mockOn = vi.fn();
const mockOff = vi.fn();

const mockEmblaApi = {
  scrollPrev: mockScrollPrev,
  scrollNext: mockScrollNext,
  scrollTo: mockScrollTo,
  scrollSnapList: vi.fn(() => [0, 1, 2]),
  selectedScrollSnap: vi.fn(() => 0),
  on: mockOn,
  off: mockOff,
};

vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => [vi.fn(), mockEmblaApi]),
}));

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
  vi.clearAllMocks();
  mockEmblaApi.scrollSnapList.mockReturnValue([0, 1, 2]);
  mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Carousel", () => {
  test("renders correct number of slide containers from children", () => {
    const { container } = render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );

    const slides = container.querySelectorAll('[role="group"]');
    expect(slides.length).toBe(3);
  });

  test("shows dots when showDots is true, dot count matches children count", () => {
    const { container } = render(
      <Carousel showDots={true}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );

    const dots = container.querySelectorAll('[role="tab"]');
    expect(dots.length).toBe(3);
  });

  test("shows arrows when showArrows is true", () => {
    const { getByLabelText } = render(
      <Carousel showArrows={true}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );

    expect(getByLabelText("Previous slide")).toBeDefined();
    expect(getByLabelText("Next slide")).toBeDefined();
  });

  test("auto-play is disabled by default (no interval set)", () => {
    vi.useFakeTimers();

    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );

    vi.advanceTimersByTime(10000);
    expect(mockScrollNext).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  test("when autoPlay: true, slides advance after interval", () => {
    vi.useFakeTimers();

    render(
      <Carousel autoPlay autoPlayInterval={3000}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );

    vi.advanceTimersByTime(3000);
    expect(mockScrollNext).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(3000);
    expect(mockScrollNext).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
