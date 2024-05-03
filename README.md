
run following commands to run docker image
```shell
docker build -t catan-react-img .
docker run --name catan-react-app --network catan-network -p 5173:5173 -d catan-react-img
```