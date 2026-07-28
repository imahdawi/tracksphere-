// ================================================================
//  🤖 AI ASSISTANT MODULE - مع Gemini API
// ================================================================

// ====== مفتاح API (استبدله بمفتاحك) ======
var GEMINI_API_KEY = '';

// ====== معرفة التطبيق ======
var APP_CONTEXT = `
أنت مساعد ذكي لتطبيق TrackSphere، تطبيق لتتبع العادات اليومية.
معلومات عن التطبيق:
- الاسم: TrackSphere
- المطور: مهدي أحمد
- الوظيفة: تتبع العادات اليومية، تسجيل التقدم، متابعة السلسلة (Streak)، نقاط، إنجازات، رسوم بيانية، مشاركة.
- المميزات: إضافة عادات، تسجيل يومي، سلسلة، نقاط، إنجازات، مشاركة، إشعارات، نسخ احتياطي.

المستخدم هيسألك عن حاجات في التطبيق أو حاجات عامة.
لو السؤال عن التطبيق، جاوب بمعلومات دقيقة عن TrackSphere.
لو السؤال عام، جاوب برد مفيد وذكي من عندك.
خلي ردودك مختصرة ومفيدة (حد أقصى 3 جمل).
`;

// ================================================================
//  💬 الرد باستخدام Gemini API
// ================================================================

function askAI(query) {
    if (!query || query.trim() === '') {
        return '👋 مرحباً! أنا مساعد TrackSphere الذكي. اسألني أي حاجة!';
    }

    // ✅ 1. نرجع رد من API
    return fetchGeminiResponse(query);
}

// ================================================================
//  🌐 الاتصال بـ Gemini API
// ================================================================

function fetchGeminiResponse(query) {
    // نجيب الرد من الـ API
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

    var data = {
        contents: [{
            parts: [{
                text: APP_CONTEXT + '\n\nسؤال المستخدم: ' + query + '\n\nالرد:'
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
            topP: 0.9
        }
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('API error: ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            var text = data.candidates[0].content.parts[0].text;
            return text;
        } else {
            return '⚠️ آسف، حصل خطأ. جرب تسأل بشكل مختلف.';
        }
    })
    .catch(function(error) {
        console.error('AI Error:', error);
        // لو فشل الـ API، نرجع رد من المعرفة المحلية
        return fallbackResponse(query);
    });
}

// ================================================================
//  📚 الرد الاحتياطي (لو الـ API وقع)
// ================================================================

function fallbackResponse(query) {
    var lowerQuery = query.toLowerCase();

    var fallbacks = {
        'اضيف عادة': 'اكتب اسم العادة في حقل الإضافة، اختار التصنيف، واضغط "أضف".',
        'سجل عادة': 'اضغط على زر ✔️ بجانب العادة في القائمة.',
        'السلسلة': 'السلسلة هي عدد الأيام المتتالية اللي حافظت فيها على عادة.',
        'النقاط': 'النقاط مكافآت بتحصل عليها عند تسجيل العادات.',
        'الإنجازات': 'جوائز بتحصل عليها عند تحقيق أهداف معينة.',
        'شارك': 'اضغط على زر مشاركة واختار الطريقة المناسبة.',
        'نسخ احتياطي': 'اضغط على زر "تصدير البيانات" في قسم المشاركة.'
    };

    for (var key in fallbacks) {
        if (lowerQuery.indexOf(key) !== -1) {
            return fallbacks[key];
        }
    }

    return '🤔 سؤال جميل! أنا حالياً في وضع عدم الاتصال. جرب تسأل عن: إضافة عادة، تسجيل، السلسلة، النقاط، أو الإنجازات.';
}

// ================================================================
//  🖥️ واجهة المحادثة (نفس الكود السابق)
// ================================================================

function createAIChat() {
    var chatHTML = `
        <div style="
            position: fixed;
            bottom: 80px;
            right: 16px;
            width: 340px;
            max-width: 90vw;
            max-height: 450px;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.5);
            z-index: 99999;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Cairo', sans-serif;
        " id="ai-chat-box">
            <div style="
                padding: 12px 16px;
                background: var(--primary);
                color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            ">
                <span style="font-weight: 700;">🤖 مساعد TrackSphere</span>
                <button onclick="closeAIChat()" style="
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 1.2rem;
                    cursor: pointer;
                ">✕</button>
            </div>
            <div style="
                flex: 1;
                padding: 12px 16px;
                overflow-y: auto;
                min-height: 150px;
                max-height: 280px;
                background: var(--bg);
            " id="ai-chat-messages">
                <div style="
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    text-align: center;
                    padding: 20px 0;
                ">
                    👋 مرحباً! أنا مساعد TrackSphere الذكي. اسألني أي حاجة!
                </div>
            </div>
            <div style="
                padding: 10px 12px;
                border-top: 1px solid var(--border);
                display: flex;
                gap: 8px;
                background: var(--bg);
            ">
                <input type="text" id="ai-chat-input" placeholder="اسأل أي حاجة..." style="
                    flex: 1;
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    background: var(--card);
                    color: var(--text);
                    font-family: 'Cairo', sans-serif;
                    outline: none;
                    font-size: 0.9rem;
                " onkeydown="if(event.key==='Enter') sendAIMessage()">
                <button onclick="sendAIMessage()" style="
                    padding: 8px 16px;
                    border: none;
                    border-radius: 8px;
                    background: var(--primary);
                    color: #fff;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'Cairo', sans-serif;
                ">إرسال</button>
            </div>
        </div>
        <button onclick="toggleAIChat()" style="
            position: fixed;
            bottom: 20px;
            right: 16px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: none;
            background: var(--primary);
            color: #fff;
            font-size: 1.8rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(108,99,255,0.4);
            z-index: 99998;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        " id="ai-chat-toggle">
            🤖
        </button>
    `;

    var container = document.createElement('div');
    container.id = 'ai-container';
    container.innerHTML = chatHTML;
    document.body.appendChild(container);

    var style = document.createElement('style');
    style.textContent = `
        #ai-chat-box {
            animation: slideUp 0.3s ease;
        }
        #ai-chat-messages::-webkit-scrollbar {
            width: 4px;
        }
        #ai-chat-messages::-webkit-scrollbar-track {
            background: var(--bg);
        }
        #ai-chat-messages::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 10px;
        }
        .ai-message-user {
            background: var(--primary);
            color: #fff;
            padding: 8px 14px;
            border-radius: 12px 12px 0 12px;
            margin: 4px 0 4px auto;
            max-width: 85%;
            width: fit-content;
            font-size: 0.9rem;
        }
        .ai-message-bot {
            background: var(--card);
            color: var(--text);
            padding: 8px 14px;
            border-radius: 12px 12px 12px 0;
            margin: 4px auto 4px 0;
            max-width: 85%;
            width: fit-content;
            font-size: 0.9rem;
            border: 1px solid var(--border);
            white-space: pre-line;
        }
        .ai-message-loading {
            background: var(--card);
            color: var(--text-secondary);
            padding: 8px 14px;
            border-radius: 12px 12px 12px 0;
            margin: 4px auto 4px 0;
            max-width: 85%;
            width: fit-content;
            font-size: 0.85rem;
            border: 1px solid var(--border);
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ====== تبديل المحادثة ======
function toggleAIChat() {
    var box = document.getElementById('ai-chat-box');
    if (box) {
        box.style.display = box.style.display === 'flex' ? 'none' : 'flex';
        if (box.style.display === 'flex') {
            document.getElementById('ai-chat-input').focus();
        }
    }
}

// ====== إغلاق المحادثة ======
function closeAIChat() {
    var box = document.getElementById('ai-chat-box');
    if (box) {
        box.style.display = 'none';
    }
}

// ====== إرسال رسالة ======
function sendAIMessage() {
    var input = document.getElementById('ai-chat-input');
    var messages = document.getElementById('ai-chat-messages');

    if (!input || !messages) return;

    var query = input.value.trim();
    if (!query) return;

    // إضافة رسالة المستخدم
    var userMsg = document.createElement('div');
    userMsg.className = 'ai-message-user';
    userMsg.textContent = query;
    messages.appendChild(userMsg);

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // إضافة رسالة تحميل
    var loadingMsg = document.createElement('div');
    loadingMsg.className = 'ai-message-loading';
    loadingMsg.textContent = '⏳ جاري التفكير...';
    messages.appendChild(loadingMsg);
    messages.scrollTop = messages.scrollHeight;

    // جلب الرد من API
    askAI(query).then(function(response) {
        // إزالة رسالة التحميل
        if (loadingMsg.parentNode) {
            loadingMsg.parentNode.removeChild(loadingMsg);
        }

        // إضافة الرد
        var botMsg = document.createElement('div');
        botMsg.className = 'ai-message-bot';
        botMsg.textContent = response;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }).catch(function(error) {
        // إزالة رسالة التحميل
        if (loadingMsg.parentNode) {
            loadingMsg.parentNode.removeChild(loadingMsg);
        }

        var botMsg = document.createElement('div');
        botMsg.className = 'ai-message-bot';
        botMsg.textContent = '⚠️ حصل خطأ في الاتصال. حاول مرة أخرى.';
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    });
}

// ====== تعديل askAI عشان ترجع Promise ======
function askAI(query) {
    if (!query || query.trim() === '') {
        return Promise.resolve('👋 مرحباً! أنا مساعد TrackSphere الذكي. اسألني أي حاجة!');
    }

    return fetchGeminiResponse(query);
}

// ================================================================
//  🌐 الاتصال بـ Gemini API
// ================================================================

function fetchGeminiResponse(query) {
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

    var data = {
        contents: [{
            parts: [{
                text: APP_CONTEXT + '\n\nسؤال المستخدم: ' + query + '\n\nالرد:'
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
            topP: 0.9
        }
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('API error: ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            var text = data.candidates[0].content.parts[0].text;
            return text;
        } else {
            return '⚠️ آسف، حصل خطأ. جرب تسأل بشكل مختلف.';
        }
    })
    .catch(function(error) {
        console.error('AI Error:', error);
        return fallbackResponse(query);
    });
}

// ================================================================
//  📚 الرد الاحتياطي (لو الـ API وقع)
// ================================================================

function fallbackResponse(query) {
    var lowerQuery = query.toLowerCase();

    var fallbacks = {
        'اضيف عادة': 'اكتب اسم العادة في حقل الإضافة، اختار التصنيف، واضغط "أضف".',
        'سجل عادة': 'اضغط على زر ✔️ بجانب العادة في القائمة.',
        'السلسلة': 'السلسلة هي عدد الأيام المتتالية اللي حافظت فيها على عادة.',
        'النقاط': 'النقاط مكافآت بتحصل عليها عند تسجيل العادات.',
        'الإنجازات': 'جوائز بتحصل عليها عند تحقيق أهداف معينة.',
        'شارك': 'اضغط على زر مشاركة واختار الطريقة المناسبة.',
        'نسخ احتياطي': 'اضغط على زر "تصدير البيانات" في قسم المشاركة.'
    };

    for (var key in fallbacks) {
        if (lowerQuery.indexOf(key) !== -1) {
            return fallbacks[key];
        }
    }

    return '🤔 سؤال جميل! أنا حالياً في وضع عدم الاتصال. جرب تسأل عن: إضافة عادة، تسجيل، السلسلة، النقاط، أو الإنجازات.';
}

// ================================================================
//  🚀 التهيئة
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    createAIChat();
});

console.log('🤖 AI Assistant module loaded!');