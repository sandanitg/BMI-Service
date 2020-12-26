import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getBMIs(event, context) {
  let bmis;
  const { email } = event.requestContext.authorizer;

  const params ={
    TableName: process.env.BMI_TABLE_NAME,
    FilterExpression:"#user=:user",
    ExpressionAttributeValues: {
      ":user": email,
    },
    ExpressionAttributeNames:{
      "#user":"user"
    }
  }

  try{
    const result = await dynamodb.scan(params).promise();

    bmis = result.Items;
  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(bmis),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}

export const handler = commonMiddleware(getBMIs);