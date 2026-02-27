import os
import cv2
import numpy as np
from tqdm import tqdm
from moviepy.editor import VideoFileClip

# -----------------------------
# Settings (edit these)
# -----------------------------
INPUT_VIDEO = "input.mp4"
OUTPUT_VIDEO = "output_blurred.mp4"

# Light–medium anonymization: increase blur kernel for stronger blur
BLUR_KERNEL = 51  # must be odd: 31, 41, 51, 61...

# Speed/accuracy tradeoff:
# Lower SCALE = faster but may miss small/side faces
DETECT_SCALE = 0.5  # 0.5 = detect on half-size frames

# Face detector (built-in Haar cascade)
CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

# -----------------------------
def make_odd(n: int) -> int:
    return n if n % 2 == 1 else n + 1

def main():
    if not os.path.exists(INPUT_VIDEO):
        raise FileNotFoundError(f"Can't find input video: {INPUT_VIDEO}")

    face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
    if face_cascade.empty():
        raise RuntimeError("Failed to load Haar cascade. Check OpenCV install.")

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

    pbar = tqdm(total=frame_count, desc="Blurring faces", unit="frame")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Downscale for faster detection
        small = cv2.resize(frame, (0, 0), fx=DETECT_SCALE, fy=DETECT_SCALE)
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=4,
            minSize=(40, 40)
        )

        # Apply blur on original frame using scaled coordinates
        for (x, y, w, h) in faces:
            x1 = int(x / DETECT_SCALE)
            y1 = int(y / DETECT_SCALE)
            x2 = int((x + w) / DETECT_SCALE)
            y2 = int((y + h) / DETECT_SCALE)

            # clamp to frame boundaries
            x1 = max(0, x1); y1 = max(0, y1)
            x2 = min(width, x2); y2 = min(height, y2)

            roi = frame[y1:y2, x1:x2]
            if roi.size > 0:
                roi_blur = cv2.GaussianBlur(roi, (k, k), 0)
                frame[y1:y2, x1:x2] = roi_blur

        out.write(frame)
        pbar.update(1)

    pbar.close()
    cap.release()
    out.release()

    # Reattach audio with MoviePy (preserves audio track)
    original = VideoFileClip(Al-Fitrah_Intro_VIDEO)
    blurred = VideoFileClip(temp_no_audio)

    final = blurred.set_audio(original.audio)
    final.write_videofile(
        OUTPUT_VIDEO,
        codec="libx264",
        audio_codec="aac",
        fps=fps,
        threads=4
    )

    final.close()
    original.close()
    blurred.close()

    # cleanup
    try:
        os.remove(temp_no_audio)
    except OSError:
        pass

    print(f"\nDone! Saved blurred video to: {Al-Fitrah_VIDEO}")

if __name__ == "__main__":
    main()