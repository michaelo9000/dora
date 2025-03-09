git config user.email "michael.ohara@hotmail.co.nz"
git config user.password "Happywalnut99!"
git add .
@echo off
set /p "msg=Message: "
git commit -m %msg%
git push
timeout /t 60