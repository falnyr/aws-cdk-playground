import * as cdk from '@aws-cdk/core';
import {HttpApi, HttpMethod, HttpRoute, HttpRouteKey, VpcLink} from '@aws-cdk/aws-apigatewayv2';
import {DefaultInstanceTenancy, SecurityGroup, Vpc} from "@aws-cdk/aws-ec2";
import {ApplicationLoadBalancer, ListenerAction} from "@aws-cdk/aws-elasticloadbalancingv2";
import {HttpAlbIntegration, HttpProxyIntegration} from "@aws-cdk/aws-apigatewayv2-integrations";

export class CdkPlaygroundStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new HttpApi(this, 'my-api');

    const route = new HttpRoute(this, 'route1', {
      httpApi: api,
      integration: new HttpProxyIntegration({
        url: "https://http.cat/404",
        method: HttpMethod.GET
      }),
      routeKey: HttpRouteKey.with("/404", HttpMethod.GET),
    })

    const vpc = new Vpc(this, 'VPC1', {
      cidr: '10.10.0.0/16',
      enableDnsSupport: true,
      enableDnsHostnames: true,
      defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT
    });

    const sg1 = new SecurityGroup(this, 'SG1', { vpc });

    const vpcLink = new VpcLink(this, 'VpcLink', { vpc });
    vpcLink.addSubnets(...vpc.publicSubnets)
    vpcLink.addSecurityGroups(sg1)

    const lb = new ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true
    });

    const listener = lb.addListener('Listener', {
      port: 80,
      open: true,
    });

    listener.addAction('a1', {
      action: ListenerAction.fixedResponse(200, {
        messageBody: 'foobar',
        contentType: 'text/plain',
      })
    })

    const route2 = new HttpRoute(this, 'route2', {
      httpApi: api,
      integration: new HttpAlbIntegration({
        listener: listener,
        vpcLink: vpcLink,
        method: HttpMethod.GET,
      }),
      routeKey: HttpRouteKey.with("/406", HttpMethod.GET),
    })

  }
}
