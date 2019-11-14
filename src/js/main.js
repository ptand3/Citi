import '../scss/main.scss';
import Swiper from 'swiper';

//////////////////////////////////////////
// Zip Selector
//////////////////////////////////////////
import zipSelectorInit from '../components/zip_selector/zip_selector.js';
zipSelectorInit();

const delay = ms => new Promise(_ => setTimeout(_, ms));
let selectedOffer;
// On Scroll event 
window.onscroll = () => {
    //sticky nav 
    let stickyElement = document.querySelector(".sticky-bar");
    if (stickyElement) {
        let className = "sticky-visible";
        let height = parseInt(document.querySelector(".get-started .stickyTrigger").offsetHeight);
        // if (window.pageYOffset == 529);
        if (window.pageYOffset > getOffsetTop(document.querySelector(".get-started .stickyTrigger")) + height) {
            if (!stickyElement.classList.contains(className)) {
                stickyElement.classList.add(className);
                stickyElement.setAttribute("aria-hidden", false);
            }
        } else {
            if (stickyElement.classList.contains(className)) {
                stickyElement.classList.remove(className);
                stickyElement.setAttribute("aria-hidden", true);
            }
        }
    }
    //sticky nav end
    // Lazy load if section doesn't exist
    let backToTop = document.querySelector(".back-to-top");

    //back to top
    if (backToTop) {
        if (window.pageYOffset > document.querySelector("footer").offsetTop - window.innerHeight + 75) {
            delay(40).then(() => backToTop.style.display = "block");
            requestAnimationFrame(() => backToTop.style.opacity = 1);
        } else {
            requestAnimationFrame(() => backToTop.style.opacity = 0);
            delay(50).then(() => backToTop.style.display = "none"); // ask for animation cases
        }
        backToTop.addEventListener("click", function (e) {
            e.preventDefault();
            window.scroll({
                top: 0,
                behavior: "smooth"
            });
            focusOnEndScrolling(document.getElementById("top_of_page"));
        });
    }
    //back to top end

    //////////////////////////////////////////
    // Focus on end of smooth scrolling
    //////////////////////////////////////////
    function focusOnEndScrolling(elem) {
        var timer = setTimer();
        
        // Listen for scroll events
        const scrollListener = () => {
            window.clearTimeout(timer);
            timer = setTimer();
        };
        window.addEventListener('scroll', scrollListener);

        // Set timer and define callback
        function setTimer () {
            return setTimeout(() => {
                window.removeEventListener("scroll", scrollListener);
                elem.focus();
                if (document.activeElement !== elem) {
                    elem.setAttribute('tabindex', '-1');
                    elem.focus();
                }
            }, 200);
        }
        
        // For protection in case users tries to scrolls while autoscrolling is performed
        delay(1000).then(() => {
            window.removeEventListener("scroll", scrollListener)
        });
    }
}
//end of on scroll event




// Function to get Query String.
var getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Get Channel Query values.
var getChannelQueryValue = (obj, PSlinkString) => {
    let channelQuery = getParameterByName("channel");
    let channelLink = obj[channelQuery];
    channelLink = (!!channelLink) ? channelLink : PSlinkString;
    return channelLink;
}


//sticky nav function getOffsetTop

//uncommented

let getOffsetTop = elem => {
    let offsetTop = 0;
    if (elem) {
        do {
            if (!isNaN(elem.offsetTop)) { offsetTop += elem.offsetTop; }
        } while (elem = elem.offsetParent);
    }

    return offsetTop;
}
//end sticky nav function getOffsetTop 



function smoothScrolling() {
    var deepLinks = document.querySelectorAll("a[href^='#']");
    for (var i = 0; i < deepLinks.length; i++) {
        if (deepLinks[i].getAttribute("href") !== "#" && deepLinks[i].getAttribute("href") !== "#0") {

            deepLinks[i].addEventListener("click", function (event) {
                var currentLink = event.target;
                if (location.pathname.replace(/^\//, '') == currentLink.pathname.replace(/^\//, '') && location.hostname == currentLink.hostname) {
                    var currentHash = hash(currentLink);
                    // Figure out element to scroll to
                    var target = document.getElementById(currentHash);
                    target = target != null ? target : document.getElementById('[name=' + currentHash + ']');
                    // Does a scroll target exist?
                    if (target != null) {
                        // Only prevent default if animation is actually gonna happen
                        if (event.preventDefault) {
                            event.preventDefault()
                        }
                        else {
                            event.returnValue = false
                        }
                        scrollToElement(target, 160);
                    }
                }
            });
        }
    }
}

function hash(anchor) {
    var href = anchor.getAttribute("href");
    if (href[0] != "#") return "";
    return href.substring(1);
}

function scrollToElement(target, fromTop) {
    var Ycoord = getElementOffset(target);
    // var i = document.documentElement.scrollTop;
    var i = window.pageYOffset;
    var int = setInterval(function () {
        window.scrollTo(0, i);
        i += 20;
        if (i >= Ycoord - fromTop) {
            target.focus();
            if (document.activeElement != target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
            clearInterval(int);
        }
    }, 10);
}

function getElementOffset(el) {
    let top = 0;
    let element = el;

    // Loop through the DOM tree
    // and add it's parent's offset to get page offset
    do {
        top += element.offsetTop || 0;
        element = element.offsetParent;
    } while (element);
    return top;
}

//END OF SMOOTH SCROOLING JAVASCRIPT


///////////////////////////////////////
// Modal Object
///////////////////////////////////////
const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);


if (window.innerWidth < 1024) {
    var buttonContainer = document.querySelectorAll('.citi-btn');
    if (buttonContainer) {
        for (var i = 0; i < buttonContainer.length; i++) {
            buttonContainer[i].classList.add('touch-device');
        }
    }
}

class Modal {
    constructor(dialogNode) {
        this.dialogNode = dialogNode;
        this.closeNode = this.dialogNode.querySelector('.close-dialog');
        this.cancelNode = this.dialogNode.querySelector('.cancel');
        this.printNode = this.dialogNode.querySelector('.print');
        this.radioNodes = this.dialogNode.querySelectorAll('.radio_btn');
        this.triggerNodes = document.querySelectorAll('.' + this.dialogNode.getAttribute('data-class'));
        this.inputNodes = Array.prototype.slice.call(dialogNode.querySelectorAll('select:not([disabled]), input:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], area[href], iframe, object, embed, *[tabindex], *[contenteditable]'));
        this.lastFocusNode;
        this.submitNode = this.dialogNode.querySelector('.submit');
        this.windowScroll = { x: 0, y: 0 };
        this.keysMap = Object.freeze({
            'tab': 9,
            'escape': 27
        });

        for (const i of this.triggerNodes) {
            i.addEventListener('click', this.handleClick_triggerNodes.bind(this));
        }

        this.dialogNode.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.dialogNode.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick_triggerNodes(event) {
        event.preventDefault();
        let classNames = event.target.className;
        if (typeof classNames === "string" && classNames.indexOf("applyNow") != -1) {
            if (selectedOffer == "200") {
                return;
            }
        }
        this.lastFocusNode = event.currentTarget;
        if (!iOS) {
            document.querySelector('html').classList.add('dialog-no-scrolling');
            document.querySelector('body').classList.add('dialog-no-scrolling');
        } else {
            this.windowScroll.x = window.pageXOffset;
            this.windowScroll.y = window.pageYOffset;
            document.querySelector('html').classList.add('dialog-no-scrolling-iOS');
            document.querySelector('body').classList.add('dialog-no-scrolling-iOS');
            document.querySelector('body').style.top = '-' + this.windowScroll.y + 'px';
        }
        this.dialogNode.classList.remove('hidden');
        const firstInput = this.getVisibleInputs()[0];
        if (firstInput) {
            this.closeNode.focus();
            // firstInput.focus();
        } else {
            this.closeNode.focus();
        }

        if (this.continueNode) {
            this.continueNode.href = event.currentTarget.href;
        }
    }

    closeDialog() {
        if (!iOS) {
            document.querySelector('html').classList.remove('dialog-no-scrolling');
            document.querySelector('body').classList.remove('dialog-no-scrolling');
        } else {
            document.querySelector('html').classList.remove('dialog-no-scrolling-iOS');
            document.querySelector('body').classList.remove('dialog-no-scrolling-iOS');
            document.querySelector('body').style.top = '';
            window.scrollTo(this.windowScroll.y, this.windowScroll.y);
        }
        this.dialogNode.classList.add('hidden');
        this.lastFocusNode.focus();
    }

    handleClick(event) {
        switch (true) {
            case (event.target === this.closeNode):
                this.closeDialog();
                break;
            // case (event.target === this.dialogNode):
            //     this.closeDialog();
            //     break;
            case (event.target === this.cancelNode):
                this.closeDialog();
                break;
            case (event.target === this.printNode):
                this.print();
                break;
            case (event.target.tagName.toLowerCase() === 'a'):
                this.closeDialog();
                break;
            case (event.target === this.submitNode):
                this.submitFtn(event);
                break;
            // case (event.target === this.selectNode):
            //     this.selectFtn(event);
            //     break;
            case (event.target === this.radioNodes[0] || event.target === this.radioNodes[1]):
                this.reset(event);
                break;
        }
    }
    reset(event) {
        var errorElement = document.querySelector(".select-error");
        if (errorElement) {
            if (!errorElement.classList.contains("hidden")) {
                errorElement.className += " hidden";
            }
        }
    }
    submitFtn(event) {
        event.preventDefault();
        var radios = document.querySelectorAll(".submit");
        var valid = false;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked === true) {
                valid = true;
                break;
            }
        }

        if (selectedOffer == "400") {

        } else {

        }
    }

    // selectFtn(event) {

    //     event.preventDefault();
    //     var selector = this.dialogNode.querySelector('.state-select');
    //     var state = selector[selector.selectedIndex].value;


    //     if (!state) {

    //         var state_select = this.dialogNode.querySelector('.state-select');
    //         state_select.classList.add('red');
    //         state_select.focus();
    //         this.dialogNode.querySelector('.select-error').classList.remove('hidden');

    //     } else {
    //         //Ops COde
    //         // querySelector('.select-error').classList.add('hidden');
    //         var szStateName = selector[selector.selectedIndex].getAttribute("value");

    //         document.getElementById("stateId").innerHTML = szStateName;

    //         bStateChanged = true;
    //         szStateSelected = szStateName;
    //         this.closeDialog();
    //     }
    // }


    print() {
        var objFra = document.querySelector("iframe.pdf");
        objFra.contentWindow.focus();
        objFra.contentWindow.print();
    }
    handleKeyDown(event) {
        var keycode = event.keyCode || event.which;
        var visibleInputs;
        switch (true) {
            case (event.keyCode === this.keysMap.escape):
                //Escape
                this.closeDialog();
                break;
            case (event.keyCode === this.keysMap.tab && event.shiftKey):
                //Shift + Tab
                visibleInputs = this.getVisibleInputs();
                if (event.target === visibleInputs[0]) {
                    // if the focus is in the first element	
                    event.preventDefault();
                    visibleInputs[visibleInputs.length - 1].focus();
                }
                break;
            case (event.keyCode === this.keysMap.tab && !event.shiftKey):
                //Tab
                visibleInputs = this.getVisibleInputs();
                if (event.target === visibleInputs[visibleInputs.length - 1]) {
                    // if the focus is in the last element
                    event.preventDefault();
                    visibleInputs[0].focus();
                }
                break;
        }
    }

    getVisibleInputs() {
        var visibleInputNodes = [];
        for (const inputNode of this.inputNodes) {
            if (inputNode.offsetHeight && inputNode.offsetWidth) {
                visibleInputNodes.push(inputNode);
            }
        }
        return visibleInputNodes
    }
}

///////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
    // const dialogNodes = document.querySelectorAll('.modal-overlay');
    // for (let i of dialogNodes) {
    //     // console.log(i);
    //     new Modal(i);
    // }
}, false);


///////////////////////////////////////
// Dialog Object
///////////////////////////////////////
class Dialog {
    constructor(dialogNode) {
        this.dialogNode = dialogNode;
        this.closeNode = this.dialogNode.querySelector('.close-dialog');
        this.continueNode = this.dialogNode.querySelector('.continue');
        this.selectNode = this.dialogNode.querySelector('.select');
        this.triggerNodes = document.querySelectorAll('.' + this.dialogNode.getAttribute('data-class'));
        this.inputNodes = Array.prototype.slice.call(dialogNode.querySelectorAll('select:not([disabled]), input:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], area[href], iframe, object, embed, *[tabindex], *[contenteditable]'));
        this.lastFocusNode;
        this.windowScroll = { x: 0, y: 0 };
        this.isSpeedbump = false;
        this.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (this.dialogNode.classList.contains('speedbump-overlay')) {
            this.isSpeedbump = true;
        }

        this.keysMap = Object.freeze({
            'tab': 9,
            'escape': 27
        });

        for (const i of this.triggerNodes) {
            i.addEventListener('click', this.handleClick_triggerNodes.bind(this));
        }

        this.dialogNode.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.dialogNode.addEventListener('click', this.handleClick.bind(this));
        // this.dialogNode.addEventListener('change', this.handleOnChange.bind(this));
    }
    // handleOnChange(event) {
    //     if (event.target.id == "state") {
    //         document.querySelector(".select-error").classList.add('hidden');
    //         document.querySelector(".state-select").classList.remove('red');
    //     }
    // }
    handleClick_triggerNodes(event) {

        event.preventDefault();
        let classNames = event.target.className;
        if (typeof classNames === "string" && classNames.indexOf("applyNow") != -1) {
            if (selectedOffer == "200") {
                return;
            }
        }
        this.lastFocusNode = event.currentTarget;
        if (!this.iOS) {
            document.querySelector('html').classList.add('dialog-no-scrolling');
            document.querySelector('body').classList.add('dialog-no-scrolling');
        } else {
            this.windowScroll.x = window.pageXOffset;
            this.windowScroll.y = window.pageYOffset;
            document.querySelector('html').classList.add('dialog-no-scrolling-iOS');
            document.querySelector('body').classList.add('dialog-no-scrolling-iOS');
            document.querySelector('body').style.top = '-' + this.windowScroll.y + 'px';
        }
        this.dialogNode.classList.remove('hidden');
        const firstInput = this.getVisibleInputs()[0];

        if (firstInput) {

            //   firstInput.blur();
            this.closeNode.focus();
        } else {
            this.closeNode.focus();
        }

        if (this.isSpeedbump) {
            if (this.continueNode) {
                this.continueNode.href = event.currentTarget.href;
            }
        }
    }

    closeDialog() {
        if (!this.iOS) {
            document.querySelector('html').classList.remove('dialog-no-scrolling');
            document.querySelector('body').classList.remove('dialog-no-scrolling');
        } else {
            document.querySelector('html').classList.remove('dialog-no-scrolling-iOS');
            document.querySelector('body').classList.remove('dialog-no-scrolling-iOS');
            document.querySelector('body').style.top = '';
            window.scrollTo(this.windowScroll.y, this.windowScroll.y);
        }
        this.dialogNode.classList.add('hidden');
        this.lastFocusNode.focus();
    }

    handleClick(event) {
        switch (true) {
            case (event.target === this.closeNode):
                this.closeDialog();
                break;
            // case (event.target === this.dialogNode):
            //     this.closeDialog();
            //     break;
            case (this.isSpeedbump && event.target === this.continueNode):
                this.closeDialog();
                break;
            case (!this.isSpeedbump && event.target.tagName.toLowerCase() === 'a'):
                this.closeDialog();
                break;
            // case (event.target === this.selectNode):
            //     this.selectFtn(event);
            //     break;
        }
    }

    handleKeyDown(event) {
        var keycode = event.keyCode || event.which;
        var visibleInputs;
        switch (true) {
            case (event.keyCode === this.keysMap.escape):
                //Escape
                this.closeDialog();
                break;
            case (event.keyCode === this.keysMap.tab && event.shiftKey):
                //Shift + Tab
                visibleInputs = this.getVisibleInputs();
                if (event.target === visibleInputs[0]) {
                    // if the focus is in the first element	
                    event.preventDefault();
                    visibleInputs[visibleInputs.length - 1].focus();
                }
                break;
            case (event.keyCode === this.keysMap.tab && !event.shiftKey):
                //Tab
                visibleInputs = this.getVisibleInputs();
                if (event.target === visibleInputs[visibleInputs.length - 1]) {
                    // if the focus is in the last element
                    event.preventDefault();
                    visibleInputs[0].focus();
                }
                break;
        }
    }

    getVisibleInputs() {
        var visibleInputNodes = [];
        for (const inputNode of this.inputNodes) {
            if (inputNode.offsetHeight && inputNode.offsetWidth) {
                visibleInputNodes.push(inputNode);
            }
        }
        return visibleInputNodes
    }
    // selectFtn(event) {
    //     event.preventDefault();
    //     var selector = this.dialogNode.querySelector('.state-select');
    //     var state = selector[selector.selectedIndex].value;
    //     if (!state) {

    //         var state_select = this.dialogNode.querySelector('.state-select');
    //         state_select.classList.add('red');
    //         state_select.focus();
    //         this.dialogNode.querySelector('.select-error').classList.remove('hidden');
    //     } else {
    //         // this.dialogNode.querySelector('.select-error').classList.add('hidden');
    //         this.closeDialog();
    //         document.getElementById("stateId").innerHTML = state;
    //         bStateChanged = true;
    //         szStateSelected = state;
    //     }
    // }
}

///////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
    const dialogNodes = document.querySelectorAll('.speedbump-overlay,.modal-overlay');
    for (const i of dialogNodes) {
        new Dialog(i);
    }
}, false);

// Setting Account section values;
import { offers } from "./data/offer";
// import { terms } from "./data/terms";
let previousList;
let previousClass;
let setValues = function (selectedOffer) {
    // Emptying offer-container 

    let offerContainer = document.getElementById('offerContainer');
    if (offerContainer.childNodes.length > 0) {
        offerContainer.innerHTML = "";
        document.querySelector(".accounts").classList.remove(previousClass);
    }

    //Iterating on each element of the variable articles
    for (let element in offers) {
        if (offers.hasOwnProperty(element)) {
            let offer = offers[element];

            if (offer.offerType == selectedOffer) {
                document.getElementsByClassName("offerTitle")[0].innerHTML = offer.earn;
                document.getElementsByClassName("remaining")[0].innerHTML = offer.remaining;
                document.getElementsByClassName("sticky-amount")[0].innerHTML = offer.stickyAmount;
                document.getElementsByClassName("offer-img")[0].src = offer.image;
                document.getElementsByClassName("offer-img")[0].alt = offer.earn;
                document.getElementsByClassName("offer-img")[0].setAttribute('aria-label', offer.earn);
                document.getElementsByClassName("phone-no")[0].innerHTML = offer.phone;
                document.querySelector(".accounts").classList.add(offer.offerClass);
                previousClass = offer.offerClass;
                let offerDiv = document.getElementsByClassName('offer');
                if (offerDiv) {
                    offerDiv.innerHTML = "";
                }

                if (offer.offer) {
                    let offerHTML = "";
                    let listHTML = `<ul role="list">`;
                    for (let key in offer.offer) {
                        let offerItem = offer.offer[key]
                        offerHTML = `<div class="offer oneOffer" aria-hidden="false"><h3 class="title">${offer.offerTitle}</h3></div>`
                        for (let key in offerItem.feature) {
                            let featureContent = offerItem.feature[key]
                            listHTML += `<li role="listitem">${featureContent}</li>`
                        }
                        document.getElementsByClassName('offer-container')[0].innerHTML += offerHTML;
                        document.getElementsByClassName('offer')[key - 1].innerHTML += listHTML + "</ul>";
                        listHTML = "<ul>";
                    }
                }
                else {
                    let offerHTML = "";
                    let listHTML = `<ul role="list">`;
                    offerHTML = `<div class="offer oneOffer"><h3 class="title">${offer.offerTitle}</h3></div>`;
                    for (let key in offer.feature) {
                        let featureContent = offer.feature[key]
                        listHTML += `<li aria-label= "${featureContent}" role="listitem">${featureContent}</li>`
                    }
                    document.getElementsByClassName('offer-container')[0].innerHTML += offerHTML;
                    document.getElementsByClassName('offer')[0].innerHTML += listHTML + "</ul>";
                    listHTML = "<ul>";
                }
            }
        }
    }
    // Setting Compare packages value
    let listContainer;
    const packageBtn = document.getElementsByClassName("packageBtn");

    for (let i = 0; i < packageBtn.length; i++) {
        if (window.innerWidth < 768) {
            packageBtn[i].addEventListener("click", function (e) {
                if (listContainer) {
                    for (var i = 0; i < listContainer.length; i++) {
                        listContainer[i].classList.remove('show');
                    }
                }
                let target = e.currentTarget;
                selectPackage(target);
            })
        }
    }

    let selectPackage = function (selectedOffer) {

        if (previousList) {
            for (var j = 0; j < previousList.length; j++) {
                previousList[j].classList.remove('show');
            }
        }

        listContainer = "";
        if (selectedOffer.classList.contains("offer500")) {
            listContainer = document.querySelectorAll('.offer500');
        } else if (selectedOffer.classList.contains("offer600")) {
            listContainer = document.querySelectorAll('.offer600');
        } else if (selectedOffer.classList.contains("offer200")) {
            listContainer = document.querySelectorAll('.offer200');
        }
        if (listContainer) {
            for (var i = 0; i < listContainer.length; i++) {
                listContainer[i].classList.add('show');
            }
        }
        previousList = listContainer;
    }


    //Selecting the active package and  Setting the aria-labels for ApplyNow CTA

    let activePackage;
    let selectedCTA = document.querySelectorAll('.stickyTrigger');
    for (let i = 0; i < selectedCTA.length; i++) {
        if (selectedOffer == 200) {
            selectedCTA[i].setAttribute("aria-label", "Apply now for Basic Banking Account");
            activePackage = document.getElementsByClassName('packageBtn')[0];
        }
        else if (selectedOffer == 400) {
            selectedCTA[i].setAttribute("aria-label", "Apply now for CitiBank Account");
            activePackage = document.getElementsByClassName('packageBtn')[1];
        }
        else if (selectedOffer == 700) {
            selectedCTA[i].setAttribute("aria-label", "Apply now for Citi Priority Account");
            activePackage = document.getElementsByClassName('packageBtn')[2];
        }
    }

    selectPackage(activePackage);


    // Setting Terms data values 
    // for (let element in terms) {

    //     if (terms.hasOwnProperty(element)) {
    //         let term = terms[element];

    //         if (term.offerType == selectedOffer) {
    //             document.getElementById("printBtn").href = term.pdfPath;
    //             document.getElementById("downloadBtn").href = term.pdfPath;
    //             if (term.content) {
    //                 let offerHTML = "";
    //                 if (document.getElementsByClassName('terms-container').length) {
    //                     document.getElementsByClassName('terms-container')[0].innerHTML = "";
    //                 }
    //                 offerHTML = `${term.content}`;
    //                 document.getElementsByClassName('terms-container')[0].innerHTML = offerHTML;

    //             }
    //         }
    //     }
    // }
}

// Carousel 

let swiper,
    activeSlide,
    isfirstSlideMove = true;


window.onload = function () {
    let paginationLabels =["Earn$400","Earn$700","Earn$200"]
    swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 1,
        allowTouchMove: false,
        centeredSlides: true,
        loop: true,
        loopFillGroupWithBlank: true,
         //...
        a11y:false,
        on: {
            init: function () {
                setTimeout(function () { document.getElementsByClassName("carousel")[0].classList.add('opacityAnimate'); }, 300);
                selectedOffer = document.getElementsByClassName("swiper-slide-active")[0].children[0].children[4].innerHTML;
                updateTabIndex(true);
                const dialogNodes = document.querySelectorAll('.modal-overlay');
                for (let i of dialogNodes) {
                    new Modal(i);
                }
                setValues(selectedOffer);
                // SMOOTH SCROOLING JAVASCRIPT
                smoothScrolling();
            },
            transitionEnd: function () {
                updateTabIndex(false);
                if (isfirstSlideMove == false) {
                    activeSlide.focus();
                }
                isfirstSlideMove = false;
                selectedOffer = document.getElementsByClassName("swiper-slide-active")[0].children[0].children[4].innerHTML;
                setValues(selectedOffer);
            },
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            role:false,
            renderBullet: function (index, className) {
                return '<button class="'  + className + '" aria-label ="' + (paginationLabels[index]) + '"></button>';
            },
        },
        breakpoints: {
            767: {
                slidesPerView: 1,
                spaceBetween: 0,
                allowTouchMove: true,
            }
        }
    });
    //firefoxFix();
    // ieFix();    
  
      //removing role button
      let pageBullets = Array.from(document.querySelectorAll(".swiper-pagination-bullet"));
      for(let i=0 ; i < pageBullets.length; i++){
        pageBullets[i].removeAttribute("role");
        
      }  

    OpsListeners();
}
document.onkeydown = checkKey;
function checkKey(e) {
    if (document.activeElement.classList.contains('swiper-slide-active')) {

        e = e || window.event;
        if (e.keyCode == '37') {
            swiper.slidePrev();
        }
        else if (e.keyCode == '39') {
            swiper.slideNext();
        }
    }
}

let updateTabIndex = function (isInit) {

    let swiperSlide = document.getElementsByClassName("swiper-slide");
 
    for (let i = 0; i < swiperSlide.length; i++) {
        swiperSlide[i].setAttribute("tabindex", "-1");
        swiperSlide[i].setAttribute("aria-hidden", "true");
        swiperSlide[i].addEventListener('click', moveSlider, false);
        if (swiperSlide[i].classList.contains('swiper-slide-active')) {
            activeSlide = swiperSlide[i];
            swiperSlide[i].setAttribute("tabindex", "0");
            swiperSlide[i].setAttribute("aria-hidden", "false");
        }
    }

    let links = document.querySelectorAll(".swiper-slide a");
    let activeLinks = document.querySelectorAll(".swiper-slide-active a");

    for (let j = 0; j < links.length; j++) {         //non active slides
            links[j].setAttribute("tabindex", "-1");
            links[j].setAttribute("aria-hidden", "true"); 
    }
    for (let k = 0; k < activeLinks.length; k++) {  //active slides
        if (k == 1) {
            activeLinks[k].removeAttribute("tabindex");
            activeLinks[k].setAttribute("aria-hidden", "true");       
        }
        else {
                activeLinks[k].setAttribute("tabindex","0");
                activeLinks[k].setAttribute("aria-hidden", "false");
        }
    }
    
}

let moveSlider = function (e) {
    e.preventDefault();
    let nextIndex = String(this.className).indexOf("swiper-slide-next");
    let prevIndex = String(this.className).indexOf("swiper-slide-prev");

    selectedOffer = this.children[0].children[4].innerHTML;
    if (prevIndex != -1) {
        if (e.target.nodeName == "A" || e.target.nodeName == "DIV") {
            swiper.slidePrev();
        }
    }
    if (nextIndex != -1) {
        if (e.target.nodeName == "A" || e.target.nodeName == "DIV") {
            swiper.slideNext();
        }
    }

};

// making readable compare package heading for mobile

if (window.innerWidth < 768) {
    let tick2 = document.querySelectorAll('.compare-packages .bottom .top-title ul');
    for (let i = 0; i < tick2.length; i++) {
        tick2[i].removeAttribute('aria-hidden');
    }
}
// //footer accordion
// class Accordion {
//     constructor() {
//         this.default = 0;
//         this.currPanelId = this.default;
//         this.arrArticles = document.querySelectorAll('div.offers article');
//         this.arrAccordion = [];
//     }

//     setup() {
//         for(let i = 0; i < this.arrArticles.length;i++) {
//             let content = this.arrArticles[i].querySelector('div.offer-body');
//             this.arrAccordion.push({panel:content, height:content.clientHeight});

//             if(i !== this.default) {
//                 content.style.height = '0px';
//                 this.arrArticles[i].style.margin = '0 0 10px';
//             }else {
//                 this.arrArticles[i].querySelector('h2.offer-header').style.backgroundImage = `url('./images/white_arrow_up.png')`;
//                 this.arrArticles[i].style.margin = '0';
//                 this.arrArticles[i].style.padding = '0 0 10px';
//                 content.style.height = content.clientHeight + 'px';
//             }

//             this.addADA(this.arrArticles[i], i);
//         }

//         //console.log(this.arrAccordion);
//     }

//     addADA(article, index) {
//         let headerText = article.querySelector('h2.offer-header').innerHTML;
//         let headerButtonHTML = `<button id="accordion_${index}" aria-expanded="false" aria-disabled="true" aria-controls="accordion_section_${index}">${headerText}</button>`;
//         let headerButton = article.querySelector('h2.offer-header');

//         article.querySelector('h2.offer-header').innerHTML = '';
//         headerButton.innerHTML = headerButtonHTML;
//         headerButton.dataset.panelId = index;
//         headerButton.addEventListener('click', this.headerOnclickHandler.bind(this));

//         let offerBodyElmt = article.querySelector('div.offer-body');
//         offerBodyElmt.setAttribute('role', 'region');
//         offerBodyElmt.setAttribute('aria-labelledby', 'accordion_' + index);
//     }

//     headerOnclickHandler(e) {
//         let id = e.currentTarget.dataset.panelId;
//         e.currentTarget.style.backgroundImage = `url('./images/white_arrow_up.png')`;

//         this.arrArticles[this.currPanelId].querySelector('h2.offer-header').style.backgroundImage = `url('./images/white_arrow_down.png')`;
//         this.arrAccordion[this.currPanelId].panel.style.height = '0px';
//         this.arrArticles[this.currPanelId].style.margin = '0 0 10px';
//         this.arrArticles[this.currPanelId].style.padding = '0';

//         this.arrAccordion[id].panel.style.height = this.arrAccordion[id].height + 'px';
//         this.arrArticles[id].style.margin = '0';
//         this.arrArticles[id].style.padding = '0 0 10px';

//         this.currPanelId = id;
//     }
// }

// window.addEventListener('load', () => {
//     let mobileAccordion= new Accordion();
//     ///////////////////////////////////////
// // Get current view port
// ///////////////////////////////////////
// let mobile = 320;
// let medmobile = 375;
// let lgmobile = 480;
// let tablet = 768;
// let desktop = 1200;
// let xl = 1400;

// function getCurrentViewport() {
//     let windowWidth = window.innerWidth;

//     if( windowWidth >= mobile && windowWidth < medmobile) {
//         return 'mobile';
//     }

//     if( windowWidth >= medmobile && windowWidth < lgmobile) {
//         return 'medmobile';
//     }

//     if( windowWidth >= lgmobile && windowWidth < tablet) {
//         return 'lgmobile';
//     }

//     if( windowWidth >= tablet && windowWidth < desktop) {
//         return 'tablet';
//     }

//     if( windowWidth >= desktop && windowWidth < xl) {
//         return 'desktop';
//     }

//     if( windowWidth >= xl) {
//         return 'xl';
//     }
//    }

//     if(getCurrentViewport() === 'mobile' || getCurrentViewport() === 'medmobile' || getCurrentViewport() === 'lgmobile') {
//         mobileAccordion.setup();
//     }
// });
(function () {
    const accordion = document.getElementsByClassName("accordion");
    let current = -1;

    for (let i = 0; i < accordion.length; i++) {
        accordion[i].addEventListener('click', function () {
            console.log("click button")
            if (i !== current && current !== -1) {
                accordion[current].classList.remove('active');
                accordion[current].parentElement.nextElementSibling.classList.remove('panel-open');
            }
            this.parentElement.nextElementSibling.classList.toggle('panel-open');
            if (this.parentElement.nextElementSibling.classList.contains("panel-open")) {
                this.setAttribute("aria-expanded", "true");
            }
            else {
                this.setAttribute("aria-expanded", "false");
            }
            current = this.classList.toggle('active') ? i : -1;
        });
    };
})();

//========================================
//Ops Code
var szDestURL = "";
var szPlacementCTA = "";
var bIs400Offer = 0;
var bIs700Offer = 0;

function OpsListeners() {
    // Added Event listener for Hero Apply Now CTAs
    [...document.querySelectorAll(".HeroApplyNow500")].forEach(btn => {
        btn.addEventListener("click", function () {
            if (bt_console) {
                console.log("Hero CTA 400!");
                console.log("selectedOffer: " + selectedOffer);
            }

            TrackPixel(szApplyNow400MainPix);
            szPlacementCTA = "hero";
            bIs400Offer = 1;
            bIs700Offer = 0;

            if (bt_console) {
                console.log("szPlacementCTA: " + szPlacementCTA);
            }
        });
    });
    [...document.querySelectorAll(".HeroApplyNow600")].forEach(btn => {
        btn.addEventListener("click", function () {
            if (bt_console) {
                console.log("Hero CTA 700!");
                console.log("selectedOffer: " + selectedOffer);
            }

            TrackPixel(szApplyNow700MainPix);
            szPlacementCTA = "hero";
            bIs400Offer = 0;
            bIs700Offer = 1;

            if (bt_console) {
                console.log("szPlacementCTA: " + szPlacementCTA);
            }
        });
    });
    [...document.querySelectorAll(".HeroApplyNow200")].forEach(btn => {
        btn.addEventListener("click", function () {
            if (bt_console) {
                console.log("Hero CTA 200!");
                console.log("selectedOffer: " + selectedOffer);
            }

            szDestURL = buildOpsURL(selectedOffer, "hero", null);
            szDestURL = szDestURL + getGsParam() + "&Promo_ID=" + szOfferCode200;
            if (bt_console) {
                console.log("szDestURL: " + szDestURL);
            }

            window.open(szDestURL);
        });
    });

    //Added Event listener for Sticky Apply Now CTA
    document.getElementById("StickyApplyNow").addEventListener("click", function () {
        if (bt_console) {
            console.log("Sticky CTA!");
            console.log("selectedOffer: " + selectedOffer);
        }

        if (selectedOffer == "200") {
            szDestURL = buildOpsURL(selectedOffer, "sticky", null);
            szDestURL = szDestURL + getGsParam() + "&Promo_ID=" + szOfferCode200;
            if (bt_console) {
                console.log("szDestURL: " + szDestURL);
            }

            window.open(szDestURL);
        }
        else {
            if (selectedOffer == "400") {
                TrackPixel(szApplyNow400StickyPix);
                bIs400Offer = 1;
                bIs700Offer = 0;
            }
            else {
                TrackPixel(szApplyNow700StickyPix);
                bIs400Offer = 0;
                bIs700Offer = 1;
            }
            szPlacementCTA = "sticky";

            if (bt_console) {
                console.log("szPlacementCTA: " + szPlacementCTA);
            }
        }
    }, false);

    if (selectedOffer == "200") {
        document.getElementById("BodyApplyNow").setAttribute("aria-label", "Apply Now for a Basic Banking Account");
    }

    //Added Event listener for Body Apply Now CTA
    document.getElementById("BodyApplyNow").addEventListener("click", function () {
        if (bt_console) {
            console.log("Body CTA!");
            console.log("selectedOffer: " + selectedOffer);
        }

        if (selectedOffer == "200") {
            szDestURL = buildOpsURL(selectedOffer, "body", null);
            szDestURL = szDestURL + getGsParam() + "&Promo_ID=" + szOfferCode200;
            if (bt_console) {
                console.log("szDestURL: " + szDestURL);
            }

            window.open(szDestURL);
        }
        else {
            if (selectedOffer == "400") {
                TrackPixel(szApplyNow400GetStartedPix);
                bIs400Offer = 1;
                bIs700Offer = 0;
            }
            else {
                TrackPixel(szApplyNow700GetStartedPix);
                bIs400Offer = 0;
                bIs700Offer = 1;
            }
            szPlacementCTA = "body";

            if (bt_console) {
                console.log("szPlacementCTA: " + szPlacementCTA);
            }
        }
    }, false);

    //Added Event listener for Regular Package
    document.getElementById("regular").addEventListener("click", function () {
        if (bt_console) {
            console.log("Regular Package!");
        }

        szDestURL = buildOpsURL(selectedOffer, szPlacementCTA, "regular");
        szDestURL = szDestURL + getGsParam() + "&Promo_ID=";
        if (bIs400Offer) { szDestURL = szDestURL + szOfferCode400 } else if (bIs700Offer) { szDestURL = szDestURL + szOfferCode700 }
        if (bt_console) {
            console.log("szDestURL: " + szDestURL);
        }

        window.open(szDestURL);
    }, false);

    //Added Event listener for Interest Package
    document.getElementById("interest").addEventListener("click", function () {
        if (bt_console) {
            console.log("Interest Package!");
        }

        szDestURL = buildOpsURL(selectedOffer, szPlacementCTA, "interest");
        szDestURL = szDestURL + getGsParam() + "&Promo_ID=";
        if (bIs400Offer) { szDestURL = szDestURL + szOfferCode400 } else if (bIs700Offer) { szDestURL = szDestURL + szOfferCode700 }
        if (bt_console) {
            console.log("szDestURL: " + szDestURL);
        }

        window.open(szDestURL);
    }, false);
}


//========================================
//Ops Functions
function buildOpsURL(selectedOffer, placement, myPackage) {
    if (bt_console) {
        console.log("placement: " + placement);
        console.log("myPackage: " + myPackage);
    }

    var retURL = "";
    switch (selectedOffer) {
        case "200":
            switch (placement) {
                case "hero":
                    retURL = szApplyNow200 + "&pixID=" + szApplyNow200MainPix;
                    break;
                case "sticky":
                    retURL = szApplyNow200 + "&pixID=" + szApplyNow200StickyPix;
                    break;
                case "body":
                    retURL = szApplyNow200 + "&pixID=" + szApplyNow200GetStartedPix;
                    break;
            }
            break;
        case "400":
            switch (placement) {
                case "hero":
                    if (myPackage == "interest") {
                        retURL = szApplyNow400Interest + "&pixID=" + szApplyNow400InterestMainPix;
                    } else {
                        retURL = szApplyNow400Regular + "&pixID=" + szApplyNow400RegularMainPix;
                    }
                    break;
                case "sticky":
                    if (myPackage == "interest") {
                        retURL = szApplyNow400Interest + "&pixID=" + szApplyNow400InterestStickyPix;
                    } else {
                        retURL = szApplyNow400Regular + "&pixID=" + szApplyNow400RegularStickyPix;
                    }
                    break;
                case "body":
                    if (myPackage == "interest") {
                        retURL = szApplyNow400Interest + "&pixID=" + szApplyNow400InterestGetStartedPix;
                    } else {
                        retURL = szApplyNow400Regular + "&pixID=" + szApplyNow400RegularGetStartedPix;
                    }
                    break;
            }
            break;
        case "700":
            switch (placement) {
                case "hero":
                    if (myPackage == "interest") {
                        retURL = szApplyNow700Interest + "&pixID=" + szApplyNow700InterestMainPix;
                    } else {
                        retURL = szApplyNow700Regular + "&pixID=" + szApplyNow700RegularMainPix;
                    }
                    break;
                case "sticky":
                    if (myPackage == "interest") {
                        retURL = szApplyNow700Interest + "&pixID=" + szApplyNow700InterestStickyPix;
                    } else {
                        retURL = szApplyNow700Regular + "&pixID=" + szApplyNow700RegularStickyPix;
                    }
                    break;
                case "body":
                    if (myPackage == "interest") {
                        retURL = szApplyNow700Interest + "&pixID=" + szApplyNow700InterestGetStartedPix;
                    } else {
                        retURL = szApplyNow700Regular + "&pixID=" + szApplyNow700RegularGetStartedPix;
                    }
                    break;
            }
            break;
    }

    if (bt_console) {
        console.log("retURL: " + retURL);
    }
    return retURL;
}

function getGsParam() {
    const gsVal = (window.btVars.zipSelectorData && window.btVars.zipSelectorData.gs) ? window.btVars.zipSelectorData.gs : "CA";
    return "&GS=" + gsVal;
}