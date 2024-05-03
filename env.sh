#!/bin/sh
for i in $(env | grep MY_APP_) // Make sure to use the prefix MY_APP_ if you have any other prefix in env.production file varialbe name replace it with MY_APP_
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value
    # sed All files
    # find /usr/share/nginx/html -type f -exec sed -i "s|${key}|${value}|g" '{}' +

    # sed JS and CSS only
    find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done

# Search and replace names starting with MY_APP with localhost in code files
find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i 's|MY_APP_BACKEND_HOST|http://localhost:8080|g' '{}' +
find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i 's|MY_APP_KC_HOST|http://localhost:8180|g' '{}' +