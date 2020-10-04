#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkPlaygroundStack } from '../lib/cdk-playground-stack';

const app = new cdk.App();
new CdkPlaygroundStack(app, 'CdkPlaygroundStack');
