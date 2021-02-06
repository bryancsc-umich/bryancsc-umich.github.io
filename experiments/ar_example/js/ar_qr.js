window.addEventListener('load', function() { 
    // pathname without filename examples: 
    // www.hello.com/a/index.html -> '/a/'
    // www.hello.com -> '/'
    // www.hello.com/a/ -> '/a/'
    let pathname_without_filename = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + '/';
    let url_to_curr_folder_photos = "https://" + window.location.hostname + pathname_without_filename + "photos";
    let ar_type = new URLSearchParams(window.location.search).get('type');
    
    // Default to flat.
    // ("/experiments/ar_example") applicable to my page.
    let scanner_url = ("https://" + window.location.hostname) + ("/experiments/ar_example") + "/ar/flat_scanner.html?ref=" + (url_to_curr_folder_photos);

    if (ar_type === 'stand') {
        scanner_url = ("https://" + window.location.hostname) + ("/experiments/ar_example") + "/ar/stand_scanner.html?ref=" + (url_to_curr_folder_photos);
    }

    alert ("Open " + scanner_url + " on your mobile phone and scan the QR below.");
    new QRCode(this.document.getElementById('scanner_qr'), scanner_url);

    let current_side = 'ar_qr';

    function setScanHintText() {
        if (current_side === 'ar_qr') {
            document.getElementById('scan_hint').innerText = "Tap to view URL and QR code for AR-scanner.";
        } else {
            document.getElementById('scan_hint').innerText = scanner_url;
        }
    }

    function setUpScanHint() {
        let scan_timeout = null;

        function showScanHint() {
            if (scan_timeout !== null) {
                clearTimeout(scan_timeout);
            }
            setScanHintText();
            document.getElementById('scan_hint').style.visibility = 'visible';
            scan_timeout = setTimeout(function() {
                document.getElementById('scan_hint').style.visibility = 'hidden';
                clearTimeout(scan_timeout);
            }, 3000);    
        }

        this.document.getElementById('scan_hint').addEventListener('click', showScanHint);
        showScanHint();
    }

    this.console.log(document.getElementById('qr_box'));
    this.document.getElementById('qr_box').addEventListener('click', function() {
        document.getElementById('qr_box_inner').classList.toggle('open');
        if (current_side === 'ar_qr') {
            current_side = 'scan_qr';
        } else {
            current_side = 'ar_qr';
        }
        setScanHintText();
    });

    setUpScanHint();
});