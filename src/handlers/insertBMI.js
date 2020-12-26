import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function insertBMI(event, context) {
  const { weight } = event.body;
  const { height } = event.body;
  const { email } = event.requestContext.authorizer;
  const now = new Date();

  const bmi = {
    id: uuid(),
    user: email,
    weight,
    height,
    bmi: (weight/(height*height)).toFixed(2),
    createdAt: now.toISOString(),
  };

  try{
    await dynamodb.put({
      TableName: process.env.BMI_TABLE_NAME,
      Item: bmi,
    }).promise();
  }catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  
  return {
    statusCode: 201,
    body: JSON.stringify(bmi),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}

export const handler = commonMiddleware(insertBMI);