const API_URL = "http://localhost:5000/api";
let currentEmail = "";
let currentPurpose = ""; // SIGNUP, LOGIN, or FORGOT_PASSWORD
let savedOtpForReset = ""; // Temporary storage for reset flow

// --- 1. SIGNUP & LOGIN ---
async function handleAuth(type) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) return alert("Fill in all fields");

    const res = await fetch(`${API_URL}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
        currentEmail = email;
        currentPurpose = type.toUpperCase(); // 'SIGNUP' or 'LOGIN'
        alert(data.message);
        showSection('otp-card');
    } else {
        alert(data.message); // This will show Rate Limit errors too!
    }
}

// --- 2. FORGOT PASSWORD ---
async function handleForgot() {
    const email = document.getElementById('forgot-email').value;
    if (!email) return alert("Email required");

    const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (data.success) {
        currentEmail = email;
        currentPurpose = "FORGOT_PASSWORD";
        alert("Reset code sent!");
        showSection('otp-card');
    } else {
        alert(data.message);
    }
}

// --- 3. OTP VERIFICATION (The "Gatekeeper") ---
async function handleVerify() {
    const otp = document.getElementById('otp-input').value;

    // A. If it's Forgot Password flow, we verify differently
    if (currentPurpose === "FORGOT_PASSWORD") {
        // In your logic, resetPassword handles both OTP check and Password update.
        // So we just save the OTP and move to the password entry screen.
        savedOtpForReset = otp;
        showSection('reset-card');
    } else {
        // B. Normal Login/Signup flow
        const res = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            credentials: "include",   // ✅ ADD THIS
            headers: { 'Content-Type': 'application/json' },
            // We pass purpose so backend finds the right OTP type
            body: JSON.stringify({ email: currentEmail, otp, purpose: currentPurpose })
        });
        const data = await res.json();

        // if (data.success) {
        //     alert("Verified! Token saved in HTTP-only cookie.");
        //     window.location.href = "dashboard.html";
        // } 
           if (data.success) {
               alert("Verified! Token saved in HTTP-only cookie.");
               console.log("Login successful. You can now call protected APIs.");
   } 
else {
            alert(data.message); // Shows "Invalid OTP", "Expired", or "Blocked"
        }
    }
}

// --- 4. FINAL PASSWORD RESET ---
async function handleResetSubmit() {
    const newPassword = document.getElementById('new-password').value;

    const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: currentEmail, 
            otp: savedOtpForReset, 
            newPassword 
        })
    });
    const data = await res.json();

    if (data.success) {
        alert("Password updated! Please login.");
        location.reload();
    } else {
        alert(data.message);
    }
}

// UI Switcher
function showSection(id) {
    document.querySelectorAll('.card').forEach(c => c.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}