// 1. YOUR SUPABASE CONFIGURATION
const SUPABASE_URL = "https://kmwqrivcwbnjszektpfv.supabase.co";
const SUPABASE_ANON_KEY = "ssb_publishable_ryWge16HjFSoFPo7nrBMQQ_CWaFDtMG";


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
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }
    
    return sum % 10 === 0;
}

// Search the registry for a stolen device
function searchRegistry() {
    const searchInput = document.getElementById('searchImei');
    const resultDiv = document.getElementById('searchResult');
    const searchButton = document.getElementById('btnSearch');
    
    const imei = searchInput.value.trim();
    
    // Clear previous results
    resultDiv.classList.add('hidden');
    
    // Validate IMEI format
    if (!imei) {
        showResult('Please enter an IMEI number.', 'error');
        return;
    }
    
    if (!validateIMEI(imei)) {
        showResult('Invalid IMEI format. Please enter exactly 15 digits.', 'error');
        return;
    }
    
    // Show loading state
    searchButton.innerHTML = '<span class="loading"></span> Searching...';
    searchButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        const stolenDevice = stolenDevices.find(device => device.imei === imei);
        
        if (stolenDevice) {
            showResult(`
                <strong>⚠️ DEVICE REPORTED STOLEN</strong><br>
                <strong>IMEI:</strong> ${stolenDevice.imei}<br>
                <strong>Device:</strong> ${stolenDevice.make}<br>
                <strong>Reported:</strong> ${stolenDevice.reportedDate}<br>
                <strong>SAPS Case:</strong> ${stolenDevice.sapsCase}<br>
                <strong>Reporter:</strong> ${stolenDevice.reporterName}<br>
                <br>
                <em>Do not purchase this device. Contact SAPS immediately.</em>
            `, 'warning');
        } else {
            showResult(`
                <strong>✅ Device Not Found in Registry</strong><br>
                This IMEI has not been reported stolen in our database.<br>
                <br>
                <em>Note: This doesn't guarantee the device is legitimate. Always verify the seller and device condition before purchasing.</em>
            `, 'success');
        }
        
        // Reset button
        searchButton.innerHTML = 'Search Registry';
        searchButton.disabled = false;
    }, 1500);
}

// Show search result
function showResult(message, type) {
    const resultDiv = document.getElementById('searchResult');
    resultDiv.innerHTML = message;
    resultDiv.className = `result-box ${type}`;
}

// Handle stolen device report form submission
function handleReport(event) {
    event.preventDefault();
    
    const form = document.getElementById('reportForm');
    const feedbackDiv = document.getElementById('formFeedback');
    const submitButton = form.querySelector('.btn-submit');
    
    // Get form values
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        contactEmail: document.getElementById('contactEmail').value.trim(),
        deviceMake: document.getElementById('deviceMake').value.trim(),
        deviceImei: document.getElementById('deviceImei').value.trim(),
        sapsCase: document.getElementById('sapsCase').value.trim(),
        itcNumber: document.getElementById('itcNumber').value.trim()
    };
    
    // Validate IMEI
    if (!validateIMEI(formData.deviceImei)) {
        showFeedback('Invalid IMEI format. Please enter exactly 15 digits.', 'error');
        return;
    }
    
    // Check if device already reported
    const existingReport = stolenDevices.find(device => device.imei === formData.deviceImei);
    if (existingReport) {
        showFeedback('This IMEI has already been reported in our registry.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<span class="loading"></span> Submitting Report...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Add to mock database
        const newReport = {
            imei: formData.deviceImei,
            make: formData.deviceMake,
            reportedDate: new Date().toISOString().split('T')[0],
            sapsCase: formData.sapsCase,
            reporterName: formData.fullName
        };
        
        stolenDevices.push(newReport);
        
        // Show success message
        showFeedback(`
            <strong>✅ Report Submitted Successfully!</strong><br>
            Your report has been added to the VerifyBlacklistSA registry.<br>
            <br>
            <strong>Report Details:</strong><br>
            IMEI: ${formData.deviceImei}<br>
            Device: ${formData.deviceMake}<br>
            SAPS Case: ${formData.sapsCase}<br>
            <br>
            <em>Thank you for helping protect our community from stolen devices.</em>
        `, 'success');
        
        // Reset form
        form.reset();
        submitButton.innerHTML = 'Submit Official Report';
        submitButton.disabled = false;
        
        // Clear feedback after 10 seconds
        setTimeout(() => {
            feedbackDiv.classList.add('hidden');
        }, 10000);
        
    }, 2000);
}

// Show form feedback
function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('formFeedback');
    feedbackDiv.innerHTML = message;
    feedbackDiv.className = `feedback ${type}`;
}

// Add input formatting and validation
document.addEventListener('DOMContentLoaded', function() {
    // IMEI input formatting (numbers only)
    const imeiInputs = document.querySelectorAll('input[type="text"][maxlength="15"]');
    imeiInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            const cleanedData = pastedData.replace(/[^0-9]/g, '').substring(0, 15);
            this.value = cleanedData;
        });
    });
    
    // Add enter key support for search
    document.getElementById('searchImei').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRegistry();
        }
    });
    
    // Email validation
    document.getElementById('contactEmail').addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.setCustomValidity('Please enter a valid email address.');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // SAPS case number formatting
    document.getElementById('sapsCase').addEventListener('input', function() {
        // Auto-format to CAS XXX/XX/XXXX pattern
        let value = this.value.toUpperCase();
        if (value.startsWith('CAS')) {
            this.value = value;
        } else if (value.match(/^\d/)) {
            // If user starts with numbers, add CAS prefix
            this.value = 'CAS ' + value;
        }
    });
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateIMEI,
        searchRegistry,
        handleReport
    };
}
