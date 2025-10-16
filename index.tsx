import { useLayoutEffect, useState, type RefObject } from "react";

export const useReactTruncate = ({
  boundary,
}: {
  boundary: RefObject<HTMLElement | null>;
}) => {
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
        : 0;
      const containerRect = container.getBoundingClientRect();
      const containerRight = containerRect.right - indicatorWidth;
      const containerBottom = containerRect.bottom;

      let overflowIndex = children.length;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child) {
          continue;
        }

        const childRect = child.getBoundingClientRect();

        const overflowsRight = childRect.right > containerRight;
        const overflowsBottom = childRect.bottom > containerBottom;

        if (overflowsRight || overflowsBottom) {
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
