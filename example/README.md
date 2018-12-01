This example uses dynamodb storage for migrations, it has just 1 single dummy migration `20180902_initial.ts`. In order to build and run the migrations, you need to first run [local DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html), then just use this:
```
npm install && npm run migrate
```
