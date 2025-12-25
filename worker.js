importScripts('vosk.js');

let model = null;
let recognizer = null;

onmessage = async function(e) {
    if (e.data.action === 'init') {
        try {
            // Load Model
            model = await Vosk.createModel(e.data.modelUrl);
            recognizer = new Vosk.Recognizer({model: model, sampleRate: e.data.sampleRate});
            postMessage({ status: 'ready' });
        } catch (err) {
            postMessage({ status: 'error', data: err.toString() });
        }
    }
    
    if (e.data.action === 'process') {
        if (recognizer) {
            try {
                // Determine if result is final
                const isFinal = recognizer.acceptWaveform(e.data.buffer);
                if (isFinal) {
                    postMessage({ status: 'result', data: recognizer.result() });
                } else {
                    postMessage({ status: 'partial', data: recognizer.partialResult() });
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
}

