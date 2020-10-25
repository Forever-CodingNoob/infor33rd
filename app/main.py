from flask import Flask,render_template
import os

app=Flask(__name__,
          template_folder=os.path.join(os.path.abspath(os.getcwd()),'templates'),
          static_url_path="",
          static_folder=os.path.join(os.path.abspath(os.getcwd()),'static')
          )
print(os.path.join(os.path.abspath(os.getcwd()),'templates'))

@app.route('/')
def home():
    return render_template('index.html')
