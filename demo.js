// ==============================================
// ১. ফায়ারবেস কনফিগারেশন (ব্যাকএন্ড চেকের জন্য)
// ==============================================
const firebaseConfig = {
    apiKey: "AIzaSyC8pt...", 
    authDomain: "crypto-dashboard.firebaseapp.com",
    projectId: "crypto-dash-project",
    // ... অন্যান্য ফায়ারবেস কী
};

// ==============================================
// ২. মেইন UI তৈরি করা (ড্যাশবোর্ড পপ-আপ)
// ==============================================
function createDashboardPopup() {
    // একটি ডিভ তৈরি করি যেখানে লিডারবোর্ড, ট্রেড বাটন থাকবে
    const popup = document.createElement('div');
    popup.id = 'customPopup';
    popup.innerHTML = `
        <h2>👑 SL TECH BD - লাইভ ট্রেডিং</h2>
        <label>আপনার লাইসেন্স কী দিন:</label>
        <input id="licenseInput" placeholder="e.g. SL_BD_2026">
        <button id="verifyBtn">✅ ভেরিফাই করুন</button>
        <div id="statusMsg"></div>
        
        <hr>
        <h3>🏆 লিডারবোর্ড (ফেক ডেটা)</h3>
        <div class="leaderboard">
            <!-- এখানে ফেক ট্রেডারদের নাম এবং লাভ দেখানো হয় -->
        </div>
        
        <button id="addTxBtn">➕ ট্রানজেকশন যোগ করুন</button>
        <div id="txForm" style="display:none">
            <select id="methodSelect">
                <option>Bkash (P2C)</option>
                <option>Nagad (P2C)</option>
                <option>Bitcoin (BTC)</option>
                <option>USDT (BEP-20)</option>
            </select>
            <input id="amountInput" placeholder="টাকার পরিমাণ">
            <button id="submitTx">জমা দিন</button>
        </div>
    `;
    document.body.appendChild(popup);
}

// ==============================================


// ==============================================
// ৪. ফেক ট্রানজেকশন যোগ করা এবং লোকাল স্টোরেজে সেভ করা
// ==============================================
function addTransaction() {
    const method = document.getElementById('methodSelect').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const profit = (Math.random() * 10).toFixed(2); // +২% থেকে +১০% পর্যন্ত র‍্যান্ডম লাভ দেখায়
    
    const txData = {
        id: Date.now(),
        type: 'Deposit',
        method: method,
        amount: amount,
        profit: profit + '%',
        status: 'Processing' // কিছুক্ষণ পর 'Successed' হয়ে যায়
    };

    // লোকাল স্টোরেজে সেভ করে (যাতে পেজ রিফ্রেশ করলেও ডেটা থাকে)
    let allTxs = JSON.parse(localStorage.getItem('transactions')) || [];
    allTxs.push(txData);
    localStorage.setItem('transactions', JSON.stringify(allTxs));
    
    alert('✅ টাকা জমা হয়েছে! কিন্তু মনে রাখবেন, এই টাকা আসলে কোথাও যায় না, শুধু আপনার ব্রাউজারে দেখায়!');
    updateLeaderboardUI(); // UI আপডেট করে
}

// ==============================================
// ৫. লাভ/লোকসানের রঙ পরিবর্তন করা (লাল/সবুজ)
// ==============================================
function updateBalanceUI() {
    // পেজের যেকোনো জায়গায় যেখানে "$" চিহ্ন আছে, সেখানে গিয়ে
    document.querySelectorAll('.profit-amount').forEach(el => {
        let value = parseFloat(el.innerText.replace('$', ''));
        if (value > 0) {
            el.style.color = '#2ecc71'; // সবুজ (লাভ)
        } else {
            el.style.color = '#e74c3c'; // লাল (লোকসান)
        }
    });
}

// ==============================================
// ৬. ডিভাইস লিমিট চেক করা (একাধিক ডিভাইসে লগইন আটকানোর ভান)
// ==============================================
function checkDeviceLimit() {
    const deviceID = localStorage.getItem('uniqueDeviceID') || 'DEVICE_' + Math.random();
    // ফায়ারবেসে 'activeDevices' আপডেট করে
    // যদি ৩ এর বেশি ডিভাইস থাকে, তাহলে "Device limit exceeded" দেখায়
}

// ==============================================
// ৭. সবকিছু চালু করার জন্য ইভেন্ট লিসেনার
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    createDashboardPopup(); // UI বানাও
    document.getElementById('verifyBtn').addEventListener('click', verifyLicense);
    document.getElementById('addTxBtn').addEventListener('click', function() {
        document.getElementById('txForm').style.display = 'block';
    });
    document.getElementById('submitTx').addEventListener('click', addTransaction);
    
    // প্রতি ৩ সেকেন্ড পর পর UI আপডেট করে (রিয়েল টাইম দেখানোর ভান)
    setInterval(updateBalanceUI, 3000);
});
