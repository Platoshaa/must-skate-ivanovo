import { isMobile, isWebp } from "./modules/utils.js";
import { gsap } from "gsap/all.js";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import LocomotiveScroll from "locomotive-scroll";
import Swiper from "swiper/bundle";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
// import styles bundle
import "swiper/css/bundle";
isWebp();
gsap.registerPlugin(ScrollTrigger);
Fancybox.bind("[data-fancybox]", {});
if (isMobile.any() || document.body.clientWidth <= 768) {
  document.body.className = "mobile";
  document.body.innerHTML = `<div>SHAME on me! i haven't done a mobile version. Sorry but the main thing is horizontalal scrolling, which i would probably turn off on mobiles anyway</div> <a href="" ><svg>
  <use xlink:href="images/icons/icons.svg#logo"></use>
</svg></a>`;
} else {
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  let bg = document.querySelector(".autoplay-progress");
  const swiper = new Swiper(".front-slider", {
    speed: 2400,
    direction: "vertical",
    autoplay: {
      delay: 4500,
    },
    loop: true,
    watchSlidesProgress: true,
    parallax: {
      enable: true,
    },
    on: {
      slideChange() {
        bg.style.transition = "opacity 1s";
        bg.style.background = getRandomColor();
      },
      autoplayTimeLeft(s, time, progress) {
        if (progress < 0.3) {
          bg.style.transition = "opacity 0s";
          bg.style.opacity = ` ${progress}`;
        } else {
          bg.style.opacity = ".3";
        }
      },
    },
  });

  const scroller = document.querySelector("[data-scroll-container]");
  const locoScroll = new LocomotiveScroll({
    el: scroller,
    smooth: true,
    repeat: true,
    direction: "horizontal",
    smartphone: {
      smooth: true,
      direction: "horizontal",
    },
    tablet: {
      smooth: true,
      direction: "horizontal",
    },
  });
  locoScroll.on("scroll", () => {
    ScrollTrigger.update();
    const secIn = document.querySelectorAll(".section.is-inview");
    const last = secIn[secIn.length - 1];
    const header = document.querySelector(".header");
    const color = window
      .getComputedStyle(last, null)
      .getPropertyValue("background-color");
    header.style.setProperty("--main-color", color);
  });
  ScrollTrigger.scrollerProxy(scroller, {
    scrollLeft(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.x;
    },
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.x;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: scroller.style.transform ? "transform" : "fixed",
  });
  ScrollTrigger.defaults({
    scroller: scroller,
  });
  gsap.to(".anim-wrap", {
    scrollTrigger: {
      trigger: ".blog__list",
      start: () => {
        return "left left";
      },
      end: () =>
        "+=" + document.querySelector(".anim-wrap").scrollHeight,
      pin: true,
      pinSpacing: true,
      // anticipatePin: 1,
      scrub: true,
      horizontal: true,
      invalidateOnRefresh: true,
      // markers: true,
      // onEnter: ({ progress, direction, isActive }) => {
      //   console.log(progress, direction, isActive);
      // },
    },
    y: () => {
      return -(
        document.querySelector(".anim-wrap").scrollHeight -
        window.innerHeight
      );
    },
    // ease: "none",
  });
  const s = document.querySelectorAll(".section");
  let width = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i].classList.contains("blog")) {
      break;
    } else {
      width += Number(s[i].offsetWidth);
    }
  }

  const ar = document.querySelectorAll(".blog-list__item");
  ar.forEach((e) => {
    const startPoint = width + +e.getBoundingClientRect().y / 5;
    gsap.to(e, {
      scrollTrigger: {
        trigger: e,
        start: () => {
          return startPoint + " top";
        },
        end: () => {
          return startPoint + e.scrollHeight * 5 + " center";
        },
        toggleClass: "red",
        scrub: 3,
        duration: 0.2,
        ease: "power1.inOut",
      },
    });
  });

  ScrollTrigger.addEventListener("refresh", () =>
    locoScroll.update()
  );
  ScrollTrigger.refresh();
  window.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".loader").classList.add("active");
  });
}
