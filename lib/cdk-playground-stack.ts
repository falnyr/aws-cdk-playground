import * as cdk from '@aws-cdk/core';
import {
  HttpApi,
  HttpIntegrationType,
  HttpMethod,
  HttpRoute,
  HttpRouteIntegrationConfig,
  HttpRouteKey,
  IHttpRouteIntegration,
  PayloadFormatVersion
} from '@aws-cdk/aws-apigatewayv2';

export class CdkPlaygroundStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new HttpApi(this, 'my-api');

    const route = new HttpRoute(this, 'route1', {
      httpApi: api,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with("/404", HttpMethod.GET),
    })
  }
}

class DummyIntegration implements IHttpRouteIntegration {
  public bind(): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.HTTP_PROXY,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      uri: 'https://http.cat/404',
      method: HttpMethod.GET,
    };
  }
}
