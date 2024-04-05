import { isMobile, isWebp, getRandomColor } from "./modules/utils.js";
import { gsap } from "gsap/all.js";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import LocomotiveScroll from "locomotive-scroll";
import Swiper from "swiper/bundle";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "swiper/css/bundle";

if (isMobile.any() || document.body.clientWidth <= 768) {
  document.body.className = "mobile";
  document.body.innerHTML = `<div>SHAME on me! i haven't done a mobile version. Sorry but the main thing is horizontalal scrolling, which i would probably turn off on mobiles anyway</div> <a href="" ><svg>
  <use xlink:href="images/icons/icons.svg#logo"></use>
</svg></a>`;
} else {
  isWebp();
  gsap.registerPlugin(ScrollTrigger);
  Fancybox.bind("[data-fancybox]", {});

  const scroller = document.querySelector("[data-scroll-container]");
  const locoScroll = new LocomotiveScroll({
    el: scroller,
    smooth: true,
    repeat: true,
    direction: "horizontal",
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
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  /////////////////////////////////////
  ////Blog section vertical scroll/////
  /////////////////////////////////////
  gsap.to(".anim-wrap", {
    scrollTrigger: {
      trigger: ".blog__list",
      start: () => {
        return "left left";
      },
      end: () => "+=" + document.querySelector(".anim-wrap").scrollHeight,
      pin: true,
      pinSpacing: true,
      scrub: true,
      horizontal: true,
      invalidateOnRefresh: true,
    },
    y: () => {
      return -(
        document.querySelector(".anim-wrap").scrollHeight - window.innerHeight
      );
    },
  });
  /////////////////////////////
  ////Blog items is inview/////
  /////////////////////////////
  function widthTillSection(sectionName) {
    const sections = document.querySelectorAll(".section");
    let sectionsWidth = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].classList.contains(sectionName)) {
        break;
      } else {
        sectionsWidth += Number(sections[i].offsetWidth);
      }
    }
    return sectionsWidth;
  }
  const blogItems = document.querySelectorAll(".blog-list__item");
  blogItems.forEach((item) => {
    const startPoint =
      widthTillSection("blog") + +item.getBoundingClientRect().y / 5;
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: () => {
          return startPoint + " top";
        },
        end: () => {
          return startPoint + item.scrollHeight * 5 + " center";
        },
        toggleClass: "is-inview",
        scrub: 3,
        duration: 0.2,
        ease: "power1.inOut",
      },
    });
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
  ///////////////
  ////Slider////
  /////////////
  const swiperProgressBackground = document.querySelector(".autoplay-progress");
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
        swiperProgressBackground.style.transition = "opacity 1s";
        swiperProgressBackground.style.background = getRandomColor();
      },
      autoplayTimeLeft(s, time, progress) {
        if (progress < 0.3) {
          swiperProgressBackground.style.transition = "opacity 0s";
          swiperProgressBackground.style.opacity = ` ${progress}`;
        } else {
          swiperProgressBackground.style.opacity = ".3";
        }
      },
    },
  });
  window.addEventListener("load", function () {
    document.querySelector(".loader").classList.add("active");
  });
}
