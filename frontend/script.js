// // 獲取 DOM 元素
// const startGameBtn = document.getElementById('start-game-btn');
// const resetGameBtn = document.getElementById('reset-game-btn');
// const playAgainBtn = document.getElementById('play-again-btn');
// const startTermInput = document.getElementById('start-term');
// const endTermInput = document.getElementById('end-term');
// const currentPageSpan = document.getElementById('current-page');
// const targetPageSpan = document.getElementById('target-page');
// const timeElapsedSpan = document.getElementById('time-elapsed');
// const pathDisplaySpan = document.getElementById('path-display');
// const linksContainer = document.getElementById('links-container');
// const gameSetupDiv = document.getElementById('game-setup');
// const gamePlayDiv = document.getElementById('game-play');
// const gameResultsDiv = document.getElementById('game-results');
// const finalPathSpan = document.getElementById('final-path');
// const finalTimeSpan = document.getElementById('final-time');
// const messageBox = document.getElementById('message-box');
// const messageContent = document.getElementById('message-content');
// const messageBoxOkBtn = document.getElementById('message-box-ok');

// // 遊戲狀態變數
// let currentPath = [];
// let startTime;
// let timerInterval;
// let currentPage = '';
// let targetPage = '';

// // 後端 API 的基礎 URL
// // 請確保這個 URL 與您的 Flask 伺服器運行的地方一致
// const BACKEND_API_BASE_URL = 'http://127.0.0.1:5000';

// // 顯示訊息框
// function showMessage(message) {
//     messageContent.textContent = message;
//     messageBox.classList.remove('hidden');
// }

// // 隱藏訊息框
// messageBoxOkBtn.addEventListener('click', () => {
//     messageBox.classList.add('hidden');
// });

// // 格式化時間為 MM:SS
// function formatTime(seconds) {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// }

// // 更新計時器顯示
// function updateTimer() {
//     const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
//     timeElapsedSpan.textContent = formatTime(elapsedTime);
// }

// // 開始遊戲
// startGameBtn.addEventListener('click', async () => { // 注意這裡加入了 async
//     const start = startTermInput.value.trim();
//     const end = endTermInput.value.trim();

//     if (!start || !end) {
//         showMessage('請輸入起點詞彙和終點詞彙！');
//         return;
//     }
//     if (start === end) {
//         showMessage('起點詞彙和終點詞彙不能相同！');
//         return;
//     }

//     // 檢查起始詞彙是否存在 (通過嘗試獲取其連結)
//     try {
//         const initialLinks = await fetchLinksFromBackend(start);
//         if (initialLinks.length === 0 && start !== end) {
//             showMessage(`起點詞彙 "${start}" 未找到任何連結或頁面不存在，請嘗試其他詞彙。`);
//             return;
//         }
//     } catch (error) {
//         showMessage(`無法連接到後端或起點詞彙 "${start}" 頁面不存在/發生錯誤。請確保後端伺服器已運行。`);
//         return;
//     }


//     currentPage = start;
//     targetPage = end;
//     currentPath = [currentPage];
//     startTime = Date.now();
//     timerInterval = setInterval(updateTimer, 1000);

//     // 更新 UI
//     currentPageSpan.textContent = currentPage;
//     targetPageSpan.textContent = targetPage;
//     pathDisplaySpan.textContent = currentPath.join(' > ');
//     timeElapsedSpan.textContent = '00:00';

//     gameSetupDiv.classList.add('hidden');
//     gamePlayDiv.classList.remove('hidden');
//     gameResultsDiv.classList.add('hidden');

//     await loadPageLinks(currentPage); // 等待連結加載完成
// });

// // **新函數：從後端獲取頁面連結**
// async function fetchLinksFromBackend(pageTitle) {
//     try {
//         const encodedPageTitle = encodeURIComponent(pageTitle); // 對中文標題進行 URL 編碼
//         const response = await fetch(`${BACKEND_API_BASE_URL}/api/page_links?title=${encodedPageTitle}`);
        
//         if (!response.ok) { // 檢查 HTTP 狀態碼
//             const errorData = await response.json();
//             throw new Error(errorData.error || `HTTP 錯誤：${response.status}`);
//         }

//         const data = await response.json();
//         return data.links || []; // 返回連結陣列，如果沒有則返回空陣列
//     } catch (error) {
//         console.error('從後端獲取連結失敗:', error);
//         throw error; // 重新拋出錯誤以便上層函數處理
//     }
// }

// // 加載頁面連結並生成按鈕 (現在從後端獲取連結)
// async function loadPageLinks(page) { // 注意這裡加入了 async
//     linksContainer.innerHTML = ''; // 清空舊的連結

//     // 我們已經退回顯示連結按鈕的版本，所以這裡不再需要移除 wiki-content-display
//     // 但如果 HTML 中意外殘留，這裡可以確保它被清除
//     const oldWikiContentDisplay = document.getElementById('wiki-content-display');
//     if (oldWikiContentDisplay) {
//         oldWikiContentDisplay.remove();
//     }


//     let availableLinks = [];
//     try {
//         availableLinks = await fetchLinksFromBackend(page);
//     } catch (error) {
//         showMessage(`無法獲取 "${page}" 的連結：${error.message}`);
//         linksContainer.innerHTML = '<p class="text-red-600 text-center">無法載入連結。</p>';
//         return;
//     }

//     // 如果沒有找到任何連結，顯示提示
//     if (availableLinks.length === 0 && page !== targetPage) {
//         linksContainer.innerHTML = '<p class="text-gray-600 text-center">此頁面未找到有效連結，或您已抵達一個沒有出站連結的頁面。</p>';
//         return;
//     }
    
//     // !!! 已將強制插入目標詞彙的邏輯移除 !!!


//     availableLinks.forEach(link => {
//         const button = document.createElement('button');
//         button.textContent = link;
//         button.classList.add(
//             'bg-gray-200', 'hover:bg-blue-200', 'text-gray-800', 'font-semibold',
//             'py-2', 'px-4', 'rounded-lg', 'shadow-sm', 'transition', 'duration-200',
//             'text-sm', 'sm:text-base', 'truncate' // 防止文字過長
//         );
//         // 如果這個連結是目標頁面，給它一個特別的顏色
//         if (link === targetPage) {
//             button.classList.add('!bg-green-500', '!hover:bg-green-600', '!text-white');
//         }
//         button.addEventListener('click', () => clickLink(link));
//         linksContainer.appendChild(button);
//     });
// }

// // 點擊連結
// async function clickLink(link) { // 注意這裡加入了 async
//     currentPage = link;
//     currentPath.push(currentPage);
//     pathDisplaySpan.textContent = currentPath.join(' > ');
//     currentPageSpan.textContent = currentPage;

//     if (currentPage === targetPage) {
//         clearInterval(timerInterval); // 停止計時器
//         const finalElapsedTime = Math.floor((Date.now() - startTime) / 1000);

//         finalPathSpan.textContent = currentPath.join(' > ');
//         finalTimeSpan.textContent = formatTime(finalElapsedTime);

//         gamePlayDiv.classList.add('hidden');
//         gameResultsDiv.classList.remove('hidden');
//     } else {
//         await loadPageLinks(currentPage); // 等待連結加載完成
//     }
// }

// // 重設遊戲
// resetGameBtn.addEventListener('click', () => {
//     clearInterval(timerInterval);
//     currentPath = [];
//     startTime = 0;
//     currentPage = '';
//     targetPage = '';

//     startTermInput.value = '';
//     endTermInput.value = '';
//     linksContainer.innerHTML = ''; // 清空連結按鈕

//     // 確保移除 wiki-content-display
//     const oldWikiContentDisplay = document.getElementById('wiki-content-display');
//     if (oldWikiContentDisplay) {
//         oldWikiContentDisplay.remove();
//     }

//     gameSetupDiv.classList.remove('hidden');
//     gamePlayDiv.classList.add('hidden');
//     gameResultsDiv.classList.add('hidden');
// });

// // 再玩一次
// playAgainBtn.addEventListener('click', () => {
//     clearInterval(timerInterval);
//     currentPath = [];
//     startTime = 0;
//     currentPage = '';
//     targetPage = '';

//     startTermInput.value = '';
//     endTermInput.value = '';
//     linksContainer.innerHTML = ''; // 清空連結按鈕

//     // 確保移除 wiki-content-display
//     const oldWikiContentDisplay = document.getElementById('wiki-content-display');
//     if (oldWikiContentDisplay) {
//         oldWikiContentDisplay.remove();
//     }

//     gameSetupDiv.classList.remove('hidden');
//     gamePlayDiv.classList.add('hidden');
//     gameResultsDiv.classList.add('hidden');
// });

// // 初始化時隱藏遊戲進行和結果區塊
// document.addEventListener('DOMContentLoaded', () => {
//     gamePlayDiv.classList.add('hidden');
//     gameResultsDiv.classList.add('hidden');
//     // 確保初始化時沒有 wiki-content-display 元素
//     const oldWikiContentDisplay = document.getElementById('wiki-content-display');
//     if (oldWikiContentDisplay) {
//         oldWikiContentDisplay.remove();
//     }
// });
// 獲取 DOM 元素
// 獲取 DOM 元素
const startGameBtn = document.getElementById('start-game-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const startTermInput = document.getElementById('start-term');
const endTermInput = document.getElementById('end-term');
const currentPageSpan = document.getElementById('current-page');
const targetPageSpan = document.getElementById('target-page');
const timeElapsedSpan = document.getElementById('time-elapsed');
const pathDisplaySpan = document.getElementById('path-display');
// const linksContainer = document.getElementById('links-container'); // 移除：不再需要 linksContainer
const wikiContentDisplay = document.getElementById('wiki-content-display');
const gameSetupDiv = document.getElementById('game-setup');
const gamePlayDiv = document.getElementById('game-play');
const gameResultsDiv = document.getElementById('game-results');
const finalPathSpan = document.getElementById('final-path');
const finalTimeSpan = document.getElementById('final-time');
const messageBox = document.getElementById('message-box');
const messageContent = document.getElementById('message-content');
const messageBoxOkBtn = document.getElementById('message-box-ok');

// 遊戲狀態變數
let currentPath = [];
let startTime;
let timerInterval;
let currentPage = '';
let targetPage = '';
let currentAvailableGameLinks = []; // 儲存當前頁面有效的遊戲連結

// 後端 API 的基礎 URL
const BACKEND_API_BASE_URL = 'https://cdbd-114-36-35-76.ngrok-free.app';

// 顯示訊息框
function showMessage(message) {
    messageContent.textContent = message;
    messageBox.classList.remove('hidden');
}

// 隱藏訊息框
messageBoxOkBtn.addEventListener('click', () => {
    messageBox.classList.add('hidden');
});

// 格式化時間為 MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// 更新計時器顯示
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timeElapsedSpan.textContent = formatTime(elapsedTime);
}

// 開始遊戲
startGameBtn.addEventListener('click', async () => {
    const start = startTermInput.value.trim();
    const end = endTermInput.value.trim();

    if (!start || !end) {
        showMessage('請輸入起點詞彙和終點詞彙！');
        return;
    }
    if (start === end) {
        showMessage('起點詞彙和終點詞彙不能相同！');
        return;
    }

    // 檢查起始詞彙是否存在 (通過嘗試獲取其內容和連結)
    try {
        const { gameLinks } = await fetchContentFromBackend(start);
        if (gameLinks.length === 0 && start !== end) {
            showMessage(`起點詞彙 "${start}" 未找到任何連結或頁面不存在，請嘗試其他詞彙。`);
            return;
        }
    } catch (error) {
        showMessage(`無法連接到後端或起點詞彙 "${start}" 頁面不存在/發生錯誤。請確保後端伺服器已運行。`);
        return;
    }

    currentPage = start;
    targetPage = end;
    currentPath = [currentPage];
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    // 更新 UI
    currentPageSpan.textContent = currentPage;
    targetPageSpan.textContent = targetPage;
    pathDisplaySpan.textContent = currentPath.join(' > ');
    timeElapsedSpan.textContent = '00:00';

    gameSetupDiv.classList.add('hidden');
    gamePlayDiv.classList.remove('hidden');
    gameResultsDiv.classList.add('hidden');

    await loadPageContentAndLinks(currentPage); // 等待內容和連結加載完成
});

// 從後端獲取頁面內容和連結
async function fetchContentFromBackend(pageTitle) {
    try {
        const encodedPageTitle = encodeURIComponent(pageTitle);
        // URL 使用您最新確認可用的這個
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/page_content?title=${encodedPageTitle}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP 錯誤：${response.status}`);
        }

        const data = await response.json();
        return {
            htmlContent: data.html_content || '',
            gameLinks: data.game_links || []
        };
    } catch (error) {
        console.error('從後端獲取內容失敗:', error);
        throw error;
    }
}

// 加載頁面內容和連結
async function loadPageContentAndLinks(page) {
    // linksContainer.innerHTML = ''; // 移除：不再需要清空連結按鈕區塊
    wikiContentDisplay.innerHTML = '<p class="text-gray-600 text-center">載入中...</p>'; // 顯示載入中訊息

    let pageHtmlContent = '';
    let gameLinks = [];

    try {
        const data = await fetchContentFromBackend(page);
        pageHtmlContent = data.htmlContent;
        gameLinks = data.gameLinks;
        currentAvailableGameLinks = gameLinks; // 更新當前頁面有效的遊戲連結列表
    } catch (error) {
        showMessage(`無法獲取 "${page}" 的內容：${error.message}`);
        wikiContentDisplay.innerHTML = '<p class="text-red-600 text-center">無法載入頁面內容。</p>';
        // linksContainer.innerHTML = '<p class="text-red-600 text-center">無法載入連結。</p>'; // 移除：不再需要連結按鈕的錯誤訊息
        return;
    }

    // 將 HTML 內容注入到顯示區塊
    wikiContentDisplay.innerHTML = pageHtmlContent;

    // 關鍵步驟：劫持點擊事件和樣式化連結
    const allLinksInContent = wikiContentDisplay.querySelectorAll('a[href^="/wiki/"]');
    allLinksInContent.forEach(linkElement => {
        const originalHref = linkElement.getAttribute('href');
        if (originalHref && originalHref.startsWith('/wiki/')) {
            const linkTitleEncoded = originalHref.split('/wiki/')[1];
            const linkTitle = decodeURIComponent(linkTitleEncoded).replace(/_/g, ' ');

            // 添加藍色樣式
            linkElement.classList.add('wiki-link');

            // 阻止預設導航行為並觸發遊戲邏輯
            linkElement.addEventListener('click', (event) => {
                event.preventDefault(); // 阻止瀏覽器跳轉
                // 只有當這個連結是後端返回的有效遊戲連結時才觸發 clickLink
                if (currentAvailableGameLinks.includes(linkTitle)) {
                    clickLink(linkTitle);
                } else {
                    // 如果點擊的不是有效遊戲連結，可以給個提示或者忽略
                    showMessage(`"${linkTitle}" 不是一個有效的遊戲連結。請點擊文章內容中的藍色連結。`);
                }
            });
            linkElement.removeAttribute('rel'); // 移除 nofollow
        }
    });

    // 移除：不再生成連結按鈕
    // linksContainer.innerHTML = ''; 
    // if (gameLinks.length === 0 && page !== targetPage) {
    //     linksContainer.innerHTML = '<p class="text-gray-600 text-center">此頁面未找到遊戲所需有效連結。</p>';
    // } else {
    //     gameLinks.forEach(link => {
    //         const button = document.createElement('button');
    //         button.textContent = link;
    //         button.classList.add(
    //             'bg-gray-200', 'hover:bg-blue-200', 'text-gray-800', 'font-semibold',
    //             'py-2', 'px-4', 'rounded-lg', 'shadow-sm', 'transition', 'duration-200',
    //             'text-sm', 'sm:text-base', 'truncate'
    //         );
    //         if (link === targetPage) {
    //             button.classList.add('!bg-green-500', '!hover:bg-green-600', '!text-white');
    //         }
    //         button.addEventListener('click', () => clickLink(link));
    //         linksContainer.appendChild(button);
    //     });
    // }
}

// 點擊連結
async function clickLink(link) {
    currentPage = link;
    currentPath.push(currentPage);
    pathDisplaySpan.textContent = currentPath.join(' > ');
    currentPageSpan.textContent = currentPage;

    if (currentPage === targetPage) {
        clearInterval(timerInterval); // 停止計時器
        const finalElapsedTime = Math.floor((Date.now() - startTime) / 1000);

        finalPathSpan.textContent = currentPath.join(' > ');
        finalTimeSpan.textContent = formatTime(finalElapsedTime);

        gamePlayDiv.classList.add('hidden');
        gameResultsDiv.classList.remove('hidden');
    } else {
        await loadPageContentAndLinks(currentPage); // 等待內容和連結加載完成
    }
}

// 重設遊戲
resetGameBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    currentPath = [];
    startTime = 0;
    currentPage = '';
    targetPage = '';
    currentAvailableGameLinks = [];

    startTermInput.value = '';
    endTermInput.value = '';
    // linksContainer.innerHTML = ''; // 移除：不再需要清空連結按鈕
    wikiContentDisplay.innerHTML = ''; // 清空維基百科內容顯示

    gameSetupDiv.classList.remove('hidden');
    gamePlayDiv.classList.add('hidden');
    gameResultsDiv.classList.add('hidden');
});

// 再玩一次
playAgainBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    currentPath = [];
    startTime = 0;
    currentPage = '';
    targetPage = '';
    currentAvailableGameLinks = [];

    startTermInput.value = '';
    endTermInput.value = '';
    // linksContainer.innerHTML = ''; // 移除：不再需要清空連結按鈕
    wikiContentDisplay.innerHTML = ''; // 清空維基百科內容顯示

    gameSetupDiv.classList.remove('hidden');
    gamePlayDiv.classList.add('hidden');
    gameResultsDiv.classList.add('hidden');
});

// 初始化時隱藏遊戲進行和結果區塊
document.addEventListener('DOMContentLoaded', () => {
    gamePlayDiv.classList.add('hidden');
    gameResultsDiv.classList.add('hidden');
    wikiContentDisplay.innerHTML = ''; // 確保初始化時維基百科內容區塊是空的
});