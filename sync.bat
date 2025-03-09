git add .
@echo off
set /p "msg=Message: "
git commit -m %msg%
git push
timeout /t 60