This is a My Wine app project bootstrapped with [`next-app`].

## Getting Started

First setup the environment variables using .env file. Create a .env file in the home directory and add the following contents. Note to update the contents with your own values.
```bash
MONGO_URI=your mongo db link
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000
PETER_KAPENA_PASSWORD=add your own password
PETER_KAPENA_EMAIL=add your own email (this account is used for dev purpose only and to login quickly)
NEXTAUTH_SECRET=add your own auth secret. e.g.: 1d5ef6310dd69061c7a52e088faf4c9f26520d37625cb54df94bae67ed4579e3
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

 ## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
