from flask import Flask, render_template, request, redirect, url_for
import cv2
import numpy as np
import os

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
app.config["pics"] = UPLOAD_FOLDER


if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def detect_panel(image_path):
    img = cv2.imread(image_path)
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
        status = "Clean Panel"
        color = (0, 255, 0)
    else:
        status = "Dirty Panel"
        color = (0, 0, 255)

    cv2.putText(img, f"{status} ({clean_ratio:.1f}%)", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 3)

    result_path = os.path.join("static", "result.jpg")
    cv2.imwrite(result_path, img)

    return status, clean_ratio, result_path

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if "file" not in request.files:
            return redirect(request.url)
        file = request.files["file"]
        if file.filename == "":
            return redirect(request.url)

        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)

        status, clean_ratio, result_path = detect_panel(file_path)

        return render_template("index.html",
                               result_image=result_path,
                               status=status,
                               clean_ratio=clean_ratio)

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
