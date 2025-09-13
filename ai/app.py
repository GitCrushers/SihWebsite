from flask import Flask, render_template, Response
from modi import detect_panel_video

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('surveillance.jsx') 

@app.route('/video_feed')
def video_feed():
    return Response(detect_panel_video("panel.mp4"),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)
