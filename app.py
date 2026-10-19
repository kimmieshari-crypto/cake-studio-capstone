"""Cake Studio: a small Flask app serving an interactive cake designer."""
from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def home():
    """Display the cake customization page."""
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
