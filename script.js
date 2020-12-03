window.onload = function() {
  
    var file = document.getElementById("myfile");
    var audio = document.getElementById("audio");

    file.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();

        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 512;
        analyser.minDecibels = -100;
        analyser.maxDecibels = -6;
        analyser.smoothingTimeConstant = 0.57;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        console.log(HEIGHT);
        var barWidth = WIDTH * 0.85 / bufferLength;
        var barHeight;
        var barSkip = (WIDTH - barWidth * bufferLength) / bufferLength;
        var x = 0;
        var magic_number = 0.28;

        function renderFrame() {
            x = 0;
            requestAnimationFrame(renderFrame);
            
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]/magic_number;

                var r = barHeight + (25 * (i/bufferLength));
                var g = 250 * (i/bufferLength);
                var b = 50;

                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + barSkip;
            }
        }

        audio.play();
        renderFrame();
    }
}