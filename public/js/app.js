const add = document.querySelector("#icon-btn")
const mobileNav = document.querySelector(".container")

add.addEventListener("click", () => {
    mobileNav.classList.toggle("openDrawer");
    console.log("clicked")
})