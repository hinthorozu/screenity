import React, { useContext, useEffect } from "react";
import { contentStateContext } from "./context/ContentState";

const KYROX_PRESET_VERSION = 1;
const KYROX_ORANGE = "#FF7A00";

const KYROX_DEFAULTS = {
  color: KYROX_ORANGE,
  strokeWidth: 4,
  tool: "shape",
  shape: "rectangle",
  shapeFill: false,
  cursorMode: "target",
  cursorEffects: ["target"],
};

const KyroxPreset = () => {
  const [contentState, setContentState] = useContext(contentStateContext);

  useEffect(() => {
    let cancelled = false;

    chrome.storage.local.get(["kyroxPresetVersion"], (stored) => {
      if (cancelled || stored.kyroxPresetVersion === KYROX_PRESET_VERSION) return;

      const applyPreset = () => {
        if (cancelled) return;

        setContentState((prev) => ({
          ...prev,
          ...KYROX_DEFAULTS,
        }));

        chrome.storage.local.set({
          ...KYROX_DEFAULTS,
          kyroxPresetVersion: KYROX_PRESET_VERSION,
        });
      };

      // ContentState hydrates from extension storage immediately after mount.
      // Apply the branded defaults just after that pass so the first run is
      // deterministic even when an older Screenity profile exists.
      const timer = window.setTimeout(applyPreset, 250);
      return () => window.clearTimeout(timer);
    });

    return () => {
      cancelled = true;
    };
  }, [setContentState]);

  if (!contentState.recording || contentState.finalizingRecording) return null;

  return (
    <div
      aria-label="KYROX Recorder watermark"
      style={{
        position: "fixed",
        top: "18px",
        right: "22px",
        zIndex: 2147483647,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 11px",
        border: `2px solid ${KYROX_ORANGE}`,
        borderRadius: "10px",
        background: "rgba(255,255,255,0.90)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.14)",
        color: KYROX_ORANGE,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "17px",
        fontWeight: 800,
        letterSpacing: "0.10em",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          background: KYROX_ORANGE,
          boxShadow: `0 0 0 4px rgba(255,122,0,0.16)`,
        }}
      />
      KYROX
    </div>
  );
};

export default KyroxPreset;
