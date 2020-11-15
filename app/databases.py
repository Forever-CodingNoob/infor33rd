import typing, flask, os, inspect,psycopg2
import psycopg2.extras


class DatabaseConn:
    databases: type = None
    host = None
    driver = None
    user = None
    password = None

    @classmethod
    def setDB(cls,class_:type):
        cls.databases = class_

    @classmethod
    def getAllDatabaseConns(cls):
        return [db[1] for db in inspect.getmembers(cls.databases) if not(db[0].startswith('__') and db[0].endswith('__'))]

    @classmethod
    def init_app(cls, app: flask.Flask, databases:type=None):
        try:
            cls.host = os.environ['DB_HOST']
            cls.user = os.environ['DB_USER']
            cls.password = os.environ['DB_PASS']
        except KeyError:
            raise DatabaseConn.DBEnvironmentError('DB_host||port||user||password')

        if databases is not None:
            cls.setDB(databases)
        app.config['DB'] = cls

        for db in cls.getAllDatabaseConns():
            try:
                db.name = os.environ[(name := ('DB_DBNAME_' + db.alter_name))]
            except KeyError:
                raise DatabaseConn.DBEnvironmentError(name, other_msg=db.alter_name)

        # @app.before_request
        # def open_db():
        #     pass

        @app.after_request
        def close_db(response):
            for db in cls.getAllDatabaseConns():
                db.disconnect()
            return response

    def __init__(self, db_name: str):
        # print(DatabaseConn.getAllDatabaseConns())
        self.alter_name = db_name
        self.name=None
        self.conn=None

    def connect(self,cursor_factory=None):
        if cursor_factory is None:
            cursor_factory=psycopg2.extras.DictCursor
        try:
            conn=psycopg2.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.name,
                sslmode='require',
                cursor_factory=cursor_factory,
                async_=False
            )
        except Exception as e:
            raise e
        self.conn=conn
    def disconnect(self):
        if self.conn is not None:
            self.conn.close()
            self.conn=None

    def build_connection(commit=False):
        def inner(func):
            def wrapped(self,*args,**kwargs):
                if self.conn is None:
                    self.connect()
                result = func(self,*args,**kwargs)
                if commit:
                    self.conn.commit()
                return result
            wrapped.__name__=func.__name__
            return wrapped
        return inner

    @build_connection(commit=True)
    def execute(self,sql):
        self.conn.cursor().execute(sql)

    @build_connection(commit=False)
    def fetchone(self,sql):
        cur=self.conn.cursor()
        cur.execute(sql)
        return cur.fetchone()

    @build_connection(commit=False)
    def fetchall(self,sql):
        cur=self.conn.cursor()
        cur.execute(sql)
        return cur.fetchall()


    class DBEnvironmentError(EnvironmentError):
        def __init__(self, env_variable: str, other_msg: str = ''):
            self.other_msg = f'(${other_msg})' if other_msg else ''
            self.message = f'environment variable {env_variable} is not set.'
            super(EnvironmentError, self).__init__(self.message)

        def __str__(self):
            return self.message + ' ' + self.other_msg
