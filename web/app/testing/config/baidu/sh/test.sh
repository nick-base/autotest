echo "Hello test"
ssh root@my-pc  > /dev/null 2>&1 << commands
pwd
commands
echo "finished"
