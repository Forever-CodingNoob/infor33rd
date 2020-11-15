from app.databases import DatabaseConn
# import os
# from dotenv import load_dotenv
# load_dotenv(dotenv_path=os.path.join(os.path.abspath(__file__),'..\\..\\.env'))

class Databases:
    WORKERS_DB = DatabaseConn('WORKERS')

# print(DatabaseConn.getAllDatabaseConns())
# DatabaseConn.databases.WORKERS_DB.connect()
