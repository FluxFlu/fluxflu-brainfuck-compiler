node --trace-warnings .\src\fbc.js %*
IF NOT %errorlevel%==0 (goto :eof)
IF %errorlevel%==0 (
    gcc -w -O3 ./temp.c -o temp.exe
    IF NOT %errorlevel%==0 (goto :eof)
    temp.exe
)