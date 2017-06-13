/**
 * Vanilla Carousel.
 * @class Carousel
 */
const Carousel = class Carousel {
  constructor(element) {
    this.dataSettings = {};
    /**
     * @private
     */
    const queryCarouselElement = (...attr) => {
      attr.unshift('data', Carousel.constrain);

      attr = attr.join('-');

      return element.querySelector(`[${attr}]`);
    };
    /**
     * @private
     */
    const queryCarouselElements = (...attr) => {
      attr.unshift('data', Carousel.constrain);

      attr = attr.join('-');

      return element.querySelectorAll(`[${attr}]`);
    };

    this.carousel = element;
    this.carouselSlides = queryCarouselElement('slides');
    this.carouselSlidesItems = queryCarouselElements('slides', 'items');
    this.carouselPrevious = queryCarouselElement('previous');
    this.carouselNext = queryCarouselElement('next');

    this.init();
  }
  /**
   * @protected
   */
  set slidesItemsCount(dataCarouselSlidesCount) {
    this.dataCarouselSlidesCount = dataCarouselSlidesCount;
  }
  /**
   * @protected
   */
  get slidesItemsCount() {
    return this.dataCarouselSlidesCount || 0;
  }
  /**
   * @protected
   */
  get slidesItemsTotal() {
    return this.carouselSlidesItems.length;
  }
  /**
   * @protected
   */
  slidesItemsNavigate(dataCarouselNavigateDirection) {
    this.disableSlidesItems(this.slidesItemsCurrent);

    this.slidesItemsCount = (this.slidesItemsCount + dataCarouselNavigateDirection);

    if(dataCarouselNavigateDirection === -1 && this.slidesItemsCount < 0) {
      this.slidesItemsCount = this.slidesItemsTotal - 1;
    }

    if(dataCarouselNavigateDirection === 1 && !this.carouselSlidesItems[this.slidesItemsCount]) {
      this.slidesItemsCount = 0;
    }

    this.enableSlidesItems(this.slidesItemsCurrent);
  }
  /**
   * @protected
   */
  disableSlidesItems(carouselSlideCurent) {
    carouselSlideCurent.classList.remove('active');
    carouselSlideCurent.classList.add('disable');

    this.carouselSlides.classList.add('disable');
    this.carouselSlides.classList.remove('active');
  }
  /**
   * @protected
   */
  enableSlidesItems(carouselSlideCurent) {
    carouselSlideCurent.classList.add('active');
    carouselSlideCurent.classList.remove('disable');

    setTimeout(() => {
      this.carouselSlides.classList.add('active');
      this.carouselSlides.classList.remove('disable');
    }, 1000);
  }
  /**
   * @protected
   */
  get slidesItemsCurrent() {
    return this.carouselSlidesItems[this.slidesItemsCount];
  }
  /**
   * @protected
   */
  slidesSize() {
    this.carouselSlides.style.width = 'auto';
    this.carouselSlides.style.height = 'auto';

    let dataCarouselSlidesWidth = this.slidesItemsCurrent.offsetWidth;
    let dataCarouselSlidesHeight = this.slidesItemsCurrent.offsetHeight;

    this.carouselSlides.style.width = dataCarouselSlidesWidth;
    this.carouselSlides.style.height = dataCarouselSlidesHeight;
  }
  /**
   * @protected
   */
  observe() {
    document.addEventListener('readystatechange', () => {
      this.slidesSize();
      this.slidesItemsNavigate(0);
    });

    window.addEventListener('resize', () => {
      this.slidesItemsNavigate(this.slidesItemsCount);

      this.carousel.style.opacity = 0;

      setTimeout(() => {
        this.slidesSize();
        this.carousel.style.opacity = 1;
      }, 1000);
    });

    this.carouselPrevious.addEventListener('click', () => {
      this.slidesItemsNavigate(-1);
    });

    this.carouselNext.addEventListener('click', () => {
      this.slidesItemsNavigate(1);
    });
  }
  /**
   * @protected
   */
  init() {
    this.observe();
  }
  /**
   * @public
   */
  static get constrain() {
    return 'carousel';
  }
  /**
   * @public
   */
  static init(elementInner = document) {
    [...elementInner.querySelectorAll(`[data-${Carousel.constrain}]`)].forEach(element => {
      new Carousel(element);
    });
  }
};

Carousel.init();
/**
 * Show download button by device system.
 */
if(/android/gi.test(navigator.userAgent)) {
  document.querySelector('[data-id=download-android]').classList.remove('hide');
  document.querySelector('[data-id=download-ios]').classList.add('hide');
} else {
  document.querySelector('[data-id=download-ios]').classList.remove('hide');
}
