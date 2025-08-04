// 導航列滾動效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// 平滑滾動到錨點
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // 考慮導航列高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 手機導航選單切換
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// 滾動動畫觀察器
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 觀察所有需要動畫的元素
document.querySelectorAll('.truth-card, .evidence-section, .motivation-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// 數字計數動畫
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (range * progress);
        
        element.textContent = Math.round(current);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// 當數據元素進入視窗時觸發計數動畫
const numberElements = document.querySelectorAll('.stat-number, .data-value');
const numberObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^\d]/g, ''));
            if (!isNaN(number) && number > 0) {
                entry.target.textContent = '0';
                animateNumber(entry.target, 0, number, 1500);
                // 恢復原始文字格式
                setTimeout(() => {
                    entry.target.textContent = text;
                }, 1500);
            }
        }
    });
}, { threshold: 0.5 });

numberElements.forEach(el => {
    numberObserver.observe(el);
});

// 分享功能
function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('【揭密】活性碳的「高濃度騙局」- 一場被包裝過的無效神話');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank', 'width=600,height=400');
}

function shareToLine() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('【揭密】活性碳的「高濃度騙局」- 一場被包裝過的無效神話');
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(function() {
        // 顯示複製成功提示
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '已複製！';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#374151';
        }, 2000);
    }).catch(function(err) {
        console.error('複製失敗:', err);
        // 備用方案：選擇文字
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '已複製！';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#374151';
        }, 2000);
    });
}

// 頁面載入完成後的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加載入動畫
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 預載入圖片
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
    
    // 添加鍵盤導航支援
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // 關閉手機選單
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
});

// 效能優化：節流函數
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 使用節流優化滾動事件
window.addEventListener('scroll', throttle(function() {
    // 滾動進度指示器
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // 可以在這裡添加滾動進度條
    // document.querySelector('.scroll-progress').style.width = scrollProgress + '%';
}, 16)); // 約60fps

// 添加觸控支援
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向上滑動
            console.log('Swipe up detected');
        } else {
            // 向下滑動
            console.log('Swipe down detected');
        }
    }
}

// 錯誤處理
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// 圖片載入錯誤處理
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

// 添加無障礙支援
document.addEventListener('keydown', function(e) {
    // Tab 鍵導航增強
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// --- 安全、無污染的收合功能 ---
document.addEventListener('DOMContentLoaded', function() {
    const accordions = document.querySelectorAll('.safe-accordion');
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.safe-accordion__header');
        if (header) {
            header.addEventListener('click', () => {
                accordion.classList.toggle('is-active');
            });
        }
    });
});

// --- 方案二：滾動時高亮對應連結 ---
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link-v2');

    function changeLinkState() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove('active'));
        // 確保對應的連結存在
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }

    changeLinkState(); // 頁面載入時先執行一次
    window.addEventListener('scroll', changeLinkState);
});

// --- 觸發「濕度影響」圖表動畫 ---
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.humidity-impact-card');

    if (!card) return;

    // 找到所有需要動畫的柱狀圖
    const bars = card.querySelectorAll('.chart-bar');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 為卡片添加 class 以觸發動畫
                card.classList.add('in-view');
                
                // 將 data-height 的值設置到 CSS 變數中
                bars.forEach(bar => {
                    const finalHeight = bar.getAttribute('data-height');
                    bar.style.setProperty('--final-height', finalHeight);
                });

                // 動畫觸發一次後即可停止觀察，節省效能
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // 當元素 50% 進入視窗時觸發
    });

    observer.observe(card);
});

// --- 觸發「濕度影響 V2」圖表動畫 (安全版) ---
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.humidity-v2-card');

    if (!card) return;

    const bars = card.querySelectorAll('.humidity-v2-bar');

    const observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            card.classList.add('is-in-view');
            
            bars.forEach(bar => {
                const finalHeight = bar.getAttribute('data-height');
                bar.style.setProperty('--final-height', finalHeight);
            });

            observer.unobserve(card);
        }
    }, {
        threshold: 0.5
    });

    observer.observe(card);
});

// 添加 CSS 類別以支援鍵盤導航樣式
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--warning-orange) !important;
        outline-offset: 2px;
    }
`;

document.head.appendChild(style);

