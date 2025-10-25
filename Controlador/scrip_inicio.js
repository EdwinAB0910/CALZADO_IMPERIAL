var swiper= new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 100,
    grabCursor:true,
    loop: true,
    breakpoints :{
        991: {
            slidesPerView:3
        }
    }
})