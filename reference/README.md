# Reference images

Drop the target screenshot(s) you want the app to match here (PNG preferred), then tell
Claude which screen each maps to. Naming convention: `<screen>-<viewport>.png`, e.g.
`home-375.png`, `workout-active-375.png`.

Claude reads these with the Read tool and runs the screenshot-diff loop documented in
[../DESIGN.md](../DESIGN.md): match the viewport, screenshot the live build, list concrete
differences, fix, repeat (~95–99% achievable; font anti-aliasing is the ceiling).

Tip: resize references to ~1568px on the long edge before saving — the model sees them 1:1
and reasons about real pixels. For a phone screen, the native 375-px-wide capture is ideal.
