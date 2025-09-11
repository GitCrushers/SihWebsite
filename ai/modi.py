import cv2
import numpy as np
img = cv2.imread("clean1.jpg")
img = cv2.resize(img, (500, 500))
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (5, 5), 0)
thresh = cv2.adaptiveThreshold(
    blur, 255,
    cv2.ADAPTIVE_THRESH_MEAN_C,
    cv2.THRESH_BINARY, 
    25, 15
)
total_pixels = img.shape[0] * img.shape[1]
clean_pixels = cv2.countNonZero(thresh)
clean_ratio = (clean_pixels / total_pixels) * 100
if clean_ratio < 80:
    status = "clean Panel"
    color = (0,255,0)
else:
    status = "dirty Panel"
    color = (0,0,255)
cv2.putText(img, f"{status} ({clean_ratio:.1f}%)", (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 3)
cv2.imshow("Threshold", thresh)
cv2.imshow("Result", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
