# Clinical Walkthrough Video

## README inline GIF (screencast)

**File:** [`ehr-sidecar-screencast.gif`](./ehr-sidecar-screencast.gif)  
**Length:** ~12 seconds · 800px wide · 10 fps  

Short clip of AI summary → **Critical Care Notes** for the root [`README.md`](../../README.md) Live Preview. Source WebM is not committed (`docs/demo/*.webm` is gitignored).

Regenerate (trim window `18s` for `12s`):

```bash
ffmpeg -y -ss 18 -t 12 -i "/path/to/screencast.webm" -filter_complex "\
  [0:v]fps=10,scale=800:-1:flags=lanczos,split[s0][s1];\
  [s0]palettegen=stats_mode=diff[p];\
  [s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle\
" -loop 0 docs/demo/ehr-sidecar-screencast.gif
```

---

## Captioned MP4 walkthrough

**File:** [`ehr-sidecar-clinical-walkthrough.mp4`](./ehr-sidecar-clinical-walkthrough.mp4)  
**Length:** ~42 seconds · 1440×900 · silent with on-screen captions  

Shows how a bedside clinician would use the EHR Sidecar in a future workflow:

1. Safety header (allergies + code status)  
2. Progressive vitals  
3. Context-aware CHF orders  
4. **Critical Care Notes** from AI summarization  
5. Sepsis / DNR patient switch  
6. Pediatric + empty-chart paths  

All patients are **synthetic**. Not for production PHI.

---

## Regenerate (requires app running)

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run demo:walkthrough
```

Or step-by-step:

```bash
npm run demo:record   # Playwright captures frames + raw screen video
npm run demo:video    # Builds captioned MP4 from keyframes
```

Output: `docs/demo/ehr-sidecar-clinical-walkthrough.mp4`

A copy is also written to Downloads as `EHR-Sidecar-Clinical-Walkthrough.mp4` when you run the build script with the optional copy step (or copy manually).

---

## LinkedIn / demo tip

Upload the MP4 as a LinkedIn native video (better reach than a link). Caption with the walkthrough script in `docs/walkthrough-script.md`.
