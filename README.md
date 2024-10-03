# Todo App with Next.js, Tailwind CSS, and DynamoDB

A simple Todo app built using **Next.js 14**, **Tailwind CSS**, and **AWS DynamoDB**. This app demonstrates how to create, read, update, and delete (CRUD) todos with server actions in Next.js and DynamoDB as the database.

## Features

1. **Create, update, and delete todos** with UI.
2. **Server-side actions** for backend logic, connected to AWS DynamoDB.
3. **Popup modal** for adding and editing todos.
4. **Basic error handling** implemented with try/catch.

## Prerequisites

- **Node.js** installed locally.
- An **AWS account** to use DynamoDB.
- DynamoDB table named `todo`.
- AWS credentials added to `.env.local`.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/thetechmaze/dynamo-todo.git
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment variables**

    Create a `.env.local` file in the root directory and add your AQWS credentials:

    ```bash
    AWS_ACCESS_KEY_ID=your-access-key-id
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open http://localhost:3000 in your browser to see the app in action.

## Deployment

To Deploy this app, you can use platforms like Vercel or Netlify. Ensure you have your environment variables set correctly on the chosen platform.

## License

This project is open source and available under the [MIT Licence](./LICENCE).
# crud-org
