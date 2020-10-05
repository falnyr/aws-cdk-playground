import { LambdaRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';

export class SimpleApi extends Stack {
  constructor(app: App, id: string) {
    super(app, id);

    // Function that returns 200 with "Hello world!"
    const helloWorldFunction = new Function(this, 'helloWorldFunction', {
      code: new AssetCode(`./src`),
      memorySize: 512,
      handler: 'handler.handler',
      runtime: Runtime.NODEJS_12_X
    });

    // Rest API backed by the helloWorldFunction
    const helloWorldLambdaRestApi = new LambdaRestApi(this, 'helloWorldLambdaRestApi', {
      restApiName: 'Hello World API',
      handler: helloWorldFunction,
      proxy: false,
    });

    helloWorldLambdaRestApi.root.addMethod('GET', new LambdaIntegration(helloWorldFunction))
  }
}


const app = new App();
new SimpleApi(app, 'SimpleApi');
app.synth();
