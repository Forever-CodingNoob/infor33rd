from flask import Flask,render_template
from app.db_conn import DatabaseConn,Databases
from app.scripts import Person
import os
# print(os.getcwd())
# print(__file__)
app=Flask(__name__,
          template_folder=os.path.join(os.path.abspath(os.getcwd()),'templates'),
          static_url_path="",
          static_folder=os.path.join(os.path.abspath(os.getcwd()),'static')
          )

if app.env=='development':
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.abspath(__file__),'..\\..\\.env'))



DatabaseConn.init_app(app=app,databases=Databases)
print(os.path.join(os.path.abspath(os.getcwd()),'templates'))

app.jinja_env.globals.update({'len':len,'enumerate':enumerate})

@app.route('/aboutus')
def about_us():
    people = Person.getAll()
    gaps = [4,7]
    return render_template('about_us.html',workers=people,gaps=gaps)
@app.route('/0.9bar')
def bar():
    return render_template('howmuchis0point9bar.html')
@app.route('/')
def home():
    return render_template('index.html')
