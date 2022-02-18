Scratch Space
===


General scratch space for notes particular to this project.

### Using `ccapture.js`

[ccapture.js](https://github.com/spite/ccapture.js/)

`index.html`:

```
    ...
    <script defer="defer" src="./CCapture.js"></script>
    <script defer="defer" src="./webm-writer-0.2.0.js"></script>
    <script defer="defer" src="./download.js"></script>
    ...
```

Global variable/state:

```
var g_info = {

  ...

  "capturer": {},
  "animation_capture": false,
  "capture_start":-1,
  "capture_end":-1,
  //"capture_dt":5000,
  "capture_dt":1000,

  ...

```

In the main animation loop:

```
function anim() {

  if (g_info.animation_capture) {
    g_info.capturer.capture( g_info.canvas );

    let _t = Date.now();

    console.log("!!", g_info.capture_end - _t);

    if (_t >= g_info.capture_end) {
      g_info.animation_capture = false;
      g_info.capturer.stop();
      g_info.capturer.save();
    }

  }

  ...

```

In the main entry point:

```
  document.addEventListener('keydown', function(ev) {
    if (ev.key == 'a') {
      if (g_info.animation_capture) { console.log("already capturing!"); return; }
      g_info.capturer = new CCapture({"format":"webm"});
      g_info.capturer.start();
      g_info.animation_capture = true;

      g_info.capture_start = Date.now();
      g_info.capture_end = g_info.capture_start + g_info.capture_dt;

      console.log(">>>", g_info.capture_start, g_info.capture_end, g_info.capture_dt);
    }
    else if (ev.key == 's') {
      screenshot();
    }
    else if (ev.key == 'p') {
      g_info.pause = ((g_info.pause) ? false : true);
    }
    return false;
  });
```

### Making a preview video

The video has to be evenly divisible by 2 or `ffmpeg` will complain when converting.

* `for x in $( ls *.webm ) ; do echo $x ; ffmpeg -i $x $( basename $x .webm ).mp4 ; done`
* `ffmpeg -f concat -safe 0 -i <( x=`pwd` ; ls *.mp4  | sed "s;^;file '"$x"/;" | sed "s/$/'/" ) -c copy out.mp4`



