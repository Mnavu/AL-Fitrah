import os
import subprocess
import cv2
import numpy as np
from tqdm import tqdm
import mediapipe as mp

# -----------------------------
# Settings
# -----------------------------
INPUT_VIDEO = "Al-Fitrah_Intro.mp4"
OUTPUT_VIDEO = "Al-Fitrah_blurred1.mp4"

# Light–medium anonymization (increase to 61/71 if needed)
BLUR_KERNEL = 51  # must be odd

# Oval size relative to detected face box
OVAL_W = 0.55   # wider oval
OVAL_H = 0.70   # taller oval

# Expand box a bit to avoid losing forehead/chin during motion
PAD_X = 0.18
PAD_Y = 0.22

# Detection confidence (lower catches more faces, but may add false positives)
MIN_DET_CONF = 0.45

# -----------------------------
def make_odd(n: int) -> int:
    return n if n % 2 == 1 else n + 1

def run(cmd):
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=False)
    if p.returncode != 0:
        raise RuntimeError(f"Command failed:\n{' '.join(cmd)}\n\n{p.stderr}")
    return p.stdout

def oval_blur(frame, x1, y1, x2, y2, k):
    roi = frame[y1:y2, x1:x2]
    if roi.size == 0:
        return

    blurred = cv2.GaussianBlur(roi, (k, k), 0)

    mask = np.zeros((roi.shape[0], roi.shape[1]), dtype=np.uint8)
    center = (roi.shape[1] // 2, roi.shape[0] // 2)
    axes = (int(roi.shape[1] * OVAL_W), int(roi.shape[0] * OVAL_H))
    cv2.ellipse(mask, center, axes, 0, 0, 360, 255, -1)

    mask3 = cv2.merge([mask, mask, mask])
    roi_out = np.where(mask3 == 255, blurred, roi)
    frame[y1:y2, x1:x2] = roi_out

def main():
    if not os.path.exists(INPUT_VIDEO):
        raise FileNotFoundError(f"Can't find input video: {INPUT_VIDEO}")

    cap = cv2.VideoCapture(INPUT_VIDEO)
    if not cap.isOpened():
        raise RuntimeError("Could not open video file.")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    temp_no_audio = "temp_blurred_no_audio.mp4"
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(temp_no_audio, fourcc, fps, (width, height))

    k = make_odd(BLUR_KERNEL)
    if k < 11:
        k = 11

    mp_face = mp.solutions.face_detection
    detector = mp_face.FaceDetection(model_selection=1, min_detection_confidence=MIN_DET_CONF)

    pbar = tqdm(total=frame_count, desc="Blurring faces (MediaPipe)", unit="frame")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # MediaPipe expects RGB
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = detector.process(rgb)

        if results.detections:
            for det in results.detections:
                bbox = det.location_data.relative_bounding_box
                x = int(bbox.xmin * width)
                y = int(bbox.ymin * height)
                w = int(bbox.width * width)
                h = int(bbox.height * height)

                # Convert to corners
                x1, y1 = x, y
                x2, y2 = x + w, y + h

                # Pad to keep coverage during motion
                pad_x = int((x2 - x1) * PAD_X)
                pad_y = int((y2 - y1) * PAD_Y)

                x1 = max(0, x1 - pad_x)
                y1 = max(0, y1 - pad_y)
                x2 = min(width, x2 + pad_x)
                y2 = min(height, y2 + pad_y)

                oval_blur(frame, x1, y1, x2, y2, k)

        out.write(frame)
        pbar.update(1)

    pbar.close()
    detector.close()
    cap.release()
    out.release()

    # Mux original audio into blurred video
    cmd = [
        "ffmpeg", "-y",
        "-i", temp_no_audio,
        "-i", INPUT_VIDEO,
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        OUTPUT_VIDEO
    ]
    run(cmd)

    try:
        os.remove(temp_no_audio)
    except OSError:
        pass

    print(f"\nDone! Saved blurred video to: {OUTPUT_VIDEO}")

if __name__ == "__main__":
    main()