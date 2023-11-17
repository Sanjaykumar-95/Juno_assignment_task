let tab=document.querySelector(".tab-sec");
let tabSection=tab.querySelector(".tab-section");
let tabSectionElements=tab.querySelectorAll(".tab-section > ul > li");
let tabBody=tab.querySelector(".tabs-body");
let tabBodyElements=tab.querySelectorAll(".tabs-body > div");

for(let i=0;i<tabSectionElements.length;i++){
    tabSectionElements[i].addEventListener('click',function(){
        tabSection.querySelector(".active").classList.remove("active");
        tabSectionElements[i].classList.add('active');
        tabBody.querySelector(".active").classList.remove("active");
        tabBodyElements[i].classList.add('active');
    })
}