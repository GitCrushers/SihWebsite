import cv2
import numpy as np

def detect_panel_video(video_path):
    cap = cv2.VideoCapture(video_path)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (500, 500))
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)

        thresh = cv2.adaptiveThreshold(
            blur, 255,
            cv2.ADAPTIVE_THRESH_MEAN_C,
            cv2.THRESH_BINARY,
            25, 15
        )

        total_pixels = frame.shape[0] * frame.shape[1]
        clean_pixels = cv2.countNonZero(thresh)
        clean_ratio = (clean_pixels / total_pixels) * 100

        if clean_ratio < 80:
            status = "Clean Panel"
            color = (0, 255, 0)
        else:
            status = "Dirty Panel"
            color = (0, 0, 255)

        cv2.putText(frame, f"{status} ({clean_ratio:.1f}%)", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 3)

        cv2.imshow("Processed Video", frame)

        if cv2.waitKey(25) & 0xFF == ord('q'):  # press q to quit
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    detect_panel_video("panel.mp4")
