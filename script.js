// Initialize EmailJS
(function() {
    emailjs.init("kx05s4SsmQKz1XFYH");
})();

// Toggle Report Section
function toggleReportSection() {
    const reportContent = document.getElementById('reportContent');
    const reportToggleIcon = document.getElementById('reportToggleIcon');
    
    if (reportContent.classList.contains('hidden')) {
        reportContent.classList.remove('hidden');
        reportContent.classList.add('show');
        reportToggleIcon.style.transform = 'rotate(180deg)';
        reportToggleIcon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    } else {
        reportContent.classList.remove('show');
        reportContent.classList.add('hidden');
        reportToggleIcon.style.transform = 'rotate(0deg)';
        reportToggleIcon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    }
}

// Toggle Search Section
function toggleSearchSection() {
    const searchContent = document.getElementById('searchContent');
    const toggleIcon = document.getElementById('toggleIcon');
    
    console.log('Toggle clicked');
    console.log('Current classes:', toggleIcon.className);
    
    if (searchContent.classList.contains('hidden')) {
        searchContent.classList.remove('hidden');
        searchContent.classList.add('show');
        toggleIcon.style.transform = 'rotate(180deg)';
        toggleIcon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        console.log('Applied direct rotation');
    } else {
        searchContent.classList.remove('show');
        searchContent.classList.add('hidden');
        toggleIcon.style.transform = 'rotate(0deg)';
        toggleIcon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        console.log('Removed direct rotation');
    }
}

// 1. YOUR SUPABASE CONFIGURATION
const SUPABASE_URL = "https://kmwqrivcwbnjszektpfv.supabase.co";
const supabaseKey = 'REPLACE_WITH_KEY';
const API_URL = `${SUPABASE_URL}/rest/v1/stolen_devices`;
const PUBLIC_API_URL = `${SUPABASE_URL}/rest/v1/public_imei_check`;

// Progress Bar Update Function
function updateProgress() {
    console.log('updateProgress called');
    
    const fields = [
        'fullName',
        'contactEmail', 
        'deviceMake',
        'deviceImei',
        'sapsCase',
        'itcNumber'
    ];
    
    let filledFields = 0;
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() !== '') {
            filledFields++;
            console.log(`Field ${fieldId} is filled: ${field.value}`);
        }
    });
    
    const progress = Math.round((filledFields / fields.length) * 100);
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    console.log(`Progress: ${progress}%, Fill element:`, progressFill, 'Text element:', progressText);
    
    if (progressFill && progressText) {
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        console.log(`Updated progress bar to ${progress}%`);
        
        // Add completion effect
        if (progress === 100) {
            progressFill.style.background = 'linear-gradient(90deg, #198754, #146c43)';
            progressText.textContent = '✓ Complete';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, var(--primary), #004494)';
        }
    } else {
        console.log('Progress bar elements not found');
    }
}

// Overlay System Functions
function openIMEICheck() {
    const overlay = document.getElementById('overlayContainer');
    const title = document.getElementById('overlayTitle');
    const body = document.getElementById('overlayBody');
    
    title.textContent = 'Check Device IMEI';
    body.innerHTML = `
        <div class="search-intro">
            <p>Enter the 15-digit IMEI number below to instantly check if the device has been reported stolen in South Africa's community registry.</p>
        </div>
        
        <div class="search-box">
            <input type="text" id="searchImei" placeholder="Enter 15-digit IMEI" maxlength="15">
            <button id="btnSearch" onclick="searchRegistry()">Search Registry</button>
        </div>
        
        <div id="searchResult" class="result-box hidden"></div>
        
        <div class="help-text">
            <small> <strong>How to find IMEI:</strong> Dial *#06# on the device or check Settings > About Phone</small>
        </div>
    `;
    
    overlay.classList.add('visible');
    
    // Focus on input after animation
    setTimeout(() => {
        document.getElementById('searchImei').focus();
    }, 400);
}

function openStolenReport() {
    const overlay = document.getElementById('overlayContainer');
    const title = document.getElementById('overlayTitle');
    const body = document.getElementById('overlayBody');
    
    title.textContent = 'Report Stolen Device';
    body.innerHTML = `
        <div class="report-intro">
            <p>Submit a stolen device report to help protect the South African community. All reports require valid SAPS case numbers and ITC references to prevent abuse.</p>
        </div>
        
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill">
                    <span class="progress-text" id="progressText">0%</span>
                </div>
            </div>
        </div>
        
        <form id="reportForm" onsubmit="handleReport(event)">
            <div class="form-group">
                <label for="fullName">Your Full Name</label>
                <input type="text" id="fullName" required placeholder="e.g. John Doe" oninput="updateProgress()">
            </div>

            <div class="form-group">
                <label for="contactEmail">Your Email Address</label>
                <input type="email" id="contactEmail" required placeholder="e.g. john@example.com" oninput="updateProgress()">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="deviceMake">Device Make & Model</label>
                    <input type="text" id="deviceMake" required placeholder="e.g. Samsung S23 FE" oninput="updateProgress()">
                </div>
                <div class="form-group">
                    <label for="deviceImei">15-Digit IMEI Number</label>
                    <input type="text" id="deviceImei" required maxlength="15" placeholder="Enter exactly 15 digits" oninput="updateProgress()">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="sapsCase">SAPS Case Number</label>
                    <input type="text" id="sapsCase" required placeholder="e.g. CAS 123/04/2026" oninput="updateProgress()">
                </div>
                <div class="form-group">
                    <label for="itcNumber">ITC Reference Number</label>
                    <input type="text" id="itcNumber" required placeholder="Issued by Telkom/Vodacom/MTN" oninput="updateProgress()">
                </div>
            </div>

            <button type="submit" class="btn-submit">Submit Official Report</button>
            <div id="formFeedback" class="feedback hidden"></div>
        </form>
    `;
    
    overlay.classList.add('visible');
    
    // Add event listeners to form fields
    setTimeout(() => {
        const fields = ['fullName', 'contactEmail', 'deviceMake', 'deviceImei', 'sapsCase', 'itcNumber'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', updateProgress);
                console.log(`Added event listener to ${fieldId}`);
            }
        });
        
        // Initialize progress bar
        updateProgress();
    }, 100);
    
    // Focus on first input after animation
    setTimeout(() => {
        document.getElementById('fullName').focus();
    }, 400);
}

function closeOverlay() {
    const overlay = document.getElementById('overlayContainer');
    overlay.classList.remove('visible');
    
    // Clear any running animations
    stopAnimations();
}

// Close on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeOverlay();
    }
});

// Landscape Detection and Fallback
function detectLandscape() {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    
    if (isLandscape) {
        console.log('🔄 Landscape mode activated');
    } else {
        console.log('📱 Portrait mode activated');
    }
}

// Initialize landscape detection
window.addEventListener('orientationchange', detectLandscape);
window.addEventListener('resize', detectLandscape);
detectLandscape();

// Utility function to validate IMEI format
function validateIMEI(imei) {
    // Remove any spaces or dashes
    const cleanIMEI = imei.replace(/[\s-]/g, '');

    // Check if exactly 15 digits
    if (!/^\d{15}$/.test(cleanIMEI)) {
        return false;
    }

    // Luhn algorithm validation
    let sum = 0;
    for (let i = 0; i < 15; i++) {
        let digit = parseInt(cleanIMEI[i]);

        // Double every second digit (starting from the second digit at index 1)
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }

    return sum % 10 === 0;
}

// 1. Handle Search Feature
async function searchRegistry() {
    const searchInput = document.getElementById("searchImei").value.trim();
    const resultBox = document.getElementById("searchResult");
    
    if (!validateIMEI(searchInput)) {
        showUIResult("searchResult", "Error: Invalid IMEI.", "alert-danger");
        return;
    }

    try {
        const response = await fetch(`${PUBLIC_API_URL}?imei=eq.${searchInput}`, {
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });
        const data = await response.json();
        console.log("Search result:", data);

        if (data.length > 0) {
            const device = data[0];
            resultBox.innerHTML = `
                <div class="alert-content">
                    <p>⚠️ <strong>STOLEN DEVICE DETECTED</strong></p>
                    <p>Model: ${device.make_model} | SAPS: ${device.saps_case}</p>
                    <button class="btn-submit" onclick="openContactForm('${device.id}')" style="margin-top:10px; background:var(--dark)">
                        Send Secure Message to Owner
                    </button>
                </div>
            `;
            resultBox.classList.add('alert-danger');
            resultBox.classList.remove('hidden');
            
            // STAGE 4: Automated Notification
            notifyOwner(device); 
        } else {
            showUIResult("searchResult", "✅ CLEAR: No records found.", "alert-success");
        }
    } catch (err) {
        showUIResult("searchResult", "Connection error.", "alert-danger");
    }
}

/**
 * Sends a silent alert to the victim that someone is checking their phone
 */
function notifyOwner(device) {
    const templateParams = {
        to_email: device.victim_email,
        victim_name: device.victim_name,
        device_name: device.make_model,
        imei_number: device.imei,
        location_hint: "A search was recently performed on VerifyBlacklistSA"
    };

    emailjs.send('service_5dxr27f', 'template_073tdi5', templateParams)
        .then(() => console.log('Victim notified!'))
        .catch((error) => console.error('Notification failed', error));
}

// Helper function to show UI results consistently
function showUIResult(elementId, message, alertClass) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `result-box ${alertClass}`;
    element.classList.remove('hidden');
}

// 2. Handle Report Submission
async function handleReport(event) {
    event.preventDefault();

    const imei = document.getElementById("deviceImei").value.trim();
    const feedback = document.getElementById("formFeedback");

    // Reset layout
    feedback.className = "feedback hidden";

    if (!validateIMEI(imei)) {
        feedback.textContent = "Error: Submission blocked. Your IMEI failed the validation algorithm check.";
        feedback.classList.add("alert-danger");
        feedback.classList.remove("hidden");
        return;
    }

    // Build Payload
    const submissionData = {
        name: document.getElementById("fullName").value,
        email: document.getElementById("contactEmail").value,
        device: document.getElementById("deviceMake").value,
        imei: imei,
        saps: document.getElementById("sapsCase").value,
        itc: document.getElementById("itcNumber").value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imei: imei,
                make_model: document.getElementById("deviceMake").value,
                saps_case: document.getElementById("sapsCase").value,
                itc_number: document.getElementById("itcNumber").value,
                victim_name: document.getElementById("fullName").value,
                victim_email: document.getElementById("contactEmail").value,
                status: 'Pending'
            })
        });

        if (response.ok) {
            feedback.textContent = "Success! The device has been securely added to the stolen phone registry.";
            feedback.classList.add("alert-success");
            feedback.classList.remove("hidden");
            
            // Clear form
            document.getElementById("reportForm").reset();
        } else {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(errorData.message || `HTTP ${response.status}: Failed to save report`);
        }
    } catch (err) {
        console.error("Submission error:", err);
        feedback.textContent = `Error: ${err.message || "Failed to save report. Please try again."}`;
        feedback.classList.add("alert-danger");
        feedback.classList.remove("hidden");
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#198754' : '#dc3545'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Toast notification function positioned near the send button
function showToastNearButton(message, type = 'success') {
    // Find the send button
    const sendButton = document.querySelector('#contactOwnerForm button[type="submit"]');
    if (!sendButton) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Get button position
    const buttonRect = sendButton.getBoundingClientRect();
    
    // Style the toast to appear near the button
    toast.style.cssText = `
        position: fixed;
        top: ${buttonRect.top - 50}px;
        left: ${buttonRect.left}px;
        background: ${type === 'success' ? '#198754' : '#dc3545'};
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        font-size: 14px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 2.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2500);
}

// Open Contact Form for Device Owner
function openContactForm(deviceId) {
    const body = document.getElementById('overlayBody');
    const title = document.getElementById('overlayTitle');
    
    title.textContent = 'Contact Device Owner';
    
    body.innerHTML = `
        <div class="report-intro">
            <p>Your message will be sent securely to the person who reported this device (ID: ${deviceId}). Please provide details on where the device was seen.</p>
        </div>
        <form id="contactOwnerForm" onsubmit="sendManualMessage(event, '${deviceId}')">
            <div class="form-group">
                <label for="finderMessage">Your Message</label>
                <textarea id="finderMessage" required placeholder="I found this device at..." rows="4" style="width:100%; border-radius:8px; padding:10px; margin-bottom:15px;"></textarea>
            </div>
            <div class="form-group">
                <label for="finderContact">Your Contact Details (Optional)</label>
                <input type="text" id="finderContact" placeholder="Phone number or email">
            </div>
            <button type="submit" class="btn-submit">Send Message</button>
        </form>
        <div id="contactFeedback" class="feedback hidden"></div>
    `;
}

// Logic to actually send the email via EmailJS
async function sendManualMessage(event, deviceId) {
    event.preventDefault();
    
    // Grabbing the data from your website form
    const userTypedMessage = document.getElementById('finderMessage').value;
    const userTypedContact = document.getElementById('finderContact').value;
    const feedback = document.getElementById('contactFeedback');
    
    // Get the IMEI from the search input (where the user originally searched)
    const userTypedIMEI = document.getElementById('searchImei').value || "Not Provided";

    // Bundling it up to match your Template Keys
    const templateParams = {
        message: userTypedMessage,        // Sends user's text to {{message}}
        imei_number: userTypedIMEI,      // Sends the IMEI to {{imei_number}}
        cas_number: "Not Provided",        // You can set defaults if the user leaves it blank
        finder_contact: userTypedContact  // Optional contact info
    };

    try {
        await emailjs.send('service_2h3n4k8', 'template_073tdi5', templateParams);
        
        // Show toast notification near the send button
        showToastNearButton("Message sent!", "success");
        
        // Clear form immediately
        const form = document.getElementById('contactOwnerForm');
        if (form) {
            form.reset();
        }
        
        // Close overlay after delay
        setTimeout(() => {
            closeOverlay();
        }, 2000);
        
    } catch (error) {
        feedback.textContent = "Failed to send message.";
        feedback.className = "result-box alert-danger";
        feedback.classList.remove('hidden');
    }
}
