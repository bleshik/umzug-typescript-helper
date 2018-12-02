import { DynamoDB } from 'aws-sdk';
import * as migrations from './migrations';
import { migrate } from 'umzug-typescript-helper';
const DynamoDbStorage = require('umzug-dynamodb-storage')

const umzugOptions = {
    storage: new DynamoDbStorage({
        dynamodb: new DynamoDB(
            {
                region: "us-east-1",
                endpoint: `http://127.0.0.1:8000`
            }
        )
    })
};

migrate(migrations, umzugOptions).catch((err: any) => {
    console.error(err);
    process.exit(1);
});
