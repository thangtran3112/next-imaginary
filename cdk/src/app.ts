#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AppRouterStack } from "./app-router-stack";
import { OverridesStack } from "./overrides-stack";

const app = new cdk.App();
new AppRouterStack(app, "next-imaginary", {
  env: {
    account: "654654352356",
    region: "us-west-2",
  },
}); // ar = app router
