import os
import subprocess
import cv2
import numpy as np
from tqdm import tqdm

# -----------------------------
# Settings
# -----------------------------
INPUT_VIDEO = "Al-Fitrah_Intro.mp4"
OUTPUT_VIDEO = "Al-Fitrah_blurred.mp4"

BLUR_KERNEL = 51         # odd number: 31/41/51/61...
DETECT_SCALE = 0.5       # 0.4 faster (misses small faces), 0.7 slower (catches more)

CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"


def make_odd(n: int) -> int:
    return n if n % 2 == 1 else n + 1


def run(cmd):
    # Runs a command and throws a readable error if it fails
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=False)
    if p.returncode != 0:
        raise RuntimeError(f"Command failed:\n{' '.join(cmd)}\n\n{p.stderr}")
    return p.stdout


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

        small = cv2.resize(frame, (0, 0), fx=DETECT_SCALE, fy=DETECT_SCALE)
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=4,
            minSize=(40, 40)
        )

        for (x, y, w, h) in faces:
            x1 = int(x / DETECT_SCALE)
            y1 = int(y / DETECT_SCALE)
            x2 = int((x + w) / DETECT_SCALE)
            y2 = int((y + h) / DETECT_SCALE)

            x1 = max(0, x1); y1 = max(0, y1)
            x2 = min(width, x2); y2 = min(height, y2)

            roi = frame[y1:y2, x1:x2]
            if roi.size > 0:
                frame[y1:y2, x1:x2] = cv2.GaussianBlur(roi, (k, k), 0)

        out.write(frame)
        pbar.update(1)

    pbar.close()
    cap.release()
    out.release()

    # Mux original audio into blurred video (preserves resolution, keeps video as-is)
    # -map 0:v:0 takes video from blurred file
    # -map 1:a:0 takes audio from original file
    # -c:v copy keeps blurred video exactly (no re-encode)
    # -c:a aac encodes audio to AAC for mp4 compatibility
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