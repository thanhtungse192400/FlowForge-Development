import { useEffect, useState, useRef } from "react";

/**
 * useScroll hook — supports two modes:
 * 
 * 1. "snap" (default) — block-by-block snap scrolling (original behavior)
 *    Intercepts wheel events, jumps one full viewport per scroll.
 * 
 * 2. "free" — natural browser scrolling
 *    Lets the browser handle scrolling natively.
 *    Tracks which section is currently visible (via IntersectionObserver).
 *    Perfect for parallax storytelling where framer-motion useScroll tracks progress.
 * 
 * Usage:
 *   const { currentPage, setCurrentPage, containerRef } = useScroll({ mode: "free" });
 */
export default function useScroll(options = {}) {
  // Support legacy call: useScroll(1200) → { mode: "snap", cooldownMs: 1200 }
  const config = typeof options === "number"
    ? { mode: "snap", cooldownMs: options }
    : { mode: "free", cooldownMs: 1000, ...options };

  const { mode, cooldownMs } = config;

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const isScrolling = useRef(false);
  const containerRef = useRef(null);

  // Auto-detect the number of child components inside the container
  useEffect(() => {
    if (containerRef.current) {
      setTotalPages(containerRef.current.children.length);
    }
  }, []);

  // ===== MODE: SNAP (Original behavior) =====
  useEffect(() => {
    if (mode !== "snap" || totalPages <= 1) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;

      if (e.deltaY > 0) {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
      } else if (e.deltaY < 0) {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
      }

      isScrolling.current = true;
      setTimeout(() => {
        isScrolling.current = false;
      }, cooldownMs);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [mode, totalPages, cooldownMs]);

  // ===== MODE: FREE (Natural scroll + IntersectionObserver) =====
  useEffect(() => {
    if (mode !== "free" || !containerRef.current) return;

    const sections = Array.from(containerRef.current.children);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target);
            if (index !== -1) setCurrentPage(index);
          }
        });
      },
      {
        root: null, // viewport
        threshold: 0.5, // 50% visible = active
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [mode, totalPages]);

  // scrollToPage helper for free mode (smooth scroll to a section)
  const scrollToPage = (index) => {
    if (!containerRef.current) return;
    const sections = Array.from(containerRef.current.children);
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: "smooth" });
      setCurrentPage(index);
    }
  };

  return { currentPage, setCurrentPage: mode === "free" ? scrollToPage : setCurrentPage, containerRef };
}