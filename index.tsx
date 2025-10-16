import { useLayoutEffect, useState, type RefObject } from "react";

export const useTruncate = ({
  boundary,
  minBuffer,
}: {
  /**
   * The boundary that it should not flow beyond.
   *
   * @note this container must be overflow-hidden, have a defined width, and can not wrap!
   */
  boundary: RefObject<HTMLElement | null>;
  /**
   * Minimum buffer in pixels.
   *
   * We use the element that has the `data-truncate-indicator` attribute to determine how much space to leave for the overflow indicator, but if that element is removed or not present, this buffer will be used instead.
   */
  minBuffer?: number;
}): number => {
  const [overflowCount, setOverflowCount] = useState(0);

  useLayoutEffect(() => {
    if (!boundary.current) {
      return;
    }

    const container = boundary.current;

    const calculateAndApplyTruncation = () => {
      const allChildren = Array.from(container.children) as HTMLElement[];
      const children = allChildren.filter(
        (child) => !child.hasAttribute("data-truncate-indicator"),
      );

      if (children.length === 0) {
        setOverflowCount(0);
        return;
      }

      for (const child of children) {
        child.style.display = "";
      }

      container.offsetHeight; // trigger a reflow

      const overflowIndicator = allChildren.find((child) =>
        child.hasAttribute("data-truncate-indicator"),
      );
      const indicatorWidth = overflowIndicator
        ? overflowIndicator.getBoundingClientRect().width
        : (minBuffer ?? 0);
      const containerRect = container.getBoundingClientRect();
      const containerRight = containerRect.right - indicatorWidth;

      let overflowIndex = children.length;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child) {
          continue;
        }

        const childRect = child.getBoundingClientRect();
        if (childRect.right > containerRight) {
          overflowIndex = i;
          break;
        }
      }

      const newOverflowCount = children.length - overflowIndex;

      children.forEach((child, index) => {
        if (index >= overflowIndex) {
          child.style.display = "none";
          return;
        }

        child.style.display = "";
      });

      setOverflowCount(newOverflowCount);
    };

    calculateAndApplyTruncation();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        calculateAndApplyTruncation();
      });
    });

    resizeObserver.observe(container);

    const mutationObserver = new MutationObserver(calculateAndApplyTruncation); // just in case a jawn adds/removes a label? idk if this is a common case or if theres a better way to listen

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [boundary]);

  return overflowCount;
};
