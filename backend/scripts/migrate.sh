#!/bin/bash

username=""
password=""
db_name=""

if [ "$1" ]
then
    username="$1"
else
    echo "username 不能为空"
    exit 0
fi

if [ "$2" ]
then
    password="$2"
else
    echo "password 不能为空"
    exit 0
fi
  
if [ "$3" ]
then
    db_name="$3"
else
    echo "db_name 不能为空"
    exit 0
fi

if [ "$4" ]
then
    migrate -database "postgres://$username:$password@localhost:5432/$db_name?sslmode=disable" -path db/migrations force "$4"
fi

migrate -database "postgres://$username:$password@localhost:5432/$db_name?sslmode=disable" -path db/migrations up
