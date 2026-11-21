import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { cn } from "./cn";

export type CarouselProps = {
  slides: ReactNode[];
  label: string;
  loop?: boolean;
  className?: string;
};

const slideKey = (index: number) => `slide-${index}`;

const ARROW =
  "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow-md outline-none transition hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-0 md:inline-flex";

export function Carousel({
  slides,
  label,
  loop = false,
  className,
}: CarouselProps) {
  const [viewportRef, embla] = useEmblaCarousel({ loop });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync).on("reInit", sync);
    return () => {
      embla.off("select", sync).off("reInit", sync);
    };
  }, [embla, sync]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("relative", className)}
    >
      <div ref={viewportRef} className="overflow-hidden rounded-ui">
        <div className="flex">
          {slides.map((slide, index) => (
            // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern needs a slide group, not a fieldset
            <div
              key={slideKey(index)}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
              className="min-w-0 flex-[0_0_100%]"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Trước"
        disabled={!canPrev}
        onClick={() => embla?.scrollPrev()}
        className={cn(ARROW, "start-2")}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Sau"
        disabled={!canNext}
        onClick={() => embla?.scrollNext()}
        className={cn(ARROW, "end-2")}
      >
        <ChevronRight size={20} />
      </button>
      <div className="mt-2 flex justify-center gap-1.5">
        {slides.map((_, index) => (
          <button
            key={slideKey(index)}
            type="button"
            aria-label={`Đến trang ${index + 1}`}
            aria-current={index === selected}
            onClick={() => embla?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === selected ? "w-5 bg-primary" : "w-2 bg-border",
            )}
          />
        ))}
      </div>
    </section>
  );
}
