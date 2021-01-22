window.addEventListener('load', function() { 
    // pathname without filename examples: 
    // www.hello.com/a/index.html -> '/a/'
    // www.hello.com -> '/'
    // www.hello.com/a/ -> '/a/'
    let pathname_without_filename = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + '/';
    let url_to_curr_folder_photos = "https://" + window.location.hostname + pathname_without_filename + "photos";
    
    // ("/experiments/ar_example") applicable to my page.
    const scanner_url = ("https://" + window.location.hostname) + ("/experiments/ar_example") + "/ar/flat_scanner.html?ref=" + (url_to_curr_folder_photos);
    alert ("Open " + scanner_url + " on your mobile phone and scan the QR below.");
});