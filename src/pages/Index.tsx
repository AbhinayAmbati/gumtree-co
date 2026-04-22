import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroCoffee from "@/assets/hero-coffee.jpg";
import cafeInterior from "@/assets/cafe-interior.jpg";
import menuBrunch from "@/assets/menu-brunch.jpg";
import menuCoffee from "@/assets/menu-coffee.jpg";
import menuPastry from "@/assets/menu-pastry.jpg";
import storyBeans from "@/assets/story-beans.jpg";
import leafImg from "@/assets/leaf.png";
import featuredRoast from "@/assets/featured-roast.png";
import v60Img from "@/assets/v60_brewing.png";
import aeropressImg from "@/assets/aeropress_brewing.png";
import espressoImg from "@/assets/espresso_extraction.png";
import lightBeans from "@/assets/light_beans.png";
import mediumBeans from "@/assets/medium_beans.png";
import darkBeans from "@/assets/dark_beans.png";

import { X, Timer, Bean, Droplets, Flame, Camera } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const RECIPES = [
  {
    id: "v60",
    title: "The Perfect V60",
    method: "Hario V60",
    ratio: "1:16",
    time: "3:00",
    temp: "94°C",
    grind: "Medium-Fine",
    color: "#D2691E",
    image: v60Img,
    steps: [
      "Rinse filter and preheat your V60 and server.",
      "Add 15g of freshly ground coffee (medium-fine).",
      "Bloom: Pour 30g of water, stir slightly, wait 30s.",
      "First Pour: Slowly add water up to 150g in circles.",
      "Final Pour: Add remaining water up to 240g.",
      "Gently tap the V60 to settle the bed. Let it drain."
    ]
  },
  {
    id: "aeropress",
    title: "Aeropress Inverted",
    method: "Aeropress",
    ratio: "1:14",
    time: "1:30",
    temp: "85°C",
    grind: "Medium",
    color: "#8B4513",
    image: aeropressImg,
    steps: [
      "Set Aeropress in inverted position (plunger on top).",
      "Add 17g of coffee. Add 240g of water at 85°C.",
      "Stir 10 times gently to ensure all grounds are wet.",
      "Steep for 60 seconds. Place filter cap and rinse.",
      "Carefully flip onto your mug.",
      "Press slowly over 30 seconds until you hear the hiss."
    ]
  },
  {
    id: "espresso",
    title: "The Golden Shot",
    method: "Espresso Machine",
    ratio: "1:2",
    time: "0:28",
    temp: "93°C",
    grind: "Fine",
    color: "#3D2B1F",
    image: espressoImg,
    steps: [
      "Dose 18g into a clean, dry portafilter basket.",
      "Distribute evenly and tamp with consistent pressure.",
      "Purge the group head before locking in.",
      "Start the shot immediately. Aim for 36g out.",
      "Extraction should take between 25-30 seconds.",
      "Stir to incorporate the crema before drinking."
    ]
  }
];

const Index = () => {
  const root = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");
  const [activeRecipe, setActiveRecipe] = useState<typeof RECIPES[0] | null>(null);
  const [roastLevel, setRoastLevel] = useState(2); // 1: Light, 2: Medium, 3: Dark

  // Sydney clock
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-AU", {
        timeZone: "Australia/Sydney",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(t);
    };
    update();
    const id = setInterval(update, 1000 * 30);
    return () => clearInterval(id);
  }, []);

  // Custom cursor follower
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      
      // Parallax for floating elements
      gsap.to(".float-bean", {
        x: (e.clientX - window.innerWidth / 2) * 0.05,
        y: (e.clientY - window.innerHeight / 2) * 0.05,
        duration: 1,
        ease: "power2.out"
      });
      gsap.to(".float-leaf", {
        x: (e.clientX - window.innerWidth / 2) * -0.03,
        y: (e.clientY - window.innerHeight / 2) * -0.03,
        duration: 1,
        ease: "power2.out"
      });
    };
    const enter = (e: any) => {
      const type = e.target.closest("[data-cursor]")?.getAttribute("data-cursor");
      gsap.to(cursor, { scale: 2.4, opacity: 1, duration: 0.3 });
      if (type === "brew") {
        cursor.innerHTML = '<span class="text-[8px] uppercase font-bold text-white">Brew</span>';
      } else if (type === "view") {
        cursor.innerHTML = '<span class="text-[8px] uppercase font-bold text-white">View</span>';
      }
    };
    const leave = () => {
      gsap.to(cursor, { scale: 1, opacity: 0.5, duration: 0.3 });
      cursor.innerHTML = "";
    };
    window.addEventListener("mousemove", move);
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===== Nav =====
      gsap.from(".nav-item", { y: -20, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.4 });

      // Nav background appears on scroll
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: { className: "nav-scrolled", targets: "header.main-nav" },
      });

      // ===== Hero =====
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-eyebrow", { y: 30, opacity: 0, duration: 0.8, delay: 0.3 })
        .from(".hero-line", { y: 100, opacity: 0, duration: 1.2, stagger: 0.12 }, "-=0.4")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(".hero-img", { scale: 1.2, opacity: 0, duration: 1.8, ease: "power3.out" }, 0.2)
        .from(".hero-meta", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, "-=0.6");

      // Floating decorations
      gsap.to(".float-bean", { y: -20, rotation: 15, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".float-leaf", { y: -30, rotation: -10, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });

      // Hero parallax
      gsap.to(".hero-img", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-content", {
        yPercent: -15,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // ===== Reveal helpers =====
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-words").forEach((el) => {
        const words = el.innerText.split(" ");
        el.innerHTML = words
          .map((w) => `<span class="inline-block overflow-hidden align-bottom"><span class="word inline-block will-change-transform">${w}&nbsp;</span></span>`)
          .join("");
        gsap.from(el.querySelectorAll(".word"), {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-chars").forEach((el) => {
        const text = el.innerText;
        el.innerHTML = text
          .split("")
          .map((c) => `<span class="char inline-block will-change-transform">${c === " " ? "&nbsp;" : c}</span>`)
          .join("");
        gsap.from(el.querySelectorAll(".char"), {
          opacity: 0,
          y: 20,
          rotateX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // ===== Marquee with scroll-linked speed =====
      gsap.to(".marquee-track", {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: "linear",
      });

      // ===== Story image parallax =====
      gsap.to(".story-img", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: { trigger: ".story-section", start: "top bottom", end: "bottom top", scrub: 1 },
      });

      // ===== Stats counter =====
      gsap.utils.toArray<HTMLElement>(".counter").forEach((el) => {
        const target = parseInt(el.dataset.target || "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.innerText = Math.floor(obj.val).toString();
          },
        });
      });

      // ===== Menu cards =====
      gsap.from(".menu-card", {
        y: 100,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".menu-grid", start: "top 78%" },
      });

      // ===== Process pinned steps =====
      const steps = gsap.utils.toArray<HTMLElement>(".process-step");
      if (steps.length) {
        steps.forEach((step, i) => {
          gsap.from(step, {
            opacity: 0,
            y: 80,
            scale: 0.95,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 80%" },
          });
          gsap.from(step.querySelector(".process-num"), {
            scale: 0,
            rotation: -180,
            duration: 1.2,
            ease: "back.out(2)",
            scrollTrigger: { trigger: step, start: "top 80%" },
            delay: 0.2,
          });
        });
      }

      // ===== Horizontal scroll testimonials =====
      const trackEl = document.querySelector(".horiz-track") as HTMLElement | null;
      if (trackEl) {
        const distance = trackEl.scrollWidth - window.innerWidth + 100;
        gsap.to(trackEl, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: ".horiz-section",
            start: "top top",
            end: () => `+=${distance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }

      // ===== Gallery reveal =====
      gsap.from(".gallery-img", {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".gallery", start: "top 78%" },
      });

      gsap.utils.toArray<HTMLElement>(".gallery-img img").forEach((img) => {
        gsap.to(img, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // ===== Visit CTA =====
      gsap.from(".visit-divider", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: ".visit-section", start: "top 70%" },
      });

      // ===== Footer marquee word =====
      gsap.to(".footer-mark", {
        xPercent: -50,
        repeat: -1,
        duration: 25,
        ease: "linear",
      });

      // ===== Featured Roast Reveal =====
      gsap.from(".roast-img", {
        scale: 1.1,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".roast-section", start: "top 80%" },
      });

      // ===== Video section reveal with mask =====
      gsap.from(".video-frame", {
        clipPath: "inset(20% 20% 20% 20%)",
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".video-section", start: "top 75%" },
      });
      gsap.to(".video-bg-text", {
        xPercent: -25,
        ease: "none",
        scrollTrigger: { trigger: ".video-section", start: "top bottom", end: "bottom top", scrub: true },
      });

      // ===== Brew guide tabs reveal =====
      gsap.from(".brew-tab", {
        x: -40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".brew-section", start: "top 75%" },
      });

      // ===== Tilt effects for cards =====
      document.querySelectorAll<HTMLElement>(".tilt-card").forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(el, {
            rotateY: x * 10,
            rotateX: -y * 10,
            scale: 1.02,
            duration: 0.5,
            ease: "power3.out"
          });
        };
        const reset = () => gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "power3.out" });
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", reset);
      });

      // ===== Magnetic hover on .magnet =====
      document.querySelectorAll<HTMLElement>(".magnet").forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.5, ease: "power3.out" });
        };
        const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", reset);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Modal Animation
  useEffect(() => {
    if (activeRecipe) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline();
      tl.to(modalRef.current, { display: "flex", opacity: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(modalContentRef.current, 
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" },
          "-=0.2"
        )
        .from(".recipe-step", {
          x: -20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power3.out"
        }, "-=0.3")
        .from(".recipe-stat", {
          y: 20,
          opacity: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: "power3.out"
        }, "-=0.5");
    } else if (modalRef.current) {
      document.body.style.overflow = "auto";
      gsap.to(modalRef.current, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => {
        if (modalRef.current) modalRef.current.style.display = "none";
      }});
    }
  }, [activeRecipe]);

  const ROAST_DATA = [
    { name: "Light Roast", desc: "Bright, acidic, floral notes. Preserves the bean's origin character.", icon: <Droplets className="w-6 h-6" /> },
    { name: "Medium Roast", desc: "Balanced body, caramel sweetness. The classic Byron morning vibe.", icon: <Bean className="w-6 h-6" /> },
    { name: "Dark Roast", desc: "Full body, low acidity, smoky cacao notes. Bold and intense.", icon: <Flame className="w-6 h-6" /> }
  ];

  return (
    <>
      <div 
        ref={root} 
        className={`min-h-screen transition-colors duration-1000 overflow-x-hidden ${
          roastLevel === 1 ? "bg-orange-50/50" : roastLevel === 2 ? "bg-background" : "bg-stone-900"
        } ${roastLevel === 3 ? "text-cream" : "text-foreground"}`}
      >
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[300] w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-clay mix-blend-difference opacity-50 hidden md:flex items-center justify-center text-center overflow-hidden"
      />

      {/* NAV */}
      <header className="main-nav fixed top-0 inset-x-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between text-cream bg-espresso/80 backdrop-blur-md border-b border-cream/10 transition-all duration-500">
        <a href="#" data-cursor className="nav-item font-display text-xl tracking-tight">
          Gumtree<span className="text-clay">.</span>&nbsp;Co
        </a>
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.2em]">
          <a href="#story" data-cursor className="nav-item hover:text-clay transition-colors">Story</a>
          <a href="#menu" data-cursor className="nav-item hover:text-clay transition-colors">Menu</a>
          <a href="#process" data-cursor className="nav-item hover:text-clay transition-colors">Craft</a>
          <a href="#voices" data-cursor className="nav-item hover:text-clay transition-colors">Voices</a>
          <a href="#visit" data-cursor className="nav-item hover:text-clay transition-colors">Visit</a>
        </nav>
        <a href="#visit" data-cursor className="magnet nav-item text-xs uppercase tracking-[0.2em] border border-current px-4 py-2 hover:bg-cream hover:text-espresso transition-colors">
          Find Us
        </a>
      </header>

      {/* HERO */}
      <section className="hero relative h-svh min-h-[700px] w-full overflow-hidden bg-espresso text-cream grain">
        <div className="absolute inset-0">
          <img
            src={heroCoffee}
            alt="Latte art on rustic Australian cafe table with eucalyptus"
            className="hero-img w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/70 via-espresso/30 to-espresso/90" />
        </div>

        {/* Floating decorations */}
        <img src={leafImg} alt="" aria-hidden className="float-leaf absolute top-24 right-8 md:right-24 w-24 md:w-40 opacity-70 pointer-events-none" />

        <div className="hero-content relative z-10 h-full flex flex-col pt-32 pb-20 md:pb-32 px-6 md:px-12 max-w-[1600px] mx-auto">
          <p className="hero-eyebrow mt-auto text-xs uppercase tracking-[0.35em] mb-4 text-cream/80">
            Est. 2018 — Byron Bay, NSW
          </p>
          <h1 className="font-display font-light text-[13vw] sm:text-[10vw] md:text-[6.5vw] leading-[1.1] tracking-tighter">
            <span className="block overflow-hidden"><span className="hero-line block py-1">Slow</span></span>
            <span className="block overflow-hidden -mt-2 md:-mt-4"><span className="hero-line block italic font-normal text-clay py-1">mornings,</span></span>
            <span className="block overflow-hidden -mt-2 md:-mt-4"><span className="hero-line block py-1">strong coffee.</span></span>
          </h1>
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="hero-sub max-w-md text-base md:text-lg text-cream/85 font-light leading-relaxed">
              A sun-soaked corner of the Northern Rivers serving single-origin espresso, sourdough toasties and very little hurry.
            </p>
            <div className="flex gap-4">
              <a href="#menu" data-cursor className="hero-cta inline-flex items-center gap-2 bg-cream text-espresso px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-clay hover:text-cream transition-colors">
                See the Menu →
              </a>
              <a href="#visit" data-cursor className="hero-cta inline-flex items-center gap-2 border border-cream/60 px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-cream/10 transition-colors">
                Visit
              </a>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-cream/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs uppercase tracking-[0.2em] text-cream/70">
            <div className="hero-meta">
              <span className="block text-cream font-display text-2xl normal-case tracking-normal mb-1">{time || "07:00"}</span>
              Sydney now
            </div>
            <div className="hero-meta"><span className="block text-cream font-display text-2xl normal-case tracking-normal mb-1">28°</span>Sun's out</div>
            <div className="hero-meta"><span className="block text-cream font-display text-2xl normal-case tracking-normal mb-1">100%</span>Single origin</div>
            <div className="hero-meta"><span className="block text-cream font-display text-2xl normal-case tracking-normal mb-1">∞</span>Good vibes</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-cream text-espresso border-y border-espresso/10 overflow-hidden py-6">
        <div className="flex marquee-track whitespace-nowrap w-max">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {["Single Origin", "Slow Brunch", "Sourdough Daily", "Oat • Almond • Soy", "Byron Bay", "Specialty Roasts"].map((t) => (
                <span key={t} className="font-display italic text-5xl md:text-7xl px-10 flex items-center gap-10">
                  {t}
                  <span className="text-clay">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* INTRO TEXT */}
      <section className="bg-cream text-espresso pt-32 md:pt-48 pb-12 md:pb-16 px-6 md:px-12 grain">
        <div className="max-w-5xl mx-auto">
          <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-10">A note from the bar</p>
          <p className="reveal-words font-display font-light text-3xl md:text-5xl leading-[1.2] text-balance">
            We believe a good coffee is half ritual, half conversation. Pull up a stool, take the long way through your morning, and let the day arrive on its own time.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="story-section relative bg-cream pt-12 md:pt-16 pb-24 md:pb-40 px-6 md:px-12 grain">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 relative h-[500px] md:h-[680px] overflow-hidden">
            <img
              src={storyBeans}
              alt="Barista pouring milk over espresso surrounded by coffee beans"
              loading="lazy"
              className="story-img absolute inset-0 w-full h-[120%] object-cover"
            />
          </div>
          <div className="md:col-span-7 md:pl-10">
            <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-6">Our Story</p>
            <h2 className="reveal-words font-display font-light text-5xl md:text-7xl leading-[1.02] mb-8 text-balance">
              Coffee roasted on the headland, poured by hands that surf at dawn.
            </h2>
            <p className="reveal text-lg leading-relaxed text-muted-foreground max-w-xl mb-6">
              Gumtree & Co was born under a fig tree in 2018 — a small bar built from reclaimed jetty timber, a stubborn La Marzocco, and a belief that coffee should taste like the place it came from.
            </p>
            <p className="reveal text-lg leading-relaxed text-muted-foreground max-w-xl">
              We work directly with growers in the Atherton Tablelands and Papua New Guinea, roasting weekly in small batches so every cup still hums with origin.
            </p>
            <div className="reveal mt-12 grid grid-cols-3 gap-8 max-w-md">
              <div>
                <p className="font-display text-5xl text-clay"><span className="counter" data-target="7">0</span></p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Years pouring</p>
              </div>
              <div>
                <p className="font-display text-5xl text-clay"><span className="counter" data-target="12">0</span></p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Origins poured</p>
              </div>
              <div>
                <p className="font-display text-5xl text-clay"><span className="counter" data-target="320">0</span>k</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Cups served</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="bg-espresso text-cream py-24 md:py-40 px-6 md:px-12 grain">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-6">The Menu</p>
              <h2 className="reveal-words font-display font-light text-5xl md:text-7xl leading-[1.02] max-w-3xl text-balance">
                A short list, made <span className="italic text-clay">properly.</span>
              </h2>
            </div>
            <p className="reveal text-cream/70 max-w-sm">
              Changing with the seasons and whatever the farmers down the road drop off that morning.
            </p>
          </div>

          <div className="menu-grid grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { img: menuCoffee, tag: "Espresso Bar", title: "Flat White", desc: "House blend, double shot, silky textured milk.", price: "5.50" },
              { img: menuBrunch, tag: "All Day", title: "Smashed Avo", title2: "+ Poached Egg", desc: "Sourdough, lemon, chilli flakes, microherbs.", price: "22" },
              { img: menuPastry, tag: "Bakery", title: "Banana Bread", desc: "Stone-milled flour, browned butter, sea salt.", price: "8" },
            ].map((m, i) => (
              <article key={i} data-cursor="view" className="menu-card tilt-card group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                  <img
                    src={m.img}
                    alt={m.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/20 transition-colors duration-500" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-clay mb-3">{m.tag}</p>
                <div className="flex justify-between items-baseline gap-4 mb-3">
                  <h3 className="font-display text-3xl font-light leading-tight">
                    {m.title}{m.title2 && <span className="block italic text-clay text-2xl">{m.title2}</span>}
                  </h3>
                  <span className="font-display text-xl text-cream/80">${m.price}</span>
                </div>
                <p className="text-cream/60 text-sm leading-relaxed max-w-xs">{m.desc}</p>
              </article>
            ))}
          </div>

          <div className="reveal mt-20 text-center">
            <a href="#" data-cursor className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] border-b border-cream/40 pb-1 hover:border-clay hover:text-clay transition-colors">
              View the full menu →
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-cream text-espresso py-24 md:py-40 px-6 md:px-12 grain">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24">
            <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-6">The Craft</p>
            <h2 className="reveal-words font-display font-light text-5xl md:text-7xl leading-[1.02] max-w-3xl mx-auto text-balance">
              From green bean to your cup.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-12 md:gap-8">
            {[
              { n: "01", t: "Source", d: "Direct trade with growers in the Atherton Tablelands and PNG highlands." },
              { n: "02", t: "Roast", d: "Small weekly batches on our 12kg drum, profiled to highlight origin." },
              { n: "03", t: "Rest", d: "Beans rest for 7 days to develop complexity and degas naturally." },
              { n: "04", t: "Pour", d: "Pulled by baristas who know the blend by feel, not by timer." },
            ].map((s) => (
              <div key={s.n} className="process-step text-center md:text-left">
                <div className="process-num font-display text-7xl text-clay/30 mb-4">{s.n}</div>
                <h3 className="font-display text-2xl mb-3">{s.t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL TESTIMONIALS */}
      <section id="voices" className="horiz-section relative bg-espresso text-cream h-screen overflow-hidden grain">
        <div className="absolute top-12 left-6 md:left-12 z-10">
          <p className="text-xs uppercase tracking-[0.35em] text-clay mb-2">Voices</p>
          <p className="font-display text-2xl md:text-3xl">What people say</p>
        </div>
        <div className="horiz-track absolute top-0 left-0 h-full flex items-center gap-8 md:gap-16 pl-[80vw] pr-32 will-change-transform">
          {[
            { q: "Best flat white I've had outside of Melbourne. The room hums.", a: "Hannah · Sydney" },
            { q: "We come every Saturday. The banana bread is dangerous.", a: "Marcus · Local" },
            { q: "Stumbled in on a road trip and stayed for three hours.", a: "Lina · Berlin" },
            { q: "That sage-coloured corner booth is my entire personality now.", a: "Tom · Brisbane" },
            { q: "Coffee tastes like it was grown by people who care. Because it was.", a: "Aroha · Auckland" },
          ].map((v, i) => (
            <figure key={i} className="shrink-0 w-[80vw] md:w-[42vw] border-l-2 border-clay pl-8 md:pl-12">
              <blockquote className="font-display font-light text-3xl md:text-5xl leading-[1.15] mb-8 text-balance italic">
                "{v.q}"
              </blockquote>
              <figcaption className="text-xs uppercase tracking-[0.3em] text-cream/60">— {v.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery bg-sand py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <p className="reveal text-xs uppercase tracking-[0.35em] text-clay">Inside the shop</p>
            <p className="reveal text-xs uppercase tracking-[0.2em] text-muted-foreground">@gumtreeandco</p>
          </div>
          <div className="grid grid-cols-12 gap-3 md:gap-5">
            <div className="gallery-img col-span-12 md:col-span-7 aspect-[16/10] overflow-hidden">
              <img src={cafeInterior} alt="Warm Australian cafe interior at golden hour" loading="lazy" className="w-full h-[120%] object-cover" />
            </div>
            <div className="gallery-img col-span-6 md:col-span-5 aspect-[4/5] overflow-hidden">
              <img src={menuCoffee} alt="Flat white with latte art" loading="lazy" className="w-full h-[120%] object-cover" />
            </div>
            
            {/* New Brewing Images */}
            <div className="gallery-img col-span-6 md:col-span-4 aspect-square overflow-hidden">
              <img src={v60Img} alt="V60 Pour Over" loading="lazy" className="w-full h-[120%] object-cover" />
            </div>
            <div className="gallery-img col-span-6 md:col-span-4 aspect-square overflow-hidden">
              <img src={aeropressImg} alt="Aeropress Brewing" loading="lazy" className="w-full h-[120%] object-cover" />
            </div>
            <div className="gallery-img col-span-12 md:col-span-4 aspect-square overflow-hidden">
              <img src={espressoImg} alt="Espresso Extraction" loading="lazy" className="w-full h-[120%] object-cover" />
            </div>

            <div className="gallery-img col-span-6 md:col-span-5 aspect-[4/5] overflow-hidden">
              <img src={menuPastry} alt="Fresh croissants and banana bread" loading="lazy" className="w-full h-[120%] object-cover" />
            </div>
            <div className="gallery-img col-span-6 md:col-span-7 aspect-[16/10] overflow-hidden">
              <img src={menuBrunch} alt="Smashed avo on sourdough" loading="lazy" className="w-full h-[120%] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-cream text-espresso py-24 md:py-32 px-6 md:px-12 grain">
        <div className="max-w-[1400px] mx-auto">
          <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-6">What's on</p>
          <h2 className="reveal-words font-display font-light text-4xl md:text-6xl mb-16 text-balance">
            More than coffee.
          </h2>
          <div className="divide-y divide-espresso/10 border-y border-espresso/10">
            {[
              { d: "Every Sat", t: "Cupping Sessions", p: "Taste this week's roast with our head roaster.", time: "9:00 am" },
              { d: "1st Sun", t: "Latte Art Throwdown", p: "Local baristas, free entry, real prizes.", time: "2:00 pm" },
              { d: "Wed Nights", t: "Vinyl & Filter", p: "Slow filter pours, dim lights, friends' records.", time: "6:30 pm" },
            ].map((ev) => (
              <div key={ev.t} data-cursor className="reveal flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 group cursor-pointer">
                <div className="flex items-baseline gap-6 md:gap-12">
                  <span className="text-xs uppercase tracking-[0.3em] text-clay w-24 shrink-0">{ev.d}</span>
                  <div>
                    <h3 className="font-display text-3xl md:text-5xl font-light group-hover:italic group-hover:text-clay transition-all duration-500">{ev.t}</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">{ev.p}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className="font-display text-xl">{ev.time}</span>
                  <span className="w-10 h-10 rounded-full border border-espresso/20 flex items-center justify-center group-hover:bg-clay group-hover:text-cream group-hover:border-clay transition-all duration-500">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ROAST */}
      <section className="roast-section bg-espresso text-cream py-24 md:py-40 px-6 md:px-12 grain overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
              <img 
                src={featuredRoast} 
                alt="Signature Byron Blend Coffee Beans" 
                className="roast-img w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-clay/20 backdrop-blur-3xl -z-10 rounded-full" />
          </div>
          <div className="order-1 md:order-2">
            <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-6">Small Batch Roastery</p>
            <h2 className="reveal-words font-display font-light text-5xl md:text-7xl leading-[1.02] mb-8 text-balance">
              The Byron Blend. <span className="italic text-clay">Roasted at dawn.</span>
            </h2>
            <p className="reveal text-lg text-cream/70 leading-relaxed mb-10 max-w-md">
              Our signature seasonal blend, developed for the slow mornings of the Northern Rivers. Smooth enough for a flat white, bold enough for a long black.
            </p>
            <div className="reveal grid grid-cols-2 gap-8 mb-12 border-y border-cream/10 py-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-clay mb-2">Tasting Notes</p>
                <p className="font-display text-2xl">Caramel & Macadamia</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-clay mb-2">Origin</p>
                <p className="font-display text-2xl">PNG & Australia</p>
              </div>
            </div>
            <a href="#" data-cursor className="magnet inline-flex items-center gap-4 bg-cream text-espresso px-8 py-4 text-sm uppercase tracking-[0.25em] hover:bg-clay hover:text-cream transition-colors duration-500">
              Buy the bag
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* BREW GUIDE */}
      <section className="brew-section bg-cream text-espresso py-24 md:py-40 px-6 md:px-12 grain">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-6">Brew at home</p>
            <h2 className="reveal-words font-display font-light text-5xl md:text-7xl leading-[1.02] max-w-3xl mx-auto text-balance">
              A few notes from our barista.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {[
              { tag: "V60", t: "Pour Over", ratio: "1 : 16", time: "3:00", note: "Bloom 30g of water for 30 seconds. Then pour in slow concentric circles." },
              { tag: "Aeropress", t: "Inverted", ratio: "1 : 14", time: "1:30", note: "Steep for 60s, swirl, press gently for 30s. Drink it hot, drink it slow." },
              { tag: "Espresso", t: "Double Shot", ratio: "1 : 2", time: "0:28", note: "18g in, 36g out. Pull until the stream goes from honey to silk." },
            ].map((b, i) => (
              <article 
                key={i} 
                data-cursor="brew" 
                onClick={() => setActiveRecipe(RECIPES[i])}
                className="brew-tab tilt-card magnet group p-8 border border-espresso/10 bg-cream hover:bg-espresso hover:text-cream transition-colors duration-700 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-clay">{b.tag}</span>
                  <span className="font-display text-xl">0{i + 1}</span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-light mb-8">{b.t}</h3>
                <div className="flex gap-8 mb-6 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Ratio</p>
                    <p className="font-display text-2xl mt-1">{b.ratio}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Time</p>
                    <p className="font-display text-2xl mt-1">{b.time}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed opacity-75">{b.note}</p>
                <div className="mt-8 pt-6 border-t border-current/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em]">Read recipe</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section id="visit" className="visit-section relative bg-gradient-sunset text-espresso py-24 md:py-40 px-6 md:px-12 overflow-hidden grain">
        <div className="visit-divider absolute top-0 left-0 right-0 h-px bg-espresso/30" />
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="reveal text-xs uppercase tracking-[0.35em] mb-6">Come Say G'day</p>
            <h2 className="reveal-words font-display font-light text-5xl md:text-7xl leading-[1.02] mb-10 text-balance">
              We've saved a seat by the window.
            </h2>
            <a href="#" data-cursor className="reveal inline-block bg-espresso text-cream px-8 py-4 text-sm uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors">
              Book a table →
            </a>
          </div>
          <div className="reveal space-y-10 font-body">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-3 opacity-70">Find us</p>
              <p className="font-display text-3xl font-light leading-snug">
                42 Jonson Street<br />
                Byron Bay, NSW 2481
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-3 opacity-70">Hours</p>
              <div className="font-display text-2xl font-light space-y-1">
                <p>Mon – Fri <span className="opacity-60">·</span> 6:30am – 3pm</p>
                <p>Sat – Sun <span className="opacity-60">·</span> 7am – 3pm</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-3 opacity-70">Say hello</p>
              <p className="font-display text-2xl font-light">hello@gumtreeandco.com.au</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROAST SELECTOR */}
      <section className="bg-espresso text-cream py-24 md:py-40 px-6 md:px-12 grain overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="reveal text-xs uppercase tracking-[0.35em] text-clay mb-6">Interactive Roastery</p>
              <h2 className="reveal-words font-display font-light text-5xl md:text-7xl leading-[1.02] mb-10 text-balance">
                Find your <span className="italic text-clay">vibe.</span>
              </h2>
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-cream/5 p-8 rounded-lg border border-cream/10">
                  <div className="flex gap-4">
                    {ROAST_DATA[roastLevel - 1].icon}
                    <div>
                      <h4 className="font-display text-2xl">{ROAST_DATA[roastLevel - 1].name}</h4>
                      <p className="text-cream/60 text-sm mt-1">{ROAST_DATA[roastLevel - 1].desc}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-clay font-bold">
                    <span>Light</span>
                    <span>Medium</span>
                    <span>Dark</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="1" 
                    value={roastLevel} 
                    onChange={(e) => setRoastLevel(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-cream/20 rounded-lg appearance-none cursor-pointer accent-clay"
                  />
                </div>

                <button 
                  onClick={() => setActiveRecipe(RECIPES[roastLevel - 1])}
                  className="w-full py-4 border border-clay text-clay hover:bg-clay hover:text-cream transition-all duration-500 uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-3"
                >
                  View {ROAST_DATA[roastLevel - 1].name} Recipe
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
            
            <div className="relative aspect-square flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full blur-[120px] transition-colors duration-1000 ${
                roastLevel === 1 ? "bg-orange-300/20" : roastLevel === 2 ? "bg-clay/30" : "bg-brown-900/40"
              }`} />
              
              <div className="relative z-10 text-center space-y-6">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-clay/30 shadow-2xl transition-transform duration-1000 hover:scale-105">
                  <img 
                    src={roastLevel === 1 ? lightBeans : roastLevel === 2 ? mediumBeans : darkBeans} 
                    alt="Coffee beans" 
                    className="w-full h-full object-cover transition-opacity duration-700"
                  />
                </div>
                <p className="font-display text-3xl italic text-clay">
                  {roastLevel === 1 ? "Fruit Forward" : roastLevel === 2 ? "Perfectly Balanced" : "Deep & Bold"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-espresso text-cream/70 pt-20 pb-12 px-6 md:px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="overflow-hidden mb-16 border-y border-cream/10 py-8">
            <div className="footer-mark flex whitespace-nowrap w-max">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex shrink-0">
                  {["Gumtree & Co", "✦", "Byron Bay", "✦", "Since 2018", "✦", "Made Slow", "✦"].map((t, j) => (
                    <span key={j} className="font-display text-6xl md:text-9xl px-8 text-cream/90 italic font-light">{t}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs uppercase tracking-[0.25em]">
            <p className="font-display text-2xl text-cream normal-case tracking-tight">Gumtree<span className="text-clay">.</span>&nbsp;Co</p>
            <p>© {new Date().getFullYear()} — Made with flat whites in Byron Bay</p>
            <div className="flex gap-6">
              <a href="#" data-cursor className="hover:text-clay transition-colors">Instagram</a>
              <a href="#" data-cursor className="hover:text-clay transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .main-nav.nav-scrolled {
          background-color: hsl(var(--espresso) / 0.85);
          backdrop-filter: blur(12px);
          padding-top: 0.875rem;
          padding-bottom: 0.875rem;
          border-bottom: 1px solid hsl(var(--cream) / 0.08);
        }
      `}</style>
    </div>

      {/* RECIPE MODAL */}
      <div 
        ref={modalRef}
        className="fixed inset-0 z-[200] hidden items-center justify-center p-4 md:p-12 bg-espresso/95 backdrop-blur-xl"
        onClick={() => setActiveRecipe(null)}
      >
        <div 
          ref={modalContentRef}
          className="relative w-full max-w-5xl bg-cream text-espresso overflow-hidden shadow-2xl rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setActiveRecipe(null)}
            className="absolute top-6 right-6 p-2 hover:bg-espresso/5 rounded-full transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-espresso/10">
              <p className="text-xs uppercase tracking-[0.3em] text-clay mb-4">Brew Guide</p>
              <h2 className="font-display text-5xl md:text-7xl font-light mb-8 leading-[1.1]">
                {activeRecipe?.title}
              </h2>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="recipe-stat">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Ratio</p>
                  <p className="font-display text-2xl">{activeRecipe?.ratio}</p>
                </div>
                <div className="recipe-stat">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Time</p>
                  <div className="flex items-center gap-2 font-display text-2xl">
                    <Timer className="w-5 h-5 text-clay" />
                    {activeRecipe?.time}
                  </div>
                </div>
                <div className="recipe-stat">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Temp</p>
                  <p className="font-display text-2xl">{activeRecipe?.temp}</p>
                </div>
                <div className="recipe-stat">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Grind</p>
                  <p className="font-display text-2xl">{activeRecipe?.grind}</p>
                </div>
              </div>

              <div className="p-6 bg-espresso text-cream rounded-sm flex items-center justify-between group cursor-pointer hover:bg-clay transition-colors duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Barista Assist</p>
                    <p className="font-display text-lg">Start Brew Timer</p>
                  </div>
                </div>
                <span className="text-xl">→</span>
              </div>
            </div>

            <div className="p-8 md:p-16 bg-sand/30">
              <h3 className="font-display text-2xl mb-8 border-b border-espresso/10 pb-4">Method</h3>
              <div className="space-y-6">
                {activeRecipe?.steps.map((step, i) => (
                  <div key={i} className="recipe-step flex gap-6">
                    <span className="font-display text-xl text-clay opacity-40 shrink-0">0{i + 1}</span>
                    <p className="text-sm leading-relaxed text-espresso/80">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-espresso/10 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-cream bg-espresso/10" />
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  128 people brewed this today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
