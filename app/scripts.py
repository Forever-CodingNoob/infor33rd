from app.db_conn import Databases
class Person:
    def __init__(self,id,name,job,intro,photo_filename):
        #print(repr(intro))
        self.id=id
        self.name=name
        self.job=job
        self.intro=intro.replace('\n',"<br>")
        self.photo_filename=photo_filename
    @staticmethod
    def getAll():
        return [Person(person['id'],
                       person['name'],
                       person['job'],
                       person['intro'],
                       person['photo_filename']) for person in Databases.WORKERS_DB.fetchall('SELECT * FROM workers ORDER BY ID')]