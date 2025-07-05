// スクロールアニメーション
const track = document.getElementById('marquee-track');
// クローンを追加して無限ループ風に
track.innerHTML += track.innerHTML;
const images = Array.from(document.querySelectorAll('.modal-trigger'));

let pos = 0;
const speed = 4; // px/フレーム
let marqueeRunning = true;

function animate() {
  if (marqueeRunning) {
    pos -= speed;
    // 画像1セット分スクロールしたらリセット
    if (Math.abs(pos) >= track.scrollWidth / 2) {
      pos = 0;
    }
    track.style.transform = `translateX(${pos}px)`;
  }
  requestAnimationFrame(animate);
}
animate();

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('modal-close');
let currentIndex = 0;

function openModal(index) {
  const src = images[index].src;
  modalImg.src = src;
  currentIndex = index;
  modal.classList.add('active');
  document.body.classList.add('modal-open');
  marqueeRunning = false;
}

function closeModal() {
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
  modalImg.src = '';
  marqueeRunning = true;
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  openModal(currentIndex);
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openModal(currentIndex);
}

images.forEach((img, index) => {
  img.addEventListener('click', () => openModal(index));
});

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    closeModal();
  }
});

const prevBtn = document.getElementById('modal-prev');
const nextBtn = document.getElementById('modal-next');

prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showPrevImage();
});
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  showNextImage();
});

// キーボード操作
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;

  switch (e.key) {
    case 'Escape':
      closeModal();
      break;
    case 'ArrowRight':
      showNextImage();
      break;
    case 'ArrowLeft':
      showPrevImage();
      break;
  }
});

// メインスライダー（フェード）
const main = new Splide('#main-carousel', {
  type      : 'fade',
  heightRatio: 0.5,
  pagination: false,
  arrows    : false,
  cover     : true,
  drag      : false,
  keyboard  : false,
  isNavigation: false
});

// サムネイル（縦スクロール可）
const thumbnails = new Splide('#thumbnail-carousel', {
  fixedWidth  : 100,
  fixedHeight : 70,
  isNavigation: true,
  gap         : 10,
  direction   : 'ttb',
  pagination  : false,
  cover       : true,
  height      : 300,
  breakpoints : {
    600: {
      direction: 'ltr',
      fixedWidth: 70,
      fixedHeight: 50,
      height: 'auto',
    }
  }
});

// 両者を連携
main.sync(thumbnails);
  main.mount();
  thumbnails.mount();
