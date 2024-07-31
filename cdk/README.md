# Template for app-router nextjs project, without tailwind

- Created with `npx create-next-app@latest`
- All assets must be put into `public/static` for proper Cloudfront redirects
- Utilize [cdk-nextjs](https://github.com/jetbridge/cdk-nextjs)
- Construct for [cdk-nextjs-standalone](https://constructs.dev/packages/cdk-nextjs-standalone)
- Application must be built into [standalone mode](https://nextjs.org/docs/pages/api-reference/next-config-js/output):

```
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
};
```

## Important Notes on Environment variables:

- We must add any environment variables, that server lambda will need. In this case:

```env
KINDE_CLIENT_ID=<KINDE_CLIENT_ID>
KINDE_CLIENT_SECRET=<KINDE_CLIENT_SECRET>
KINDE_ISSUER_URL=https://<KINDE_DOMAIN>.kinde.com

### we have to change these 3 Urls in Production, when hosting on Cloud
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/api/auth/creation

# See https://supabase.com/partners/integrations/prisma, get the Database URL on Transaction Pooler mode
# It is required to put `?pgbouncer=true&connection_limit=1` in serverless environment
DATABASE_URL="postgres://postgres.zkcvlzshthdeudzfissu:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
# While the DATABASE_URL is in transaction pooler mode, the DIRECT_URL is in session mode
DIRECT_URL="postgres://postgres.zkcvlzshthdeudzfissu:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

SUPABASE_URL="https://<SubdomainUrl>.supabase.co"
SUPABASE_ANON_KEY="<YOUR-PROJECT-PUBLIC-ANON-KEY>"
```

## Important Notes on Kindle Callback and Logout Urls:

- We also need to update Kinde Callback Url and Logout Url in Kinde with Cloudfront Url or actual domain Url.
  ![Production Callback URLs](../images/AWSCloudfrontKindleCallback.png)

## Important Notes on Prisma and AWS Lambda:

- [Prisma deployment on AWS Lambda](https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-aws-lambda). Modify `schema.prisma` and add:

```
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-arm64-openssl-3.0.x"]
}
```

- Add `PRISMA_CLI_BINARY_TARGETS=native,rhel-openssl-1.0.x` to Lambda environment.
- Also, we may still need to copy `node_modules/.prisma/client` to `.open-next` build, if it does not generate `libquery_engine-linux-arm64-openssl-3.0.x.so.node`
  ![Lambda Environment Variables](../images/LambdaEnvironment.png)

## Important Note on performance:

- Since our Supabase and Kinde servers are both on West, we should deploy to `us-west-2` for best performant website.

## Solution Architectures:

- Since the next server is already running in Lambda (not Lambda@Edge), we have the option to authenticate requests directly inside `middleware.ts`
- Another option is editing the original `cdk-nextjs` so we can rewrite Lambda@Edge to authenticate. Example:[cloudfront-authorization-at-edge](https://github.com/aws-samples/cloudfront-authorization-at-edge)

  ![Next.js Serverless Architecture](architecture.png)

## Deployment Steps

```
npm install
cdk bootstrap
cdk synth
cdk deploy
```

## The deployment will also have a <baseUrl>/api route

- View in Local: http://localhost:3000/api
- View in Cloudfront: https:<CloudfrontURL>/api
