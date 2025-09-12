from flask import Flask, render_template, request
import os
from modi import detect_panel   # <-- import your function

app = Flask(__name__)
UPLOAD_FOLDER = "static"
app.config[""] = UPLOAD_FOLDER

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files["file"]
        if file:
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], "input.jpg")
            file.save(file_path)

            status, clean_ratio, result_path = detect_panel(file_path)

            return render_template("index.html",
                                   result_image=result_path,
                                   status=status,
                                   clean_ratio=clean_ratio)

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
