document.addEventListener('DOMContentLoaded', () => {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => {
                console.log(`Service worker registered --> ${reg}`);
                console.log('__dirname');
            }, (err) => { 
                console.error(`Service worker not registered --> ${err}`);
            })
    } 
}, false);